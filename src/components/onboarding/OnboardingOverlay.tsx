"use client";

import { useEffect, useState } from "react";
import { OnboardingFlow } from "./OnboardingFlow";

const KEY = "fitplan_onb_done";

// Loaded via dynamic({ ssr: false }) in layout — localStorage is always available here.
export function OnboardingOverlay() {
  const [done, setDone] = useState(() => localStorage.getItem(KEY) === "1");

  useEffect(() => {
    const restart = () => {
      localStorage.removeItem(KEY);
      setDone(false);
    };
    window.addEventListener("fitplan:onboarding-restart", restart);
    return () => window.removeEventListener("fitplan:onboarding-restart", restart);
  }, []);

  if (done) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        overflowY: "auto",
        background: "linear-gradient(180deg, #F4E5FA 0%, #FCE4EC 100%)",
      }}
    >
      <OnboardingFlow
        onDone={() => {
          localStorage.setItem(KEY, "1");
          setDone(true);
        }}
      />
    </div>
  );
}
