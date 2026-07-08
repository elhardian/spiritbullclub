"use client";

import { WalletName } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useMemo } from "react";

export type WalletOption = {
  id: string;
  label: string;
  icon: string;
  installUrl: string;
  walletName?: WalletName;
  installed: boolean;
};

const WALLET_DEFS = [
  {
    id: "phantom",
    label: "Phantom",
    icon: "👻",
    installUrl: "https://phantom.app/download",
    match: /phantom/i,
  },
  {
    id: "metamask",
    label: "MetaMask",
    icon: "🦊",
    installUrl: "https://metamask.io/download/",
    match: /metamask/i,
  },
  {
    id: "jupiter",
    label: "Jupiter",
    icon: "🪐",
    installUrl: "https://jup.ag/wallet",
    match: /jupiter/i,
  },
] as const;

type Props = {
  open: boolean;
  onClose: () => void;
  onError?: (message: string) => void;
};

export function WalletConnectModal({ open, onClose, onError }: Props) {
  const { wallets, select, connect, connecting } = useWallet();

  const options: WalletOption[] = useMemo(
    () =>
      WALLET_DEFS.map((def) => {
        const found = wallets.find((w) => def.match.test(w.adapter.name));
        return {
          id: def.id,
          label: def.label,
          icon: def.icon,
          installUrl: def.installUrl,
          walletName: found?.adapter.name,
          installed: Boolean(found && found.readyState !== "NotDetected"),
        };
      }),
    [wallets],
  );

  const handleSelect = useCallback(
    async (option: WalletOption) => {
      if (!option.walletName) {
        window.open(option.installUrl, "_blank", "noopener,noreferrer");
        return;
      }
      try {
        await select(option.walletName);
        await connect();
        onClose();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Could not connect wallet.";
        if (!message.toLowerCase().includes("user rejected")) {
          onError?.(message);
        }
      }
    },
    [connect, onClose, onError, select],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close wallet modal"
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm rounded-3xl bg-[#0a0a0a] p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">
              Connect wallet
            </p>
            <h2 className="mt-1 text-xl font-semibold text-white">Choose Solana wallet</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-2.5 py-1 text-white/45 hover:bg-white/[0.06]"
          >
            ✕
          </button>
        </div>

        <ul className="space-y-2">
          {options.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                disabled={connecting}
                onClick={() => handleSelect(option)}
                className="flex w-full items-center justify-between rounded-2xl bg-white/[0.05] px-4 py-3.5 text-left transition hover:bg-white/[0.09] disabled:opacity-50"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-lg">
                    {option.icon}
                  </span>
                  <span>
                    <span className="block font-medium text-white">{option.label}</span>
                    <span className="block text-xs text-white/40">
                      {option.installed ? "Detected" : "Install extension"}
                    </span>
                  </span>
                </span>
                <span className="text-sm text-white/50">{option.installed ? "→" : "↗"}</span>
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-center text-xs text-white/35">
          Phantom, MetaMask Solana, or Jupiter wallet
        </p>
      </div>
    </div>
  );
}
