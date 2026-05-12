"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateWorkoutAction } from "@/app/(app)/_actions/workout";
import type { Workout } from "@/db/schema";

const WEEKDAY_LABELS = ["ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ", "კვი"] as const;

const TYPE_OPTIONS = [
  { value: "pilates", label: "🧘 პილატესი" },
  { value: "cardio", label: "🏃 კარდიო" },
  { value: "combo", label: "🔥 კომბო" },
  { value: "rest", label: "😴 დასვენება" },
] as const;

const INTENSITY_OPTIONS = [
  { value: "light", label: "🌿 მსუბუქი", activeBg: "#7DDFA8", activeColor: "#2E6B47" },
  {
    value: "medium",
    label: "⚡ საშუალო",
    activeBg: "linear-gradient(135deg,#FFD66B 0%,#FF9EC5 100%)",
    activeColor: "#fff",
  },
  {
    value: "strong",
    label: "🔥 ძლიერი",
    activeBg: "linear-gradient(135deg,#C9A8E8 0%,#FF9EC5 100%)",
    activeColor: "#fff",
  },
  {
    value: "heavy",
    label: "💥 მძიმე",
    activeBg: "#FF9EC5",
    activeColor: "#fff",
  },
] as const;

type FormState = {
  type: Workout["type"];
  title: string;
  focus: string;
  durationMin: number;
  intensity: Workout["intensity"];
  timeStart: string;
  timeEnd: string;
  videoUrl: string;
  description: string;
  reminderEnabled: boolean;
};

function initForm(workout: Workout): FormState {
  return {
    type: workout.type,
    title: workout.title,
    focus: workout.focus ?? "",
    durationMin: workout.durationMin ?? 30,
    intensity: workout.intensity,
    timeStart: workout.timeStart ?? "",
    timeEnd: workout.timeEnd ?? "",
    videoUrl: workout.videoUrl ?? "",
    description: workout.description ?? "",
    reminderEnabled: false,
  };
}

type Props = {
  workout: Workout;
  weekLabel: string;
  onClose: () => void;
};

export function WorkoutEditorSheet({ workout, weekLabel, onClose }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>(() => initForm(workout));

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    startTransition(async () => {
      await updateWorkoutAction(workout.id, {
        type: form.type,
        title: form.title,
        focus: form.focus || null,
        durationMin: form.durationMin || null,
        intensity: form.intensity,
        timeStart: form.timeStart || null,
        timeEnd: form.timeEnd || null,
        videoUrl: form.videoUrl || null,
        description: form.description || null,
      });
      router.refresh();
      onClose();
    });
  }

  function handleReset() {
    setForm(initForm(workout));
  }

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-40"
        style={{ background: "rgba(60,30,90,0.35)", backdropFilter: "blur(8px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />

      {/* Sheet panel */}
      <motion.div
        key="sheet"
        className="fixed right-0 bottom-0 left-0 z-50 flex flex-col rounded-t-[28px] bg-white"
        style={{
          top: 110,
          boxShadow: "0 -8px 32px rgba(60,30,90,0.18)",
        }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 350 }}
      >
        {/* Grab handle */}
        <div className="flex flex-none justify-center pt-2.5 pb-1">
          <div className="h-1 w-10 rounded-full" style={{ background: "#E8DFF7" }} />
        </div>

        {/* Header */}
        <div className="flex-none px-[22px] pt-4 pb-3">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-[19px] leading-tight font-extrabold text-[#3D2C5F]">
              ვარჯიშის რედაქტირება
            </h2>
            <button
              type="button"
              aria-label="დახურვა"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#7B4FA8]"
              style={{ background: "rgba(244,236,250,0.9)", backdropFilter: "blur(6px)" }}
            >
              ✕
            </button>
          </div>
          <p className="text-[11.5px] font-medium text-[#7B6A9B]">{weekLabel}</p>
        </div>

        {/* Scrollable form */}
        <div className="min-h-0 flex-1 overflow-y-auto px-[22px] pb-4">
          {/* Section: ძირითადი */}
          <SectionLabel>💪 ძირითადი</SectionLabel>
          <FormCard>
            {/* Type */}
            <CardRow label="ტიპი">
              <div className="flex flex-wrap gap-1.5">
                {TYPE_OPTIONS.map((opt) => {
                  const active = form.type === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => set("type", opt.value)}
                      className="rounded-full px-2.5 py-1 text-[11.5px] font-semibold transition-all"
                      style={{
                        background: active
                          ? "linear-gradient(135deg,#FFD66B 0%,#FF9EC5 100%)"
                          : "#F4ECFA",
                        color: active ? "#fff" : "#5A4275",
                        boxShadow: active ? "0 2px 8px rgba(255,158,197,0.35)" : "none",
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </CardRow>

            <CardDivider />

            {/* Title */}
            <CardRow label="სათაური">
              <input
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className="w-full rounded-[14px] px-3.5 py-2.5 text-[13px] font-semibold text-[#3D2C5F] outline-none focus:ring-2 focus:ring-[#C9A8E8]"
                style={{ background: "#F4ECFA", height: 44 }}
              />
            </CardRow>

            <CardDivider />

            {/* Focus */}
            <CardRow label="ფოკუსი">
              <input
                type="text"
                value={form.focus}
                onChange={(e) => set("focus", e.target.value)}
                placeholder="მაგ. მკლავები + გვერდები"
                className="w-full rounded-[14px] px-3.5 py-2.5 text-[13px] font-semibold text-[#3D2C5F] outline-none focus:ring-2 focus:ring-[#C9A8E8]"
                style={{ background: "#F4ECFA", height: 44 }}
              />
            </CardRow>

            <CardDivider />

            {/* Weekday display */}
            <CardRow label="დღე">
              <div className="flex gap-[4px]">
                {WEEKDAY_LABELS.map((label, idx) => {
                  const active = idx === workout.weekday;
                  return (
                    <div
                      key={idx}
                      className="flex h-[26px] w-[26px] items-center justify-center rounded-md text-[9.5px] font-bold"
                      style={{
                        background: active
                          ? "linear-gradient(135deg,#FFD66B 0%,#FF9EC5 100%)"
                          : "transparent",
                        color: active ? "#fff" : "#B7AAD0",
                      }}
                    >
                      {label}
                    </div>
                  );
                })}
              </div>
            </CardRow>
          </FormCard>

          {/* Section: დრო და ინტენსიობა */}
          <SectionLabel>⏱ დრო და ინტენსიობა</SectionLabel>
          <FormCard>
            {/* Duration stepper */}
            <CardRow label="ხანგრძლივობა">
              <div className="flex items-center gap-2">
                <StepperButton
                  onClick={() => set("durationMin", Math.max(5, form.durationMin - 5))}
                >
                  −
                </StepperButton>
                <span className="min-w-[52px] text-center text-[13px] font-bold text-[#3D2C5F]">
                  {form.durationMin} წთ
                </span>
                <StepperButton
                  onClick={() => set("durationMin", Math.min(180, form.durationMin + 5))}
                >
                  +
                </StepperButton>
              </div>
            </CardRow>

            <CardDivider />

            {/* Time window */}
            <CardRow label="დროის ფანჯარა">
              <div className="flex items-center gap-1.5">
                <TimeInput
                  value={form.timeStart}
                  onChange={(v) => set("timeStart", v)}
                  placeholder="00:00"
                />
                <span className="text-[11px] font-semibold text-[#B7AAD0]">→</span>
                <TimeInput
                  value={form.timeEnd}
                  onChange={(v) => set("timeEnd", v)}
                  placeholder="00:00"
                />
              </div>
            </CardRow>

            <CardDivider />

            {/* Intensity */}
            <CardRow label="ინტენსიობა">
              <div className="flex gap-1">
                {INTENSITY_OPTIONS.map((opt) => {
                  const active = form.intensity === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => set("intensity", opt.value)}
                      className="flex-1 rounded-full px-1.5 py-1.5 text-[10px] font-bold transition-all"
                      style={{
                        background: active ? opt.activeBg : "#F4ECFA",
                        color: active ? opt.activeColor : "#7B6A9B",
                        boxShadow: active ? "0 2px 8px rgba(255,158,197,0.3)" : "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </CardRow>
          </FormCard>

          {/* Section: აღწერა */}
          <SectionLabel>📝 აღწერა</SectionLabel>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="ვარჯიშის აღწერა..."
            rows={3}
            className="w-full rounded-[14px] px-3.5 py-3 text-[12px] font-medium text-[#3D2C5F] outline-none focus:ring-2 focus:ring-[#C9A8E8]"
            style={{ background: "#F4ECFA", resize: "none" }}
          />

          {/* Section: ვიდეო ბმული */}
          <SectionLabel>🎥 ვიდეო ბმული — სურვილისამებრ</SectionLabel>
          <FormCard>
            <div className="flex items-center gap-2 px-3.5 py-3">
              <span className="text-[14px]">🔗</span>
              <input
                type="url"
                value={form.videoUrl}
                onChange={(e) => set("videoUrl", e.target.value)}
                placeholder="youtube.com/..."
                className="flex-1 bg-transparent text-[12px] font-medium text-[#3D2C5F] outline-none"
              />
            </div>
          </FormCard>

          {/* Section: შეხსენება */}
          <SectionLabel>🔔 შეხსენება</SectionLabel>
          <FormCard>
            <div className="flex items-center justify-between px-3.5 py-3">
              <span className="text-[13px] font-semibold text-[#3D2C5F]">
                შემახსენე 30 წთ-ით ადრე
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={form.reminderEnabled}
                onClick={() => set("reminderEnabled", !form.reminderEnabled)}
                className="relative h-[28px] w-[50px] rounded-full transition-all"
                style={{
                  background: form.reminderEnabled
                    ? "linear-gradient(135deg,#FFD66B 0%,#FF9EC5 100%)"
                    : "#E8DFF7",
                  boxShadow: form.reminderEnabled ? "0 2px 8px rgba(255,158,197,0.4)" : "none",
                }}
              >
                <span
                  className="absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white transition-all"
                  style={{
                    left: form.reminderEnabled ? "calc(100% - 25px)" : 3,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                  }}
                />
              </button>
            </div>
          </FormCard>

          <div className="h-2" />
        </div>

        {/* Sticky footer */}
        <div
          className="flex flex-none items-center justify-between px-[22px] py-4"
          style={{ borderTop: "1px solid #F4ECFA" }}
        >
          <button type="button" onClick={onClose} className="text-[13px] font-bold text-[#7B6A9B]">
            გაუქმება
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="text-[12px] font-bold text-[#7B4FA8]"
          >
            ნაგულისხმევზე დაბრუნება
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="rounded-full px-5 py-2.5 text-[14px] font-extrabold text-white transition-opacity disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg,#C9A8E8 0%,#FF9EC5 100%)",
              boxShadow: "0 4px 16px rgba(255,158,197,0.35)",
            }}
          >
            {isPending ? "..." : "შენახვა ✓"}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mt-5 mb-2 text-[10.5px] font-bold tracking-[0.08em] uppercase"
      style={{ color: "#7B4FA8" }}
    >
      {children}
    </p>
  );
}

function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="overflow-hidden rounded-[20px]"
      style={{
        background: "#fff",
        border: "1px solid rgba(244,236,250,0.9)",
        boxShadow: "0 2px 8px rgba(201,168,232,0.10)",
      }}
    >
      {children}
    </div>
  );
}

function CardRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3.5 py-3">
      <span className="shrink-0 text-[13px] font-semibold text-[#3D2C5F]">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function CardDivider() {
  return <div className="mx-3.5 h-px" style={{ background: "#F4ECFA" }} />;
}

function StepperButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-full text-[16px] font-bold text-[#7B4FA8]"
      style={{ background: "#F4ECFA" }}
    >
      {children}
    </button>
  );
}

function TimeInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="rounded-[10px] px-2 py-1.5 text-center text-[12px] font-bold text-[#3D2C5F] outline-none focus:ring-2 focus:ring-[#C9A8E8]"
      style={{ background: "#F4ECFA", width: 72 }}
    />
  );
}
