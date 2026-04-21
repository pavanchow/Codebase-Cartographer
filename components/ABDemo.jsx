/* ABDemo.jsx — the centerpiece: vanilla Claude Code vs Cartographer, side-by-side race */

const TASK = {
  prompt: "add rate-limit headers to every public API route, and update docs + tests",
  repo: "acme/acme-monorepo",
  repoMeta: "312k LOC · 2,847 files · 4 services",
};

// VANILLA side — the painful, grep-heavy version
const VANILLA_STEPS = [
  { t: 140, tool: 'Read',    label: 'package.json',                   info: '82 tokens' },
  { t: 110, tool: 'Glob',    label: '**/*.{ts,py}',                   info: '2,847 matches' },
  { t: 160, tool: 'Grep',    label: 'rate[_-]?limit',                 info: '141 hits across 38 files' },
  { t: 180, tool: 'Read',    label: 'src/middleware/rate_limit.ts',    info: '412 lines' },
  { t: 160, tool: 'Read',    label: 'src/middleware/throttle.ts',      info: '201 lines' },
  { t: 150, tool: 'Read',    label: 'packages/api-core/headers.ts',    info: '96 lines' },
  { t: 160, tool: 'Grep',    label: "'X-RateLimit'",                   info: '4 hits' },
  { t: 150, tool: 'Read',    label: 'src/routes/v1/index.ts',          info: "wrong file — doesn't mount" },
  { t: 160, tool: 'Read',    label: 'src/routes/v2/index.ts',          info: '307 lines' },
  { t: 140, tool: 'Read',    label: 'src/app.ts',                      info: 'middleware order' },
  { t: 150, tool: 'Grep',    label: "'use(.*Limit)'",                  info: '12 hits' },
  { t: 180, tool: 'Read',    label: 'src/routes/public/users.ts',      info: '88 lines' },
  { t: 160, tool: 'Read',    label: 'src/routes/public/orders.ts',     info: '134 lines' },
  { t: 170, tool: 'Read',    label: 'src/routes/public/events.ts',     info: '162 lines' },
  { t: 160, tool: 'Read',    label: 'tests/e2e/rate_limit.spec.ts',    info: '201 lines' },
  { t: 160, tool: 'Read',    label: 'tests/unit/throttle.spec.ts',     info: 'unrelated' },
  { t: 180, tool: 'Edit',    label: 'src/middleware/rate_limit.ts',    info: 'adds header output' },
  { t: 180, tool: 'Edit',    label: 'src/routes/public/users.ts',      info: 'wires middleware' },
  { t: 180, tool: 'Edit',    label: 'src/routes/public/orders.ts',     info: 'wires middleware' },
  { t: 180, tool: 'Edit',    label: 'src/routes/public/events.ts',     info: 'wires middleware' },
  { t: 200, tool: 'Bash',    label: 'pnpm test',                       info: '... 14 tests fail' },
  { t: 200, tool: 'Read',    label: 'tests/e2e/rate_limit.spec.ts',    info: 'missing header fixture' },
  { t: 180, tool: 'Edit',    label: 'tests/e2e/rate_limit.spec.ts',    info: 'fixes header assertions' },
  { t: 200, tool: 'Bash',    label: 'pnpm test',                       info: '✓ 202 passed · still missed docs' },
];

// CARTOGRAPHER side — lean, exact, fast
const SMART_STEPS = [
  { t: 120, tool: 'cartographer.tests_for',   label: "'rate-limit'",                                 info: '7 tests in 3 files' },
  { t: 120, tool: 'cartographer.find_symbol', label: "'RateLimitMiddleware'",                        info: 'defined src/middleware/rate_limit.ts:18' },
  { t: 120, tool: 'cartographer.callers_of',  label: "'RateLimitMiddleware'",                        info: 'mounted at src/app.ts:41 (1 site)' },
  { t: 130, tool: 'cartographer.blast_radius',label: "'public API routes'",                          info: '3 files · 7 tests · 2 docs' },
  { t: 160, tool: 'Edit',                     label: 'src/middleware/rate_limit.ts',                 info: 'emits X-RateLimit headers' },
  { t: 150, tool: 'Edit',                     label: 'tests/e2e/rate_limit.spec.ts',                 info: 'asserts headers present' },
  { t: 140, tool: 'Edit',                     label: 'docs/api/rate-limiting.mdx',                   info: 'updates response examples' },
  { t: 220, tool: 'Bash',                     label: 'pnpm test',                                    info: '✓ 209 passed · 0 failed' },
];

const TOTAL_VANILLA_TIME_S = 381; // "6:21"
const TOTAL_SMART_TIME_S   =  68; // "1:08"
const SPEED = 1.0;

function useTicker(playing, rate = 1) {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    if (!playing) return;
    let raf, last = performance.now();
    const tick = (now) => {
      setT(tt => tt + (now - last) * rate / 1000);
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, rate]);
  return [t, () => setT(0)];
}

const fmtTime = (s) => {
  const m = Math.floor(s/60), ss = Math.floor(s%60).toString().padStart(2,'0');
  return `${m}:${ss}`;
};

// A single runner (used twice — left and right)
const Runner = ({ title, subtitle, steps, progressRatio, onTick, tone = 'default', variant = 'vanilla' }) => {
  const bodyRef = React.useRef(null);
  const [stepIdx, setStepIdx] = React.useState(0);

  // cumulative advance: as progressRatio (0..1) grows, reveal more steps
  React.useEffect(() => {
    const totalT = steps.reduce((a,s)=>a+s.t, 0);
    let t = progressRatio * totalT;
    let i = 0;
    for (; i < steps.length; i++) {
      if (t < steps[i].t) break;
      t -= steps[i].t;
    }
    setStepIdx(i);
  }, [progressRatio, steps]);

  React.useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [stepIdx]);

  const toolCalls = Math.min(stepIdx, steps.length);
  const done = stepIdx >= steps.length;

  return (
    <div className={`runner runner-${variant}`}>
      <div className="runner-head">
        <div className="runner-title">
          <div className="runner-chip">
            {variant === 'smart'
              ? <svg width="14" height="14" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="13" stroke="#E8E1D0" strokeWidth="1.2" opacity="0.3"/><path d="M20 8 L23 20 L20 22 L17 20 Z" fill="#E59866"/><path d="M20 32 L17 20 L20 18 L23 20 Z" fill="#E8E1D0"/></svg>
              : <div style={{width:14,height:14, borderRadius:3, background:'#5C574C'}}/>}
            {title}
          </div>
          <div className="runner-sub">{subtitle}</div>
        </div>
        <div className="runner-meters">
          <div className="meter">
            <div className="meter-k">Tool calls</div>
            <div className="meter-v">{toolCalls}</div>
          </div>
          <div className="meter">
            <div className="meter-k">Elapsed</div>
            <div className="meter-v">{fmtTime(progressRatio * (variant==='smart' ? TOTAL_SMART_TIME_S : TOTAL_VANILLA_TIME_S))}</div>
          </div>
          <div className="meter meter-status">
            <div className="meter-k">Status</div>
            <div className={`meter-v ${done ? 'ok' : 'running'}`}>{done ? '● done' : '● running'}</div>
          </div>
        </div>
      </div>
      <div className="term runner-term">
        <div className="term-head">
          <div className="term-dots"><span/><span/><span/></div>
          <div className="term-title">claude-code · {TASK.repo}</div>
          <div className="term-head-right">{variant === 'smart' ? 'with cartographer' : 'vanilla'}</div>
        </div>
        <div className="term-body" ref={bodyRef} style={{height: 360}}>
          <div className="term-line term-dim">$ claude "{TASK.prompt}"</div>
          <div className="term-line">&nbsp;</div>
          {steps.slice(0, stepIdx).map((s, i) => (
            <ToolLine key={i} step={s} variant={variant}/>
          ))}
          {done && (
            <>
              <div className="term-line">&nbsp;</div>
              {variant === 'smart' ? (
                <>
                  <div className="term-line term-green">✓ rate-limit headers added to 3 route files</div>
                  <div className="term-line term-green">✓ tests/e2e/rate_limit.spec.ts updated</div>
                  <div className="term-line term-green">✓ docs/api/rate-limiting.mdx updated</div>
                  <div className="term-line term-green">✓ 209 passing · 0 failing · 0 regressions</div>
                </>
              ) : (
                <>
                  <div className="term-line term-yellow">⚠ docs/api/rate-limiting.mdx not updated</div>
                  <div className="term-line term-yellow">⚠ 1 public route missed: src/routes/public/webhooks.ts</div>
                  <div className="term-line term-green">✓ 202 passing · 0 failing</div>
                </>
              )}
            </>
          )}
          {!done && (
            <div className="term-line term-dim term-caret">{variant === 'smart' ? 'querying cartographer.index…' : 'searching…'}</div>
          )}
        </div>
      </div>
    </div>
  );
};

const ToolLine = ({ step, variant }) => {
  const isCarto = step.tool.startsWith('cartographer.');
  return (
    <div className="tool-line">
      <span className={`tl-tool ${isCarto ? 'tl-carto' : ''}`}>{step.tool}</span>
      <span className="tl-label">{step.label}</span>
      <span className="tl-info">{step.info}</span>
    </div>
  );
};

const ABDemo = () => {
  const [playing, setPlaying] = React.useState(false);
  const [t, resetT] = useTicker(playing, SPEED);

  // both sides run on the same "real-world" wall-clock scale; vanilla takes 6.3x as long
  // we scale the real time to a compressed demo time of ~24s for the slow side
  const DEMO_DURATION_S = 24;
  const SMART_DURATION_S = DEMO_DURATION_S * (TOTAL_SMART_TIME_S / TOTAL_VANILLA_TIME_S);

  const vanillaProgress = Math.min(1, t / DEMO_DURATION_S);
  const smartProgress   = Math.min(1, t / SMART_DURATION_S);

  // auto-stop when both finish
  React.useEffect(() => {
    if (vanillaProgress >= 1 && smartProgress >= 1) setPlaying(false);
  }, [vanillaProgress, smartProgress]);

  const restart = () => { resetT(); setPlaying(true); };

  return (
    <section id="demo" className="section section-dark" style={{paddingTop: 96}}>
      <div className="container-wide">
        <div className="section-head" style={{maxWidth: 860}}>
          <span className="eyebrow">The Proof</span>
          <h2>Same model. Same repo. Same task.<br/><em style={{color:'#E59866', fontFamily:'var(--font-serif)'}}>One already knows the codebase.</em></h2>
          <p>Cartographer doesn't change the model. It changes what the model walks in knowing — and it shows, from the first tool call.</p>
        </div>

        <div className="demo-task">
          <div className="demo-task-label">Prompt given to both sessions</div>
          <div className="demo-task-body">
            <span className="demo-task-quote">"{TASK.prompt}"</span>
            <span className="demo-task-meta">{TASK.repo} · {TASK.repoMeta}</span>
          </div>
          <div className="demo-task-controls">
            {!playing && t === 0 && (
              <button className="demo-btn demo-btn-primary" onClick={() => setPlaying(true)}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2 1l9 5-9 5V1z"/></svg>
                Start the race
              </button>
            )}
            {playing && (
              <button className="demo-btn" onClick={() => setPlaying(false)}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><rect x="2" y="1" width="3" height="10"/><rect x="7" y="1" width="3" height="10"/></svg>
                Pause
              </button>
            )}
            {!playing && t > 0 && (
              <>
                <button className="demo-btn demo-btn-primary" onClick={() => setPlaying(true)}>Resume</button>
                <button className="demo-btn" onClick={restart}>↺ Restart</button>
              </>
            )}
            <div className="demo-task-time">
              <span className="demo-task-time-k">Demo time</span>
              <span className="demo-task-time-v">{t.toFixed(1)}s</span>
            </div>
          </div>
        </div>

        <div className="demo-grid">
          <Runner
            variant="vanilla"
            title="Claude Code — vanilla"
            subtitle="No repo context. Starts from a grep."
            steps={VANILLA_STEPS}
            progressRatio={vanillaProgress}
          />
          <Runner
            variant="smart"
            title="Claude Code + Cartographer"
            subtitle="Queries the map + MCP index before touching a file."
            steps={SMART_STEPS}
            progressRatio={smartProgress}
          />
        </div>

        <div className="demo-scoreboard">
          <ScoreCard
            label="Wall-clock"
            vanilla={fmtTime(TOTAL_VANILLA_TIME_S)}
            smart={fmtTime(TOTAL_SMART_TIME_S)}
            delta="5.6× faster"
          />
          <ScoreCard
            label="Tool calls"
            vanilla={VANILLA_STEPS.length}
            smart={SMART_STEPS.length}
            delta="3× fewer"
          />
          <ScoreCard
            label="Files read"
            vanilla={VANILLA_STEPS.filter(s=>s.tool==='Read').length}
            smart={0}
            delta="no speculative reads"
          />
          <ScoreCard
            label="Coverage"
            vanilla="1 route missed · docs stale"
            smart="complete · docs + tests"
            delta="correct on first try"
          />
        </div>
      </div>
    </section>
  );
};

const ScoreCard = ({ label, vanilla, smart, delta }) => (
  <div className="score-card">
    <div className="score-label">{label}</div>
    <div className="score-row">
      <div className="score-v score-vanilla">
        <span className="score-dot"/><span>{vanilla}</span>
      </div>
      <div className="score-v score-smart">
        <span className="score-dot score-dot-smart"/><span>{smart}</span>
      </div>
    </div>
    <div className="score-delta">{delta}</div>
  </div>
);

window.ABDemo = ABDemo;
