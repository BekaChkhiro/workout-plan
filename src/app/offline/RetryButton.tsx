"use client";

export function RetryButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="bg-brand-pink text-ink rounded-2xl px-8 py-3 text-sm font-semibold active:scale-95"
    >
      ხელახლა ცდა
    </button>
  );
}
