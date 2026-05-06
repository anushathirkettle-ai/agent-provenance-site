/**
 * AGENT PROVENANCE — API Keys
 * Users create and revoke API keys to authenticate the SDK.
 */
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Key, Plus, Trash2, Copy, Check, Loader2, Shield, AlertTriangle } from "lucide-react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1 text-white/30 hover:text-teal-400 transition-colors"
      title="Copy"
    >
      {copied ? <Check size={13} className="text-teal-400" /> : <Copy size={13} />}
    </button>
  );
}

export default function ApiKeys() {
  const { user, loading } = useAuth();
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
  const utils = trpc.useUtils();

  const { data: keys, isLoading } = trpc.decisions.listApiKeys.useQuery(undefined, { enabled: !!user });

  const createKey = trpc.decisions.createApiKey.useMutation({
    onSuccess: (data) => {
      setNewKeyValue(data.raw);
      setNewKeyName("");
      utils.decisions.listApiKeys.invalidate();
    },
  });

  const revokeKey = trpc.decisions.revokeApiKey.useMutation({
    onSuccess: () => utils.decisions.listApiKeys.invalidate(),
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[oklch(0.10_0.015_240)] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-teal-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[oklch(0.10_0.015_240)] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <Shield size={36} className="text-teal-400 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-white mb-3">Sign in to manage API keys</h2>
          <a href={getLoginUrl("/decisions/api-keys")} className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 text-[oklch(0.08_0.015_240)] font-semibold rounded hover:bg-teal-400 transition-colors text-sm">
            Sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[oklch(0.10_0.015_240)]">
      <div className="border-b border-white/8 bg-[oklch(0.12_0.015_240)]">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">Fleet</div>
            <h1 className="font-serif text-xl text-white">API Keys</h1>
          </div>
          <Link href="/decisions" className="text-xs text-white/40 hover:text-white/70 transition-colors font-mono">
            ← Decision log
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

        {/* New key revealed */}
        {newKeyValue && (
          <div className="bg-teal-500/10 border border-teal-500/25 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle size={16} className="text-teal-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-teal-300 font-semibold mb-1">Copy this key now — it won't be shown again.</p>
                <div className="flex items-center gap-2 bg-[oklch(0.09_0.015_240)] rounded-lg px-3 py-2 mt-2">
                  <code className="text-xs font-mono text-teal-400 flex-1 break-all">{newKeyValue}</code>
                  <CopyButton text={newKeyValue} />
                </div>
                <button onClick={() => setNewKeyValue(null)} className="text-xs text-white/30 hover:text-white/60 mt-3 transition-colors">
                  I've copied it, dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create new key */}
        <div className="bg-[oklch(0.12_0.015_240)] border border-white/8 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Plus size={15} className="text-teal-400" /> Create new API key
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Key name (e.g. production-agent)"
              value={newKeyName}
              onChange={e => setNewKeyName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && newKeyName.trim() && createKey.mutate({ name: newKeyName.trim() })}
              className="flex-1 px-3 py-2 bg-[oklch(0.10_0.015_240)] border border-white/10 rounded text-sm text-white/80 placeholder:text-white/25 font-mono focus:outline-none focus:border-teal-500/50"
            />
            <button
              onClick={() => newKeyName.trim() && createKey.mutate({ name: newKeyName.trim() })}
              disabled={!newKeyName.trim() || createKey.isPending}
              className="px-4 py-2 bg-teal-500 text-[oklch(0.08_0.015_240)] font-semibold rounded text-sm hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {createKey.isPending ? <Loader2 size={14} className="animate-spin" /> : <Key size={14} />}
              Generate
            </button>
          </div>
        </div>

        {/* Keys list */}
        <div className="bg-[oklch(0.12_0.015_240)] border border-white/8 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/8">
            <h2 className="text-sm font-semibold text-white">Active keys</h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={20} className="animate-spin text-teal-400" />
            </div>
          ) : !keys?.length ? (
            <div className="text-center py-12 text-white/30 text-sm">
              <Key size={24} className="mx-auto mb-3 opacity-30" />
              No API keys yet. Create one above to start capturing decisions.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {keys.map(k => (
                <div key={k.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Key size={14} className="text-teal-400/60" />
                    <div>
                      <div className="text-sm text-white/80 font-medium">{k.name}</div>
                      <div className="text-xs font-mono text-white/30 mt-0.5">
                        {k.keyPrefix}••••••••••••••••••••••••
                        {k.lastUsedAt && (
                          <span className="ml-2 text-white/20">
                            Last used {new Date(k.lastUsedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => confirm(`Revoke "${k.name}"? This cannot be undone.`) && revokeKey.mutate({ keyId: k.id })}
                    className="p-1.5 text-white/20 hover:text-red-400 transition-colors"
                    title="Revoke key"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Usage example */}
        <div className="bg-[oklch(0.12_0.015_240)] border border-white/8 rounded-xl p-5">
          <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-3">Usage</div>
          <pre className="text-xs text-teal-300 font-mono leading-relaxed overflow-x-auto">
{`import agentprovenance

agentprovenance.init(api_key="ap_live_your_key_here")

from agentprovenance import trace

@trace(agent_id="credit-risk-v2", use_case="Credit risk assessment")
def assess_credit(customer_id: str, data: dict) -> dict:
    # Your agent logic here
    return {"approved": True, "score": 742}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
