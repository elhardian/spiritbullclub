"use client";

import { useCallback, useState } from "react";

const CA = process.env.NEXT_PUBLIC_TOKEN_CA ?? "";

function shortenAddress(address: string) {
  if (address.length <= 12) return address;
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

export function ContractAddress() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    if (!CA) return;
    try {
      await navigator.clipboard.writeText(CA);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  }, []);

  if (!CA) return null;

  return (
    <div className="mt-4 flex justify-center">
      <button
        type="button"
        onClick={copy}
        className="group inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2 font-mono text-sm text-white/70 transition hover:bg-white/[0.1] hover:text-white"
        aria-label="Copy contract address"
      >
        <span className="text-[10px] tracking-[0.2em] text-white/40 uppercase">CA</span>
        <span>{shortenAddress(CA)}</span>
        {copied ? (
          <CheckIcon className="text-emerald-400" />
        ) : (
          <CopyIcon className="text-white/40 transition group-hover:text-white/70" />
        )}
      </button>
    </div>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 ${className ?? ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 ${className ?? ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
