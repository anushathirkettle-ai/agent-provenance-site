"""
AgentProvenanceClient — HTTP client for the Agent Provenance API.

Calls the REST endpoint POST /api/v1/decisions using only the Python
standard library (no external dependencies required).
"""

from __future__ import annotations

import hashlib
import json
import threading
import time
import uuid
from typing import Any, Optional
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError


class AgentProvenanceClient:
    """
    Low-level HTTP client for the Agent Provenance API.

    Uses only the Python standard library — no external dependencies required.
    Traces are sent to POST /api/v1/decisions with an API key in the
    Authorization header.
    """

    def __init__(
        self,
        api_key: str,
        base_url: str = "https://agentprovenance.io",
        timeout: float = 5.0,
        async_mode: bool = True,
    ):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.async_mode = async_mode
        self._lock = threading.Lock()

    def capture(
        self,
        *,
        agent_id: str,
        use_case: str,
        output_summary: str,
        agent_version: Optional[str] = None,
        subject_id: Optional[str] = None,
        subject_type: Optional[str] = None,
        input_summary: Optional[str] = None,
        input_data: Optional[Any] = None,
        output_data: Optional[Any] = None,
        data_sources: Optional[list[str]] = None,
        model_name: Optional[str] = None,
        model_version: Optional[str] = None,
        risk_classification: Optional[str] = None,
        latency_ms: Optional[int] = None,
        confidence_score: Optional[int] = None,
        decided_at: Optional[int] = None,
        decision_id: Optional[str] = None,
    ) -> dict:
        """
        Capture a single agent decision trace.

        Args:
            agent_id:            Unique identifier for the agent (e.g. "credit-risk-agent-v2")
            use_case:            What the agent was doing (e.g. "Loan approval")
            output_summary:      Human-readable summary of the decision made
            agent_version:       Optional version string (e.g. "2.1.0")
            subject_id:          The entity this decision was about (customer ID, case ID, etc.)
            subject_type:        Type of subject (e.g. "customer", "application", "claim")
            input_summary:       Human-readable description of the input data
            input_data:          Raw input data — will be hashed, not stored in full
            output_data:         Structured output dict if available
            data_sources:        List of data source names/URIs used (e.g. ["precisely-mcp/address-api"])
            model_name:          LLM or model used (e.g. "gpt-4o", "claude-3-5-sonnet")
            model_version:       Model version string
            risk_classification: EU AI Act risk level: "HIGH", "LIMITED", "MINIMAL", "UNCLASSIFIED"
            latency_ms:          How long the agent took in milliseconds
            confidence_score:    Model confidence 0-100 if available
            decided_at:          UTC timestamp in ms when the decision was made (default: now)
            decision_id:         Override the auto-generated decision ID

        Returns:
            dict with {"success": True, "decisionId": "ap_..."}
        """
        payload: dict[str, Any] = {
            "decisionId": decision_id or f"ap_{uuid.uuid4().hex}",
            "agentId": agent_id,
            "useCase": use_case,
            "outputSummary": output_summary,
            "decidedAt": decided_at or int(time.time() * 1000),
        }

        if agent_version:
            payload["agentVersion"] = agent_version
        if subject_id:
            payload["subjectId"] = str(subject_id)
        if subject_type:
            payload["subjectType"] = subject_type
        if input_summary:
            payload["inputSummary"] = input_summary
        if input_data is not None:
            # Hash the raw input for integrity — never store PII in full
            raw = json.dumps(input_data, sort_keys=True, default=str)
            payload["inputHash"] = hashlib.sha256(raw.encode()).hexdigest()
            if not input_summary:
                payload["inputSummary"] = (
                    f"Input data ({len(raw)} chars, sha256: {payload['inputHash'][:8]}...)"
                )
        if output_data is not None:
            payload["outputData"] = output_data
        if data_sources:
            payload["dataSources"] = data_sources
        if model_name:
            payload["modelName"] = model_name
        if model_version:
            payload["modelVersion"] = model_version
        if risk_classification:
            payload["riskClassification"] = risk_classification
        if latency_ms is not None:
            payload["latencyMs"] = latency_ms
        if confidence_score is not None:
            payload["confidenceScore"] = confidence_score

        if self.async_mode:
            thread = threading.Thread(target=self._send, args=(payload,), daemon=True)
            thread.start()
            return {"success": True, "decisionId": payload["decisionId"], "async": True}
        else:
            return self._send(payload)

    def _send(self, payload: dict) -> dict:
        """Send the payload to POST /api/v1/decisions."""
        url = f"{self.base_url}/api/v1/decisions"
        body = json.dumps(payload).encode("utf-8")
        req = Request(
            url,
            data=body,
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": f"Bearer {self.api_key}",
                "User-Agent": "agentprovenance-python/0.1.0",
            },
            method="POST",
        )
        try:
            with urlopen(req, timeout=self.timeout) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except HTTPError as e:
            body_text = e.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"Agent Provenance API error {e.code}: {body_text}") from e
        except URLError as e:
            raise RuntimeError(f"Agent Provenance API unreachable: {e.reason}") from e
        except Exception as e:
            # Never crash the agent — log and continue
            print(f"[AgentProvenance] Failed to capture decision: {e}")
            return {"success": False, "error": str(e)}
