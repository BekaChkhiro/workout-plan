import { BgBlobs } from "@/components/BgBlobs";
import { MobileShell } from "@/components/MobileShell";

export default function Home() {
  return (
    <MobileShell>
      <BgBlobs />
      <main className="relative z-1 flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="text-display text-ink font-bold">Fit Plan</div>
        <p className="text-body text-ink-soft mt-2">
          მობილური სამუშაო გარემო — გრადიენტი + დეკორაციული ფონები 🌸
        </p>
      </main>
    </MobileShell>
  );
}
