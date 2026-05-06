# Agent Provenance Python SDK

Instrument your AI agents for EU AI Act compliance in two lines of code.

```bash
pip install agentprovenance
```

## Quick Start

```python
import agentprovenance

# Initialise once at app startup
agentprovenance.init(api_key="ap_live_your_key_here")

# Wrap your agent function with @trace
from agentprovenance import trace

@trace(
    agent_id="credit-risk-agent-v2",
    use_case="Loan approval decision",
    subject_id_arg="customer_id",       # links each decision to a customer
    subject_type="customer",
    data_sources=["precisely-mcp/address-api", "experian-credit-api"],
    model_name="gpt-4o",
    risk_classification="HIGH",          # EU AI Act risk level
)
def assess_credit_risk(customer_id: str, application: dict) -> dict:
    # Your existing agent code — completely unchanged
    return {"approved": True, "score": 742, "reason": "Strong credit history"}

# Call your agent as normal — traces are captured automatically in the background
result = assess_credit_risk("cust_12345", application_data)
```

That's it. Every call to `assess_credit_risk` now creates an audit trail in your Agent Provenance dashboard.

---

## What Gets Captured

| Field | Description |
|---|---|
| `decision_id` | Unique ID for this decision (auto-generated) |
| `agent_id` | Which agent made it |
| `subject_id` | The customer/entity this decision was about |
| `use_case` | What the agent was doing |
| `input_summary` | Description of the input (raw data is hashed, not stored) |
| `output_summary` | What the agent decided |
| `data_sources` | Which APIs and databases were used |
| `model_name` | Which LLM was invoked |
| `risk_classification` | EU AI Act risk level |
| `latency_ms` | How long the agent took |
| `decided_at` | UTC timestamp of the decision |

---

## Manual Capture

If the decorator doesn't fit your workflow, capture decisions manually:

```python
from agentprovenance import get_client, Decision

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
```

---

## LangChain Integration

```python
import agentprovenance
from agentprovenance import trace
from langchain.chains import LLMChain

agentprovenance.init(api_key="ap_live_your_key_here")

@trace(
    agent_id="langchain-customer-service-v1",
    use_case="Customer complaint resolution",
    subject_id_arg="customer_id",
    data_sources=["crm-api", "product-knowledge-base"],
    model_name="gpt-4o",
    risk_classification="LIMITED",
)
def resolve_complaint(customer_id: str, complaint: str) -> str:
    return chain.invoke({"complaint": complaint})["text"]
```

---

## Precisely MCP Server Integration

If you're using Precisely's MCP Server for data enrichment, pass the API names as `data_sources`:

```python
@trace(
    agent_id="address-validation-agent-v2",
    use_case="Customer address validation and enrichment",
    subject_id_arg="customer_id",
    data_sources=[
        "precisely-mcp/address-validate",
        "precisely-mcp/geocode",
        "precisely-mcp/demographics-enrichment",
    ],
    model_name="gpt-4o",
    risk_classification="LIMITED",
)
def validate_and_enrich_address(customer_id: str, raw_address: str) -> dict:
    # Uses Precisely MCP Server to validate and enrich the address
    result = mcp_client.call("address-validate", {"address": raw_address})
    return result
```

This creates a complete lineage trail: **Precisely data → agent decision → audit record**.

---

## EU AI Act Risk Classification

| Level | When to use |
|---|---|
| `HIGH` | Credit scoring, recruitment, medical diagnosis, law enforcement, critical infrastructure |
| `LIMITED` | Chatbots, emotion recognition, deep fakes (with disclosure obligations) |
| `MINIMAL` | Spam filters, AI in video games, inventory management |
| `UNCLASSIFIED` | Not yet assessed (default) |

---

## REST API

The SDK calls `POST /api/v1/decisions` directly. You can also call it from any HTTP client:

```bash
curl -X POST https://agentprovenance.io/api/v1/decisions \
  -H "Authorization: Bearer ap_live_..." \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "credit-risk-agent-v2",
    "useCase": "Loan approval decision",
    "outputSummary": "Approved — credit score 742, low risk",
    "riskClassification": "HIGH",
    "modelName": "gpt-4o",
    "latencyMs": 1240
  }'
```

Response:
```json
{ "success": true, "decisionId": "ap_a1b2c3d4e5f6..." }
```

---

## Zero Dependencies

The SDK uses only the Python standard library. No `requests`, no `httpx`, no `aiohttp` — nothing to conflict with your existing dependencies.

---

## License

MIT — see [LICENSE](LICENSE)
