// Progress screen — Style C (Soft Pastel Feminine)
// Weight tab active. Hero stats, line chart, recent entries, achievement banner.

function ProgressCScreen() {
  // Weight history (Mon → today). Downward trend.
  const weights = [57.0, 56.4, 56.1, 55.8, 55.2, 54.7, 54.3];
  const days = ['ორშ', 'სამშ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვი'];
  // Active day = "today" = index 2 (Wednesday)? Per spec last point = today (54.3) which matches Wed in date logic.
  // But the chart shows 7 days Mon→Sun with today highlighted as the LAST point. We'll follow spec literally.

  // Chart geometry
  const W = 320, H = 152;
  const padL = 12, padR = 12, padT = 12, padB = 22;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const maxW = Math.max(...weights);
  const minW = Math.min(...weights);
  const range = maxW - minW || 1;
  const xs = weights.map((_, i) => padL + (innerW * i) / (weights.length - 1));
  const ys = weights.map(w => padT + innerH * (1 - (w - minW) / range));

  // Smooth path via Catmull-Rom-ish midpoint blend
  let path = `M ${xs[0]} ${ys[0]}`;
  for (let i = 0; i < xs.length - 1; i++) {
    const x0 = xs[i], y0 = ys[i], x1 = xs[i + 1], y1 = ys[i + 1];
    const cx1 = x0 + (x1 - x0) * 0.5;
    const cy1 = y0;
    const cx2 = x0 + (x1 - x0) * 0.5;
    const cy2 = y1;
    path += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x1} ${y1}`;
  }
  const areaPath = `${path} L ${xs[xs.length-1]} ${padT + innerH} L ${xs[0]} ${padT + innerH} Z`;

  const lastIdx = xs.length - 1;

  return (
    <div className="style-c" style={{ minHeight: '100%', paddingTop: 54, position: 'relative' }}>
      {/* decorative blobs */}
      <div style={{
        position: 'absolute', top: 60, left: -90, width: 220, height: 220,
        borderRadius: 999, background: 'radial-gradient(circle, rgba(255,214,107,0.30) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', top: 460, right: -100, width: 240, height: 240,
        borderRadius: 999, background: 'radial-gradient(circle, rgba(125,223,168,0.28) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', top: 950, left: -80, width: 220, height: 220,
        borderRadius: 999, background: 'radial-gradient(circle, rgba(201,168,232,0.32) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Title row */}
      <div style={{
        padding: '8px 22px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.01em' }}>
          პროგრესი <span style={{ fontSize: 22 }}>📊</span>
        </div>
        <button style={{
          width: 36, height: 36, borderRadius: 999,
          background: 'rgba(255,255,255,0.65)',
          border: '1.5px solid #C9A8E8',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0,
        }}>
          <svg width="17" height="17" viewBox="0 0 17 17">
            <rect x="2.5" y="3.5" width="12" height="11" rx="2" fill="none" stroke="#5A3A8B" strokeWidth="1.4"/>
            <path d="M2.5 6.5h12M6 2v3M11 2v3" fill="none" stroke="#5A3A8B" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* 4-tab segmented control */}
      <div style={{ padding: '0 18px', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex', gap: 4, padding: 5,
          background: 'rgba(255,255,255,0.55)',
          border: '1px solid rgba(255,255,255,0.7)',
          borderRadius: 999,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 10px rgba(201,168,232,0.15)',
        }}>
          {[
            { key: 'weight',  label: '⚖️ წონა',   active: true },
            { key: 'measure', label: '📏 ზომები' },
            { key: 'photo',   label: '📸 ფოტო' },
            { key: 'stats',   label: '✨ სტატ.' },
          ].map(t => (
            <div key={t.key} style={{
              flex: 1, textAlign: 'center', padding: '8px 4px',
              borderRadius: 999,
              background: t.active ? 'linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)' : 'transparent',
              color: t.active ? '#fff' : '#7B6A9B',
              fontSize: 12.5, fontWeight: t.active ? 800 : 600,
              boxShadow: t.active ? '0 3px 10px rgba(255,158,197,0.4)' : 'none',
              textShadow: t.active ? '0 1px 1px rgba(90,58,10,0.18)' : 'none',
              whiteSpace: 'nowrap',
            }}>{t.label}{t.active && <span style={{ marginLeft: 3 }}>✨</span>}</div>
          ))}
        </div>
      </div>

      {/* Hero stats card */}
      <div style={{
        margin: '14px 18px 0', padding: '20px 22px',
        background: '#FFFFFF', borderRadius: 28,
        boxShadow: '0 4px 16px rgba(255,158,197,0.18), 0 1px 4px rgba(201,168,232,0.12)',
        position: 'relative', zIndex: 1,
        display: 'flex', gap: 18,
      }}>
        {/* Left half — 60% */}
        <div style={{ flex: '0 0 56%', paddingRight: 14, borderRight: '1px solid #F4ECFA' }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: '#7B4FA8',
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6,
          }}>მიმდინარე წონა</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 10 }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: '#3D2C5F', lineHeight: 1, letterSpacing: '-0.02em' }}>54.3</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#7B6A9B' }}>კგ</span>
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 11, fontWeight: 700, color: '#2E8B57',
            background: '#E7F8EE', borderRadius: 999, padding: '4px 10px',
          }}>✨ −2.7 კგ 12 დღეში</span>
        </div>
        {/* Right half — 40% */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: '#7B4FA8',
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6,
          }}>სამიზნე</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#7B6A9B', lineHeight: 1, marginBottom: 12 }}>
            52 <span style={{ fontSize: 12, fontWeight: 700, color: '#B7AAD0' }}>კგ</span>
          </div>
          <div style={{ position: 'relative', height: 6, borderRadius: 99, background: '#F4ECFA', marginBottom: 8 }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '54%',
              borderRadius: 99,
              background: 'linear-gradient(90deg, #7DDFA8 0%, #FFD66B 100%)',
            }} />
            <div style={{
              position: 'absolute', left: 'calc(54% - 4px)', top: -3,
              width: 12, height: 12, borderRadius: 999,
              background: '#FFD66B', border: '2px solid #fff',
              boxShadow: '0 1px 4px rgba(255,158,197,0.4)',
            }} />
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#7B6A9B' }}>კიდევ 2.3 კგ</div>
        </div>
      </div>

      {/* Weight chart card */}
      <div style={{
        margin: '16px 18px 0', padding: '20px 18px 14px',
        background: '#FFFFFF', borderRadius: 28,
        boxShadow: '0 4px 16px rgba(255,158,197,0.18), 0 1px 4px rgba(201,168,232,0.12)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 16, fontWeight: 700, padding: '0 4px' }}>📈 დინამიკა</div>
          <div style={{
            display: 'flex', gap: 2, padding: 3,
            background: '#F8F2FB', borderRadius: 999,
          }}>
            {[
              { k: 'w', label: 'კვირა', active: true },
              { k: 'm', label: 'თვე' },
              { k: 'a', label: 'ყველა' },
            ].map(t => (
              <div key={t.k} style={{
                padding: '4px 10px', borderRadius: 999,
                fontSize: 10.5, fontWeight: 700,
                background: t.active ? '#FFFFFF' : 'transparent',
                color: t.active ? '#5A3A8B' : '#9785B5',
                boxShadow: t.active ? '0 1px 3px rgba(201,168,232,0.25)' : 'none',
              }}>{t.label}</div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div style={{ position: 'relative', paddingTop: 18, paddingBottom: 2 }}>
          {/* Tooltip above last point */}
          {(() => {
            const tx = xs[lastIdx];
            const ty = ys[lastIdx];
            // tooltip width ~ 96 px, position above point
            const tipW = 96, tipH = 30;
            const left = Math.max(0, Math.min(W - tipW, tx - tipW / 2));
            const top = Math.max(0, ty - 38);
            return (
              <div style={{
                position: 'absolute', left, top,
                width: tipW,
                background: '#FFFFFF', borderRadius: 10,
                border: '1px solid #F4ECFA',
                boxShadow: '0 3px 10px rgba(201,168,232,0.22)',
                padding: '6px 8px',
                fontSize: 11, fontWeight: 700, color: '#3D2C5F',
                textAlign: 'center',
                zIndex: 2,
              }}>
                54.3 კგ · ოთხშ
                <div style={{
                  position: 'absolute', left: '50%', bottom: -5, transform: 'translateX(-50%) rotate(45deg)',
                  width: 8, height: 8, background: '#FFFFFF',
                  borderRight: '1px solid #F4ECFA', borderBottom: '1px solid #F4ECFA',
                }} />
              </div>
            );
          })()}

          <svg width={W} height={H} style={{ display: 'block', maxWidth: '100%' }}>
            <defs>
              <linearGradient id="progLineC" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF9EC5"/>
                <stop offset="100%" stopColor="#C9A8E8"/>
              </linearGradient>
              <linearGradient id="progAreaC" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,158,197,0.22)"/>
                <stop offset="100%" stopColor="rgba(201,168,232,0)"/>
              </linearGradient>
            </defs>

            {/* dashed guide lines */}
            {[0.25, 0.5, 0.75].map(p => (
              <line key={p}
                x1={padL} x2={W - padR}
                y1={padT + innerH * p} y2={padT + innerH * p}
                stroke="#F4ECFA" strokeWidth="1" strokeDasharray="3 4"
              />
            ))}

            {/* area */}
            <path d={areaPath} fill="url(#progAreaC)" />
            {/* line */}
            <path d={path} fill="none" stroke="url(#progLineC)" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" />

            {/* points */}
            {xs.map((x, i) => i === lastIdx ? (
              <g key={i}>
                <circle cx={x} cy={ys[i]} r="8" fill="#C9A8E8" stroke="#fff" strokeWidth="2.5"/>
                <circle cx={x} cy={ys[i]} r="3" fill="#fff"/>
              </g>
            ) : (
              <circle key={i} cx={x} cy={ys[i]} r="5" fill="#fff" stroke="#FF9EC5" strokeWidth="2"/>
            ))}

            {/* x-axis labels */}
            {days.map((d, i) => (
              <text key={d} x={xs[i]} y={H - 4}
                textAnchor="middle"
                fontSize="10" fontWeight="600" fill="#B7AAD0"
                fontFamily="DM Sans, sans-serif">{d}</text>
            ))}
          </svg>
        </div>
      </div>

      {/* Quick-log CTA */}
      <div style={{ padding: '14px 18px 0', position: 'relative', zIndex: 1 }}>
        <button style={{
          width: '100%', padding: '14px 16px', borderRadius: 999,
          background: 'linear-gradient(135deg, #C9A8E8 0%, #FF9EC5 100%)',
          color: '#fff', border: 'none',
          fontFamily: 'DM Sans, "Noto Sans Georgian", sans-serif',
          fontSize: 14.5, fontWeight: 800, letterSpacing: '0.01em',
          boxShadow: '0 10px 24px rgba(255,158,197,0.4), 0 2px 6px rgba(201,168,232,0.25)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>⚖️ + წონის ჩაწერა</button>
      </div>

      {/* Recent entries */}
      <div style={{
        padding: '24px 22px 12px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>📒 ბოლო ჩანაწერები</div>
        <div style={{ fontSize: 11.5, color: '#7B6A9B', fontWeight: 600 }}>12 ჩანაწერი</div>
      </div>
      <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', zIndex: 1 }}>
        {[
          { d: '12', m: 'მაი', dayKa: 'ოთხშაბათი', kg: '54.3', delta: '0.4', tint: '#FFE6F0', tintColor: '#C04A7E' },
          { d: '11', m: 'მაი', dayKa: 'სამშაბათი', kg: '54.7', delta: '0.5', tint: '#F0E5F9', tintColor: '#7B4FA8' },
          { d: '10', m: 'მაი', dayKa: 'ორშაბათი',  kg: '55.2', delta: '0.6', tint: '#FFF5DA', tintColor: '#A47000' },
        ].map(r => (
          <div key={r.d} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 16px', borderRadius: 20,
            background: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(201,168,232,0.10)',
            border: '1px solid rgba(244,236,250,0.8)',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: r.tint, color: r.tintColor,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1 }}>{r.d}</div>
              <div style={{ fontSize: 8.5, fontWeight: 700, opacity: 0.8, marginTop: 2, letterSpacing: '0.04em' }}>{r.m}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#3D2C5F', lineHeight: 1.1 }}>{r.kg} <span style={{ fontSize: 11, fontWeight: 600, color: '#7B6A9B' }}>კგ</span></div>
              <div style={{ fontSize: 11.5, color: '#7B6A9B', fontWeight: 500, marginTop: 3 }}>{r.dayKa}</div>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 700, color: '#2E8B57',
              background: '#E7F8EE', borderRadius: 999, padding: '5px 11px',
              whiteSpace: 'nowrap',
            }}>↓ {r.delta} კგ</span>
          </div>
        ))}
      </div>

      {/* Achievement banner */}
      <div style={{
        margin: '18px 18px 0', padding: '16px 18px',
        background: 'linear-gradient(135deg, #E8DFF7 0%, #FFE6F0 100%)',
        borderRadius: 20,
        boxShadow: '0 4px 16px rgba(255,158,197,0.18)',
        position: 'relative', zIndex: 1, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: 4, top: 4, fontSize: 50, opacity: 0.6, lineHeight: 1, pointerEvents: 'none',
        }}>✨</div>
        <div style={{
          fontSize: 10.5, fontWeight: 700, color: '#7B4FA8',
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4,
        }}>შენ ხარ ცეცხლი!</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#3D2C5F', lineHeight: 1.35, paddingRight: 50 }}>
          −2.7 კგ მიღწეული — ნახევარი გზა გაიარე 🎉
        </div>
      </div>

      {/* Tab previews ghost row */}
      <div style={{
        marginTop: 20, marginBottom: 4,
        paddingLeft: 18, paddingRight: 18,
        display: 'flex', gap: 8, overflowX: 'auto',
        scrollbarWidth: 'none',
        position: 'relative', zIndex: 1,
      }}>
        {[
          { t: '📏 ზომები',  s: 'ბოლო გაზომვა 7 დღის წინ' },
          { t: '📸 ფოტო',     s: '4 ფოტო' },
          { t: '✨ სტატ.',    s: 'adherence 82%' },
        ].map(p => (
          <div key={p.t} style={{
            flexShrink: 0,
            padding: '10px 14px', borderRadius: 16,
            background: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(244,236,250,0.8)',
            boxShadow: '0 1px 4px rgba(201,168,232,0.12)',
            fontSize: 11, fontWeight: 600, color: '#5A4275',
            lineHeight: 1.35,
            minWidth: 150,
          }}>
            <div style={{ fontWeight: 800, color: '#3D2C5F', marginBottom: 2 }}>{p.t}</div>
            <div style={{ color: '#7B6A9B' }}>{p.s}</div>
          </div>
        ))}
      </div>

      <div style={{ height: 120 }} />

      {/* Bottom nav — პროგრესი active */}
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
          {TODAY.tabs.map(t => {
            const active = t.key === 'progress';
            return (
              <div key={t.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: 1 }}>
                <div style={{
                  width: 36, height: 28, borderRadius: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: active ? 'linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)' : 'transparent',
                }}>
                  <TabIcon name={t.icon} color={active ? '#fff' : '#B7AAD0'} size={18} />
                </div>
                <div style={{
                  fontSize: 9.5, fontWeight: active ? 700 : 600,
                  color: active ? '#3D2C5F' : '#B7AAD0',
                }}>{t.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ProgressCScreen });
