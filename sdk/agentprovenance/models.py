"""
Data models for Agent Provenance SDK.
"""
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Any, Optional


@dataclass
class Decision:
    """
    Represents a single agent decision trace.
    Use this to manually construct and capture a decision
    when the @trace decorator doesn't fit your workflow.

    Example:
        from agentprovenance import Decision, get_client

        decision = Decision(
            agent_id="fraud-detection-agent-v3",
            use_case="Transaction fraud screening",
            output_summary="Transaction flagged as HIGH RISK — velocity pattern detected",
            subject_id=transaction_id,
            subject_type="transaction",
            data_sources=["precisely-mcp/address-api", "internal-velocity-db"],
            model_name="gpt-4o",
            risk_classification="HIGH",
            output_data={"risk_score": 0.94, "flags": ["velocity", "new_device"]},
        )
        get_client().capture(**decision.to_kwargs())
    """
    agent_id: str
    use_case: str
    output_summary: str
    agent_version: Optional[str] = None
    subject_id: Optional[str] = None
    subject_type: Optional[str] = None
    input_summary: Optional[str] = None
    input_data: Optional[Any] = None
    output_data: Optional[dict] = None
    data_sources: Optional[list[str]] = None
    model_name: Optional[str] = None
    model_version: Optional[str] = None
    risk_classification: Optional[str] = None
    latency_ms: Optional[int] = None
    confidence_score: Optional[int] = None
    decided_at: Optional[int] = None
    decision_id: Optional[str] = None

    def to_kwargs(self) -> dict:
        return {k: v for k, v in self.__dict__.items() if v is not None}
