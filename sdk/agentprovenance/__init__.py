"""
Agent Provenance SDK
====================
Instrument your AI agents to capture decision traces for EU AI Act compliance.

Quick start:
    from agentprovenance import trace, init

    init(api_key="ap_live_...")

    @trace(agent_id="my-agent-v1", use_case="Credit risk assessment")
    def run_agent(customer_id: str, data: dict) -> dict:
        # your existing agent code, unchanged
        return {"approved": True, "reason": "Score above threshold"}

    result = run_agent("cust_12345", {...})
"""

from .client import AgentProvenanceClient
from .decorators import trace
from .models import Decision

__version__ = "0.1.0"
__all__ = ["init", "trace", "Decision", "AgentProvenanceClient"]

_default_client: AgentProvenanceClient | None = None


def init(
    api_key: str,
    base_url: str = "https://agentprovenance.io",
    timeout: float = 5.0,
    async_mode: bool = True,
) -> AgentProvenanceClient:
    """
    Initialise the Agent Provenance SDK with your API key.

    Args:
        api_key:   Your Agent Provenance API key (starts with ap_live_)
        base_url:  Override the API base URL (default: https://agentprovenance.io)
        timeout:   HTTP request timeout in seconds (default: 5.0)
        async_mode: Send traces in background threads (default: True, non-blocking)

    Returns:
        AgentProvenanceClient instance
    """
    global _default_client
    _default_client = AgentProvenanceClient(
        api_key=api_key,
        base_url=base_url,
        timeout=timeout,
        async_mode=async_mode,
    )
    return _default_client


def get_client() -> AgentProvenanceClient:
    if _default_client is None:
        raise RuntimeError(
            "Agent Provenance SDK not initialised. Call agentprovenance.init(api_key='...') first."
        )
    return _default_client
