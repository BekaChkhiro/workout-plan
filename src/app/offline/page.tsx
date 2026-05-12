import { BgBlobs } from "@/components/BgBlobs";
import { MobileShell } from "@/components/MobileShell";

import { RetryButton } from "./RetryButton";

export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <MobileShell>
      <BgBlobs />
      <div className="relative z-1 flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <span className="text-5xl" aria-hidden="true">
          📶
        </span>
        <div>
          <h1 className="text-ink text-xl font-bold">ინტერნეტი არ არის</h1>
          <p className="text-ink-soft mt-2 text-sm">
            შეამოწმე კავშირი და სცადე თავიდან.
          </p>
        </div>
        <RetryButton />
      </div>
    </MobileShell>
  );
}
