// Style B — Premium Dark (Apple Fitness vibe)
// Near-black, neon-green progress, hot-pink alerts. Big bold numerics.

function StyleBScreen() {
  return (
    <div className="style-b" style={{ minHeight: '100%', paddingTop: 54 }}>
      <div style={{ padding: '14px 22px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div className="caps" style={{ fontSize: 10.5, color: 'var(--ink-soft)' }}>
            {TODAY.dateLine}
          </div>
          <div className="caps mono" style={{
            fontSize: 10, color: 'var(--neon)',
            padding: '4px 9px', borderRadius: 6,
            background: 'var(--neon-dim)',
            border: '1px solid rgba(168,255,96,0.25)',
          }}>WK 02 / 04</div>
        </div>

        <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          {TODAY.greeting} <span>{TODAY.greetingEmoji}</span>
        </div>
        <div className="caps" style={{ fontSize: 10.5, color: 'var(--neon)', marginTop: 8 }}>
          • {TODAY.subtitle}
        </div>
      </div>

      {/* Snapshot card */}
      <div style={{
        margin: '8px 16px 0', padding: '22px 20px 20px',
        background: 'var(--card)', borderRadius: 20,
        border: '1px solid var(--hair)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 12px 32px rgba(0,0,0,0.4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <CalRing
            size={120} stroke={12}
            pct={TODAY.kcal.eaten / TODAY.kcal.goal}
            track="rgba(255,255,255,0.07)"
            gradientId="ringGradB"
            gradFrom="#A8FF60" gradTo="#5EE8C7"
          >
            <div className="mono" style={{ fontSize: 30, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
              820
            </div>
            <div className="caps mono" style={{ fontSize: 9, color: 'var(--ink-soft)', marginTop: 4 }}>
              / 1250 KCAL
            </div>
          </CalRing>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 11 }}>
            {TODAY.macros.map((m, i) => {
              const c = ['#A8FF60', '#7CC7FF', '#FFB347'][i];
              const pct = Math.min(1, m.value / m.goal);
              return (
                <div key={m.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <span className="caps" style={{ fontSize: 9.5, color: 'var(--ink-soft)' }}>{m.short}</span>
                    <span className="mono" style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>
                      {m.value}<span style={{ color: 'var(--ink-mute)' }}>/{m.goal}{m.unit}</span>
                    </span>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)' }}>
                    <div style={{ width: `${pct * 100}%`, height: '100%', borderRadius: 2, background: c, boxShadow: `0 0 10px ${c}66` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{
          marginTop: 18, paddingTop: 16,
          borderTop: '1px solid var(--hair)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div className="caps" style={{ fontSize: 9.5, color: 'var(--ink-soft)', marginBottom: 4 }}>HYDRATION</div>
            <div className="mono" style={{ fontSize: 18, fontWeight: 600 }}>
              1.25<span style={{ color: 'var(--ink-mute)', fontWeight: 400, fontSize: 12 }}> / 2.00 L</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: TODAY.water.total }).map((_, i) => {
              const filled = i < TODAY.water.filled;
              return (
                <div key={i} style={{
                  width: 8, height: 22, borderRadius: 2,
                  background: filled ? '#7CC7FF' : 'rgba(255,255,255,0.07)',
                  boxShadow: filled ? '0 0 8px rgba(124,199,255,0.5)' : 'none',
                }} />
              );
            })}
          </div>
        </div>
      </div>

      {/* Meals */}
      <div style={{ padding: '24px 22px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="caps" style={{ fontSize: 11, fontWeight: 600 }}>MEALS</div>
        <div className="mono caps" style={{ fontSize: 10, color: 'var(--ink-soft)' }}>3 / 5</div>
      </div>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {TODAY.meals.map(m => {
          const isDone = m.state === 'done';
          const isActive = m.state === 'active';
          return (
            <div key={m.time} style={{
              position: 'relative',
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '13px 14px', borderRadius: 14,
              background: isActive ? 'linear-gradient(135deg, rgba(168,255,96,0.10) 0%, rgba(168,255,96,0.02) 100%)' : 'var(--card)',
              border: isActive ? '1px solid rgba(168,255,96,0.45)' : '1px solid var(--hair)',
              boxShadow: isActive ? 'inset 0 0 0 1px rgba(168,255,96,0.08), 0 0 24px rgba(168,255,96,0.08)' : 'none',
              opacity: m.state === 'upcoming' ? 0.5 : 1,
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isDone ? 'rgba(255,255,255,0.10)' : isActive ? '#A8FF60' : 'transparent',
                border: isDone ? '1px solid var(--hair)' : isActive ? 'none' : '1.5px solid rgba(255,255,255,0.15)',
                flexShrink: 0,
              }}>
                {isDone && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2.5 6l2.5 2.5 4.5-5" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                {isActive && <div style={{ width: 8, height: 8, borderRadius: 99, background: '#0A0A0B' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span className="mono caps" style={{ fontSize: 10.5, color: isActive ? 'var(--neon)' : 'var(--ink-soft)' }}>{m.time}</span>
                  <span style={{
                    fontSize: 13.5, fontWeight: 600,
                    color: isDone ? 'var(--ink-mute)' : '#fff',
                    textDecoration: isDone ? 'line-through' : 'none',
                  }}>{m.name}</span>
                </div>
                <div style={{
                  fontSize: 11.5, color: isDone ? 'var(--ink-mute)' : 'var(--ink-soft)',
                  marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{m.desc}</div>
              </div>
              <div className="mono" style={{ fontSize: 15, fontWeight: 600, color: isActive ? 'var(--neon)' : isDone ? 'var(--ink-mute)' : '#fff' }}>
                {m.kcal}
              </div>
              {isActive && (
                <div style={{
                  position: 'absolute', top: -7, right: 14,
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 8.5, fontWeight: 600,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  background: 'var(--neon)', color: '#0A0A0B',
                  padding: '2px 7px', borderRadius: 4,
                }}>NEXT UP</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Workout */}
      <div style={{
        margin: '20px 16px 0', padding: '20px 20px 18px',
        background: 'linear-gradient(155deg, #18221A 0%, #16161A 60%)',
        borderRadius: 20,
        border: '1px solid rgba(168,255,96,0.18)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 160, height: 160,
          borderRadius: 999, background: 'radial-gradient(circle, rgba(168,255,96,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="caps" style={{ fontSize: 10, color: 'var(--neon)', fontWeight: 600, marginBottom: 10 }}>
          ◆ TODAY'S WORKOUT
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 3 }}>
          პილატესი
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginBottom: 14 }}>
          ბირთვი · ზურგი · დუნდულო
        </div>
        <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
          <div>
            <div className="caps" style={{ fontSize: 9, color: 'var(--ink-mute)', marginBottom: 2 }}>DURATION</div>
            <div className="mono" style={{ fontSize: 14, fontWeight: 600 }}>35–45<span style={{ color: 'var(--ink-mute)', fontSize: 11 }}> წთ</span></div>
          </div>
          <div>
            <div className="caps" style={{ fontSize: 9, color: 'var(--ink-mute)', marginBottom: 2 }}>INTENSITY</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>საშუალო</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <div className="caps" style={{ fontSize: 9, color: 'var(--ink-mute)', marginBottom: 2 }}>WINDOW</div>
            <div className="mono" style={{ fontSize: 14, fontWeight: 600 }}>18:30</div>
          </div>
        </div>
        <button style={{
          width: '100%', padding: '14px 16px', borderRadius: 12,
          background: 'var(--neon)', color: '#0A0A0B', border: 'none',
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 14, fontWeight: 700, letterSpacing: '0.02em',
          textTransform: 'uppercase',
          boxShadow: '0 4px 18px rgba(168,255,96,0.35)',
        }}>{TODAY.workout.cta} ▸</button>
      </div>

      <div style={{ height: 110 }} />

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
        padding: '10px 12px 28px',
        background: 'linear-gradient(180deg, rgba(10,10,11,0) 0%, rgba(10,10,11,0.85) 35%, #0A0A0B 100%)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-around',
          background: 'rgba(22,22,26,0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.06)',
          padding: '10px 4px',
        }}>
          {TODAY.tabs.map(t => (
            <div key={t.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: 1 }}>
              <TabIcon name={t.icon} color={t.active ? '#A8FF60' : 'rgba(255,255,255,0.42)'} size={20} />
              <div className="caps" style={{
                fontSize: 8.5, fontWeight: t.active ? 700 : 500,
                color: t.active ? '#fff' : 'rgba(255,255,255,0.42)',
              }}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const STYLE_B_TOKENS = {
  accent: 'Premium Dark',
  theme: 'dark',
  palette: [
    { name: 'bg',        hex: '#0A0A0B' },
    { name: 'card',      hex: '#16161A' },
    { name: 'card-2',    hex: '#1E1E24' },
    { name: 'neon',      hex: '#A8FF60' },
    { name: 'pink',      hex: '#FF3D71' },
    { name: 'blue',      hex: '#7CC7FF' },
    { name: 'amber',     hex: '#FFB347' },
    { name: 'hair',      hex: '#23232A' },
  ],
  type: [
    { name: 'Display',  size: '32', weight: '700', family: 'Space Grotesk', sample: { fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', color: '#fff' } },
    { name: 'H1',       size: '22', weight: '700', family: 'Space Grotesk', sample: { fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18, color: '#fff' } },
    { name: 'Numeric',  size: '30', weight: '700', family: 'JetBrains Mono',sample: { fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 18, color: '#fff' } },
    { name: 'Body',     size: '14', weight: '500', family: 'Space Grotesk', sample: { fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: 13, color: '#fff' } },
    { name: 'Caps S',   size: '10', weight: '600', family: 'Space Grotesk', sample: { fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.6)' } },
  ],
  radii: [
    { name: 'sm', value: 8 },
    { name: 'md', value: 12 },
    { name: 'lg', value: 20 },
    { name: 'xl', value: 28 },
  ],
  shadows: [
    { name: 'none', value: 'none' },
    { name: 'sm',   value: '0 1px 2px rgba(0,0,0,0.4)' },
    { name: 'md',   value: '0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)' },
    { name: 'glow', value: '0 0 0 1px rgba(168,255,96,0.3), 0 0 28px rgba(168,255,96,0.25)' },
  ],
  motion: 'Crisp: 200ms ease-out for tap & overlay; 320ms cubic-bezier(.2,.7,.3,1) on cards; haptic-feeling scale 0.96 on press.',
};

Object.assign(window, { StyleBScreen, STYLE_B_TOKENS });
