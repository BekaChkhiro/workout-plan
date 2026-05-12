"use client";

import { useCallback, useEffect, useState } from "react";

export type PushPermission = "unsupported" | "prompt" | "denied" | "granted";

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    output[i] = rawData.charCodeAt(i);
  }
  return output;
}

function readBrowserPermission(): PushPermission {
  if (typeof window === "undefined" || !("Notification" in window)) return "prompt";
  const p = Notification.permission;
  if (p === "granted") return "granted";
  if (p === "denied") return "denied";
  return "prompt";
}

export function usePushSubscription() {
  const [permission, setPermission] = useState<PushPermission>(readBrowserPermission);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.ready.then((reg) => {
      void reg.pushManager.getSubscription().then((sub) => setSubscription(sub));
    });
  }, []);

  const subscribe = useCallback(async (): Promise<PushSubscription> => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      throw new Error("Push not supported in this browser");
    }

    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) throw new Error("NEXT_PUBLIC_VAPID_PUBLIC_KEY is not configured");

    setLoading(true);
    try {
      const perm = await Notification.requestPermission();
      const normalized: PushPermission =
        perm === "granted" ? "granted" : perm === "denied" ? "denied" : "prompt";
      setPermission(normalized);
      if (perm !== "granted") throw new Error("Notification permission denied");

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      const json = sub.toJSON();
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: json.endpoint,
          p256dh: json.keys?.p256dh,
          auth: json.keys?.auth,
        }),
      });
      if (!res.ok) throw new Error("Failed to save subscription on server");

      setSubscription(sub);
      return sub;
    } finally {
      setLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async (): Promise<void> => {
    if (!subscription) return;
    setLoading(true);
    try {
      const endpoint = subscription.endpoint;
      await subscription.unsubscribe();
      await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint }),
      });
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  }, [subscription]);

  return { permission, subscription, loading, subscribe, unsubscribe };
}
