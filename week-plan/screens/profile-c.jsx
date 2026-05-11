// Profile / Settings screen — Style C (Soft Pastel Feminine)
// Tall scrollable screen: identity, targets, goal, plan timing, notifications, appearance, danger zone.

function ProfileCScreen() {
  return (
    <div className="style-c" style={{ minHeight: '100%', paddingTop: 54, position: 'relative' }}>
      {/* decorative blobs */}
      <div style={{
        position: 'absolute', top: 50, right: -90, width: 220, height: 220,
        borderRadius: 999, background: 'radial-gradient(circle, rgba(255,214,107,0.30) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', top: 540, left: -100, width: 240, height: 240,
        borderRadius: 999, background: 'radial-gradient(circle, rgba(125,223,168,0.28) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', top: 1100, right: -90, width: 220, height: 220,
        borderRadius: 999, background: 'radial-gradient(circle, rgba(201,168,232,0.32) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Title row */}
      <div style={{
        padding: '8px 22px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.01em' }}>
          პროფილი <span style={{ fontSize: 22 }}>⚙️</span>
        </div>
        <button style={{
          width: 36, height: 36, borderRadius: 999,
          background: 'rgba(255,255,255,0.65)',
          border: '1.5px solid #C9A8E8',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0, fontSize: 16, fontWeight: 800, color: '#5A3A8B',
        }}>ⓘ</button>
      </div>

      {/* Identity card */}
      <div style={{
        margin: '4px 18px 0', padding: '22px 20px 0',
        background: 'linear-gradient(135deg, #E8DFF7 0%, #FFE6F0 100%)',
        borderRadius: 28,
        boxShadow: '0 4px 16px rgba(255,158,197,0.18), 0 1px 4px rgba(201,168,232,0.12)',
        position: 'relative', zIndex: 1, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 10, right: 14, fontSize: 30, opacity: 0.45, lineHeight: 1, pointerEvents: 'none',
        }}>✨</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 999,
            background: 'linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 32,
            boxShadow: '0 4px 14px rgba(255,158,197,0.4)',
            flexShrink: 0,
          }}>მ</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1 }}>მეი</div>
            <div style={{ fontSize: 12, color: '#7B6A9B', marginTop: 3, fontWeight: 500 }}>mei@fitplan.ge</div>
            <span style={{
              display: 'inline-block', marginTop: 7,
              fontSize: 10.5, fontWeight: 700, color: '#5A3A8B',
              background: 'rgba(255,255,255,0.7)', borderRadius: 999,
              padding: '3px 9px',
              border: '1px solid rgba(255,255,255,0.8)',
            }}>✨ კვირა 2 / 4</span>
          </div>
        </div>

        {/* divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.7)', margin: '18px 0 0' }} />

        {/* stats row */}
        <div style={{ display: 'flex', padding: '14px 0' }}>
          {[
            { v: '57 → 54.3', c: 'კგ' },
            { v: '12', c: 'დღე' },
            { v: '82%', c: 'adherence' },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, textAlign: 'center',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.7)' : 'none',
            }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#3D2C5F', lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#7B6A9B', marginTop: 5, letterSpacing: '0.02em' }}>{s.c}</div>
            </div>
          ))}
        </div>
      </div>

      <SectionHeader>🎯 დღიური სამიზნე</SectionHeader>
      <SettingsCard>
        <SettingRow label="კალორია" right={
          <ValueWithPencil value="1250 კკალ" />
        }/>
        <SettingRow label="ცილა" right={<DotValue color="#7DDFA8" value="100 გ" />}/>
        <SettingRow label="ნახშირწყლები" right={<DotValue color="#FFD66B" value="120 გ" />}/>
        <SettingRow label="ცხიმი" right={<DotValue color="#FF9EC5" value="40 გ" />}/>
        <SettingRow label="წყალი" right={<DotValue color="#7CC7FF" value="2 ლ" />}
          footer="1 ჭიქა = 250 მლ"
        />
      </SettingsCard>

      <SectionHeader>✨ მიზანი</SectionHeader>
      <SettingsCard>
        <SettingRow label="სამიზნე წონა" right={<PlainValue value="52 კგ" />}/>
        <SettingRow label="ვადა" right={<PlainValue value="4 კვირაში" />}/>
        <SettingRow label="მიღწეული" right={
          <span style={{
            fontSize: 11, fontWeight: 700, color: '#2E8B57',
            background: '#E7F8EE', borderRadius: 999, padding: '4px 10px',
            whiteSpace: 'nowrap',
          }}>✨ 54% (−2.7 კგ)</span>
        }/>
      </SettingsCard>

      <SectionHeader>📅 გეგმის თარიღი</SectionHeader>
      <SettingsCard>
        <SettingRow label="დაწყების თარიღი" right={<PlainValue value="29 აპრ. 2026" />}/>
        <div style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#3D2C5F' }}>მიმდინარე კვირა</div>
            <div style={{
              display: 'flex', gap: 2, padding: 3,
              background: '#F8F2FB', borderRadius: 999,
            }}>
              {[1, 2, 3, 4].map(n => {
                const active = n === 2;
                return (
                  <div key={n} style={{
                    width: 28, height: 24, borderRadius: 999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800,
                    background: active ? 'linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)' : 'transparent',
                    color: active ? '#fff' : '#9785B5',
                    boxShadow: active ? '0 2px 6px rgba(255,158,197,0.4)' : 'none',
                  }}>{n}</div>
                );
              })}
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 8, gap: 12,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#7B6A9B' }}>
              ავტომატური — შეგიძლია ხელით შეცვალო
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '3px 10px 3px 8px', borderRadius: 999,
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid #EADCF5',
              backdropFilter: 'blur(6px)',
              fontSize: 10.5, fontWeight: 700, color: '#5A3A8B',
              whiteSpace: 'nowrap',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: '#7DDFA8' }}/>
              ავტო
            </div>
          </div>
        </div>
      </SettingsCard>

      <SectionHeader>🔔 შეტყობინებები</SectionHeader>
      <SettingsCard>
        <SettingRow label="🍽 კვების შეხსენებები" right={<IOSSwitch on />}/>
        <SettingRow label="💪 ვარჯიშის შეხსენებები" right={<IOSSwitch on />}/>
        <SettingRow label="💧 წყლის შეხსენებები" right={<IOSSwitch />}/>
        <SettingRow label="⚖️ წონის შეხსენება" right={<IOSSwitch on />}
          footer="ყოველდღე 8:00-ზე"
        />
      </SettingsCard>

      {/* info banner */}
      <div style={{
        margin: '12px 18px 0', padding: '14px 16px',
        background: '#E7F8EE',
        border: '1px solid rgba(125,223,168,0.35)',
        borderRadius: 20,
        position: 'relative', zIndex: 1,
        fontSize: 11.5, fontWeight: 500, color: '#2E6B47', lineHeight: 1.4,
      }}>
        💡 iOS-ზე — დაამატე ეკრანზე ხატულა, რომ შეტყობინებები მუშაობდეს
      </div>

      <SectionHeader>🎨 გარეგნობა</SectionHeader>
      <SettingsCard>
        <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: '#3D2C5F' }}>თემა</div>
          <div style={{
            display: 'flex', gap: 2, padding: 3,
            background: '#F8F2FB', borderRadius: 999,
          }}>
            {[
              { k: 'light', label: '☀️ ღია', active: true },
              { k: 'dark',  label: '🌙 მუქი' },
              { k: 'auto',  label: '⚙️ ავტო' },
            ].map(t => (
              <div key={t.k} style={{
                padding: '5px 10px', borderRadius: 999,
                fontSize: 10.5, fontWeight: 700,
                background: t.active ? 'linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)' : 'transparent',
                color: t.active ? '#fff' : '#9785B5',
                boxShadow: t.active ? '0 2px 6px rgba(255,158,197,0.4)' : 'none',
                whiteSpace: 'nowrap',
              }}>{t.label}</div>
            ))}
          </div>
        </div>
      </SettingsCard>

      <SectionHeader muted>⚠️ მართვა</SectionHeader>
      <SettingsCard muted>
        <ActionRow icon="🔄" label="გეგმის ნაგულისხმევზე დაბრუნება" />
        <ActionRow icon="📤" label="მონაცემების ექსპორტი (CSV)" />
        <ActionRow icon="🚪" label="გასვლა" destructive />
      </SettingsCard>

      {/* Footer */}
      <div style={{
        marginTop: 26, padding: '0 22px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ fontSize: 10.5, fontWeight: 600, color: '#B7AAD0' }}>Fit Plan · v0.1.0</div>
        <div style={{ fontSize: 10, fontWeight: 500, color: '#B7AAD0' }}>❤️ Made for მეი</div>
      </div>

      <div style={{ height: 120 }} />

      {/* Bottom nav — პროფილი active */}
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
            const active = t.key === 'profile';
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

// ----- Sub-components -----

function SectionHeader({ children, muted }) {
  return (
    <div style={{
      margin: '24px 22px 12px',
      fontSize: 10.5, fontWeight: 700,
      color: muted ? '#9785B5' : '#7B4FA8',
      letterSpacing: '0.08em', textTransform: 'uppercase',
      position: 'relative', zIndex: 1,
    }}>{children}</div>
  );
}

function SettingsCard({ children, muted }) {
  return (
    <div style={{
      margin: '0 18px', padding: 0,
      background: '#FFFFFF', borderRadius: 20,
      boxShadow: muted
        ? '0 1px 4px rgba(201,168,232,0.10)'
        : '0 2px 8px rgba(201,168,232,0.12)',
      border: '1px solid rgba(244,236,250,0.8)',
      position: 'relative', zIndex: 1,
      overflow: 'hidden',
    }}>
      {React.Children.map(children, (child, i) => (
        <React.Fragment>
          {i > 0 && <div style={{ height: 1, background: '#F4ECFA', margin: '0 18px' }} />}
          {child}
        </React.Fragment>
      ))}
    </div>
  );
}

function SettingRow({ label, right, footer }) {
  return (
    <div style={{ padding: '14px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: '#3D2C5F' }}>{label}</div>
        <div>{right}</div>
      </div>
      {footer && (
        <div style={{ fontSize: 11.5, color: '#7B6A9B', fontWeight: 500, marginTop: 4 }}>{footer}</div>
      )}
    </div>
  );
}

function PlainValue({ value }) {
  return <span style={{ fontSize: 13.5, fontWeight: 700, color: '#3D2C5F' }}>{value}</span>;
}

function DotValue({ color, value }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: color }}/>
      <span style={{ fontSize: 13.5, fontWeight: 700, color: '#3D2C5F' }}>{value}</span>
    </span>
  );
}

function ValueWithPencil({ value }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 13.5, fontWeight: 700, color: '#3D2C5F' }}>{value}</span>
      <span style={{
        width: 22, height: 22, borderRadius: 999,
        background: '#F4ECFA',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="11" height="11" viewBox="0 0 11 11">
          <path d="M1.5 8.5L7.7 2.3l1.5 1.5L3 10H1.5V8.5z M7 3l1.5 1.5" fill="none" stroke="#7B4FA8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    </span>
  );
}

function IOSSwitch({ on }) {
  return (
    <div style={{
      width: 42, height: 26, borderRadius: 999,
      background: on ? 'linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)' : '#E8DFF7',
      padding: 3, boxSizing: 'border-box',
      display: 'flex', alignItems: 'center',
      justifyContent: on ? 'flex-end' : 'flex-start',
      boxShadow: on ? 'inset 0 1px 2px rgba(192,74,126,0.18)' : 'inset 0 1px 2px rgba(60,40,90,0.08)',
      transition: 'all 200ms ease',
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: 999, background: '#fff',
        boxShadow: '0 1px 3px rgba(60,40,90,0.25)',
      }}/>
    </div>
  );
}

function ActionRow({ icon, label, destructive }) {
  return (
    <div style={{
      padding: '14px 18px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{
          fontSize: 13,
          fontWeight: destructive ? 700 : 600,
          color: destructive ? '#C04A7E' : '#3D2C5F',
        }}>{label}</span>
      </div>
      <svg width="8" height="13" viewBox="0 0 8 13">
        <path d="M1.5 1.5L6.5 6.5L1.5 11.5" fill="none"
          stroke={destructive ? '#C04A7E' : '#B7AAD0'} strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

Object.assign(window, { ProfileCScreen });
