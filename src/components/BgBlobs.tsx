import type { CSSProperties } from "react";

type BlobColor = "yellow" | "mint" | "lilac";

type Blob = {
  color: BlobColor;
  size: number;
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
};

const BLOB_VAR: Record<BlobColor, string> = {
  yellow: "var(--blob-yellow)",
  mint: "var(--blob-mint)",
  lilac: "var(--blob-lilac)",
};

const defaultBlobs: Blob[] = [
  { color: "yellow", size: 220, top: 0, right: -60 },
  { color: "mint", size: 240, top: 380, left: -80 },
  { color: "lilac", size: 260, bottom: -80, right: -60 },
];

type BgBlobsProps = {
  blobs?: Blob[];
};

export function BgBlobs({ blobs = defaultBlobs }: BgBlobsProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {blobs.map((blob, i) => {
        const style: CSSProperties = {
          position: "absolute",
          width: blob.size,
          height: blob.size,
          borderRadius: "9999px",
          background: BLOB_VAR[blob.color],
          top: blob.top,
          bottom: blob.bottom,
          left: blob.left,
          right: blob.right,
        };
        return <div key={i} style={style} />;
      })}
    </div>
  );
}
