// Plan screen — Style C (Soft Pastel Feminine)
// Week 2 of 4. Sticky-feeling top zone, then 7-day list.

function PlanCScreen() {
  // helper for meta-chips
  const Chip = ({ children, bg = 'rgba(255,255,255,0.7)', color }) => (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 999,
      background: bg, color: color || '#3D2C5F',
      whiteSpace: 'nowrap',
    }}>{children}</span>
  );

  const weeks = [
    { n: 1, label: 'მსუბუქი',  pct: 35,  color: '#7DDFA8', wash: '#E7F8EE' },
    { n: 2, label: 'საშუალო',  pct: 60,  color: '#FFD66B', wash: '#FFF5DA', active: true },
    { n: 3, label: 'ძლიერი',   pct: 80,  color: '#C9A8E8', wash: '#F0E5F9' },
    { n: 4, label: 'მძიმე',    pct: 100, color: '#FF9EC5', wash: '#FFE6F0' },
  ];

  const days = [
    { ka: 'ორშაბათი',  workout: 'პილატესი', emoji: '🧘', sub: 'ბირთვი, ზურგი, დუნდულო',
      chips: ['⏱ 40 წთ', 'საშ. დონე'], state: 'done' },
    { ka: 'სამშაბათი', workout: 'კარდიო',   emoji: '🏃', sub: 'სიარული + ლახტი',
      chips: ['⏱ 35 წთ', 'ტემპი ↑'],   state: 'done' },
    { ka: 'ოთხშაბათი', workout: 'პილატესი', emoji: '🧘', sub: 'მკლავები + გვერდები',
      chips: ['⏱ 45 წთ', 'საშ. დონე'], state: 'active' },
    { ka: 'ხუთშაბათი', workout: 'დასვენება', emoji: '😴', sub: 'სრული დასვენება — სიარული ნებაყოფლ.',
      chips: [], state: 'rest' },
    { ka: 'პარასკევი', workout: 'კომბო დღე', emoji: '🔥', sub: '20 წთ პილატესი + 20 წთ ლახტი',
      chips: ['⏱ 45 წთ', '🔥 ყველაზე ინტენს.'], state: 'peak' },
    { ka: 'შაბათი',    workout: 'კარდიო',    emoji: '🏃', sub: 'სიარული + ლახტი',
      chips: ['⏱ 40 წთ', 'ტემპი ↑'], state: 'pending' },
    { ka: 'კვირა',     workout: 'დასვენება', emoji: '😴', sub: 'სრული დასვენება',
      chips: [], state: 'rest' },
  ];

  return (
    <div className="style-c" style={{ minHeight: '100%', paddingTop: 54, position: 'relative' }}>
      {/* decorative blobs (different positions from Today) */}
      <div style={{
        position: 'absolute', top: 80, right: -100, width: 240, height: 240,
        borderRadius: 999, background: 'radial-gradient(circle, rgba(255,214,107,0.28) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', top: 520, left: -100, width: 260, height: 260,
        borderRadius: 999, background: 'radial-gradient(circle, rgba(125,223,168,0.28) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', top: 1100, right: -60, width: 200, height: 200,
        borderRadius: 999, background: 'radial-gradient(circle, rgba(201,168,232,0.32) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Title row */}
      <div style={{
        padding: '8px 22px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.01em' }}>
          გეგმა <span style={{ fontSize: 22 }}>📅</span>
        </div>
        <button style={{
          fontFamily: 'DM Sans, "Noto Sans Georgian", sans-serif',
          fontSize: 12, fontWeight: 700,
          color: '#5A3A8B',
          background: 'rgba(255,255,255,0.65)',
          border: '1.5px solid #C9A8E8',
          padding: '7px 13px', borderRadius: 999,
          backdropFilter: 'blur(8px)',
        }}>✨ რედაქტირება</button>
      </div>

      {/* Week tabs */}
      <div style={{ padding: '0 18px', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex', gap: 4, padding: 5,
          background: 'rgba(255,255,255,0.55)',
          border: '1px solid rgba(255,255,255,0.7)',
          borderRadius: 999,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 10px rgba(201,168,232,0.15)',
        }}>
          {[1, 2, 3, 4].map(n => {
            const active = n === 2;
            return (
              <div key={n} style={{ flex: 1, position: 'relative' }}>
                <div style={{
                  textAlign: 'center', padding: '8px 4px',
                  borderRadius: 999,
                  background: active ? 'linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)' : 'transparent',
                  color: active ? '#fff' : '#7B6A9B',
                  fontSize: 12.5, fontWeight: active ? 800 : 600,
                  letterSpacing: '0.01em',
                  boxShadow: active ? '0 3px 10px rgba(255,158,197,0.4)' : 'none',
                  textShadow: active ? '0 1px 1px rgba(90,58,10,0.18)' : 'none',
                }}>
                  კვირა {n} {active && <span style={{ marginLeft: 2 }}>✨</span>}
                </div>
                {active && (
                  <div style={{
                    position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
                    width: 5, height: 5, borderRadius: 999, background: '#FFD66B',
                    boxShadow: '0 0 0 3px rgba(255,214,107,0.25)',
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Week-summary card */}
      <div style={{
        margin: '20px 18px 0', padding: '20px 22px 18px',
        background: 'linear-gradient(135deg, #E8DFF7 0%, #FFE6F0 100%)',
        borderRadius: 28,
        boxShadow: '0 4px 16px rgba(255,158,197,0.18), 0 1px 4px rgba(201,168,232,0.12)',
        position: 'relative', zIndex: 1, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -22, right: -18, fontSize: 110, opacity: 0.18,
          pointerEvents: 'none', lineHeight: 1,
        }}>📈</div>

        <div style={{
          fontSize: 10.5, fontWeight: 700, color: '#7B4FA8',
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6,
        }}>ამ კვირის ფოკუსი</div>

        <div style={{ fontSize: 21, fontWeight: 800, lineHeight: 1.15, marginBottom: 12 }}>
          ინტენსიობა იზრდება <span style={{ color: '#3FB475', fontSize: 18 }}>↗</span>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
          <Chip>🧘 პილატესი 40 წთ</Chip>
          <Chip>🏃 კარდიო 25 წთ</Chip>
          <Chip>⚡ საშუალო დონე</Chip>
        </div>

        {/* Intensity progression bars */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 96 }}>
          {weeks.map(w => (
            <div key={w.n} style={{
              flex: 1, height: '100%',
              display: 'flex', flexDirection: 'column',
              borderRadius: 14,
              background: w.active ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.32)',
              border: w.active ? '1.5px solid #FF9EC5' : '1px solid rgba(255,255,255,0.55)',
              padding: 6, justifyContent: 'flex-end',
              position: 'relative',
              boxShadow: w.active ? '0 2px 8px rgba(255,158,197,0.3)' : 'none',
            }}>
              <div style={{
                width: '100%',
                height: `${w.pct}%`,
                borderRadius: 8,
                background: w.active
                  ? `linear-gradient(180deg, ${w.color} 0%, #FFB347 100%)`
                  : w.color,
                opacity: w.active ? 1 : 0.85,
              }} />
              <div style={{
                position: 'absolute', top: 6, left: 0, right: 0,
                textAlign: 'center',
                fontSize: 11, fontWeight: 800,
                color: w.active ? '#5A3A0A' : '#5A4275',
              }}>{w.n}</div>
              <div style={{
                position: 'absolute', bottom: -16, left: 0, right: 0,
                textAlign: 'center',
                fontSize: 9.5, fontWeight: 700,
                color: w.active ? '#5A3A0A' : '#7B6A9B',
                letterSpacing: '0.02em',
              }}>{w.label}</div>
            </div>
          ))}
        </div>
        <div style={{ height: 14 }} />
      </div>

      {/* Section divider */}
      <div style={{
        padding: '24px 22px 10px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>📋 კვირის ცხრილი</div>
        <div style={{ fontSize: 11, color: '#7B6A9B', fontWeight: 600 }}>3 / 5 ვარჯიში დასრულდა</div>
      </div>

      {/* 7-day list */}
      <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
        {days.map((d, idx) => {
          const isDone = d.state === 'done';
          const isActive = d.state === 'active';
          const isRest = d.state === 'rest';
          const isPeak = d.state === 'peak';
          const isPending = d.state === 'pending';

          const bg = isActive
            ? 'linear-gradient(120deg, #FFF5DA 0%, #FFE6F0 100%)'
            : isRest ? '#F4ECFA' : '#FFFFFF';
          const border = isActive
            ? '2px solid #FFD66B'
            : isPeak ? '1px solid rgba(244,236,250,0.8)' : '1px solid rgba(244,236,250,0.8)';
          const shadow = isActive
            ? '0 6px 20px rgba(255,158,197,0.28)'
            : isRest ? 'none' : '0 2px 8px rgba(201,168,232,0.10)';

          const avatarBg = isRest
            ? '#EADCF5'
            : isDone ? '#E7F8EE'
            : isActive ? '#FFFFFF'
            : isPeak ? '#FFE6F0'
            : '#F4ECFA';

          return (
            <div key={d.ka} style={{
              position: 'relative',
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '14px 14px', borderRadius: 20,
              background: bg, border, boxShadow: shadow,
              opacity: isDone ? 0.88 : 1,
              overflow: 'hidden',
            }}>
              {/* Peak intensity flag — left edge strip */}
              {isPeak && (
                <div style={{
                  position: 'absolute', top: 0, bottom: 0, left: 0, width: 4,
                  background: 'linear-gradient(180deg, #FF9EC5 0%, #C9A8E8 100%)',
                }} />
              )}

              {/* avatar */}
              <div style={{
                width: 44, height: 44, borderRadius: 999, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: avatarBg, fontSize: 20,
                boxShadow: isActive ? '0 2px 8px rgba(255,214,107,0.4)' : 'none',
                position: 'relative',
              }}>
                <span style={{ opacity: isDone || isRest ? 0.85 : 1 }}>{d.emoji}</span>
                {isDone && (
                  <div style={{
                    position: 'absolute', bottom: -2, right: -2,
                    width: 18, height: 18, borderRadius: 999, background: '#7DDFA8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid #fff',
                  }}>
                    <svg width="9" height="9" viewBox="0 0 8 8"><path d="M1.5 4l1.7 1.7L6.5 2.3" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                )}
              </div>

              {/* content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 700, letterSpacing: '0.01em',
                    color: isActive ? '#A47000' : isRest ? '#9785B5' : '#7B6A9B',
                  }}>{d.ka}</span>
                </div>
                <div style={{
                  fontSize: 15, fontWeight: 800, lineHeight: 1.2,
                  color: isRest ? '#7B6A9B' : '#3D2C5F',
                }}>{d.workout}</div>
                <div style={{
                  fontSize: 11.5, color: '#7B6A9B', fontWeight: 500,
                  marginTop: 3, lineHeight: 1.3,
                  overflow: 'hidden', textOverflow: 'ellipsis',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}>{d.sub}</div>
                {d.chips.length > 0 && (
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 8 }}>
                    {d.chips.map(ch => (
                      <span key={ch} style={{
                        fontSize: 10.5, fontWeight: 600,
                        padding: '3px 9px', borderRadius: 999,
                        background: isActive ? 'rgba(255,255,255,0.8)' : '#F4ECFA',
                        color: '#5A4275',
                      }}>{ch}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* right status */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                {isDone && (
                  <span style={{
                    fontSize: 10.5, fontWeight: 700,
                    padding: '5px 10px', borderRadius: 999,
                    background: '#E7F8EE', color: '#2E8B57',
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}>✓ დასრულდა</span>
                )}
                {isActive && (
                  <button style={{
                    fontFamily: 'DM Sans, "Noto Sans Georgian", sans-serif',
                    fontSize: 11, fontWeight: 800,
                    padding: '7px 12px', borderRadius: 999,
                    background: 'linear-gradient(135deg, #C9A8E8 0%, #FF9EC5 100%)',
                    color: '#fff', border: 'none',
                    boxShadow: '0 3px 10px rgba(255,158,197,0.45)',
                    whiteSpace: 'nowrap',
                  }}>დაიწყე →</button>
                )}
                {isRest && (
                  <span style={{
                    fontSize: 10.5, fontWeight: 700,
                    padding: '5px 11px', borderRadius: 999,
                    background: '#EADCF5', color: '#7B4FA8',
                  }}>ღია</span>
                )}
                {isPeak && (
                  <span style={{
                    fontSize: 10.5, fontWeight: 700,
                    padding: '5px 11px', borderRadius: 999,
                    background: '#FFE6F0', color: '#C04A7E',
                  }}>მაქს. დატვ.</span>
                )}
                {isPending && (
                  <span style={{
                    fontSize: 10.5, fontWeight: 600, color: '#B7AAD0',
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}>
                    <svg width="11" height="11" viewBox="0 0 11 11"><circle cx="5.5" cy="5.5" r="4.5" fill="none" stroke="#B7AAD0" strokeWidth="1.3"/></svg>
                    მოლოდინში
                  </span>
                )}
              </div>

              {/* Active "today" badge */}
              {isActive && (
                <div style={{
                  position: 'absolute', top: -9, left: 14,
                  fontSize: 9.5, fontWeight: 800,
                  background: '#FFD66B', color: '#5A3A0A',
                  padding: '3px 9px', borderRadius: 999,
                  letterSpacing: '0.04em',
                  boxShadow: '0 2px 6px rgba(255,214,107,0.5)',
                }}>⏰ დღეს</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom info card */}
      <div style={{
        margin: '18px 18px 0', padding: '14px 16px',
        background: '#E7F8EE', borderRadius: 20,
        border: '1px solid rgba(125,223,168,0.35)',
        display: 'flex', gap: 10, alignItems: 'flex-start',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ fontSize: 18, lineHeight: 1.2 }}>💡</div>
        <div style={{ fontSize: 11.5, lineHeight: 1.45, color: '#2E6B47', fontWeight: 500 }}>
          ხუთშაბათი და კვირა — სრული დასვენება სავალდებულოა. კუნთი დასვენებისას იზრდება.
        </div>
      </div>

      <div style={{ height: 120 }} />

      {/* Bottom nav — გეგმა active */}
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
            const active = t.key === 'plan';
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

Object.assign(window, { PlanCScreen });
