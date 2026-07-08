"use client";

import { useConnection, useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { COLLECTION, type Bid, type SpiritBull } from "@/data/collection";
import { WalletConnectModal } from "@/components/WalletConnectModal";
import { buildSeatBookingTransaction, confirmBidTransaction } from "@/lib/solana";
import { formatSol, isReservable, minBidAmount } from "@/lib/collection-utils";
import { isValidEmail } from "@/lib/validation";
import { bidsToClientBids } from "@/types/bids";
import type { NftBidSummary } from "@/types/bids";

type WalletContextValue = {
  address: string | null;
  walletLabel: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  walletModalOpen: boolean;
  openWalletModal: () => void;
  closeWalletModal: () => void;
  nfts: SpiritBull[];
  disconnect: () => Promise<void>;
  placeBid: (
    nftId: number,
    email: string,
    bidAmount: number,
  ) => Promise<{ ok: true; signature: string } | { ok: false; error: string }>;
  getNft: (id: number) => SpiritBull | undefined;
};

const WalletContext = createContext<WalletContextValue | null>(null);

function shortAddress(addr: string) {
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

function applyBidSummaries(nfts: SpiritBull[], summaries: NftBidSummary[]) {
  const map = new Map(summaries.map((s) => [s.nftId, s]));
  return nfts.map((nft) => {
    const summary = map.get(nft.id);
    if (!summary) return nft;
    return {
      ...nft,
      highestBid: summary.highestBid,
      bids: bidsToClientBids(summary.bids) as Bid[],
    };
  });
}

export function AppWalletProvider({
  children,
  walletsReady = true,
}: {
  children: ReactNode;
  walletsReady?: boolean;
}) {
  const { connection } = useConnection();
  const {
    publicKey,
    connected,
    connecting,
    disconnect: adapterDisconnect,
    sendTransaction,
    wallet,
  } = useSolanaWallet();

  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [nfts, setNfts] = useState<SpiritBull[]>(() =>
    COLLECTION.map((n) => ({ ...n, bids: [...n.bids] })),
  );

  const address = publicKey?.toString() ?? null;
  const walletLabel = wallet?.adapter.name ?? null;

  const openWalletModal = useCallback(() => setWalletModalOpen(true), []);
  const closeWalletModal = useCallback(() => setWalletModalOpen(false), []);

  const disconnect = useCallback(async () => {
    await adapterDisconnect();
  }, [adapterDisconnect]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/bids/summary")
      .then((res) => res.json())
      .then((data: { summaries?: NftBidSummary[] }) => {
        if (cancelled || !data.summaries) return;
        setNfts((prev) => applyBidSummaries(prev, data.summaries!));
      })
      .catch(() => {
        /* keep local defaults */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const placeBid = useCallback(
    async (nftId: number, email: string, bidAmount: number) => {
      if (!isValidEmail(email)) {
        return { ok: false as const, error: "Enter a valid email to complete your bid." };
      }
      if (!walletsReady) {
        return { ok: false as const, error: "Wallets are still loading. Try again." };
      }
      if (!publicKey || !connected) {
        return { ok: false as const, error: "Connect your Solana wallet first." };
      }

      const nft = nfts.find((n) => n.id === nftId);
      if (!nft) return { ok: false as const, error: "Bull not found." };
      if (!isReservable(nft)) {
        return {
          ok: false as const,
          error: nft.airdropped
            ? "This bull is airdropped to holders only."
            : "This genesis bull is reserved for Ansem.",
        };
      }

      const minimum = minBidAmount(nft);
      if (!Number.isFinite(bidAmount) || bidAmount < minimum) {
        return {
          ok: false as const,
          error: `Bid offer must be at least ${formatSol(minimum)}.`,
        };
      }

      try {
        const { transaction, blockhash, lastValidBlockHeight } = await buildSeatBookingTransaction(
          connection,
          publicKey,
        );
        const signature = await sendTransaction(transaction, connection);
        await confirmBidTransaction(connection, signature, blockhash, lastValidBlockHeight);

        const wallet = publicKey.toString();
        const reservationRes = await fetch("/api/reservations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            nftId,
            nftName: nft.name,
            wallet,
            signature,
            bidAmount,
          }),
        });

        if (!reservationRes.ok) {
          const data = (await reservationRes.json().catch(() => null)) as { error?: string } | null;
          return {
            ok: false as const,
            error: data?.error ?? "Seat fee paid but bid could not be saved.",
          };
        }

        const bid: Bid = {
          amount: bidAmount,
          bidder: shortAddress(wallet),
          email: email.trim(),
          timestamp: Date.now(),
          signature,
        };

        setNfts((prev) =>
          prev.map((item) => {
            if (item.id !== nftId) return item;
            return {
              ...item,
              highestBid: Math.max(item.highestBid, bidAmount),
              bids: [bid, ...item.bids].slice(0, 12),
            };
          }),
        );

        return { ok: true as const, signature };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Transaction failed.";
        if (message.toLowerCase().includes("user rejected")) {
          return { ok: false as const, error: "Transaction cancelled in wallet." };
        }
        return { ok: false as const, error: message };
      }
    },
    [walletsReady, publicKey, connected, nfts, connection, sendTransaction],
  );

  const getNft = useCallback((id: number) => nfts.find((n) => n.id === id), [nfts]);

  const value = useMemo(
    () => ({
      address,
      walletLabel,
      isConnected: connected,
      isConnecting: connecting,
      walletModalOpen,
      openWalletModal,
      closeWalletModal,
      nfts,
      disconnect,
      placeBid,
      getNft,
    }),
    [
      address,
      walletLabel,
      connected,
      connecting,
      walletModalOpen,
      openWalletModal,
      closeWalletModal,
      nfts,
      disconnect,
      placeBid,
      getNft,
    ],
  );

  return (
    <WalletContext.Provider value={value}>
      {children}
      <WalletConnectModal open={walletModalOpen} onClose={closeWalletModal} />
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within AppWalletProvider");
  return ctx;
}

export function formatAddress(address: string) {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}
