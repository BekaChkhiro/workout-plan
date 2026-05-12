"use client";

import { useRef, useTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { uploadProgressPhotoAction } from "@/app/(app)/progress/actions";
import type { ProgressPhotoEntry } from "@/db/queries";

const MONTHS_KA_SHORT = [
  "იან",
  "თებ",
  "მარ",
  "აპრ",
  "მაი",
  "ივნ",
  "ივლ",
  "აგვ",
  "სექ",
  "ოქტ",
  "ნოე",
  "დეკ",
] as const;

type Props = {
  photos: ProgressPhotoEntry[];
};

export function PhotosTab({ photos }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [lightboxPhoto, setLightboxPhoto] = useState<ProgressPhotoEntry | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    const formData = new FormData();
    formData.append("photo", file);
    startTransition(async () => {
      try {
        await uploadProgressPhotoAction(formData);
        router.refresh();
      } catch {
        setUploadError("ატვირთვა ვერ მოხერხდა. სცადეთ თავიდან.");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    });
  }

  return (
    <div className="flex flex-col gap-4 px-5">
      <div className="flex items-center justify-between">
        <h2 className="text-h2 text-ink font-bold">📒 ბოლო ფოტოები</h2>
        {photos.length > 0 && (
          <span className="text-caption text-ink-soft">{photos.length} ფოტო</span>
        )}
      </div>

      {photos.length === 0 ? (
        <p className="text-body text-ink-soft py-8 text-center">
          ჯერ ფოტო არ გაქვს — დაამატე პირველი!
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-1.5">
          {photos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setLightboxPhoto(photo)}
              className="aspect-square overflow-hidden rounded-md"
              aria-label="ფოტოს ნახვა"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.blobUrl}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {uploadError && <p className="text-caption text-center text-red-400">{uploadError}</p>}

      {/* Hidden file input — no `capture` so iOS shows camera+library picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* FAB */}
      <button
        type="button"
        disabled={isPending}
        onClick={() => fileInputRef.current?.click()}
        className="rounded-pill mt-1 w-full py-4 text-[14.5px] font-bold text-white disabled:opacity-60"
        style={{
          background: "var(--gradient-brand)",
          boxShadow: "0 12px 32px rgba(255,158,197,0.28), 0 4px 12px rgba(201,168,232,0.18)",
        }}
      >
        {isPending ? "იტვირთება..." : "📸 + ფოტო"}
      </button>

      {lightboxPhoto && (
        <PhotoLightbox photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
      )}
    </div>
  );
}

function PhotoLightbox({ photo, onClose }: { photo: ProgressPhotoEntry; onClose: () => void }) {
  const takenAt = new Date(photo.takenAt);
  const day = takenAt.getDate();
  const month = MONTHS_KA_SHORT[takenAt.getMonth()] ?? "";
  const year = takenAt.getFullYear();

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black"
      role="dialog"
      aria-modal="true"
      aria-label="ფოტოს ნახვა"
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="დახურვა"
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path d="M2 2l14 14M16 2L2 16" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Image */}
      <div className="flex flex-1 items-center justify-center" onClick={onClose} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.blobUrl}
          alt=""
          className="max-h-full max-w-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Week + date overlay */}
      <div
        className="px-5 pb-4"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
      >
        <div className="rounded-[16px] px-5 py-3" style={{ background: "rgba(0,0,0,0.65)" }}>
          <p
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            კვირა {photo.week}
          </p>
          <p className="text-h2 font-bold text-white">
            {day} {month} {year}
          </p>
        </div>
      </div>
    </div>
  );
}
