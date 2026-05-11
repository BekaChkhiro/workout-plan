// Meal Editor + Workout Editor — bottom-sheet modals over a peek of the parent screen.

function SheetBackdrop({ children, peek }) {
  return (
    <div className="style-c" style={{
      minHeight: '100%', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(180deg, #F4E5FA 0%, #FCE4EC 100%)',
    }}>
      {/* Parent peek — faux blurred glimpse */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 160,
        filter: 'blur(6px)', opacity: 0.65,
        paddingTop: 54, paddingLeft: 22, paddingRight: 22,
      }}>
        {peek}
      </div>
      {/* Dim overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 160,
        background: 'rgba(60,30,90,0.35)',
      }}/>

      {/* Sheet */}
      <div style={{
        position: 'absolute', top: 110, left: 0, right: 0, bottom: 0,
        background: '#FFFFFF',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        boxShadow: '0 -8px 32px rgba(60,30,90,0.18)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Grab handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8, paddingBottom: 4 }}>
          <div style={{ width: 40, height: 4, borderRadius: 99, background: '#E8DFF7' }}/>
        </div>
        {children}
      </div>
    </div>
  );
}

function SheetHeader({ title, caption, onClose = true }) {
  return (
    <div style={{ padding: '12px 22px 14px', borderBottom: '1px solid #F4ECFA' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.15 }}>{title}</div>
        <button style={{
          width: 32, height: 32, borderRadius: 999,
          background: '#F4ECFA', border: 'none',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: '#5A3A8B', fontWeight: 800, fontSize: 14,
        }}>✕</button>
      </div>
      {caption && (
        <div style={{ fontSize: 11.5, fontWeight: 500, color: '#7B6A9B', marginTop: 4 }}>{caption}</div>
      )}
    </div>
  );
}

function SubLabel({ children, right }) {
  return (
    <div style={{
      margin: '18px 22px 8px',
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
    }}>
      <div style={{
        fontSize: 10.5, fontWeight: 700, color: '#7B4FA8',
        letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>{children}</div>
      {right}
    </div>
  );
}

function Card({ children, padding = 0 }) {
  return (
    <div style={{
      margin: '0 18px', padding,
      background: '#FFFFFF', borderRadius: 20,
      boxShadow: '0 2px 8px rgba(201,168,232,0.10)',
      border: '1px solid #F4ECFA',
      overflow: 'hidden',
    }}>
      {React.Children.map(children, (child, i) => (
        <React.Fragment>
          {i > 0 && <div style={{ height: 1, background: '#F4ECFA', margin: '0 18px' }}/>}
          {child}
        </React.Fragment>
      ))}
    </div>
  );
}

function FieldRow({ label, right, children, footer }) {
  return (
    <div style={{ padding: '14px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#3D2C5F' }}>{label}</div>
        {right}
      </div>
      {children}
      {footer && (
        <div style={{ fontSize: 11, fontWeight: 500, color: '#7B6A9B', marginTop: 4 }}>{footer}</div>
      )}
    </div>
  );
}

function PillSelect({ value }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '6px 12px', borderRadius: 999,
      background: '#F4ECFA',
      fontSize: 12, fontWeight: 700, color: '#3D2C5F',
    }}>
      {value}
      <svg width="9" height="6" viewBox="0 0 9 6"><path d="M1 1l3.5 3.5L8 1" fill="none" stroke="#7B4FA8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </span>
  );
}

function TextInput({ value, placeholder, height = 48, multiline, lines = 3 }) {
  return (
    <div style={{
      marginTop: 6,
      height: multiline ? undefined : height,
      minHeight: multiline ? lines * 18 + 24 : undefined,
      borderRadius: 14,
      background: '#F4ECFA',
      padding: '12px 14px',
      fontSize: 13, fontWeight: multiline ? 500 : 600,
      color: value ? '#3D2C5F' : '#9785B5',
      display: 'flex', alignItems: multiline ? 'flex-start' : 'center',
      lineHeight: 1.45,
    }}>{value || placeholder}</div>
  );
}

function Segmented({ items, fullWidth }) {
  return (
    <div style={{
      display: 'flex', gap: 2, padding: 3,
      background: '#F8F2FB', borderRadius: 999,
      width: fullWidth ? '100%' : undefined,
    }}>
      {items.map(it => (
        <div key={it.label} style={{
          flex: fullWidth ? 1 : undefined,
          textAlign: 'center',
          padding: '5px 10px', borderRadius: 999,
          fontSize: 10.5, fontWeight: 700,
          background: it.active ? 'linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)' : 'transparent',
          color: it.active ? '#fff' : '#9785B5',
          boxShadow: it.active ? '0 2px 6px rgba(255,158,197,0.4)' : 'none',
          whiteSpace: 'nowrap',
        }}>{it.label}</div>
      ))}
    </div>
  );
}

function StickyFooter({ children }) {
  return (
    <div style={{
      borderTop: '1px solid #F4ECFA',
      padding: '14px 22px 22px',
      background: '#FFFFFF',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>{children}</div>
  );
}

// ============ Meal Editor ============

function MealEditorScreen() {
  const peek = (
    <div>
      <div style={{ fontSize: 24, fontWeight: 800, color: '#3D2C5F' }}>
        კვება 🍽
      </div>
      <div style={{ marginTop: 10, height: 50, borderRadius: 20, background: 'rgba(255,255,255,0.8)' }}/>
    </div>
  );

  return (
    <SheetBackdrop peek={peek}>
      <SheetHeader
        title="სადილის რედაქტირება"
        caption="შენი ცვლილებები ავტომატურად შენახდება"
      />

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 4 }}>

        <SubLabel>🍽 ძირითადი</SubLabel>
        <Card>
          <FieldRow label="დრო" right={<PillSelect value="15:00"/>}/>
          <div style={{ padding: '14px 18px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#3D2C5F' }}>კვების სახელი</div>
            <TextInput value="სადილი — ქათამი + ბრინჯი"/>
          </div>
          <FieldRow label="დღის ტიპი" right={
            <Segmented items={[
              { label: '💪 ვარჯიშის' },
              { label: '😴 დასვენების' },
              { label: 'ორივე', active: true },
            ]}/>
          }/>
        </Card>

        <SubLabel right={
          <button style={{
            background: 'transparent', border: 'none', padding: 0,
            fontSize: 11.5, fontWeight: 700, color: '#7B4FA8',
          }}>+ დამატება</button>
        }>🧾 ინგრედიენტები</SubLabel>
        <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { name: 'გამომცხვარი ქათმის მკერდი', amount: '150 გრ' },
            { name: 'ბოსტნეული (ბროკოლი, კაბახი)', amount: '200 გრ' },
            { name: 'ყავისფერი ბრინჯი', amount: '3 ს.კ.' },
          ].map((ing, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 14px', borderRadius: 14,
              background: '#FFFFFF',
              boxShadow: '0 1px 4px rgba(201,168,232,0.10)',
              border: '1px solid #F4ECFA',
            }}>
              <span style={{ color: '#B7AAD0', fontSize: 14, fontWeight: 800, letterSpacing: '-0.06em' }}>⋮⋮</span>
              <div style={{
                flex: 1, fontSize: 13, fontWeight: 600, color: '#3D2C5F',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{ing.name}</div>
              <div style={{
                width: 64, height: 28, borderRadius: 10,
                background: '#F4ECFA',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: '#3D2C5F',
              }}>{ing.amount}</div>
              <span style={{ color: '#B7AAD0', fontSize: 12, fontWeight: 700 }}>✕</span>
            </div>
          ))}
        </div>

        <SubLabel>📊 კალორია და მაკრო</SubLabel>
        <Card>
          <FieldRow label="კალორია" right={
            <span style={{ fontSize: 13, fontWeight: 700, color: '#3D2C5F',
              padding: '5px 12px', borderRadius: 10, background: '#F4ECFA' }}>330 კკალ</span>
          }/>
          <FieldRow label="ცილა" right={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: '#7DDFA8' }}/>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#3D2C5F',
                padding: '5px 12px', borderRadius: 10, background: '#F4ECFA' }}>38 გ</span>
            </span>
          }/>
          <FieldRow label="ნახშირწყლები" right={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: '#FFD66B' }}/>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#3D2C5F',
                padding: '5px 12px', borderRadius: 10, background: '#F4ECFA' }}>32 გ</span>
            </span>
          }/>
          <FieldRow label="ცხიმი" right={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: '#FF9EC5' }}/>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#3D2C5F',
                padding: '5px 12px', borderRadius: 10, background: '#F4ECFA' }}>9 გ</span>
            </span>
          }/>
        </Card>
        <div style={{ margin: '8px 22px 0', fontSize: 11, fontWeight: 500, color: '#7B6A9B' }}>
          ჯამი ნაგულისხმევია — შენ შეგიძლია ხელით შეცვალო
        </div>

        <SubLabel>🔄 შემცვლელები</SubLabel>
        <div style={{ padding: '0 18px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {[
            '🐟 თევზი (150გ)',
            '🦃 ინდაური (150გ)',
            '🍠 ბატატი (100გ)',
            '🥬 მეტი სალათი',
          ].map(c => (
            <span key={c} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11.5, fontWeight: 600, color: '#3D2C5F',
              background: '#FFFFFF',
              border: '1px solid #F4ECFA',
              borderRadius: 999, padding: '6px 11px',
            }}>
              {c}
              <span style={{ color: '#B7AAD0' }}>✕</span>
            </span>
          ))}
          <span style={{
            fontSize: 11.5, fontWeight: 700, color: '#7B4FA8',
            border: '1.5px dashed #C9A8E8',
            background: 'transparent',
            borderRadius: 999, padding: '5px 11px',
          }}>+ ახალი</span>
        </div>

        <SubLabel>📝 შენიშვნა</SubLabel>
        <div style={{ padding: '0 18px 22px' }}>
          <TextInput multiline lines={3} placeholder="მაგ. ვარჯიშამდე 3 სთ-ით ადრე..."/>
        </div>
      </div>

      <StickyFooter>
        <button style={{
          background: 'transparent', border: 'none', padding: '10px 8px',
          fontSize: 13, fontWeight: 700, color: '#7B6A9B',
        }}>გაუქმება</button>
        <div style={{ flex: 1 }}/>
        <button style={{
          background: 'linear-gradient(135deg, #C9A8E8 0%, #FF9EC5 100%)',
          color: '#fff', border: 'none',
          padding: '12px 24px', borderRadius: 999,
          fontFamily: 'DM Sans, "Noto Sans Georgian", sans-serif',
          fontSize: 14, fontWeight: 800,
          boxShadow: '0 6px 18px rgba(255,158,197,0.4)',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>შენახვა ✓</button>
      </StickyFooter>
    </SheetBackdrop>
  );
}

// ============ Workout Editor ============

function WorkoutEditorScreen() {
  const peek = (
    <div>
      <div style={{ fontSize: 24, fontWeight: 800, color: '#3D2C5F' }}>
        გეგმა 📅
      </div>
      <div style={{ marginTop: 10, height: 50, borderRadius: 20, background: 'rgba(255,255,255,0.8)' }}/>
    </div>
  );

  const days = ['ო', 'სა', 'ოთხ', 'ხუ', 'პა', 'შა', 'კვ'];

  return (
    <SheetBackdrop peek={peek}>
      <SheetHeader
        title="ვარჯიშის რედაქტირება"
        caption="ოთხშაბათი · კვირა 2"
      />

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 4 }}>

        <SubLabel>💪 ძირითადი</SubLabel>
        <Card>
          <div style={{ padding: '14px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#3D2C5F' }}>ტიპი</div>
              <PillSelect value="🧘 პილატესი"/>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[
                { label: '🧘 პილატესი', active: true },
                { label: '🏃 კარდიო' },
                { label: '🔥 კომბო' },
                { label: '😴 დასვენება' },
              ].map(opt => (
                <span key={opt.label} style={{
                  fontSize: 11.5, fontWeight: 700,
                  padding: '6px 12px', borderRadius: 999,
                  background: opt.active ? 'linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)' : '#FFFFFF',
                  color: opt.active ? '#fff' : '#3D2C5F',
                  border: opt.active ? 'none' : '1px solid #F4ECFA',
                  boxShadow: opt.active ? '0 2px 6px rgba(255,158,197,0.35)' : 'none',
                }}>{opt.label}</span>
              ))}
            </div>
          </div>
          <div style={{ padding: '14px 18px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#3D2C5F' }}>ფოკუსი</div>
            <TextInput value="მკლავები + გვერდები"/>
          </div>
          <div style={{ padding: '14px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#3D2C5F' }}>დღე</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {days.map(d => {
                  const active = d === 'ოთხ';
                  return (
                    <div key={d} style={{
                      minWidth: 26, height: 26, padding: '0 4px',
                      borderRadius: 8,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: active ? 'linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)' : '#F4ECFA',
                      color: active ? '#fff' : '#9785B5',
                      fontSize: 10, fontWeight: 800,
                      boxShadow: active ? '0 2px 6px rgba(255,158,197,0.4)' : 'none',
                    }}>{d}</div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        <SubLabel>⏱ დრო და ინტენსიობა</SubLabel>
        <Card>
          <FieldRow label="ხანგრძლივობა" right={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 24, height: 24, borderRadius: 999,
                background: '#F4ECFA',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, color: '#7B4FA8', fontSize: 14,
              }}>−</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#3D2C5F', minWidth: 50, textAlign: 'center' }}>45 წთ</span>
              <span style={{
                width: 24, height: 24, borderRadius: 999,
                background: 'linear-gradient(135deg, #C9A8E8 0%, #FF9EC5 100%)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, color: '#fff', fontSize: 14,
                boxShadow: '0 2px 5px rgba(255,158,197,0.4)',
              }}>+</span>
            </span>
          }/>
          <FieldRow label="დროის ფანჯარა" right={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#3D2C5F',
                padding: '5px 11px', borderRadius: 10, background: '#F4ECFA' }}>18:30</span>
              <span style={{ color: '#B7AAD0', fontSize: 13 }}>→</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#3D2C5F',
                padding: '5px 11px', borderRadius: 10, background: '#F4ECFA' }}>19:30</span>
            </span>
          }/>
          <div style={{ padding: '14px 18px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#3D2C5F', marginBottom: 10 }}>ინტენსიობა</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[
                { label: '🌿 მსუბუქი', bg: '#E7F8EE', color: '#2E8B57' },
                { label: '⚡ საშუალო', active: true },
                { label: '🔥 ძლიერი', bg: '#FFF5DA', color: '#A47000' },
                { label: '💥 მძიმე',  bg: '#FFE6F0', color: '#C04A7E' },
              ].map(opt => (
                <span key={opt.label} style={{
                  fontSize: 11.5, fontWeight: 700,
                  padding: '6px 12px', borderRadius: 999,
                  background: opt.active
                    ? 'linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)'
                    : opt.bg || '#FFFFFF',
                  color: opt.active ? '#fff' : (opt.color || '#3D2C5F'),
                  border: opt.active || opt.bg ? 'none' : '1px solid #F4ECFA',
                  boxShadow: opt.active ? '0 2px 6px rgba(255,158,197,0.35)' : 'none',
                }}>{opt.label}</span>
              ))}
            </div>
          </div>
        </Card>

        <SubLabel>📝 აღწერა</SubLabel>
        <div style={{ padding: '0 18px' }}>
          <TextInput multiline lines={2} value={"YouTube პილატესი — სხვა ვიდეო\nფოკუსი: მკლავები + გვერდები"}/>
        </div>

        <SubLabel>🎥 ვიდეო ბმული — სურვილისამებრ</SubLabel>
        <div style={{ padding: '0 18px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            height: 48, borderRadius: 14,
            background: '#F4ECFA',
            padding: '0 14px',
          }}>
            <span style={{ fontSize: 14 }}>🔗</span>
            <div style={{ fontSize: 13, color: '#9785B5', fontWeight: 500 }}>youtube.com/...</div>
          </div>
        </div>

        <SubLabel>🔔 შეხსენება</SubLabel>
        <Card>
          <FieldRow label="შემახსენე 30 წთ-ით ადრე" right={<IOSSwitch on/>}/>
        </Card>

        <div style={{ height: 22 }}/>
      </div>

      <StickyFooter>
        <button style={{
          background: 'transparent', border: 'none', padding: '10px 4px',
          fontSize: 13, fontWeight: 700, color: '#7B6A9B',
        }}>გაუქმება</button>
        <button style={{
          background: 'transparent', border: 'none', padding: '10px 4px',
          fontSize: 12, fontWeight: 700, color: '#7B4FA8',
          flex: 1, textAlign: 'center',
        }}>ნაგულისხმევზე დაბრუნება</button>
        <button style={{
          background: 'linear-gradient(135deg, #C9A8E8 0%, #FF9EC5 100%)',
          color: '#fff', border: 'none',
          padding: '12px 22px', borderRadius: 999,
          fontFamily: 'DM Sans, "Noto Sans Georgian", sans-serif',
          fontSize: 14, fontWeight: 800,
          boxShadow: '0 6px 18px rgba(255,158,197,0.4)',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>შენახვა ✓</button>
      </StickyFooter>
    </SheetBackdrop>
  );
}

Object.assign(window, { MealEditorScreen, WorkoutEditorScreen });
