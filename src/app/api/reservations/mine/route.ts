import { listReservationsByWallet } from "@/lib/reservations-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get("wallet")?.trim() ?? "";

  if (!wallet) {
    return Response.json({ error: "Wallet address is required." }, { status: 400 });
  }

  const reservations = await listReservationsByWallet(wallet);
  return Response.json({ reservations });
}
