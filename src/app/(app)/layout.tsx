import type { ReactNode } from "react";
import dynamic from "next/dynamic";

import { BgBlobs } from "@/components/BgBlobs";
import { BottomNav } from "@/components/BottomNav";
import { MobileShell } from "@/components/MobileShell";

const OnboardingOverlay = dynamic(
  () =>
    import("@/components/onboarding/OnboardingOverlay").then((m) => ({
      default: m.OnboardingOverlay,
    })),
  { ssr: false },
);

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <MobileShell>
      <BgBlobs />
      <main
        className="relative z-1 flex flex-1 flex-col"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 96px)" }}
      >
        {children}
      </main>
      <BottomNav />
      <OnboardingOverlay />
    </MobileShell>
  );
}
