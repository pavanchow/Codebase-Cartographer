/* HowItWorks.jsx + Install.jsx + Footer.jsx */

const HowItWorks = () => {
  const [step, setStep] = React.useState(0);
  const steps = [
    {
      k: 'Explore',
      t: '40 minutes, autonomously',
      body: 'A long-horizon subagent reads the code, runs the tests to see what actually executes, traces the call graph, and identifies dead zones. Not indexing — understanding.',
      art: (
        <div className="hiw-art hiw-art-explore">
          {Array.from({length: 14}).map((_,i)=>(
            <div key={i} className="hiw-file" style={{animationDelay: `${i*0.08}s`}}/>
          ))}
        </div>
      ),
    },
    {
      k: 'Synthesize',
      t: 'A staff-engineer brief',
      body: "The agent doesn't dump everything it read — it prioritizes. Which three files matter. Which seventy don't. What the invariants are. Where the dragons live.",
      art: (
        <div className="hiw-art hiw-art-synthesize">
          <div className="hiw-doc">
            <div className="hiw-doc-h"/>
            <div className="hiw-doc-l" style={{width:'80%'}}/>
            <div className="hiw-doc-l" style={{width:'60%'}}/>
            <div className="hiw-doc-l" style={{width:'88%'}}/>
            <div className="hiw-doc-code">
              <div className="hiw-doc-code-l" style={{width:'50%'}}/>
              <div className="hiw-doc-code-l" style={{width:'70%'}}/>
              <div className="hiw-doc-code-l" style={{width:'40%'}}/>
            </div>
            <div className="hiw-doc-l" style={{width:'74%'}}/>
            <div className="hiw-doc-l" style={{width:'66%'}}/>
          </div>
        </div>
      ),
    },
    {
      k: 'Index',
      t: 'A queryable mental model',
      body: 'A SQLite index ships alongside — symbols, call graph, test-to-code mapping, file importance via PageRank on the graph. Sub-millisecond lookups.',
      art: (
        <div className="hiw-art hiw-art-index">
          <svg viewBox="0 0 280 160" width="100%" height="160">
            {[[40,80],[100,40],[100,120],[170,60],[170,110],[230,40],[230,120]].map(([x,y],i)=>(
              <circle key={i} cx={x} cy={y} r={i===3?10:6} fill={i===3?'#B85A3F':'#27251F'} opacity={i===3?1:0.35}/>
            ))}
            {[[40,80,100,40],[40,80,100,120],[100,40,170,60],[100,120,170,110],[170,60,230,40],[170,110,230,120],[170,60,170,110]].map(([x1,y1,x2,y2],i)=>(
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#27251F" strokeWidth="1" opacity="0.25"/>
            ))}
          </svg>
        </div>
      ),
    },
    {
      k: 'Serve',
      t: 'Via MCP, forever',
      body: 'The index becomes an MCP server. Every future Claude Code session on this repo gets find_symbol, blast_radius, tests_for — for free. Re-runs on a pre-push hook.',
      art: (
        <div className="hiw-art hiw-art-serve">
          {['find_symbol','callers_of','blast_radius','tests_for','similar_patterns'].map((t,i)=>(
            <div key={t} className="hiw-tool-pill" style={{animationDelay: `${i*0.15}s`}}>
              <span className="hiw-tool-dot"/>{t}
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section id="how" className="section">
      <div className="container-wide">
        <div className="section-head" style={{maxWidth: 780}}>
          <span className="eyebrow">How it works</span>
          <h2>One command. Four passes.<br/><em>Every session afterward: faster.</em></h2>
        </div>
        <div className="hiw">
          <div className="hiw-rail">
            {steps.map((s,i)=>(
              <button
                key={i}
                className={`hiw-rail-item ${step===i?'active':''}`}
                onClick={()=>setStep(i)}
              >
                <span className="hiw-rail-n">{String(i+1).padStart(2,'0')}</span>
                <span className="hiw-rail-k">{s.k}</span>
                <span className="hiw-rail-t">{s.t}</span>
              </button>
            ))}
          </div>
          <div className="hiw-panel">
            <div className="hiw-panel-k">{steps[step].k}</div>
            <div className="hiw-panel-t">{steps[step].t}</div>
            <p className="hiw-panel-body">{steps[step].body}</p>
            <div className="hiw-panel-art">{steps[step].art}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Install = () => {
  const [copied, setCopied] = React.useState(false);
  const cmd = 'npx cartographer init';
  const copy = () => {
    navigator.clipboard?.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <section id="install" className="section section-dark">
      <div className="container">
        <div className="install">
          <div className="install-head">
            <span className="eyebrow" style={{color:'var(--term-muted)'}}>Install</span>
            <h2 style={{color:'var(--term-fg)', fontFamily:'var(--font-serif)', fontSize:'clamp(34px,4vw,52px)', lineHeight:1.1, letterSpacing:'-0.02em', fontWeight:400, margin:'16px 0 20px'}}>One line. Thirty seconds.<br/><em style={{color:'#E59866'}}>Then go back to shipping.</em></h2>
          </div>

          <div className="install-cmd">
            <div className="install-cmd-line">
              <span className="term-dim">$</span>
              <span className="term-fg">{cmd}</span>
            </div>
            <button className="install-copy" onClick={copy}>
              {copied ? (
                <><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 6l3 3 5-6"/></svg> copied</>
              ) : (
                <><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="3" width="7" height="7" rx="1"/><path d="M2 8V2h6"/></svg> copy</>
              )}
            </button>
          </div>

          <div className="install-steps">
            <div className="install-step">
              <div className="install-step-n">01</div>
              <div className="install-step-body">
                <div className="install-step-t">cd into any repo</div>
                <div className="install-step-d">Python, TypeScript, Go, or Rust. No build system assumptions.</div>
              </div>
            </div>
            <div className="install-step">
              <div className="install-step-n">02</div>
              <div className="install-step-body">
                <div className="install-step-t">Run the command</div>
                <div className="install-step-d">Cartographer spawns a long-horizon Opus agent. Walk away for coffee.</div>
              </div>
            </div>
            <div className="install-step">
              <div className="install-step-n">03</div>
              <div className="install-step-body">
                <div className="install-step-t">Start Claude Code</div>
                <div className="install-step-d">The MCP server is already registered. The map is already read.</div>
              </div>
            </div>
          </div>

          <div className="install-meta">
            <div className="install-meta-item">MIT licensed · built at the Anthropic hackathon</div>
            <div className="install-meta-item">Authors: <a href="https://www.linkedin.com/in/pavanchow/" target="_blank">Pavan N</a> · <a href="https://www.linkedin.com/in/dina-m-0388462a3/" target="_blank">Dina M</a></div>
            <div className="install-meta-item">Source: <a href="https://github.com/pavanchow/Codebase-Cartographer" target="_blank">github.com/pavanchow/Codebase-Cartographer</a></div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="footer">
    <div className="container-wide">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">
            <svg width="28" height="28"><use href="#logo-mark"/></svg>
            Cartographer
          </div>
          <p className="caption" style={{maxWidth: 320}}>
            A Claude Code subagent that turns day one in an unfamiliar repo into day ninety.
          </p>
        </div>
        <div>
          <h5>Product</h5>
          <a href="#how">How it works</a>
          <a href="#demo">The proof</a>
          <a href="#map">Sample map.md</a>
          <a href="#tools">MCP tools</a>
        </div>
        <div>
          <h5>Resources</h5>
          <a href="https://github.com/pavanchow/Codebase-Cartographer" target="_blank">GitHub</a>
          <a href="#install">Install</a>
          <a href="#">Docs</a>
        </div>
        <div>
          <h5>Team</h5>
          <a href="https://www.linkedin.com/in/pavanchow/" target="_blank">Pavan N</a>
          <a href="https://www.linkedin.com/in/dina-m-0388462a3/" target="_blank">Dina M</a>
        </div>
      </div>
      <div className="footer-small">
        <span>© 2026 Cartographer · MIT</span>
        <span>Built for the Anthropic hackathon</span>
      </div>
    </div>
  </footer>
);

window.HowItWorks = HowItWorks;
window.Install = Install;
window.Footer = Footer;
