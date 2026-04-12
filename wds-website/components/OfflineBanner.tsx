"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-[9998] animate-in slide-in-from-bottom-4">
      <Link
        href="/offline"
        className="flex items-center gap-3 p-4 rounded-xl bg-gray-900 border border-amber-500/30 shadow-lg hover:border-amber-400 transition-colors"
      >
        <WifiOff className="w-5 h-5 text-amber-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">You&apos;re offline</p>
          <p className="text-xs text-white/60">
            Tap to view your saved chapters
          </p>
        </div>
      </Link>
    </div>
  );
}
