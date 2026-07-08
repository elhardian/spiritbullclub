import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { SEAT_FEE_SOL } from "@/data/collection";

export { SEAT_FEE_SOL, SEAT_FEE_SOL as BID_AMOUNT_SOL };

export function getSolanaConfig() {
  return {
    rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com",
    marketingWallet: process.env.NEXT_PUBLIC_MARKETING_WALLET ?? "",
  };
}

export async function buildSeatBookingTransaction(
  connection: Connection,
  fromPubkey: PublicKey,
): Promise<{ transaction: Transaction; blockhash: string; lastValidBlockHeight: number }> {
  const { marketingWallet } = getSolanaConfig();

  if (!marketingWallet) {
    throw new Error("Marketing wallet is not configured. Set NEXT_PUBLIC_MARKETING_WALLET in .env.local");
  }

  let toPubkey: PublicKey;
  try {
    toPubkey = new PublicKey(marketingWallet);
  } catch {
    throw new Error("Marketing wallet address in env is invalid.");
  }

  const lamports = Math.round(SEAT_FEE_SOL * LAMPORTS_PER_SOL);
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");

  const transaction = new Transaction({
    feePayer: fromPubkey,
    blockhash,
    lastValidBlockHeight,
  }).add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports,
    }),
  );

  return { transaction, blockhash, lastValidBlockHeight };
}

/** @deprecated Use buildSeatBookingTransaction */
export const buildBidTransaction = buildSeatBookingTransaction;

export async function confirmBidTransaction(
  connection: Connection,
  signature: string,
  blockhash: string,
  lastValidBlockHeight: number,
) {
  await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, "confirmed");
}
