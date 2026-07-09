import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { ensureSchema, getPool, isDbConfigured } from "@/lib/db";
import { maskWallet } from "@/lib/validation";
import type { NftBidSummary } from "@/types/bids";
import type { PublicReservation, ReservationRecord } from "@/types/reservation";

type ReservationRow = RowDataPacket & {
  id: string;
  email: string;
  nft_id: number;
  nft_name: string;
  wallet: string;
  signature: string;
  amount: number;
  created_at: Date;
};

const DUMMY_WALLETS = [
  "7kP9mN3xQw2vRt8yHj5bLc4dF6gA1sZ",
  "9xH2pL8nQm4wRs6tYv3bKc5dE7fG0aB",
  "4mNz8qRt2wXy6vBc1dFg3hJk5lMn7pQr",
] as const;

const DUMMY_AMOUNTS = [0.3, 0.5, 1.2] as const;

const DUMMY_SIGNATURES = [
  "5Kp9mN3xQw2vRt8yHj5bLc4dF6gA1sZ8xH2pL8nQm4wRs6tYv3bKc",
  "3mNz8qRt2wXy6vBc1dFg3hJk5lMn7pQr9xH2pL8nQm4wRs6tYv3bK",
  "8xH2pL8nQm4wRs6tYv3bKc5dE7fG0aB4mNz8qRt2wXy6vBc1dFg3h",
] as const;

function rowToRecord(row: ReservationRow): ReservationRecord {
  return {
    id: row.id,
    email: row.email,
    nftId: row.nft_id,
    nftName: row.nft_name,
    wallet: row.wallet,
    signature: row.signature,
    bidAmount: Number(row.amount),
    createdAt: new Date(row.created_at).toISOString(),
  };
}

function toPublic(record: ReservationRecord): PublicReservation {
  return {
    id: record.id,
    nftId: record.nftId,
    nftName: record.nftName,
    maskedWallet: maskWallet(record.wallet),
    signature: record.signature,
    bidAmount: record.bidAmount,
    createdAt: record.createdAt,
  };
}

function dummyRecords(): ReservationRecord[] {
  const now = Date.now();
  return [
    { nftId: 3, nftName: "Spirit Bull #0003 - Diamond Horn", wallet: DUMMY_WALLETS[0] },
    { nftId: 4, nftName: "Spirit Bull #0004 - Gold Horn", wallet: DUMMY_WALLETS[1] },
    { nftId: 5, nftName: "Spirit Bull #0005 - Punk", wallet: DUMMY_WALLETS[2] },
  ].map((item, i) => ({
    id: `dummy-${i + 1}`,
    email: "hidden@spiritbull.club",
    nftId: item.nftId,
    nftName: item.nftName,
    wallet: item.wallet,
    signature: DUMMY_SIGNATURES[i],
    bidAmount: DUMMY_AMOUNTS[i],
    createdAt: new Date(now - (i + 1) * 3_600_000).toISOString(),
  }));
}

function dummyPublicReservations(): PublicReservation[] {
  return dummyRecords().map(toPublic);
}

function buildSummariesFromRecords(records: ReservationRecord[]): NftBidSummary[] {
  const byNft = new Map<number, ReservationRecord[]>();
  for (const record of records) {
    const list = byNft.get(record.nftId) ?? [];
    list.push(record);
    byNft.set(record.nftId, list);
  }

  return [...byNft.entries()].map(([nftId, rows]) => {
    const sorted = [...rows].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const highestBid = Math.max(...rows.map((r) => r.bidAmount));
    return {
      nftId,
      highestBid,
      bids: sorted.slice(0, 12).map((r) => ({
        maskedWallet: maskWallet(r.wallet),
        amount: r.bidAmount,
        createdAt: r.createdAt,
        signature: r.signature,
      })),
    };
  });
}

async function seedDummyReservations() {
  const db = getPool();
  const [rows] = await db.execute<RowDataPacket[]>("SELECT COUNT(*) AS count FROM reservations");
  const count = Number(rows[0]?.count ?? 0);
  if (count > 0) return;

  const now = Date.now();
  const seeds = [
    { nftId: 3, nftName: "Spirit Bull #0003 - Diamond Horn", wallet: DUMMY_WALLETS[0] },
    { nftId: 4, nftName: "Spirit Bull #0004 - Gold Horn", wallet: DUMMY_WALLETS[1] },
    { nftId: 5, nftName: "Spirit Bull #0005 - Punk", wallet: DUMMY_WALLETS[2] },
  ];

  for (const [i, seed] of seeds.entries()) {
    await db.execute<ResultSetHeader>(
      `INSERT INTO reservations (id, email, nft_id, nft_name, wallet, signature, amount, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        `seed-${i + 1}`,
        "hidden@spiritbull.club",
        seed.nftId,
        seed.nftName,
        seed.wallet,
        DUMMY_SIGNATURES[i],
        DUMMY_AMOUNTS[i],
        new Date(now - (i + 1) * 3_600_000),
      ],
    );
  }
}

export async function addReservation(input: {
  email: string;
  nftId: number;
  nftName: string;
  wallet: string;
  signature: string;
  bidAmount: number;
}) {
  await ensureSchema();
  const db = getPool();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  await db.execute<ResultSetHeader>(
    `INSERT INTO reservations (id, email, nft_id, nft_name, wallet, signature, amount)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, input.email, input.nftId, input.nftName, input.wallet, input.signature, input.bidAmount],
  );

  return {
    id,
    email: input.email,
    nftId: input.nftId,
    nftName: input.nftName,
    wallet: input.wallet,
    signature: input.signature,
    bidAmount: input.bidAmount,
    createdAt: new Date().toISOString(),
  } satisfies ReservationRecord;
}

export async function listPublicReservations(): Promise<PublicReservation[]> {
  if (!isDbConfigured()) {
    return dummyPublicReservations();
  }

  try {
    await ensureSchema();
    await seedDummyReservations();
    const db = getPool();
    const [rows] = await db.execute<ReservationRow[]>(
      "SELECT * FROM reservations ORDER BY created_at DESC",
    );
    return rows.map(rowToRecord).map(toPublic);
  } catch {
    return dummyPublicReservations();
  }
}

export async function listReservationsByWallet(wallet: string): Promise<PublicReservation[]> {
  const normalized = wallet.trim();
  if (!normalized) return [];

  if (!isDbConfigured()) {
    return dummyPublicReservations().filter(
      (r) => r.maskedWallet === maskWallet(normalized),
    );
  }

  try {
    await ensureSchema();
    const db = getPool();
    const [rows] = await db.execute<ReservationRow[]>(
      "SELECT * FROM reservations WHERE wallet = ? ORDER BY created_at DESC",
      [normalized],
    );
    return rows.map(rowToRecord).map(toPublic);
  } catch {
    return [];
  }
}

export async function getBidSummaries(): Promise<NftBidSummary[]> {
  if (!isDbConfigured()) {
    return buildSummariesFromRecords(dummyRecords());
  }

  try {
    await ensureSchema();
    await seedDummyReservations();
    const db = getPool();
    const [rows] = await db.execute<ReservationRow[]>(
      "SELECT * FROM reservations ORDER BY created_at DESC",
    );
    return buildSummariesFromRecords(rows.map(rowToRecord));
  } catch {
    return buildSummariesFromRecords(dummyRecords());
  }
}
