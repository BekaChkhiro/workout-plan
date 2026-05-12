"use client";

import dynamic from "next/dynamic";

const OnboardingOverlay = dynamic(
  () =>
    import("@/components/onboarding/OnboardingOverlay").then((m) => ({
      default: m.OnboardingOverlay,
    })),
  { ssr: false },
);

export function OnboardingOverlayClient() {
  return <OnboardingOverlay />;
}
