// Shared data + helpers across all three style explorations.

const TODAY = {
  dateLine: 'ოთხშაბათი, 11 მაისი',
  weekBadge: 'კვირა 2 / 4',
  greeting: 'გამარჯობა, მეი',
  greetingEmoji: '👋',
  subtitle: 'დღეს ვარჯიშის დღეა',

  kcal: { eaten: 820, goal: 1250 },
  macros: [
    { key: 'P', label: 'ცილა', short: 'P', value: 64, goal: 100, unit: 'გ' },
    { key: 'F', label: 'ნახშირწყლები', short: 'ნ', value: 78, goal: 120, unit: 'გ' },
    { key: 'C', label: 'ცხიმი', short: 'ც', value: 26, goal: 40, unit: 'გ' },
  ],
  water: { filled: 5, total: 8, liters: 1.25, goalLiters: 2 },

  meals: [
    { time: '10:00', name: 'საუზმე',       desc: 'კვერცხის ომლეტი + ბოსტნეული',     kcal: 280, state: 'done' },
    { time: '12:30', name: 'შუაქვე',       desc: 'კოტეჯი + კენკრა',                    kcal: 170, state: 'done' },
    { time: '15:00', name: 'სადილი',       desc: 'ქათამი + ბრინჯი + ბოსტნეული',       kcal: 330, state: 'done' },
    { time: '17:30', name: 'ვარჯიშამდე',   desc: 'იოგურტი + კაკალი',                   kcal: 175, state: 'active' },
    { time: '20:00', name: 'ვახშამი',      desc: 'კვერცხი + სალათი',                   kcal: 240, state: 'upcoming' },
  ],

  workout: {
    title: 'დღევანდელი ვარჯიში',
    type: 'პილატესი — ბირთვი, ზურგი, დუნდულო',
    duration: '35–45 წთ',
    intensity: 'საშუალო',
    window: '18:30 – 19:30',
    cta: 'დასრულდა',
  },

  tabs: [
    { key: 'today',    label: 'დღეს',     icon: 'today',    active: true  },
    { key: 'plan',     label: 'გეგმა',    icon: 'plan',     active: false },
    { key: 'food',     label: 'კვება',    icon: 'food',     active: false },
    { key: 'progress', label: 'პროგრესი', icon: 'progress', active: false },
    { key: 'profile',  label: 'პროფილი',  icon: 'profile',  active: false },
  ],
};

// Calorie ring — pure SVG, configurable colors/stroke.
function CalRing({ size, stroke, pct, track, fill, gradientId, gradFrom, gradTo, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct);
  const strokeColor = gradientId ? `url(#${gradientId})` : fill;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {gradientId && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradFrom} />
              <stop offset="100%" stopColor={gradTo} />
            </linearGradient>
          </defs>
        )}
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={strokeColor} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {children}
      </div>
    </div>
  );
}

// Tiny line icons used by all bottom navs (stroke-based so style can theme them).
function TabIcon({ name, color, size = 22, strokeWidth = 1.7 }) {
  const sw = strokeWidth;
  const s = { fill: 'none', stroke: color, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'today') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <rect x="3.5" y="5" width="17" height="15" rx="2.5" {...s} />
        <path d="M3.5 9.5h17M8 3v4M16 3v4" {...s} />
        <circle cx="12" cy="14" r="1.2" fill={color} stroke="none" />
      </svg>
    );
  }
  if (name === 'plan') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path d="M5 4h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" {...s} />
        <path d="M8 11h8M8 15h6M8 7h5" {...s} />
      </svg>
    );
  }
  if (name === 'food') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path d="M6 4v8a3 3 0 0 0 3 3v6M9 4v6M12 4v6M18 4c-1.5 1-2.5 3-2.5 6S16.5 14 18 14v7" {...s} />
      </svg>
    );
  }
  if (name === 'progress') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path d="M4 20V8M10 20v-9M16 20V4M22 20H2" {...s} />
      </svg>
    );
  }
  if (name === 'profile') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="8.5" r="3.8" {...s} />
        <path d="M4.5 20c1.2-3.8 4.2-5.8 7.5-5.8s6.3 2 7.5 5.8" {...s} />
      </svg>
    );
  }
  return null;
}

// Token sheet — renders below each phone mockup inside its artboard.
function TokenSheet({ palette, type, radii, shadows, motion, accent, theme }) {
  const wrap = {
    boxSizing: 'border-box', width: '100%', padding: '24px 22px 26px',
    background: theme === 'dark' ? '#0F0F11' : '#FFFFFF',
    color: theme === 'dark' ? 'rgba(255,255,255,0.92)' : '#3D2C28',
    borderRadius: 18,
    boxShadow: theme === 'dark'
      ? '0 1px 0 rgba(255,255,255,0.05) inset, 0 12px 40px rgba(0,0,0,0.25)'
      : '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.05)',
    fontFamily: 'Manrope, "Noto Sans Georgian", system-ui, sans-serif',
    fontSize: 11,
  };
  const sectionLabel = {
    fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
    textTransform: 'uppercase', opacity: 0.55, marginBottom: 8,
  };
  const sub = theme === 'dark' ? 'rgba(255,255,255,0.55)' : '#8B6F5C';

  return (
    <div style={wrap}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 18, paddingBottom: 14,
        borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'}`,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.01em' }}>Design tokens</div>
        <div style={{ fontSize: 10, color: sub, letterSpacing: '0.06em' }}>{accent}</div>
      </div>

      {/* Palette */}
      <div style={sectionLabel}>Palette</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 18 }}>
        {palette.map(p => (
          <div key={p.name}>
            <div style={{
              height: 44, borderRadius: 10, background: p.hex,
              border: p.hex.toLowerCase() === '#ffffff' || p.hex.toLowerCase() === '#fff' ? '1px solid rgba(0,0,0,0.06)' : 'none',
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)',
            }} />
            <div style={{ fontSize: 9.5, fontWeight: 600, marginTop: 5 }}>{p.name}</div>
            <div style={{ fontSize: 9, color: sub, fontFamily: 'JetBrains Mono, monospace' }}>{p.hex.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Type */}
      <div style={sectionLabel}>Type scale</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
        {type.map(t => (
          <div key={t.name} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ ...t.sample, color: theme === 'dark' ? '#fff' : '#3D2C28' }}>{t.name}</span>
            <span style={{ fontSize: 9.5, color: sub, fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>
              {t.size}/{t.weight} · {t.family}
            </span>
          </div>
        ))}
      </div>

      {/* Radii + Shadow */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        <div>
          <div style={sectionLabel}>Radii</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            {radii.map(r => (
              <div key={r.name} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  height: 36, borderRadius: r.value,
                  background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : '#F0EAE0',
                  border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'}`,
                }} />
                <div style={{ fontSize: 9, fontWeight: 600, marginTop: 4 }}>{r.name}</div>
                <div style={{ fontSize: 8.5, color: sub }}>{r.value}px</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={sectionLabel}>Shadow</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            {shadows.map(sh => (
              <div key={sh.name} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  height: 36, borderRadius: 8,
                  background: theme === 'dark' ? '#1A1A1F' : '#FFF',
                  border: theme === 'dark' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  boxShadow: sh.value,
                }} />
                <div style={{ fontSize: 9, fontWeight: 600, marginTop: 4 }}>{sh.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Motion */}
      <div style={sectionLabel}>Motion</div>
      <div style={{ fontSize: 11, lineHeight: 1.5, color: sub }}>{motion}</div>
    </div>
  );
}

Object.assign(window, { TODAY, CalRing, TabIcon, TokenSheet });
