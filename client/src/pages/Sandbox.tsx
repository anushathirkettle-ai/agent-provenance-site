/**
 * PRECISELY — Sandbox Page
 * Interactive API playground, Agent Readiness Score demo, code snippets
 * Design: Dark terminal aesthetic within the Editorial Precision system
 */
import { useState } from "react";
import { Link } from "wouter";
import { Play, Copy, CheckCircle2, ArrowRight, Database, MapPin, Layers, Eye, GitMerge, BarChart3, Shield } from "lucide-react";
import { toast } from "sonner";

// ─── API Examples ────────────────────────────────────────────────────────────
const apiExamples = [
  {
    id: "readiness",
    label: "Agent Readiness Score",
    icon: CheckCircle2,
    color: "oklch(0.62 0.20 264)",
    endpoint: "POST /v1/agent-readiness/score",
    description: "Score your data across 5 dimensions before your agents act on it.",
    request: `{
  "source": "sample",
  "records": [
    {
      "id": "cust_001",
      "name": "Acme Corporation",
      "address": "123 Main St, New York",
      "email": "contact@acme.com",
      "phone": "+1-212-555-0100"
    }
  ],
  "dimensions": [
    "completeness",
    "accuracy",
    "consistency",
    "freshness",
    "context"
  ]
}`,
    response: `{
  "score": {
    "overall": 72,
    "completeness": 85,
    "accuracy": 48,
    "consistency": 74,
    "freshness": 91,
    "context": 34
  },
  "issues": [
    {
      "dimension": "accuracy",
      "severity": "high",
      "field": "address",
      "message": "Address could not be geocoded",
      "fix": "Enable Geo Addressing to validate"
    },
    {
      "dimension": "context",
      "severity": "high",
      "message": "No enrichment context detected",
      "fix": "Enable Data Enrichment for demographics"
    }
  ],
  "recommendations": [
    "geo_addressing",
    "data_enrichment"
  ],
  "credits_used": 5
}`,
  },
  {
    id: "geocode",
    label: "Geo Addressing",
    icon: MapPin,
    color: "oklch(0.60 0.15 300)",
    endpoint: "POST /v1/geo-addressing/geocode",
    description: "Validate and geocode addresses across 140+ countries.",
    request: `{
  "addresses": [
    {
      "addressLine1": "1 Infinite Loop",
      "city": "Cupertino",
      "stateProvince": "CA",
      "postalCode": "95014",
      "country": "USA"
    }
  ],
  "options": {
    "returnLatLong": true,
    "returnStandardized": true,
    "returnConfidence": true
  }
}`,
    response: `{
  "results": [
    {
      "input": "1 Infinite Loop, Cupertino, CA",
      "standardized": "1 Infinite Loop, Cupertino, CA 95014-2083",
      "latitude": 37.331741,
      "longitude": -122.030333,
      "confidence": 99.8,
      "status": "VERIFIED",
      "preciselyId": "P0000GL41OME",
      "components": {
        "houseNumber": "1",
        "street": "Infinite Loop",
        "city": "Cupertino",
        "state": "CA",
        "zip": "95014",
        "zip4": "2083",
        "country": "USA"
      }
    }
  ],
  "credits_used": 1
}`,
  },
  {
    id: "quality",
    label: "Data Quality",
    icon: Database,
    color: "oklch(0.62 0.20 264)",
    endpoint: "POST /v1/data-quality/assess",
    description: "AI-powered data quality assessment with auto-remediation.",
    request: `{
  "dataset": "customers",
  "records": [
    {
      "customer_id": "C001",
      "email": "john.doe@example",
      "phone": "555-1234",
      "dob": "1985/03/15"
    }
  ],
  "rules": "recommended",
  "autoFix": true,
  "agent": "data_quality_agent"
}`,
    response: `{
  "assessment": {
    "total_records": 1,
    "issues_found": 3,
    "auto_fixed": 2,
    "requires_review": 1
  },
  "issues": [
    {
      "field": "email",
      "rule": "EMAIL_FORMAT",
      "original": "john.doe@example",
      "status": "FLAGGED",
      "message": "Invalid email domain"
    },
    {
      "field": "phone",
      "rule": "PHONE_NORMALIZE",
      "original": "555-1234",
      "fixed": "+1-555-555-1234",
      "status": "AUTO_FIXED"
    },
    {
      "field": "dob",
      "rule": "DATE_STANDARDIZE",
      "original": "1985/03/15",
      "fixed": "1985-03-15",
      "status": "AUTO_FIXED"
    }
  ],
  "credits_used": 1
}`,
  },
  {
    id: "enrichment",
    label: "Data Enrichment",
    icon: Layers,
    color: "oklch(0.70 0.16 140)",
    endpoint: "POST /v1/data-enrichment/enrich",
    description: "Add real-world context from 500+ curated datasets.",
    request: `{
  "records": [
    {
      "preciselyId": "P0000GL41OME",
      "address": "1 Infinite Loop, Cupertino CA"
    }
  ],
  "datasets": [
    "demographics",
    "firmographics",
    "crime_risk",
    "property_info"
  ],
  "agent": "enrichment_agent"
}`,
    response: `{
  "enriched": [
    {
      "preciselyId": "P0000GL41OME",
      "demographics": {
        "median_household_income": 142500,
        "population_density": 4200,
        "education_college_pct": 68.2
      },
      "firmographics": {
        "business_count_500m": 1240,
        "dominant_industry": "Technology"
      },
      "crime_risk": {
        "overall_index": 12,
        "rating": "Very Low"
      },
      "property_info": {
        "median_home_value": 1850000,
        "year_built_median": 1975
      }
    }
  ],
  "credits_used": 12
}`,
  },
];

// ─── Sample Data for Readiness Demo ─────────────────────────────────────────
const sampleDatasets = [
  { id: "customers", label: "Customer records (1,000 rows)", score: 72 },
  { id: "addresses", label: "Delivery addresses (5,000 rows)", score: 48 },
  { id: "products", label: "Product catalog (800 rows)", score: 85 },
  { id: "transactions", label: "Transaction log (10,000 rows)", score: 61 },
];

export default function Sandbox() {
  const [activeApi, setActiveApi] = useState("readiness");
  const [running, setRunning] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState("customers");
  const [copied, setCopied] = useState(false);

  const activeExample = apiExamples.find(e => e.id === activeApi)!;

  const handleRun = () => {
    setRunning(true);
    setShowResponse(false);
    setTimeout(() => {
      setRunning(false);
      setShowResponse(true);
    }, 1200);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[oklch(0.10_0.012_260)]" style={{ fontFamily: "var(--font-sans-body)" }}>

      {/* Header */}
      <section className="pt-24 pb-10 border-b border-white/8">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="text-xs font-mono-data text-[oklch(0.62_0.20_264)] uppercase tracking-widest mb-3">Sandbox</div>
              <h1 className="font-serif-display text-4xl text-white mb-3">
                Try the API. No setup required.
              </h1>
              <p className="text-white/50 max-w-xl leading-relaxed">
                5,000 free credits. Live API responses. Copy the code and use it in your project.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-white/6 border border-white/10 rounded-lg font-mono-data text-xs text-white/50">
                <span className="text-[oklch(0.72_0.18_162)]">●</span> 4,850 credits remaining
              </div>
              <Link href="/pricing" className="px-4 py-2 bg-indigo text-white text-sm font-semibold rounded-lg hover:bg-[oklch(0.46_0.22_264)] transition-colors">
                Upgrade
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main playground */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">


          {/* Left: API selector — horizontal scroll on mobile, vertical sidebar on desktop */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 lg:space-y-2 -mx-6 px-6 lg:mx-0 lg:px-0">
            <div className="hidden lg:block text-xs font-mono-data text-white/30 uppercase tracking-widest mb-4 px-1">APIs</div>
            {apiExamples.map((example) => {
              const Icon = example.icon;
              return (
                <button
                  key={example.id}
                  onClick={() => { setActiveApi(example.id); setShowResponse(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeApi === example.id
                      ? "bg-white/10 border border-white/15"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${example.color.replace(')', ' / 0.15)')}` }}
                  >
                    <Icon size={15} style={{ color: example.color }} />
                  </div>
                  <div>
                  <div className="text-sm font-medium text-white whitespace-nowrap">{example.label}</div>
                  <div className="text-[10px] text-white/40 font-mono-data mt-0.5 hidden lg:block">{example.endpoint.split(" ")[0]}</div>
                  </div>
                </button>
              );
            })}

            {/* More APIs — hidden on mobile */}
            <div className="hidden lg:block pt-4 border-t border-white/8">
              <div className="text-xs font-mono-data text-white/30 uppercase tracking-widest mb-3 px-1">More APIs</div>
              {[
                { label: "Observability", icon: Eye },
                { label: "Spatial Analytics", icon: BarChart3 },
                { label: "Data Governance", icon: Shield },
                { label: "Data Integration", icon: GitMerge },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => toast.info(`${item.label} API coming to sandbox soon`)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-white/5 transition-all opacity-60"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 shrink-0">
                      <Icon size={15} className="text-white/40" />
                    </div>
                    <div className="text-sm text-white/50">{item.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Playground */}
          <div className="space-y-4">
            {/* Endpoint bar */}
            <div className="flex flex-wrap items-center gap-2 p-3 bg-[oklch(0.14_0.010_260)] border border-white/8 rounded-xl">
              <span className="px-2 py-0.5 bg-[oklch(0.62_0.20_264)/20] text-[oklch(0.75_0.18_264)] text-[11px] font-mono-data font-medium rounded">
                {activeExample.endpoint.split(" ")[0]}
              </span>
              <span className="font-mono-data text-xs sm:text-sm text-white/70 flex-1 min-w-0 truncate">{activeExample.endpoint.split(" ")[1]}</span>
              <button
                onClick={handleRun}
                disabled={running}
                className="flex items-center gap-2 px-4 py-2 bg-[oklch(0.72_0.18_162)] text-white text-sm font-semibold rounded-lg hover:bg-[oklch(0.65_0.18_162)] transition-colors disabled:opacity-60"
              >
                {running ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play size={13} />
                    Run
                  </>
                )}
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-white/50 px-1">{activeExample.description}</p>

            {/* Request / Response */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Request */}
              <div className="bg-[oklch(0.08_0.010_260)] border border-white/8 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                  <span className="text-xs font-mono-data text-white/40">Request body</span>
                  <button
                    onClick={() => handleCopy(activeExample.request)}
                    className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
                  >
                    {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                    Copy
                  </button>
                </div>
                <pre className="p-4 text-[12px] leading-relaxed font-mono-data text-white/70 overflow-x-auto">
                  {activeExample.request}
                </pre>
              </div>

              {/* Response */}
              <div className="bg-[oklch(0.08_0.010_260)] border border-white/8 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                  <span className="text-xs font-mono-data text-white/40">Response</span>
                  {showResponse && (
                    <span className="flex items-center gap-1.5 text-xs font-mono-data text-[oklch(0.72_0.18_162)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.72_0.18_162)]" />
                      200 OK
                    </span>
                  )}
                </div>
                <div className="p-4 min-h-[200px]">
                  {!showResponse && !running && (
                    <div className="flex flex-col items-center justify-center h-40 text-white/20">
                      <Play size={24} className="mb-3" />
                      <span className="text-xs font-mono-data">Click Run to see the response</span>
                    </div>
                  )}
                  {running && (
                    <div className="flex flex-col items-center justify-center h-40 text-white/40">
                      <div className="w-6 h-6 border-2 border-white/20 border-t-[oklch(0.62_0.20_264)] rounded-full animate-spin mb-3" />
                      <span className="text-xs font-mono-data">Calling API...</span>
                    </div>
                  )}
                  {showResponse && (
                    <pre className="text-[12px] leading-relaxed font-mono-data text-[oklch(0.72_0.18_162)] overflow-x-auto">
                      {activeExample.response}
                    </pre>
                  )}
                </div>
              </div>
            </div>

            {/* Code snippet */}
            <div className="bg-[oklch(0.08_0.010_260)] border border-white/8 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                <span className="text-xs font-mono-data text-white/40">Use in your project</span>
                <div className="flex gap-2">
                  {["Node.js", "Python", "cURL"].map((lang) => (
                    <button key={lang} className="text-[10px] font-mono-data px-2 py-0.5 rounded bg-white/8 text-white/50 hover:text-white/80 transition-colors">
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
              <pre className="p-4 text-[12px] leading-relaxed font-mono-data text-white/70 overflow-x-auto">{`import Precisely from '@precisely/sdk';

const client = new Precisely({
  apiKey: 'YOUR_API_KEY'  // Get free key at precisely.com/sandbox
});

const result = await client.${activeApi === 'readiness' ? 'agentReadiness.score' : activeApi === 'geocode' ? 'geoAddressing.geocode' : activeApi === 'quality' ? 'dataQuality.assess' : 'dataEnrichment.enrich'}(
  yourData,
  { agent: 'auto' }
);

console.log(result);`}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Get API key CTA */}
      <section className="border-t border-white/8 py-12">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-8 bg-[oklch(0.14_0.010_260)] rounded-2xl border border-white/8">
            <div>
              <h3 className="font-serif-display text-2xl text-white mb-2">Ready to use this in production?</h3>
              <p className="text-white/50 text-sm">Get your free API key. 5,000 credits included. No credit card.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link href="/developers" className="px-5 py-2.5 bg-white/8 border border-white/15 text-white text-sm font-medium rounded-lg hover:bg-white/12 transition-colors">
                View full docs
              </Link>
              <Link href="/pricing" className="flex items-center gap-2 px-5 py-2.5 bg-indigo text-white text-sm font-semibold rounded-lg hover:bg-[oklch(0.46_0.22_264)] transition-colors">
                Get free API key
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
