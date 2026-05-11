// App — three artboards side-by-side, each: iPhone mockup + token sheet.

const ART_W = 460;
const PHONE_W = 390;
const PHONE_H = 844;

function Artboard({ Screen, tokens, label }) {
  return (
    <div style={{
      width: ART_W,
      padding: '22px 22px 22px',
      boxSizing: 'border-box',
      background: tokens.theme === 'dark' ? '#0A0A0B' : '#F6F2EC',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22,
    }}>
      {/* Style label */}
      <div style={{
        alignSelf: 'flex-start',
        fontFamily: 'Manrope, sans-serif',
        fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: tokens.theme === 'dark' ? 'rgba(255,255,255,0.7)' : '#8B6F5C',
        padding: '4px 10px', borderRadius: 999,
        background: tokens.theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      }}>{label} — {tokens.accent}</div>

      {/* Phone */}
      <IOSDevice width={PHONE_W} height={PHONE_H} dark={tokens.theme === 'dark'}>
        <Screen />
      </IOSDevice>

      {/* Token sheet */}
      <div style={{ width: '100%' }}>
        <TokenSheet {...tokens} />
      </div>
    </div>
  );
}

function App() {
  return (
    <DesignCanvas>
      <DCSection
        id="fitplan-styles"
        title="Fit Plan — Today screen, three directions"
        subtitle="Same content. Three visual languages. Pick one to lock as the design system."
        gap={56}
      >
        <DCArtboard id="a" label="A · Warm Minimalist" width={ART_W} height={1500}>
          <Artboard Screen={StyleAScreen} tokens={STYLE_A_TOKENS} label="A" />
        </DCArtboard>
        <DCArtboard id="b" label="B · Premium Dark" width={ART_W} height={1500}>
          <Artboard Screen={StyleBScreen} tokens={STYLE_B_TOKENS} label="B" />
        </DCArtboard>
        <DCArtboard id="c" label="C · Soft Pastel Feminine" width={ART_W} height={1500}>
          <Artboard Screen={StyleCScreen} tokens={STYLE_C_TOKENS} label="C" />
        </DCArtboard>
      </DCSection>

      <DCSection
        id="plan-c"
        title="Plan screen — Style C"
        subtitle="Week 2 of 4. Soft Pastel Feminine tokens."
        gap={56}
      >
        <DCArtboard id="plan" label="გეგმა · Week 2" width={PHONE_W + 40} height={PHONE_H + 60}>
          <div style={{
            padding: '22px 20px',
            background: 'linear-gradient(180deg, #F4E5FA 0%, #FCE4EC 100%)',
            display: 'flex', justifyContent: 'center',
          }}>
            <IOSDevice width={PHONE_W} height={PHONE_H} dark={false}>
              <PlanCScreen />
            </IOSDevice>
          </div>
        </DCArtboard>
      </DCSection>

      <DCSection
        id="meals-c"
        title="Meals screen — Style C"
        subtitle="Workout-day rotation. Card #3 (სადილი) expanded inline."
        gap={56}
      >
        <DCArtboard id="meals" label="კვება · ვარჯიშის დღე" width={PHONE_W + 40} height={PHONE_H + 60}>
          <div style={{
            padding: '22px 20px',
            background: 'linear-gradient(180deg, #F4E5FA 0%, #FCE4EC 100%)',
            display: 'flex', justifyContent: 'center',
          }}>
            <IOSDevice width={PHONE_W} height={PHONE_H} dark={false}>
              <MealsCScreen />
            </IOSDevice>
          </div>
        </DCArtboard>
      </DCSection>

      <DCSection
        id="profile-c"
        title="Profile screen — Style C"
        subtitle="Identity + targets, goal, plan timing, notifications, appearance, danger zone."
        gap={56}
      >
        <DCArtboard id="profile" label="პროფილი · ⚙️" width={PHONE_W + 40} height={1700}>
          <div style={{
            padding: '22px 20px',
            background: 'linear-gradient(180deg, #F4E5FA 0%, #FCE4EC 100%)',
            display: 'flex', justifyContent: 'center',
          }}>
            <IOSDevice width={PHONE_W} height={1620} dark={false}>
              <ProfileCScreen />
            </IOSDevice>
          </div>
        </DCArtboard>
      </DCSection>

      <DCSection
        id="progress-c"
        title="Progress screen — Style C"
        subtitle="Weight tab active. −2.7 კგ trend with line chart."
        gap={56}
      >
        <DCArtboard id="progress" label="პროგრესი · წონა" width={PHONE_W + 40} height={PHONE_H + 60}>
          <div style={{
            padding: '22px 20px',
            background: 'linear-gradient(180deg, #F4E5FA 0%, #FCE4EC 100%)',
            display: 'flex', justifyContent: 'center',
          }}>
            <IOSDevice width={PHONE_W} height={PHONE_H} dark={false}>
              <ProgressCScreen />
            </IOSDevice>
          </div>
        </DCArtboard>
      </DCSection>
      <DCSection
        id="auth-c"
        title="Login + Onboarding — Style C"
        subtitle="Entry point and 4-step first-run flow. No bottom nav."
        gap={40}
      >
        {[
          { id: 'login',  label: '1 · Login',           Screen: LoginCScreen },
          { id: 'welcome',label: '2 · Welcome',         Screen: OnbWelcomeScreen },
          { id: 'a2hs',   label: '3 · iOS Add-to-Home', Screen: OnbAddToHomeScreen },
          { id: 'notify', label: '4 · Notifications',   Screen: OnbNotificationsScreen },
          { id: 'ready',  label: '5 · Ready',           Screen: OnbReadyScreen },
        ].map(a => (
          <DCArtboard key={a.id} id={a.id} label={a.label} width={PHONE_W + 40} height={PHONE_H + 60}>
            <div style={{
              padding: '22px 20px',
              background: 'linear-gradient(180deg, #F4E5FA 0%, #FCE4EC 100%)',
              display: 'flex', justifyContent: 'center',
            }}>
              <IOSDevice width={PHONE_W} height={PHONE_H} dark={false}>
                <a.Screen />
              </IOSDevice>
            </div>
          </DCArtboard>
        ))}
      </DCSection>
      <DCSection
        id="editors-c"
        title="Meal + Workout editor sheets"
        subtitle="Bottom-sheet modals over a peek of the parent screen."
        gap={56}
      >
        {[
          { id: 'meal-edit',    label: 'Meal Editor',    Screen: MealEditorScreen },
          { id: 'workout-edit', label: 'Workout Editor', Screen: WorkoutEditorScreen },
        ].map(a => (
          <DCArtboard key={a.id} id={a.id} label={a.label} width={PHONE_W + 40} height={PHONE_H + 60}>
            <div style={{
              padding: '22px 20px',
              background: 'linear-gradient(180deg, #F4E5FA 0%, #FCE4EC 100%)',
              display: 'flex', justifyContent: 'center',
            }}>
              <IOSDevice width={PHONE_W} height={PHONE_H} dark={false}>
                <a.Screen />
              </IOSDevice>
            </div>
          </DCArtboard>
        ))}
      </DCSection>
      <DCSection
        id="rules-c"
        title="Rules / Tips reference — Style C"
        subtitle="Standalone deep-link page. 8 sections · 24 rules."
        gap={40}
      >
        <DCArtboard id="rules" label="წესები · 📖" width={PHONE_W + 40} height={1820}>
          <div style={{
            padding: '22px 20px',
            background: 'linear-gradient(180deg, #F4E5FA 0%, #FCE4EC 100%)',
            display: 'flex', justifyContent: 'center',
          }}>
            <IOSDevice width={PHONE_W} height={1760} dark={false}>
              <RulesCScreen />
            </IOSDevice>
          </div>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
