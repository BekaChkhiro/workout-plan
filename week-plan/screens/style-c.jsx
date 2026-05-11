// Style C — Soft Pastel Feminine
// Lilac→pink gradient bg, deep purple text, mint+yellow accents.
// DM Sans, big emoji, pill buttons, super-rounded 28px cards.

function StyleCScreen() {
  return (
    <div className="style-c" style={{ minHeight: '100%', paddingTop: 54, position: 'relative' }}>
      {/* decorative blobs */}
      <div style={{
        position: 'absolute', top: 0, right: -60, width: 220, height: 220,
        borderRadius: 999, background: 'radial-gradient(circle, rgba(255,214,107,0.35) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', top: 380, left: -80, width: 240, height: 240,
        borderRadius: 999, background: 'radial-gradient(circle, rgba(125,223,168,0.32) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ padding: '14px 22px 14px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 500 }}>
            {TODAY.dateLine}
          </div>
          <div style={{
            fontSize: 10.5, fontWeight: 700, color: '#5A3A8B',
            padding: '5px 12px', borderRadius: 999,
            background: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(201,168,232,0.4)',
            backdropFilter: 'blur(6px)',
          }}>✨ {TODAY.weekBadge}</div>
        </div>

        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
          {TODAY.greeting} <span>{TODAY.greetingEmoji}</span>
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginTop: 6, fontWeight: 500 }}>
          {TODAY.subtitle} 🌸
        </div>
      </div>

      {/* Snapshot card */}
      <div style={{
        margin: '8px 18px 0', padding: '22px 22px 18px',
        background: 'var(--surface)', borderRadius: 28,
        boxShadow: 'var(--shadow-pink)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <CalRing
            size={114} stroke={13}
            pct={TODAY.kcal.eaten / TODAY.kcal.goal}
            track="#F4ECFA"
            gradientId="ringGradC"
            gradFrom="#FF9EC5" gradTo="#C9A8E8"
          >
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', lineHeight: 1 }}>820</div>
            <div style={{ fontSize: 10, color: 'var(--ink-soft)', marginTop: 3, fontWeight: 600 }}>
              / 1250 კკალ
            </div>
          </CalRing>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {TODAY.macros.map((m, i) => {
              const c = ['#7DDFA8', '#FFD66B', '#FF9EC5'][i];
              const bg = ['#E7F8EE', '#FFF5DA', '#FFE6F0'][i];
              const pct = Math.min(1, m.value / m.goal);
              return (
                <div key={m.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 11, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700 }}>{m.short}</span>
                    <span style={{ fontWeight: 600, color: 'var(--ink-soft)' }}>{m.value}/{m.goal}{m.unit}</span>
                  </div>
                  <div style={{ height: 7, borderRadius: 99, background: bg }}>
                    <div style={{ width: `${pct * 100}%`, height: '100%', borderRadius: 99, background: c }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{
          marginTop: 18, paddingTop: 16,
          borderTop: '1px solid #F4ECFA',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 600, marginBottom: 2 }}>💧 წყალი</div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>
              1.25 <span style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 500 }}>/ 2 ლ</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: TODAY.water.total }).map((_, i) => {
              const filled = i < TODAY.water.filled;
              return (
                <div key={i} style={{
                  width: 16, height: 22, borderRadius: '8px 8px 5px 5px',
                  background: filled ? 'linear-gradient(180deg, #BCE3FF 0%, #7CC7FF 100%)' : '#F4ECFA',
                  border: filled ? '1px solid rgba(124,199,255,0.5)' : '1px solid #EADCF5',
                }} />
              );
            })}
          </div>
        </div>
      </div>

      {/* Meals */}
      <div style={{
        padding: '24px 22px 10px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>🍽 დღევანდელი კვება</div>
        <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 600 }}>3 / 5</div>
      </div>
      <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
        {TODAY.meals.map((m, idx) => {
          const isDone = m.state === 'done';
          const isActive = m.state === 'active';
          const emojis = ['🍳', '🫐', '🍗', '🥜', '🥗'];
          return (
            <div key={m.time} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '13px 14px', borderRadius: 22,
              background: isActive ? 'linear-gradient(120deg, #FFF5DA 0%, #FFE6F0 100%)' : 'var(--surface)',
              boxShadow: isActive ? '0 6px 20px rgba(255,158,197,0.28)' : '0 2px 8px rgba(201,168,232,0.10)',
              border: isActive ? '2px solid #FFD66B' : '1px solid rgba(244,236,250,0.8)',
              opacity: m.state === 'upcoming' ? 0.55 : 1,
              position: 'relative',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isDone ? '#E7F8EE' : isActive ? '#FFFFFF' : '#F4ECFA',
                fontSize: 18,
                flexShrink: 0,
                boxShadow: isActive ? '0 2px 8px rgba(255,214,107,0.4)' : 'none',
                position: 'relative',
              }}>
                <span style={{ opacity: isDone ? 0.7 : 1 }}>{emojis[idx]}</span>
                {isDone && (
                  <div style={{
                    position: 'absolute', bottom: -2, right: -2,
                    width: 16, height: 16, borderRadius: 999, background: '#7DDFA8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid #fff',
                  }}>
                    <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1.5 4l1.7 1.7L6.5 2.3" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 11.5, color: isActive ? '#A47000' : 'var(--ink-soft)', fontWeight: 700 }}>{m.time}</span>
                  <span style={{
                    fontSize: 14, fontWeight: 700,
                    color: isDone ? 'var(--ink-mute)' : 'var(--ink)',
                    textDecoration: isDone ? 'line-through' : 'none',
                  }}>{m.name}</span>
                </div>
                <div style={{
                  fontSize: 11.5, color: 'var(--ink-soft)', fontWeight: 500,
                  marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{m.desc}</div>
              </div>
              <div style={{
                fontSize: 14, fontWeight: 700,
                color: isDone ? 'var(--ink-mute)' : 'var(--ink)',
              }}>{m.kcal}</div>
              {isActive && (
                <div style={{
                  position: 'absolute', top: -9, left: 14,
                  fontSize: 9.5, fontWeight: 800,
                  background: '#FFD66B', color: '#5A3A0A',
                  padding: '3px 9px', borderRadius: 999,
                  letterSpacing: '0.04em',
                  boxShadow: '0 2px 6px rgba(255,214,107,0.5)',
                }}>⏰ ახლა</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Workout */}
      <div style={{
        margin: '22px 18px 0', padding: '22px 22px 18px',
        background: 'linear-gradient(135deg, #E8DFF7 0%, #FFE6F0 100%)',
        borderRadius: 28,
        boxShadow: '0 8px 24px rgba(201,168,232,0.25)',
        position: 'relative', zIndex: 1, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -30, right: -30, fontSize: 110, opacity: 0.18,
          pointerEvents: 'none',
        }}>🧘</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#7B4FA8', marginBottom: 10, letterSpacing: '0.02em' }}>
          💪 დღევანდელი ვარჯიში
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.15, marginBottom: 3 }}>
          პილატესი
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginBottom: 14, fontWeight: 500 }}>
          ბირთვი · ზურგი · დუნდულო
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, padding: '5px 11px', borderRadius: 999, background: 'rgba(255,255,255,0.7)' }}>⏱ 35–45 წთ</span>
          <span style={{ fontSize: 11.5, fontWeight: 600, padding: '5px 11px', borderRadius: 999, background: 'rgba(255,255,255,0.7)' }}>🔥 საშუალო</span>
          <span style={{ fontSize: 11.5, fontWeight: 600, padding: '5px 11px', borderRadius: 999, background: 'rgba(255,255,255,0.7)' }}>🕡 18:30</span>
        </div>
        <button style={{
          width: '100%', padding: '15px 16px', borderRadius: 999,
          background: 'linear-gradient(135deg, #C9A8E8 0%, #FF9EC5 100%)',
          color: '#fff', border: 'none',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 14.5, fontWeight: 700, letterSpacing: '0.02em',
          boxShadow: '0 6px 18px rgba(201,168,232,0.5)',
        }}>{TODAY.workout.cta} ✨</button>
      </div>

      <div style={{ height: 110 }} />

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
        padding: '10px 12px 28px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-around',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: 28,
          border: '1px solid rgba(255,255,255,0.8)',
          boxShadow: '0 6px 24px rgba(201,168,232,0.25)',
          padding: '10px 4px',
        }}>
          {TODAY.tabs.map(t => (
            <div key={t.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: 1 }}>
              <div style={{
                width: 36, height: 28, borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: t.active ? 'linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)' : 'transparent',
              }}>
                <TabIcon name={t.icon} color={t.active ? '#fff' : '#B7AAD0'} size={18} />
              </div>
              <div style={{
                fontSize: 9.5, fontWeight: t.active ? 700 : 600,
                color: t.active ? 'var(--ink)' : 'var(--ink-mute)',
              }}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const STYLE_C_TOKENS = {
  accent: 'Soft Pastel Feminine',
  theme: 'light',
  palette: [
    { name: 'bg-lilac',  hex: '#F4E5FA' },
    { name: 'bg-pink',   hex: '#FCE4EC' },
    { name: 'surface',   hex: '#FFFFFF' },
    { name: 'purple',    hex: '#3D2C5F' },
    { name: 'lilac',     hex: '#C9A8E8' },
    { name: 'pink',      hex: '#FF9EC5' },
    { name: 'mint',      hex: '#7DDFA8' },
    { name: 'yellow',    hex: '#FFD66B' },
  ],
  type: [
    { name: 'Display',  size: '30', weight: '700', family: 'DM Sans', sample: { fontFamily: 'DM Sans', fontWeight: 700, fontSize: 22 } },
    { name: 'H1',       size: '22', weight: '800', family: 'DM Sans', sample: { fontFamily: 'DM Sans', fontWeight: 800, fontSize: 18 } },
    { name: 'H2',       size: '16', weight: '700', family: 'DM Sans', sample: { fontFamily: 'DM Sans', fontWeight: 700, fontSize: 14 } },
    { name: 'Body',     size: '14', weight: '500', family: 'DM Sans', sample: { fontFamily: 'DM Sans', fontWeight: 500, fontSize: 13 } },
    { name: 'Caption',  size: '11', weight: '600', family: 'DM Sans', sample: { fontFamily: 'DM Sans', fontWeight: 600, fontSize: 11, color: '#7B6A9B' } },
  ],
  radii: [
    { name: 'sm', value: 12 },
    { name: 'md', value: 20 },
    { name: 'lg', value: 28 },
    { name: 'xl', value: 999 },
  ],
  shadows: [
    { name: 'none', value: 'none' },
    { name: 'sm',   value: '0 2px 8px rgba(201,168,232,0.12)' },
    { name: 'md',   value: '0 4px 16px rgba(255,158,197,0.18), 0 1px 4px rgba(201,168,232,0.12)' },
    { name: 'lg',   value: '0 12px 32px rgba(255,158,197,0.28), 0 4px 12px rgba(201,168,232,0.18)' },
  ],
  motion: 'Bouncy: spring (stiffness 260, damping 18) on cards & buttons; 220ms ease-out for fades; confetti burst on meal completion.',
};

Object.assign(window, { StyleCScreen, STYLE_C_TOKENS });
