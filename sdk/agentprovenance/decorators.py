"""
@trace decorator — wraps an agent function to automatically capture decision traces.
"""

from __future__ import annotations

import functools
import inspect
import time
from typing import Any, Callable, Optional, TypeVar, overload

F = TypeVar("F", bound=Callable[..., Any])


def trace(
    agent_id: str,
    use_case: str,
    *,
    agent_version: Optional[str] = None,
    subject_id_arg: Optional[str] = None,
    subject_type: Optional[str] = None,
    data_sources: Optional[list[str]] = None,
    model_name: Optional[str] = None,
    risk_classification: Optional[str] = None,
    output_formatter: Optional[Callable[[Any], str]] = None,
    input_formatter: Optional[Callable[..., str]] = None,
    capture_output_data: bool = False,
) -> Callable[[F], F]:
    """
    Decorator that wraps an agent function to automatically capture decision traces.

    Args:
        agent_id:          Unique identifier for this agent (e.g. "credit-risk-agent-v2")
        use_case:          What this agent does (e.g. "Loan approval decision")
        agent_version:     Optional version string
        subject_id_arg:    Name of the function argument that contains the subject ID
                           (e.g. "customer_id" — so each decision is linked to a customer)
        subject_type:      Type of subject (e.g. "customer", "application")
        data_sources:      List of data source names used by this agent
        model_name:        LLM or model name (e.g. "gpt-4o")
        risk_classification: EU AI Act risk level
        output_formatter:  Function that converts the return value to a human-readable string
        input_formatter:   Function that converts the function args to a human-readable string
        capture_output_data: Whether to store the full structured output (default: False)

    Example:
        @trace(
            agent_id="credit-risk-agent-v2",
            use_case="Loan approval decision",
            subject_id_arg="customer_id",
            subject_type="customer",
            data_sources=["precisely-mcp/address-api", "experian-credit-api"],
            model_name="gpt-4o",
            risk_classification="HIGH",
        )
        def assess_credit_risk(customer_id: str, application: dict) -> dict:
            # your existing code, unchanged
            return {"approved": True, "score": 742, "reason": "Strong credit history"}
    """

    def decorator(func: F) -> F:
        sig = inspect.signature(func)

        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            from . import get_client

            start_ms = int(time.time() * 1000)

            # Extract subject_id from args if specified
            subject_id = None
            if subject_id_arg:
                bound = sig.bind(*args, **kwargs)
                bound.apply_defaults()
                subject_id = bound.arguments.get(subject_id_arg)

            # Build input summary
            if input_formatter:
                input_summary = input_formatter(*args, **kwargs)
            else:
                bound = sig.bind(*args, **kwargs)
                bound.apply_defaults()
                parts = []
                for k, v in bound.arguments.items():
                    if k == subject_id_arg:
                        continue
                    str_v = str(v)
                    parts.append(f"{k}={str_v[:80]}{'...' if len(str_v) > 80 else ''}")
                input_summary = f"{func.__name__}({', '.join(parts)})" if parts else func.__name__

            # Execute the function
            result = func(*args, **kwargs)
            latency_ms = int(time.time() * 1000) - start_ms

            # Build output summary
            if output_formatter:
                output_summary = output_formatter(result)
            elif isinstance(result, dict):
                # Try to produce a readable summary from common dict keys
                for key in ("decision", "result", "output", "answer", "summary", "reason", "approved", "status"):
                    if key in result:
                        output_summary = f"{key}: {result[key]}"
                        break
                else:
                    output_summary = str(result)[:500]
            elif isinstance(result, str):
                output_summary = result[:500]
            else:
                output_summary = str(result)[:500]

            # Capture the trace (non-blocking by default)
            try:
                client = get_client()
                client.capture(
                    agent_id=agent_id,
                    agent_version=agent_version,
                    use_case=use_case,
                    subject_id=subject_id,
                    subject_type=subject_type,
                    input_summary=input_summary,
                    output_summary=output_summary,
                    output_data=result if capture_output_data and isinstance(result, dict) else None,
                    data_sources=data_sources,
                    model_name=model_name,
                    risk_classification=risk_classification,
                    latency_ms=latency_ms,
                )
            except RuntimeError:
                # SDK not initialised — skip silently (don't crash the agent)
                pass

            return result

        return wrapper  # type: ignore

    return decorator
