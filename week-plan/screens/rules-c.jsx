// Rules / Tips reference screen — Style C
// Standalone, deep-link. Tall artboard. No bottom nav.

function RulesCScreen() {
  return (
    <div className="style-c" style={{ minHeight: '100%', paddingTop: 54, position: 'relative' }}>
      {/* decorative blobs */}
      <div style={{
        position: 'absolute', top: 60, right: -90, width: 220, height: 220,
        borderRadius: 999, background: 'radial-gradient(circle, rgba(255,214,107,0.30) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', top: 580, left: -100, width: 240, height: 240,
        borderRadius: 999, background: 'radial-gradient(circle, rgba(125,223,168,0.26) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', top: 1200, right: -100, width: 220, height: 220,
        borderRadius: 999, background: 'radial-gradient(circle, rgba(201,168,232,0.32) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Sticky-style header */}
      <div style={{
        padding: '4px 18px 4px', position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <button style={{
          width: 36, height: 36, borderRadius: 999,
          background: 'rgba(255,255,255,0.65)',
          border: '1.5px solid #C9A8E8',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
        }}>
          <svg width="13" height="13" viewBox="0 0 13 13">
            <path d="M8 1.5L3 6.5L8 11.5" fill="none" stroke="#5A3A8B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ fontSize: 19, fontWeight: 800, color: '#3D2C5F' }}>წესები 📖</div>
        <button style={{
          width: 36, height: 36, borderRadius: 999,
          background: 'rgba(255,255,255,0.65)',
          border: '1.5px solid #C9A8E8',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
          fontSize: 13,
        }}>🔍</button>
      </div>
      <div style={{
        textAlign: 'center', padding: '0 22px 16px',
        fontSize: 11.5, fontWeight: 600, color: '#7B6A9B',
        position: 'relative', zIndex: 1,
      }}>
        8 თემა · 24 წესი
      </div>

      {/* Hero intro card */}
      <div style={{
        margin: '0 18px', padding: '20px 22px',
        background: 'linear-gradient(135deg, #E8DFF7 0%, #FFE6F0 100%)',
        borderRadius: 28,
        boxShadow: '0 4px 16px rgba(255,158,197,0.18), 0 1px 4px rgba(201,168,232,0.12)',
        position: 'relative', zIndex: 1, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -6, right: 4, fontSize: 80, opacity: 0.18, pointerEvents: 'none', lineHeight: 1,
        }}>✨</div>
        <div style={{
          fontSize: 10.5, fontWeight: 700, color: '#7B4FA8',
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4,
        }}>გახსოვდეს</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#3D2C5F', lineHeight: 1.2, paddingRight: 50 }}>
          მთავარი ცვლილება — 5-ჯერ ჭამა
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 500, color: '#3D2C5F', marginTop: 8, lineHeight: 1.5, paddingRight: 30 }}>
          1-2-ჯერ ჭამიდან გადადი 5-ჯერ ჭამაზე. ეს ყველაზე ეფექტური ნაბიჯია მეტაბოლიზმის გასაუმჯობესებლად.
        </div>
      </div>

      {/* Sections */}
      <RuleSection
        emoji="💧" circleBg="#E3F2FD" title="წყალი" count="3 წესი"
        rules={[
          { icon: '💧', tint: '#E3F2FD', text: 'მინიმუმ 2 ლიტრი დღეში' },
          { icon: '🥛', tint: '#E3F2FD', text: 'ვარჯიშამდე 30 წთ — 1 ჭიქა' },
          { icon: '💪', tint: '#E3F2FD', text: 'ვარჯიშის შემდეგ — 1.5 ჭიქა' },
        ]}
      />

      <RuleSection
        emoji="🌙" circleBg="#F0E5F9" title="დროები" count="2 წესი"
        rules={[
          { icon: '🌙', tint: '#F0E5F9', text: 'ბოლო კვება 20:00-მდე' },
          { icon: '💤', tint: '#F0E5F9', text: 'ძილამდე მინიმუმ 2.5-3 საათი' },
        ]}
      />

      <RuleSection
        emoji="🥚" circleBg="#FFF5DA" title="პროტეინი" count="2 წესი"
        rules={[
          { icon: '🥚', tint: '#FFF5DA', text: 'პროტეინი ყველა კვებაზე — კვერცხი, ქათამი, კოტეჯი ან იოგურტი' },
          { icon: '🥤', tint: '#FFF5DA', text: 'პროტეინის კოქტეილი — ჩაანაცვლე ვახშამი, ვარჯიშის შემდეგ 30 წთ-ში' },
        ]}
      />

      {/* Avoid section — chip cloud */}
      <SectionHeaderRule emoji="🚫" circleBg="#FFE6F0" title="გამოირიცხება" count="5 პროდუქტი" />
      <div style={{
        margin: '0 18px', padding: '14px 16px',
        background: '#FFFFFF', borderRadius: 20,
        boxShadow: '0 2px 8px rgba(201,168,232,0.10)',
        border: '1px solid rgba(244,236,250,0.8)',
        position: 'relative', zIndex: 1,
        display: 'flex', flexWrap: 'wrap', gap: 6,
      }}>
        {[
          '🍞 თეთრი პური', '🍺 ბოქალი', '🥤 ტკბილი სასმელები',
          '🍟 ჩიფსი', '🍰 ნამცხვარი', '🌭 ძეხვი',
        ].map(c => (
          <span key={c} style={{
            fontSize: 12, fontWeight: 700, color: '#C04A7E',
            background: '#FFE6F0',
            borderRadius: 999, padding: '7px 13px',
          }}>{c}</span>
        ))}
      </div>

      <RuleSection
        emoji="💪" circleBg="#F0E5F9" title="ვარჯიში" count="3 წესი"
        rules={[
          { icon: '🔥', tint: '#FFE6F0', text: 'პარასკევის კომბო დღე — ნუ გამოტოვებ', sub: 'ყველაზე მეტ კალორიას წვავს' },
          { icon: '📺', tint: '#F0E5F9', text: 'პილატესის ვიდეო — ყოველ კვირა ახალი', sub: 'სხვადასხვა კუნთთა ჯგუფი' },
          { icon: '😴', tint: '#F4ECFA', text: 'ხუთშაბათი + კვირა — სრული დასვენება', sub: 'კუნთი დასვენებისას იზრდება' },
        ]}
      />

      <RuleSection
        emoji="📈" circleBg="#E7F8EE" title="პროგრესია" count="2 წესი"
        rules={[
          { icon: '📈', tint: '#E7F8EE', text: 'ყოველ კვირა ინტენსიობა ოდნავ გაიზარდება' },
          { icon: '🎯', tint: '#E7F8EE', text: 'ეს ყველაზე ეფექტური გზაა პროგრესისთვის' },
        ]}
      />

      <RuleSection
        emoji="⚖️" circleBg="#FFF5DA" title="მოლოდინი" count="3 წესი"
        rules={[
          { icon: '⚖️', tint: '#FFF5DA', text: 'ჯანმრთელი ტემპი — 0.5-1 კგ/კვირაში', sub: 'რეალისტური მოლოდინი ამ გეგმით — 4-6 კგ' },
          { icon: '📏', tint: '#FFF5DA', text: 'სასწორი ყოველდღე ნუ', sub: 'გაზომე მუცელი, მკლავი, ბარძაყი კვირაში ერთხელ' },
          { icon: '💤', tint: '#F0E5F9', text: 'ძილი — 7-8 საათი სავალდებულოა', sub: 'ნაკლები ძილი → კორტიზოლი ↑ → ცხიმი არ ნადნება' },
        ]}
      />

      {/* Closing card */}
      <div style={{ height: 24 }}/>
      <div style={{
        margin: '0 18px', padding: '22px 20px',
        background: 'linear-gradient(135deg, #E8DFF7 0%, #FFE6F0 100%)',
        borderRadius: 28,
        boxShadow: '0 4px 16px rgba(255,158,197,0.18), 0 1px 4px rgba(201,168,232,0.12)',
        position: 'relative', zIndex: 1, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -4, right: 6, fontSize: 60, opacity: 0.4, pointerEvents: 'none', lineHeight: 1,
        }}>✨</div>
        <div style={{
          fontSize: 10.5, fontWeight: 700, color: '#7B4FA8',
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4,
        }}>ფინიში</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#3D2C5F', lineHeight: 1.2, paddingRight: 40 }}>
          4 კვირის შემდეგ — გადახედე გეგმას
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 500, color: '#3D2C5F', marginTop: 8, lineHeight: 1.45 }}>
          ახალ წონასა და შედეგებს მიუსადაგე ახალი მიზნები
        </div>
        <button style={{
          marginTop: 16, width: '100%',
          background: 'transparent',
          color: '#7B4FA8',
          border: '1.5px solid #C9A8E8',
          padding: '12px 18px', borderRadius: 999,
          fontFamily: 'DM Sans, "Noto Sans Georgian", sans-serif',
          fontSize: 13, fontWeight: 700,
        }}>📋 ახალი გეგმის შექმნა</button>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center', padding: '28px 22px 30px',
        fontSize: 10.5, fontWeight: 500, color: '#B7AAD0',
        position: 'relative', zIndex: 1,
      }}>
        ✨ წყარო: კვებისა და ვარჯიშის გეგმის დოკუმენტი
      </div>
    </div>
  );
}

function SectionHeaderRule({ emoji, circleBg, title, count }) {
  return (
    <div style={{
      margin: '24px 22px 8px',
      display: 'flex', alignItems: 'center', gap: 12,
      position: 'relative', zIndex: 1,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 999,
        background: circleBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 17,
        flexShrink: 0,
      }}>{emoji}</div>
      <div style={{ fontSize: 16, fontWeight: 800, color: '#3D2C5F', flex: 1 }}>{title}</div>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: '#7B6A9B' }}>{count}</div>
    </div>
  );
}

function RuleSection({ emoji, circleBg, title, count, rules }) {
  return (
    <>
      <SectionHeaderRule emoji={emoji} circleBg={circleBg} title={title} count={count}/>
      <div style={{
        margin: '0 18px', padding: 0,
        background: '#FFFFFF', borderRadius: 20,
        boxShadow: '0 2px 8px rgba(201,168,232,0.10)',
        border: '1px solid rgba(244,236,250,0.8)',
        position: 'relative', zIndex: 1,
        overflow: 'hidden',
      }}>
        {rules.map((r, i) => (
          <React.Fragment key={i}>
            {i > 0 && <div style={{ height: 1, background: '#F4ECFA', margin: '0 16px' }}/>}
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 999,
                background: r.tint,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14,
                flexShrink: 0, marginTop: 1,
              }}>{r.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#3D2C5F', lineHeight: 1.4 }}>
                  {r.text}
                </div>
                {r.sub && (
                  <div style={{ fontSize: 11.5, fontWeight: 500, color: '#7B6A9B', lineHeight: 1.4, marginTop: 3 }}>
                    {r.sub}
                  </div>
                )}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  );
}

Object.assign(window, { RulesCScreen });
