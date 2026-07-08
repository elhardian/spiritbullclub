"use client";

import { createSolanaClient } from "@metamask/connect-solana";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AppWalletProvider } from "@/context/WalletContext";
import { getSolanaConfig } from "@/lib/solana";

export function SolanaProviders({ children }: { children: ReactNode }) {
  const [walletsReady, setWalletsReady] = useState(false);
  const { rpcUrl } = getSolanaConfig();

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  useEffect(() => {
    let cancelled = false;
    createSolanaClient({
      dapp: {
        name: "Spirit Bull Club",
        url: window.location.origin,
      },
      api: {
        supportedNetworks: { mainnet: rpcUrl },
      },
    })
      .catch(() => {
        /* MetaMask registration optional */
      })
      .finally(() => {
        if (!cancelled) setWalletsReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [rpcUrl]);

  return (
    <ConnectionProvider endpoint={rpcUrl}>
      <WalletProvider wallets={wallets} autoConnect>
        <AppWalletProvider walletsReady={walletsReady}>{children}</AppWalletProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
