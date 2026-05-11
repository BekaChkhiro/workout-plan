// Meals screen — Style C (Soft Pastel Feminine)
// 5-meal browser. Card #3 (სადილი) expanded inline.

function MealsCScreen() {
  // Inline pill chip used in summary + swap chips
  const StatPill = ({ children, bg = 'rgba(255,255,255,0.7)', color = '#3D2C5F' }) => (
    <span style={{
      fontSize: 11.5, fontWeight: 600,
      padding: '6px 11px', borderRadius: 999,
      background: bg, color,
      whiteSpace: 'nowrap',
      boxShadow: '0 1px 3px rgba(201,168,232,0.10)',
    }}>{children}</span>
  );

  // Compact 56×56 time block
  const TimeBlock = ({ time, label, bg, color, badge }) => (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: bg, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.5)',
      }}>
        <div style={{ fontSize: 14, fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.01em' }}>
          {time}
        </div>
        <div style={{ fontSize: 9, fontWeight: 700, color, opacity: 0.75, marginTop: 4, letterSpacing: '0.02em' }}>
          {label}
        </div>
      </div>
      {badge && (
        <div style={{
          position: 'absolute', top: -6, right: -10,
          fontSize: 8.5, fontWeight: 800,
          background: '#FFD66B', color: '#5A3A0A',
          padding: '3px 7px', borderRadius: 999,
          letterSpacing: '0.02em',
          boxShadow: '0 2px 5px rgba(255,214,107,0.5)',
          whiteSpace: 'nowrap',
        }}>{badge}</div>
      )}
    </div>
  );

  const ChevDown = ({ size = 14, color = '#B7AAD0' }) => (
    <svg width={size} height={size} viewBox="0 0 14 14">
      <path d="M3 5l4 4 4-4" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // ---- Collapsed meal card ----
  const CollapsedMeal = ({ time, dayLabel, blockBg, blockColor, badge, emoji, name, summary, kcal }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '13px 14px', borderRadius: 20,
      background: '#FFFFFF',
      border: '1px solid rgba(244,236,250,0.8)',
      boxShadow: '0 2px 8px rgba(201,168,232,0.10)',
    }}>
      <TimeBlock time={time} label={dayLabel} bg={blockBg} color={blockColor} badge={badge} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 16 }}>{emoji}</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#3D2C5F' }}>{name}</span>
        </div>
        <div style={{
          fontSize: 11.5, color: '#7B6A9B', fontWeight: 500,
          marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{summary}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#3D2C5F', lineHeight: 1 }}>{kcal}</div>
        <div style={{ fontSize: 9.5, fontWeight: 700, color: '#B7AAD0', letterSpacing: '0.04em' }}>კკალ</div>
        <div style={{ marginTop: 3 }}><ChevDown /></div>
      </div>
    </div>
  );

  // ---- Expanded meal card content (Card 3) ----
  const ingredients = [
    { name: 'გამომცხვარი ქათმის მკერდი', amt: '150 გრ' },
    { name: 'ბოსტნეული (ბროკოლი, კაბახი, წიწაკა)', amt: '200 გრ' },
    { name: 'ყავისფერი ბრინჯი / გრეჩკა', amt: '3 ს.კ.' },
  ];
  const mealMacros = [
    { label: 'ცილა',         val: 38, color: '#7DDFA8', bg: '#E7F8EE' },
    { label: 'ნახშირწყლები', val: 32, color: '#FFD66B', bg: '#FFF5DA' },
    { label: 'ცხიმი',        val: 9,  color: '#FF9EC5', bg: '#FFE6F0' },
  ];
  const swaps = ['🐟 თევზი (150გ)', '🦃 ინდაური (150გ)', '🍠 ბატატი (100გ)', '🥬 მეტი სალათი'];

  return (
    <div className="style-c" style={{ minHeight: '100%', paddingTop: 54, position: 'relative' }}>
      {/* decorative blobs — positions distinct from Today/Plan */}
      <div style={{
        position: 'absolute', top: 240, right: -90, width: 220, height: 220,
        borderRadius: 999, background: 'radial-gradient(circle, rgba(125,223,168,0.30) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', top: 580, left: -100, width: 240, height: 240,
        borderRadius: 999, background: 'radial-gradient(circle, rgba(255,214,107,0.28) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', top: 1180, right: -80, width: 240, height: 240,
        borderRadius: 999, background: 'radial-gradient(circle, rgba(201,168,232,0.32) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Title row */}
      <div style={{
        padding: '8px 22px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.01em' }}>
          კვება <span style={{ fontSize: 22 }}>🍽</span>
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

      {/* Day-type toggle */}
      <div style={{ padding: '0 18px', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex', gap: 4, padding: 5,
          background: 'rgba(255,255,255,0.55)',
          border: '1px solid rgba(255,255,255,0.7)',
          borderRadius: 999,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 10px rgba(201,168,232,0.15)',
        }}>
          <div style={{
            flex: 1, textAlign: 'center', padding: '10px 4px',
            borderRadius: 999,
            background: 'linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)',
            color: '#fff',
            fontSize: 13, fontWeight: 800,
            boxShadow: '0 3px 10px rgba(255,158,197,0.4)',
            textShadow: '0 1px 1px rgba(90,58,10,0.18)',
          }}>💪 ვარჯიშის დღე ✨</div>
          <div style={{
            flex: 1, textAlign: 'center', padding: '10px 4px',
            borderRadius: 999, color: '#7B6A9B',
            fontSize: 13, fontWeight: 600,
          }}>😴 დასვენების დღე</div>
        </div>
        <div style={{
          textAlign: 'center', fontSize: 10.5, fontWeight: 600,
          color: '#9785B5', marginTop: 8, letterSpacing: '0.03em',
        }}>5 კვება · საათობრივად</div>
      </div>

      {/* Day summary card */}
      <div style={{
        margin: '14px 18px 0', padding: '22px 22px 16px',
        background: '#FFFFFF', borderRadius: 28,
        boxShadow: '0 4px 16px rgba(255,158,197,0.18), 0 1px 4px rgba(201,168,232,0.12)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* ring */}
          <div style={{ flexShrink: 0 }}>
            <CalRing
              size={118} stroke={13}
              pct={1}
              track="#F4ECFA"
              gradientId="ringGradMealsC"
              gradFrom="#FF9EC5" gradTo="#C9A8E8"
            >
              <div style={{ fontSize: 24, fontWeight: 800, color: '#3D2C5F', lineHeight: 1 }}>1250</div>
              <div style={{ fontSize: 10, color: '#7B6A9B', marginTop: 4, fontWeight: 600 }}>კკალ სამიზნე</div>
            </CalRing>
          </div>
          {/* target macros */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { short: 'ცილა',         goal: 100, color: '#7DDFA8', bg: '#E7F8EE' },
              { short: 'ნახშირწყლები', goal: 120, color: '#FFD66B', bg: '#FFF5DA' },
              { short: 'ცხიმი',        goal: 40,  color: '#FF9EC5', bg: '#FFE6F0' },
            ].map(m => (
              <div key={m.short}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 10.5, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, color: '#3D2C5F' }}>{m.short}</span>
                  <span style={{ fontWeight: 700, color: '#7B6A9B' }}>{m.goal} გ</span>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: m.bg }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: 99, background: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          marginTop: 18, paddingTop: 14,
          borderTop: '1px solid #F4ECFA',
          display: 'flex', gap: 6, justifyContent: 'space-between',
        }}>
          <StatPill bg="#F4ECFA">💧 2 ლ წყალი</StatPill>
          <StatPill bg="#FFF5DA" color="#5A3A0A">🍽 5 კვება</StatPill>
          <StatPill bg="#FFE6F0" color="#7B4FA8">🕗 20:00-მდე</StatPill>
        </div>
      </div>

      {/* Section divider */}
      <div style={{
        padding: '24px 22px 12px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>🍽 დღის რაციონი</div>
        <div style={{
          fontSize: 12, fontWeight: 700, color: '#7B4FA8',
          textDecoration: 'underline', textUnderlineOffset: 3, textDecorationColor: 'rgba(123,79,168,0.4)',
        }}>ყველას რედაქტირება</div>
      </div>

      {/* Meal cards */}
      <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', zIndex: 1 }}>
        {/* 1 */}
        <CollapsedMeal
          time="10:00" dayLabel="დილა" blockBg="#FFF5DA" blockColor="#A47000"
          emoji="🍳" name="საუზმე" summary="კვერცხის ომლეტი + ბოსტნეული" kcal="280"
        />
        {/* 2 */}
        <CollapsedMeal
          time="12:30" dayLabel="შუაქვე" blockBg="#FFE6F0" blockColor="#C04A7E"
          emoji="🫐" name="შუაქვე" summary="კოტეჯი + კენკრა" kcal="170"
        />

        {/* 3 — EXPANDED */}
        <div style={{
          background: '#FFFFFF', borderRadius: 28,
          border: '2px solid #C9A8E8',
          boxShadow: '0 12px 32px rgba(255,158,197,0.28), 0 4px 12px rgba(201,168,232,0.18)',
          padding: '20px 22px',
          position: 'relative',
        }}>
          {/* chev-up affordance */}
          <div style={{
            position: 'absolute', top: 18, right: 20,
            width: 28, height: 28, borderRadius: 999,
            background: '#F4ECFA', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path d="M3 9l4-4 4 4" fill="none" stroke="#7B4FA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* hero header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <TimeBlock time="15:00" label="სადილი" bg="#E8DFF7" color="#5A3A8B" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 30, lineHeight: 1 }}>🍗</div>
            </div>
            <div style={{ textAlign: 'right', marginRight: 32 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#C04A7E', letterSpacing: '0.04em', marginBottom: 2 }}>
                ყველაზე დიდი კვება
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#3D2C5F' }}>330 <span style={{ fontSize: 11, fontWeight: 700, color: '#7B6A9B' }}>კკალ</span></div>
            </div>
          </div>

          {/* title row */}
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.2 }}>
              სადილი — ქათამი + ბრინჯი
            </div>
            <div style={{ fontSize: 11.5, color: '#7B6A9B', fontWeight: 500, marginTop: 4 }}>
              მთავარი დღის კვება, ვარჯიშამდე 3 სთ-ით ადრე
            </div>
          </div>

          {/* Ingredients */}
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px dashed #EADCF5' }}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: '#7B4FA8',
              letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10,
            }}>🧾 ინგრედიენტები</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ingredients.map(i => (
                <div key={i.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 5, height: 5, borderRadius: 99, background: '#C9A8E8', flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#3D2C5F' }}>{i.name}</div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: '#7B6A9B', whiteSpace: 'nowrap' }}>{i.amt}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Macros for this meal */}
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px dashed #EADCF5' }}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: '#7B4FA8',
              letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10,
            }}>📊 ამ კვების მაკროები</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {mealMacros.map(m => (
                <div key={m.label} style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#3D2C5F', marginBottom: 4 }}>{m.label}</div>
                  <div style={{ height: 6, borderRadius: 99, background: m.bg }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: 99, background: m.color }} />
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#7B6A9B', marginTop: 5 }}>{m.val} გ</div>
                </div>
              ))}
            </div>
          </div>

          {/* Swap chips */}
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px dashed #EADCF5' }}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: '#7B4FA8',
              letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10,
            }}>🔄 შემცვლელები</div>
            <div style={{
              display: 'flex', gap: 8, overflowX: 'auto',
              marginLeft: -22, marginRight: -22, padding: '0 22px',
              scrollbarWidth: 'none',
            }}>
              {swaps.map(s => (
                <span key={s} style={{
                  fontSize: 11.5, fontWeight: 700,
                  padding: '6px 12px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.95)',
                  border: '1px solid #EADCF5',
                  color: '#5A4275',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 1px 3px rgba(201,168,232,0.10)',
                }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Footer actions */}
          <div style={{
            marginTop: 16, paddingTop: 14, borderTop: '1px solid #F4ECFA',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <button style={{
              fontFamily: 'DM Sans, "Noto Sans Georgian", sans-serif',
              fontSize: 12, fontWeight: 700, color: '#7B4FA8',
              background: 'transparent', border: 'none', padding: 0,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <svg width="13" height="13" viewBox="0 0 14 14"><path d="M10 1.5L12.5 4l-7.5 7.5H2.5V9L10 1.5z" fill="none" stroke="#7B4FA8" strokeWidth="1.4" strokeLinejoin="round"/></svg>
              რედაქტირება
            </button>
            <button style={{
              fontFamily: 'DM Sans, "Noto Sans Georgian", sans-serif',
              fontSize: 12, fontWeight: 700, color: '#C04A7E',
              background: 'transparent', border: 'none', padding: 0,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 12s-4.5-2.7-4.5-6A2.5 2.5 0 0 1 7 4.5 2.5 2.5 0 0 1 11.5 6c0 3.3-4.5 6-4.5 6z" fill="none" stroke="#C04A7E" strokeWidth="1.4" strokeLinejoin="round"/></svg>
              შენახვა საყვარელში
            </button>
          </div>
        </div>

        {/* 4 — collapsed (pre-workout) */}
        <CollapsedMeal
          time="17:30" dayLabel="ვარჯიშამდე" blockBg="#FFE6F0" blockColor="#C04A7E"
          badge="⚡ ვარჯიშამდე"
          emoji="🥜" name="ვარჯიშამდე" summary="იოგურტი + კაკალი" kcal="175"
        />

        {/* 5 — collapsed */}
        <CollapsedMeal
          time="20:00" dayLabel="ვახშამი" blockBg="#F4ECFA" blockColor="#5A4275"
          emoji="🥗" name="ვახშამი" summary="კვერცხი + სალათი" kcal="240"
        />
      </div>

      {/* Bottom helper card */}
      <div style={{
        margin: '18px 18px 0', padding: '14px 16px',
        background: '#E7F8EE', borderRadius: 20,
        border: '1px solid rgba(125,223,168,0.35)',
        display: 'flex', gap: 10, alignItems: 'flex-start',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ fontSize: 18, lineHeight: 1.2 }}>💡</div>
        <div style={{ fontSize: 11.5, lineHeight: 1.45, color: '#2E6B47', fontWeight: 500 }}>
          ბოლო კვება 20:00-მდე. ძილამდე 2.5-3 საათი მინიმუმ.
        </div>
      </div>

      <div style={{ height: 120 }} />

      {/* Bottom nav — კვება active */}
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
            const active = t.key === 'food';
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

Object.assign(window, { MealsCScreen });
