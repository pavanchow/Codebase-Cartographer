/* MCPTools.jsx — live explorer of the MCP tool surface Cartographer exposes */

const TOOLS = [
  {
    id: 'find_symbol',
    icon: '◎',
    name: 'find_symbol',
    tag: 'lookup',
    signature: 'find_symbol(query: string, kind?: "fn"|"class"|"type"|"const") → Symbol[]',
    purpose: 'Resolve a name to its definition without grep.',
    request: `{ "query": "RateLimitMiddleware", "kind": "class" }`,
    response: `[
  {
    "name": "RateLimitMiddleware",
    "kind": "class",
    "file": "src/middleware/rate_limit.ts",
    "line": 18,
    "docstring": "Per-route token-bucket limiter. Emits X-RateLimit-* headers.",
    "exported": true
  }
]`,
  },
  {
    id: 'callers_of',
    icon: '↥',
    name: 'callers_of',
    tag: 'call graph',
    signature: 'callers_of(symbol: string, depth?: 1..5) → Caller[]',
    purpose: 'Who depends on this? Stops speculative edits.',
    request: `{ "symbol": "auth.session.verify", "depth": 2 }`,
    response: `[
  { "from": "src/app.ts:41", "path": "HTTP middleware chain" },
  { "from": "src/admin.ts:38", "path": "admin HTTP mount" },
  { "from": "workers/dispatch.py:77", "path": "background verify" }
]`,
  },
  {
    id: 'callees_of',
    icon: '↧',
    name: 'callees_of',
    tag: 'call graph',
    signature: 'callees_of(symbol: string, depth?: 1..5) → Callee[]',
    purpose: 'What does this reach? Useful for blast-radius sanity checks.',
    request: `{ "symbol": "api.billing.charge", "depth": 2 }`,
    response: `[
  { "to": "ext/stripe.createCharge" },
  { "to": "lib/billing/ledger.record" },
  { "to": "lib/tracing.span" },
  { "to": "events.emit" }
]`,
  },
  {
    id: 'blast_radius',
    icon: '◈',
    name: 'blast_radius',
    tag: 'safety',
    signature: 'blast_radius(target: File|Symbol) → { files, tests, docs, risk }',
    purpose: 'Scope a change before making it. Surfaces tests + docs.',
    request: `{ "target": "src/middleware/rate_limit.ts" }`,
    response: `{
  "files": ["routes/public/users.ts", "routes/public/orders.ts", "routes/public/events.ts"],
  "tests": ["e2e/rate_limit.spec.ts", "unit/middleware.spec.ts"],
  "docs":  ["docs/api/rate-limiting.mdx"],
  "risk":  "medium — 3 public routes mount this middleware"
}`,
  },
  {
    id: 'tests_for',
    icon: '✓',
    name: 'tests_for',
    tag: 'coverage',
    signature: 'tests_for(symbol|file|keyword: string) → Test[]',
    purpose: 'Which tests actually execute this code? (Not "which tests mention it.")',
    request: `{ "query": "rate-limit" }`,
    response: `[
  { "file": "tests/e2e/rate_limit.spec.ts", "suites": 4, "runs": "ci + pre-push" },
  { "file": "tests/unit/middleware.spec.ts", "suites": 2, "runs": "ci" },
  { "file": "tests/contract/headers.spec.ts", "suites": 1, "runs": "nightly" }
]`,
  },
  {
    id: 'similar_patterns',
    icon: '≈',
    name: 'similar_patterns',
    tag: 'pattern search',
    signature: 'similar_patterns(example: string) → Match[]',
    purpose: 'Find the other three places this pattern appears, before inventing a fourth.',
    request: `{ "example": "src/routes/public/users.ts#POST_handler" }`,
    response: `[
  { "file": "src/routes/public/orders.ts:12",  "similarity": 0.91 },
  { "file": "src/routes/public/events.ts:8",   "similarity": 0.88 },
  { "file": "src/routes/admin/audit.ts:24",    "similarity": 0.61 }
]`,
  },
  {
    id: 'file_summary',
    icon: '❂',
    name: 'file_summary',
    tag: 'summary',
    signature: 'file_summary(path: string) → { role, exports, invariants }',
    purpose: 'The one-line "why this file exists," pulled from map.md + index.',
    request: `{ "path": "src/auth/session.ts" }`,
    response: `{
  "role": "Verifies and rotates session tokens. Crosses every authenticated request.",
  "exports": ["verify", "issue", "rotate", "SessionError"],
  "invariants": ["token rotation is single-flight", "errors never leak raw JWTs"],
  "importance": 0.97
}`,
  },
  {
    id: 'module_brief',
    icon: '¶',
    name: 'module_brief',
    tag: 'summary',
    signature: 'module_brief(name: string) → MarkdownString',
    purpose: 'A self-contained paragraph about any module — suitable for inlining into a PR description.',
    request: `{ "name": "lib/tracing" }`,
    response: `"lib/tracing wraps OpenTelemetry with an acme-specific \\nspan context. Every fetch within a request propagates \\nX-Request-Id. The tracer is fail-open in prod, fail-loud in dev."`,
  },
];

const MCPTools = () => {
  const [activeId, setActiveId] = React.useState('blast_radius');
  const [copied, setCopied] = React.useState(false);
  const active = TOOLS.find(t => t.id === activeId);

  const copyReq = () => {
    navigator.clipboard?.writeText(active.request);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section id="tools" className="section section-alt">
      <div className="container-wide">
        <div className="section-head" style={{maxWidth: 780}}>
          <span className="eyebrow">The Index · MCP server</span>
          <h2>Eight tools Claude Code didn't have yesterday.<br/><em>All backed by your repo's ground truth.</em></h2>
          <p>Registered in <code style={{background:'var(--paper)', padding:'2px 8px', borderRadius:4, border:'1px solid var(--border-hair)', fontSize:14}}>.mcp.json</code>. Zero configuration — if Cartographer ran, the tools are there.</p>
        </div>

        <div className="mcp">
          <div className="mcp-list">
            {TOOLS.map(t => (
              <button
                key={t.id}
                className={`mcp-item ${activeId===t.id?'active':''}`}
                onClick={() => setActiveId(t.id)}
              >
                <span className="mcp-icon">{t.icon}</span>
                <div className="mcp-item-body">
                  <div className="mcp-item-name">{t.name}</div>
                  <div className="mcp-item-tag">{t.tag}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="mcp-detail">
            <div className="mcp-detail-head">
              <div>
                <div className="eyebrow" style={{marginBottom: 6}}>{active.tag}</div>
                <h3 className="mcp-detail-title">{active.name}</h3>
                <p className="mcp-detail-purpose">{active.purpose}</p>
              </div>
              <div className="mcp-icon-lg">{active.icon}</div>
            </div>

            <div className="mcp-signature">
              <div className="mcp-label">Signature</div>
              <code>{active.signature}</code>
            </div>

            <div className="mcp-io">
              <div className="mcp-io-col">
                <div className="mcp-io-head">
                  <div className="mcp-label">Request</div>
                  <button className="mcp-copy" onClick={copyReq}>
                    {copied ? '✓ copied' : 'copy'}
                  </button>
                </div>
                <pre className="mcp-code mcp-code-req">{active.request}</pre>
              </div>
              <div className="mcp-io-col">
                <div className="mcp-io-head">
                  <div className="mcp-label">Response</div>
                  <div className="mcp-io-badge">live · from your index</div>
                </div>
                <pre className="mcp-code mcp-code-res">{active.response}</pre>
              </div>
            </div>

            <div className="mcp-footnote">
              Called automatically by Claude Code when relevant — you don't have to remember these names.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

window.MCPTools = MCPTools;
