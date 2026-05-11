// Style A — Warm Minimalist
// Cream + mint + peach. DM Serif Display headlines, Manrope body.
// Generous radii, hand-feel iconography, lots of breathing room.

function StyleAScreen() {
  return (
    <div className="style-a" style={{ minHeight: '100%', paddingTop: 54 }}>
      <div style={{ padding: '14px 22px 16px' }}>
        {/* Date + week */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', letterSpacing: '0.01em' }}>
            {TODAY.dateLine}
          </div>
          <div style={{
            fontSize: 11, fontWeight: 600, color: 'var(--ink)',
            padding: '5px 11px', borderRadius: 999,
            background: '#F1E8DA', letterSpacing: '0.02em',
          }}>{TODAY.weekBadge}</div>
        </div>

        {/* Greeting */}
        <div className="display" style={{ fontSize: 34, lineHeight: 1.05, marginTop: 6 }}>
          {TODAY.greeting} <span style={{ fontFamily: 'system-ui' }}>{TODAY.greetingEmoji}</span>
        </div>
        <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 8 }}>
          {TODAY.subtitle}
        </div>
      </div>

      {/* Snapshot card */}
      <div style={{
        margin: '8px 18px 0', padding: '20px 20px 18px',
        background: 'var(--surface)', borderRadius: 24,
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--cream-stroke)',
      }}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <CalRing
            size={108} stroke={11}
            pct={TODAY.kcal.eaten / TODAY.kcal.goal}
            track="#F1E8DA" fill="#A8D5BA"
          >
            <div className="display" style={{ fontSize: 26, lineHeight: 1, color: 'var(--ink)' }}>
              {TODAY.kcal.eaten}
            </div>
            <div style={{ fontSize: 10, color: 'var(--ink-soft)', marginTop: 4, letterSpacing: '0.03em' }}>
              / {TODAY.kcal.goal} კკალ
            </div>
          </CalRing>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {TODAY.macros.map((m, i) => {
              const c = ['#A8D5BA', '#F5B7A1', '#D9C28E'][i];
              const pct = Math.min(1, m.value / m.goal);
              return (
                <div key={m.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, marginBottom: 4, color: 'var(--ink-soft)' }}>
                    <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{m.short}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{m.value}/{m.goal}{m.unit}</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 99, background: '#F1E8DA' }}>
                    <div style={{ width: `${pct * 100}%`, height: '100%', borderRadius: 99, background: c }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Water row */}
        <div style={{
          marginTop: 18, paddingTop: 14,
          borderTop: '1px dashed #EFE5D6',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginBottom: 4 }}>წყალი</div>
            <div className="display" style={{ fontSize: 16 }}>
              {TODAY.water.liters} <span style={{ fontSize: 11, color: 'var(--ink-soft)', fontFamily: 'Manrope' }}>/ {TODAY.water.goalLiters} ლ</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {Array.from({ length: TODAY.water.total }).map((_, i) => {
              const filled = i < TODAY.water.filled;
              return (
                <svg key={i} width="13" height="17" viewBox="0 0 13 17">
                  <path d="M2 1.5h9l-1 13a1.5 1.5 0 0 1-1.5 1.4h-4A1.5 1.5 0 0 1 3 14.5L2 1.5z"
                    fill={filled ? '#A8D5BA' : 'transparent'}
                    stroke={filled ? '#A8D5BA' : '#D9C9B4'} strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
              );
            })}
          </div>
        </div>
      </div>

      {/* Meals list */}
      <div style={{ padding: '24px 22px 8px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div className="display" style={{ fontSize: 19 }}>კვება</div>
        <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>3 / 5 დასრულდა</div>
      </div>
      <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        {TODAY.meals.map(m => {
          const isDone = m.state === 'done';
          const isActive = m.state === 'active';
          return (
            <div key={m.time} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '13px 14px', borderRadius: 18,
              background: isActive ? '#FBEDE6' : 'var(--surface)',
              border: isActive ? '1.5px solid #F5B7A1' : '1px solid var(--cream-stroke)',
              boxShadow: isActive ? '0 4px 14px rgba(245,183,161,0.22)' : 'var(--shadow-sm)',
              opacity: m.state === 'upcoming' ? 0.55 : 1,
            }}>
              {/* state dot */}
              <div style={{
                width: 26, height: 26, borderRadius: 999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isDone ? '#A8D5BA' : isActive ? '#F5B7A1' : 'transparent',
                border: isDone || isActive ? 'none' : '1.5px solid #D9C9B4',
                flexShrink: 0,
              }}>
                {isDone && (
                  <svg width="13" height="13" viewBox="0 0 13 13"><path d="M3 6.8l2.4 2.4L10 4.2" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
                {isActive && (
                  <div style={{ width: 8, height: 8, borderRadius: 99, background: '#fff' }} />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, color: 'var(--ink-soft)' }}>{m.time}</span>
                  <span style={{
                    fontSize: 13.5, fontWeight: 600,
                    textDecoration: isDone ? 'line-through' : 'none',
                    color: isDone ? 'var(--ink-mute)' : 'var(--ink)',
                  }}>{m.name}</span>
                </div>
                <div style={{
                  fontSize: 11.5, color: isActive ? 'var(--ink)' : 'var(--ink-soft)',
                  marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  textDecoration: isDone ? 'line-through' : 'none',
                }}>{m.desc}</div>
              </div>
              <div style={{
                fontFamily: 'DM Serif Display, serif', fontSize: 16,
                color: isDone ? 'var(--ink-mute)' : 'var(--ink)',
                textDecoration: isDone ? 'line-through' : 'none',
              }}>{m.kcal}</div>
            </div>
          );
        })}
      </div>

      {/* Workout card */}
      <div style={{
        margin: '24px 18px 0', padding: '20px 20px 18px',
        background: 'linear-gradient(160deg, #EAF4EE 0%, #FAF6F0 100%)',
        borderRadius: 24,
        border: '1px solid #DCEADF',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 16 }}>💪</span>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
            {TODAY.workout.title}
          </div>
        </div>
        <div className="display" style={{ fontSize: 22, lineHeight: 1.15, marginBottom: 4 }}>
          🧘 პილატესი
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginBottom: 14 }}>
          ბირთვი · ზურგი · დუნდულო
        </div>
        <div style={{ display: 'flex', gap: 14, fontSize: 11.5, color: 'var(--ink-soft)', marginBottom: 16 }}>
          <span>⏱ {TODAY.workout.duration}</span>
          <span>· {TODAY.workout.intensity}</span>
          <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', color: 'var(--ink)' }}>{TODAY.workout.window}</span>
        </div>
        <button style={{
          width: '100%', padding: '14px 16px', borderRadius: 16,
          background: '#5C4033', color: '#FFF8EE', border: 'none',
          fontFamily: 'Manrope, "Noto Sans Georgian", sans-serif',
          fontSize: 14, fontWeight: 700, letterSpacing: '0.02em',
          boxShadow: '0 2px 0 #3F2A22',
        }}>{TODAY.workout.cta}</button>
      </div>

      <div style={{ height: 110 }} />

      {/* Tab bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
        padding: '12px 14px 28px',
        background: 'linear-gradient(180deg, rgba(250,246,240,0) 0%, rgba(250,246,240,0.95) 30%, var(--bg) 100%)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-around',
          background: '#FFFFFF', borderRadius: 22,
          border: '1px solid var(--cream-stroke)',
          boxShadow: 'var(--shadow-md)',
          padding: '10px 6px',
        }}>
          {TODAY.tabs.map(t => (
            <div key={t.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: 1 }}>
              <TabIcon name={t.icon} color={t.active ? '#5C4033' : '#B8A595'} size={20} />
              <div style={{
                fontSize: 9.5, fontWeight: t.active ? 700 : 500,
                color: t.active ? 'var(--ink)' : 'var(--ink-mute)',
                letterSpacing: '0.01em',
              }}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const STYLE_A_TOKENS = {
  accent: 'Warm Minimalist',
  theme: 'light',
  palette: [
    { name: 'cream',     hex: '#FAF6F0' },
    { name: 'surface',   hex: '#FFFFFF' },
    { name: 'mint',      hex: '#A8D5BA' },
    { name: 'peach',     hex: '#F5B7A1' },
    { name: 'terracotta',hex: '#5C4033' },
    { name: 'ink-soft',  hex: '#8B6F5C' },
    { name: 'stroke',    hex: '#EFE5D6' },
    { name: 'wheat',     hex: '#D9C28E' },
  ],
  type: [
    { name: 'Display',  size: '34',  weight: '400', family: 'DM Serif Display', sample: { fontFamily: 'DM Serif Display, serif', fontSize: 22 } },
    { name: 'H1',       size: '22',  weight: '400', family: 'DM Serif Display', sample: { fontFamily: 'DM Serif Display, serif', fontSize: 18 } },
    { name: 'H2',       size: '16',  weight: '600', family: 'Manrope',          sample: { fontFamily: 'Manrope', fontWeight: 600, fontSize: 14 } },
    { name: 'Body',     size: '14',  weight: '500', family: 'Manrope',          sample: { fontFamily: 'Manrope', fontWeight: 500, fontSize: 13 } },
    { name: 'Caption',  size: '11',  weight: '500', family: 'Manrope',          sample: { fontFamily: 'Manrope', fontWeight: 500, fontSize: 11, opacity: 0.7 } },
  ],
  radii: [
    { name: 'sm', value: 10 },
    { name: 'md', value: 16 },
    { name: 'lg', value: 24 },
    { name: 'xl', value: 32 },
  ],
  shadows: [
    { name: 'none', value: 'none' },
    { name: 'sm',   value: '0 1px 2px rgba(92,64,51,0.06), 0 2px 6px rgba(92,64,51,0.05)' },
    { name: 'md',   value: '0 2px 4px rgba(92,64,51,0.05), 0 8px 24px rgba(92,64,51,0.08)' },
    { name: 'lg',   value: '0 4px 8px rgba(92,64,51,0.06), 0 20px 48px rgba(92,64,51,0.1)' },
  ],
  motion: 'Gentle: 320ms ease-out fades; subtle 1.02 spring on tap (stiffness 220, damping 22).',
};

Object.assign(window, { StyleAScreen, STYLE_A_TOKENS });
