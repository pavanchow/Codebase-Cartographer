/* Hero.jsx — animated headline + live "cartographer scan" preview */
const Hero = () => {
  const [phase, setPhase] = React.useState(0);
  // typewriter scan lines
  const lines = [
    { t: 210, kind: 'prompt', text: '$ npx cartographer .' },
    { t: 460, kind: 'muted',  text: '✓ detected: python (67%), typescript (31%), dockerfile' },
    { t: 320, kind: 'muted',  text: '✓ 2,847 files · 312,104 LOC · 4 packages · 1 workspace' },
    { t: 380, kind: 'blue',   text: '→ pass 1 · entry points            74 found' },
    { t: 340, kind: 'blue',   text: '→ pass 2 · import graph            52,004 edges' },
    { t: 360, kind: 'blue',   text: '→ pass 3 · test coverage map       1,204 links' },
    { t: 380, kind: 'blue',   text: '→ pass 4 · dead code & invariants  23 zones flagged' },
    { t: 360, kind: 'blue',   text: '→ pass 5 · architecture synthesis  writing map.md…' },
    { t: 700, kind: 'green',  text: '✓ produced .claude/map.md  (14,204 words)' },
    { t: 220, kind: 'green',  text: '✓ produced .claude/index.db  (8.4 MB)' },
    { t: 220, kind: 'green',  text: '✓ MCP server registered in .mcp.json' },
    { t: 400, kind: 'strong', text: 'Ready. Claude Code now knows your codebase.' },
  ];

  React.useEffect(() => {
    if (phase >= lines.length) return;
    const id = setTimeout(() => setPhase(p => p + 1), lines[phase].t);
    return () => clearTimeout(id);
  }, [phase]);

  const restart = () => setPhase(0);

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div>
            <div className="hero-eyebrow">
              <span className="dot"></span>
              A subagent for Claude Code · built at the Anthropic hackathon
            </div>
            <h1>
              Claude Code is great<br/>on day one.<br/>
              <span className="accent">Cartographer</span> makes day&nbsp;one<br/>
              feel like <span className="ink">day ninety.</span>
            </h1>
            <p className="lede">
              A subagent that spends forty minutes reading your repo
              so Claude Code doesn't have to. Ships a living architectural
              brief and an MCP server of semantic tools for every session that follows.
            </p>
            <div className="hero-ctas">
              <a className="btn btn-primary btn-mono" href="#install" onClick={(e)=>{e.preventDefault(); document.getElementById('install')?.scrollIntoView({behavior:'smooth', block:'start'});}}>
                <span>$ npx cartographer</span>
              </a>
              <a className="btn btn-ghost" href="#demo" onClick={(e)=>{e.preventDefault(); document.getElementById('demo')?.scrollIntoView({behavior:'smooth', block:'start'});}}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 2l9 5-9 5V2z"/></svg>
                Watch the 90-second demo
              </a>
            </div>
            <div className="hero-meta">
              <span>MIT licensed</span>
              <span className="dotmid"></span>
              <span>Works with any Claude Code project</span>
              <span className="dotmid"></span>
              <span>Python · TypeScript · Go · Rust</span>
            </div>
          </div>

          <div className="hero-right">
            <HeroTerm lines={lines.slice(0, phase)} active={phase < lines.length} onRestart={restart}/>
          </div>
        </div>
      </div>
    </section>
  );
};

const HeroTerm = ({ lines, active, onRestart }) => {
  const bodyRef = React.useRef(null);
  React.useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines.length]);

  const klass = (k) => ({
    prompt: 'term-green',
    muted:  'term-muted',
    blue:   'term-blue',
    green:  'term-green',
    red:    'term-red',
    orange: 'term-orange',
    yellow: 'term-yellow',
    strong: 'term-strong',
  })[k] || '';

  return (
    <div className="term" style={{minHeight: 400}}>
      <div className="term-head">
        <div className="term-dots"><span/><span/><span/></div>
        <div className="term-title">~/repos/acme-monorepo — cartographer</div>
        <div className="term-head-right">▸ scanning</div>
      </div>
      <div className="term-body" ref={bodyRef} style={{minHeight: 340}}>
        {lines.map((l, i) => (
          <span key={i} className={`term-line ${klass(l.kind)}`}>
            {l.text}
          </span>
        ))}
        {active && <span className="term-line term-caret term-dim">scanning…</span>}
        {!active && (
          <>
            <span className="term-line">&nbsp;</span>
            <span className="term-line term-dim" style={{cursor:'pointer'}} onClick={onRestart}>
              ↺ replay
            </span>
          </>
        )}
      </div>
    </div>
  );
};

window.Hero = Hero;
