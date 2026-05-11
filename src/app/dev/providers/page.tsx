"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState } from "react";

import { useUIStore } from "@/stores/ui-store";

async function fetchPing(): Promise<{ ok: true; at: string }> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { ok: true, at: new Date().toISOString() };
}

export default function ProvidersDevPage() {
  const [toggled, setToggled] = useState(false);
  const isNavOpen = useUIStore((s) => s.isNavOpen);
  const toggleNav = useUIStore((s) => s.toggleNav);

  const ping = useQuery({
    queryKey: ["dev", "ping"],
    queryFn: fetchPing,
  });

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-10 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-[--color-ink]">/dev/providers</h1>
        <p className="text-sm text-[--color-ink-soft]">
          TanStack Query + Zustand + Framer Motion smoke test.
        </p>
      </header>

      <section className="flex flex-col gap-3 rounded-2xl bg-white/70 p-5 shadow-sm">
        <h2 className="text-lg font-medium text-[--color-ink]">Framer Motion spring</h2>
        <p className="text-sm text-[--color-ink-soft]">
          Tap the button — the box slides on a spring. Respects
          <code className="ml-1 rounded bg-black/5 px-1">prefers-reduced-motion</code> via{" "}
          <code>MotionConfig reducedMotion=&quot;user&quot;</code>.
        </p>
        <div className="relative h-20 overflow-hidden rounded-xl bg-[--color-surface-2]">
          <motion.div
            animate={{ x: toggled ? 240 : 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="absolute top-1/2 left-4 size-12 -translate-y-1/2 rounded-xl bg-[--color-brand]"
          />
        </div>
        <button
          type="button"
          onClick={() => setToggled((v) => !v)}
          className="self-start rounded-full bg-[--color-ink] px-4 py-2 text-sm font-medium text-white"
        >
          Toggle motion
        </button>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl bg-white/70 p-5 shadow-sm">
        <h2 className="text-lg font-medium text-[--color-ink]">TanStack Query</h2>
        <p className="text-sm text-[--color-ink-soft]">
          Devtools button is in the bottom-left corner of the viewport.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-black/5 p-3 text-xs">
          {JSON.stringify(
            {
              status: ping.status,
              fetchStatus: ping.fetchStatus,
              data: ping.data ?? null,
            },
            null,
            2,
          )}
        </pre>
        <button
          type="button"
          onClick={() => ping.refetch()}
          className="self-start rounded-full bg-[--color-ink] px-4 py-2 text-sm font-medium text-white"
        >
          Refetch
        </button>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl bg-white/70 p-5 shadow-sm">
        <h2 className="text-lg font-medium text-[--color-ink]">Zustand useUIStore</h2>
        <p className="text-sm text-[--color-ink-soft]">
          isNavOpen: <strong className="text-[--color-ink]">{String(isNavOpen)}</strong>
        </p>
        <button
          type="button"
          onClick={toggleNav}
          className="self-start rounded-full bg-[--color-ink] px-4 py-2 text-sm font-medium text-white"
        >
          Toggle nav
        </button>
      </section>
    </main>
  );
}
