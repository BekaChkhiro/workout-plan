// Login + 4 onboarding screens — Style C

// ---------- shared bits ----------

function Blobs({ blobs }) {
  return (
    <>
      {blobs.map((b, i) => (
        <div key={i} style={{
          position: 'absolute',
          ...b.pos,
          width: b.size || 220, height: b.size || 220,
          borderRadius: 999,
          background: `radial-gradient(circle, ${b.color} 0%, transparent 65%)`,
          pointerEvents: 'none', zIndex: 0,
        }}/>
      ))}
    </>
  );
}

function ProgressDots({ active, total = 4 }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      padding: '4px 0 14px',
      position: 'relative', zIndex: 1,
    }}>
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === active;
        const isDone = i < active;
        return (
          <div key={i} style={{
            width: isActive ? 22 : 8, height: 8,
            borderRadius: 999,
            background: isActive
              ? 'linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)'
              : isDone
                ? 'linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)'
                : '#E8DFF7',
            opacity: isDone && !isActive ? 0.6 : 1,
            transition: 'all 200ms ease',
          }}/>
        );
      })}
    </div>
  );
}

function PrimaryCTA({ children, style }) {
  return (
    <button style={{
      width: '100%', height: 56, borderRadius: 999,
      background: 'linear-gradient(135deg, #C9A8E8 0%, #FF9EC5 100%)',
      color: '#fff', border: 'none',
      fontFamily: 'DM Sans, "Noto Sans Georgian", sans-serif',
      fontSize: 15, fontWeight: 800, letterSpacing: '0.01em',
      boxShadow: '0 10px 24px rgba(255,158,197,0.4), 0 2px 6px rgba(201,168,232,0.25)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      ...style,
    }}>{children}</button>
  );
}

function TextLink({ children, color = '#7B4FA8', style }) {
  return (
    <button style={{
      background: 'transparent', border: 'none',
      color, fontSize: 12.5, fontWeight: 600,
      fontFamily: 'DM Sans, "Noto Sans Georgian", sans-serif',
      cursor: 'pointer',
      ...style,
    }}>{children}</button>
  );
}

// ---------- Artboard 1: Login ----------

function LoginCScreen() {
  return (
    <div className="style-c" style={{
      minHeight: '100%', paddingTop: 54, position: 'relative',
      display: 'flex', flexDirection: 'column',
    }}>
      <Blobs blobs={[
        { pos: { top: 30, right: -80 }, color: 'rgba(255,214,107,0.35)', size: 240 },
        { pos: { bottom: 80,  left: -90 }, color: 'rgba(255,158,197,0.30)', size: 230 },
        { pos: { top: 380, left: -100 }, color: 'rgba(201,168,232,0.25)', size: 220 },
      ]} />

      {/* Logo emblem */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '20px 22px 18px', position: 'relative', zIndex: 1,
      }}>
        <div style={{
          width: 116, height: 116, borderRadius: 36,
          background: 'linear-gradient(135deg, #C9A8E8 0%, #FF9EC5 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 52, color: '#fff',
          boxShadow: '0 16px 32px rgba(255,158,197,0.4), 0 4px 12px rgba(201,168,232,0.3)',
        }}>✨</div>
        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 14, letterSpacing: '-0.01em' }}>Fit Plan</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#7B6A9B', marginTop: 4 }}>
          შენი 4-კვირიანი მოგზაურობა
        </div>
      </div>

      {/* Form card */}
      <div style={{
        margin: '8px 18px 0', padding: '24px 22px 22px',
        background: '#FFFFFF', borderRadius: 28,
        boxShadow: '0 4px 16px rgba(255,158,197,0.18), 0 1px 4px rgba(201,168,232,0.12)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ fontSize: 17, fontWeight: 800 }}>გამარჯობა! 👋</div>
        <div style={{ fontSize: 12.5, fontWeight: 500, color: '#7B6A9B', marginTop: 4 }}>
          შედი შენი მონაცემებით
        </div>

        {/* Email */}
        <div style={{ marginTop: 20 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: '#7B4FA8',
            letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6,
          }}>ელ.ფოსტა</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            height: 52, borderRadius: 16,
            background: '#F4ECFA',
            border: '2px solid transparent',
            padding: '0 14px',
          }}>
            <span style={{ fontSize: 16, opacity: 0.5 }}>✉️</span>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#3D2C5F' }}>
              mei@fitplan.ge
            </div>
          </div>
        </div>

        {/* Password */}
        <div style={{ marginTop: 14 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: '#7B4FA8',
            letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6,
          }}>პაროლი</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            height: 52, borderRadius: 16,
            background: '#FFFFFF',
            border: '2px solid #C9A8E8',
            boxShadow: '0 0 0 4px rgba(201,168,232,0.15)',
            padding: '0 14px',
          }}>
            <span style={{ fontSize: 16, opacity: 0.5 }}>🔒</span>
            <div style={{ flex: 1, fontSize: 16, letterSpacing: '0.18em', color: '#3D2C5F', fontWeight: 700 }}>
              ••••••••
            </div>
            <svg width="20" height="14" viewBox="0 0 20 14">
              <path d="M1 7s3-5.5 9-5.5S19 7 19 7s-3 5.5-9 5.5S1 7 1 7z" fill="none" stroke="#7B6A9B" strokeWidth="1.4"/>
              <circle cx="10" cy="7" r="2.5" fill="none" stroke="#7B6A9B" strokeWidth="1.4"/>
            </svg>
          </div>
        </div>

        {/* Remember me */}
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 8,
              background: 'linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(255,158,197,0.4)',
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path d="M2.5 6l2.5 2.5L9.5 3" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: '#3D2C5F' }}>
              დამიმახსოვრე ერთი წელი
            </span>
          </div>
          <div style={{ fontSize: 10.5, fontWeight: 500, color: '#7B6A9B', marginTop: 4, paddingLeft: 32 }}>
            🍪 უსაფრთხო session cookie
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 20 }}>
          <PrimaryCTA>შესვლა → <span style={{ fontSize: 12 }}>✨</span></PrimaryCTA>
        </div>

        {/* Forgot */}
        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <TextLink>პაროლი დაგავიწყდა?</TextLink>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Bottom note */}
      <div style={{
        textAlign: 'center', padding: '0 22px 40px',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#B7AAD0' }}>
          პირველად აქ ხარ? დაუკავშირდი ადმინს
        </div>
      </div>
    </div>
  );
}

// ---------- Artboard 2: Welcome ----------

function OnbWelcomeScreen() {
  return (
    <div className="style-c" style={{
      minHeight: '100%', paddingTop: 54, position: 'relative',
      display: 'flex', flexDirection: 'column',
    }}>
      <Blobs blobs={[
        { pos: { top: 90, left: -80 }, color: 'rgba(255,214,107,0.35)', size: 230 },
        { pos: { bottom: 120, right: -90 }, color: 'rgba(125,223,168,0.30)', size: 230 },
      ]} />

      <ProgressDots active={0} />

      {/* Hero */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 28px', position: 'relative', zIndex: 1,
      }}>
        <div style={{
          width: 220, height: 220, borderRadius: 999,
          background: 'linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 22px 44px rgba(255,158,197,0.35), 0 6px 16px rgba(255,214,107,0.25)',
          position: 'relative',
          fontSize: 0,
        }}>
          <span style={{ fontSize: 70, position: 'absolute', top: 50, left: 56 }}>💪</span>
          <span style={{ fontSize: 38, position: 'absolute', top: 38, right: 48 }}>✨</span>
          <span style={{ fontSize: 60, position: 'absolute', bottom: 36, right: 50 }}>🌸</span>
        </div>

        <div style={{
          fontSize: 28, fontWeight: 800, color: '#3D2C5F',
          textAlign: 'center', marginTop: 32, lineHeight: 1.2, letterSpacing: '-0.01em',
        }}>
          კეთილი იყოს მობრძანება
        </div>
        <div style={{
          fontSize: 14, fontWeight: 600, color: '#7B6A9B',
          textAlign: 'center', marginTop: 10, lineHeight: 1.5,
        }}>
          შენი პერსონალური 4-კვირიანი გეგმა
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '0 22px 16px', position: 'relative', zIndex: 1 }}>
        <PrimaryCTA>გავაგრძელოთ → <span style={{ fontSize: 12 }}>✨</span></PrimaryCTA>
      </div>
      <div style={{ textAlign: 'center', padding: '0 22px 40px', position: 'relative', zIndex: 1 }}>
        <TextLink color="#B7AAD0">გამოტოვება</TextLink>
      </div>
    </div>
  );
}

// ---------- Artboard 3: Add to Home Screen ----------

function OnbAddToHomeScreen() {
  return (
    <div className="style-c" style={{
      minHeight: '100%', paddingTop: 54, position: 'relative',
      display: 'flex', flexDirection: 'column',
    }}>
      <Blobs blobs={[
        { pos: { top: 60, right: -90 }, color: 'rgba(255,214,107,0.32)', size: 220 },
        { pos: { top: 380, left: -100 }, color: 'rgba(255,158,197,0.26)', size: 220 },
      ]} />

      <ProgressDots active={1} />

      {/* Title */}
      <div style={{ padding: '4px 22px 0', position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: '#7B4FA8',
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6,
        }}>📱 iPhone-ისთვის</div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.15 }}>
          დაამატე ეკრანზე
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#7B6A9B', marginTop: 6, lineHeight: 1.45 }}>
          შეტყობინებების მისაღებად აპი უნდა იყოს მთავარ ეკრანზე
        </div>
      </div>

      {/* Mini phone illustration */}
      <div style={{
        margin: '20px auto 12px',
        width: 168, height: 200,
        borderRadius: 26,
        background: '#FFFFFF',
        border: '2px solid #EADCF5',
        boxShadow: '0 8px 24px rgba(201,168,232,0.18)',
        position: 'relative', zIndex: 1,
        padding: '10px 12px',
        overflow: 'hidden',
      }}>
        {/* Address bar */}
        <div style={{
          height: 22, borderRadius: 8, background: '#F4ECFA',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, color: '#7B6A9B', fontWeight: 600,
        }}>🔒 fitplan.ge</div>
        {/* Faux content lines */}
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ height: 6, borderRadius: 99, background: '#EADCF5', width: '80%' }}/>
          <div style={{ height: 6, borderRadius: 99, background: '#F4ECFA', width: '65%' }}/>
          <div style={{ height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #FFE6F0 0%, #E8DFF7 100%)',
            marginTop: 4,
          }}/>
          <div style={{ height: 6, borderRadius: 99, background: '#EADCF5', width: '50%' }}/>
        </div>
        {/* Bottom toolbar with share button highlighted */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          height: 34, background: '#F8F2FB',
          borderTop: '1px solid #EADCF5',
          display: 'flex', alignItems: 'center', justifyContent: 'space-around',
          padding: '0 14px',
        }}>
          <span style={{ fontSize: 12, opacity: 0.4 }}>‹</span>
          <span style={{ fontSize: 12, opacity: 0.4 }}>›</span>
          <div style={{
            position: 'relative',
            width: 26, height: 26, borderRadius: 8,
            background: '#FFFFFF',
            border: '1.5px solid #FFD66B',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 4px rgba(255,214,107,0.35), 0 0 14px rgba(255,214,107,0.55)',
          }}>
            <svg width="11" height="13" viewBox="0 0 11 13">
              <path d="M5.5 1.5v8M2.5 4l3-3 3 3M1.5 8.5v3h8v-3" fill="none" stroke="#7B4FA8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 12, opacity: 0.4 }}>▢</span>
        </div>
        {/* Arrow + Share label */}
        <div style={{
          position: 'absolute', right: -4, bottom: 24,
          fontSize: 9.5, fontWeight: 800, color: '#A47000',
          background: '#FFF5DA', padding: '3px 7px', borderRadius: 8,
          border: '1px solid #FFD66B',
        }}>🔼 Share</div>
      </div>

      {/* Steps */}
      <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
        {[
          'დააჭირე 🔼 Share ღილაკს',
          'აირჩიე ➕ Add to Home Screen',
          "დააჭირე 'Add' ზედა მარჯვენა კუთხეში",
        ].map((step, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 16px', borderRadius: 20,
            background: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(201,168,232,0.10)',
            border: '1px solid rgba(244,236,250,0.8)',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 999,
              background: 'linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)',
              color: '#fff', fontSize: 14, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(255,158,197,0.35)',
              flexShrink: 0,
            }}>{i + 1}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#3D2C5F', lineHeight: 1.35 }}>
              {step}
            </div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* CTA */}
      <div style={{ padding: '14px 22px 8px', position: 'relative', zIndex: 1 }}>
        <PrimaryCTA>გავიგე ✓</PrimaryCTA>
      </div>
      <div style={{ textAlign: 'center', padding: '0 22px 32px', position: 'relative', zIndex: 1 }}>
        <TextLink>მე უკვე დავამატე</TextLink>
      </div>
    </div>
  );
}

// ---------- Artboard 4: Notifications ----------

function OnbNotificationsScreen() {
  return (
    <div className="style-c" style={{
      minHeight: '100%', paddingTop: 54, position: 'relative',
      display: 'flex', flexDirection: 'column',
    }}>
      <Blobs blobs={[
        { pos: { top: 90, left: -90 }, color: 'rgba(125,223,168,0.32)', size: 230 },
        { pos: { bottom: 100, right: -90 }, color: 'rgba(255,214,107,0.32)', size: 230 },
      ]} />

      <ProgressDots active={2} />

      {/* Hero bell */}
      <div style={{
        display: 'flex', justifyContent: 'center',
        padding: '24px 0 18px', position: 'relative', zIndex: 1,
      }}>
        <div style={{
          position: 'relative',
          width: 180, height: 180, borderRadius: 999,
          background: 'linear-gradient(135deg, #C9A8E8 0%, #FF9EC5 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 18px 36px rgba(201,168,232,0.4), 0 4px 12px rgba(255,158,197,0.3)',
        }}>
          <span style={{ fontSize: 78 }}>🔔</span>
          {/* Orbiting sparkles */}
          <span style={{ position: 'absolute', top: -4, right: 14, fontSize: 22 }}>✨</span>
          <span style={{ position: 'absolute', bottom: 4, left: -4, fontSize: 18 }}>✦</span>
          <span style={{ position: 'absolute', top: 28, left: -10, fontSize: 16 }}>✧</span>
        </div>
      </div>

      <div style={{ padding: '0 28px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#3D2C5F', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
          შეგახსენო კვება და ვარჯიში?
        </div>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#7B6A9B', marginTop: 8, lineHeight: 1.45 }}>
          5 კვება + ვარჯიში — ყოველდღე სწორ დროზე
        </div>
      </div>

      {/* Time chips */}
      <div style={{
        margin: '22px 22px 0',
        display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center',
        position: 'relative', zIndex: 1,
      }}>
        {[
          '🍳 10:00','🫐 12:30','🍗 15:00','🥜 17:30','💪 18:30','🥗 20:00',
        ].map(c => (
          <span key={c} style={{
            fontSize: 11, fontWeight: 600, color: '#3D2C5F',
            background: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(244,236,250,0.85)',
            borderRadius: 999, padding: '5px 11px',
            backdropFilter: 'blur(6px)',
          }}>{c}</span>
        ))}
      </div>

      <div style={{
        textAlign: 'center', padding: '14px 22px 0',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#7B6A9B' }}>
          შეგიძლია მოგვიანებით პროფილში გამორთო
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ padding: '14px 22px 8px', position: 'relative', zIndex: 1 }}>
        <PrimaryCTA>🔔 ჩართე შეტყობინებები</PrimaryCTA>
      </div>
      <div style={{ textAlign: 'center', padding: '0 22px 32px', position: 'relative', zIndex: 1 }}>
        <TextLink color="#B7AAD0">ახლა არა</TextLink>
      </div>
    </div>
  );
}

// ---------- Artboard 5: Ready ----------

function OnbReadyScreen() {
  return (
    <div className="style-c" style={{
      minHeight: '100%', paddingTop: 54, position: 'relative',
      display: 'flex', flexDirection: 'column',
    }}>
      <Blobs blobs={[
        { pos: { top: 60, right: -90 }, color: 'rgba(255,214,107,0.32)', size: 230 },
        { pos: { bottom: 100, left: -90 }, color: 'rgba(255,158,197,0.30)', size: 230 },
        { pos: { top: 360, left: 120 }, color: 'rgba(125,223,168,0.22)', size: 180 },
      ]} />

      <ProgressDots active={3} />

      {/* Hero */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 28px', position: 'relative', zIndex: 1,
      }}>
        <div style={{
          position: 'relative',
          width: 240, height: 240, borderRadius: 999,
          background: 'radial-gradient(circle, #E7F8EE 0%, rgba(231,248,238,0) 70%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 92, zIndex: 2 }}>🎉</span>
          {/* Confetti stars */}
          <span style={{ position: 'absolute', top: 10, left: 28, fontSize: 22, color: '#FFD66B' }}>✨</span>
          <span style={{ position: 'absolute', top: 30, right: 24, fontSize: 18, color: '#FF9EC5' }}>✦</span>
          <span style={{ position: 'absolute', bottom: 14, left: 18, fontSize: 20, color: '#7DDFA8' }}>✧</span>
          <span style={{ position: 'absolute', bottom: 30, right: 12, fontSize: 24, color: '#C9A8E8' }}>✨</span>
          <span style={{ position: 'absolute', top: 60, left: -6, fontSize: 16, color: '#FF9EC5' }}>✦</span>
          <span style={{ position: 'absolute', top: 80, right: -2, fontSize: 18, color: '#FFD66B' }}>✧</span>
          <span style={{ position: 'absolute', bottom: 60, left: 60, fontSize: 14, color: '#7DDFA8' }}>✨</span>
          <span style={{ position: 'absolute', bottom: 80, right: 60, fontSize: 16, color: '#C9A8E8' }}>✦</span>
        </div>

        <div style={{
          fontSize: 30, fontWeight: 800, color: '#3D2C5F',
          textAlign: 'center', marginTop: 18, letterSpacing: '-0.01em',
        }}>
          მზად ხარ! ✨
        </div>
        <div style={{
          fontSize: 14, fontWeight: 500, color: '#7B6A9B',
          textAlign: 'center', marginTop: 8, lineHeight: 1.45,
        }}>
          შენი 4-კვირიანი მოგზაურობა იწყება დღეს
        </div>

        {/* Stats preview card */}
        <div style={{
          marginTop: 24, alignSelf: 'stretch',
          padding: '16px 18px', borderRadius: 20,
          background: '#FFFFFF',
          boxShadow: '0 4px 16px rgba(255,158,197,0.18), 0 1px 4px rgba(201,168,232,0.12)',
          display: 'flex',
        }}>
          {[
            { v: '4', c: 'კვირა' },
            { v: '5', c: 'კვება/დღე' },
            { v: '5', c: 'ვარჯიში/კვ' },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, textAlign: 'center',
              borderRight: i < 2 ? '1px solid #F4ECFA' : 'none',
            }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#3D2C5F', lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#7B6A9B', marginTop: 6 }}>{s.c}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '14px 22px 8px', position: 'relative', zIndex: 1 }}>
        <PrimaryCTA>მოგზაურობა იწყება ✨</PrimaryCTA>
      </div>
      <div style={{ textAlign: 'center', padding: '0 22px 32px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#7B6A9B' }}>შენ შეგიძლია 💪</div>
      </div>
    </div>
  );
}

Object.assign(window, {
  LoginCScreen, OnbWelcomeScreen, OnbAddToHomeScreen, OnbNotificationsScreen, OnbReadyScreen,
});
