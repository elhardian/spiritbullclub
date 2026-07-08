import { addReservation, listPublicReservations } from "@/lib/reservations-store";
import { sendBidConfirmationEmail } from "@/lib/email/send-bid-confirmation";
import { isValidEmail } from "@/lib/validation";
import { MIN_BID_OFFER_SOL } from "@/data/collection";

export async function GET() {
  const reservations = await listPublicReservations();
  return Response.json({ reservations });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      nftId?: number;
      nftName?: string;
      wallet?: string;
      signature?: string;
      bidAmount?: number;
      amount?: number;
    };

    const email = body.email?.trim() ?? "";
    if (!isValidEmail(email)) {
      return Response.json({ error: "A valid email is required." }, { status: 400 });
    }
    if (!body.nftId || !body.wallet || !body.signature) {
      return Response.json({ error: "Missing reservation details." }, { status: 400 });
    }

    const bidAmount = Number(body.bidAmount ?? body.amount);
    if (!Number.isFinite(bidAmount) || bidAmount < MIN_BID_OFFER_SOL) {
      return Response.json(
        { error: `Bid offer must be at least ${MIN_BID_OFFER_SOL} SOL.` },
        { status: 400 },
      );
    }

    const nftName = body.nftName ?? `Spirit Bull #${String(body.nftId).padStart(4, "0")}`;

    const record = await addReservation({
      email,
      nftId: body.nftId,
      nftName,
      wallet: body.wallet,
      signature: body.signature,
      bidAmount,
    });

    try {
      await sendBidConfirmationEmail({
        email,
        bullName: nftName,
        nftId: body.nftId,
        bidOffer: bidAmount,
        signature: body.signature,
      });
    } catch (err) {
      console.error("[email] Failed to send bid confirmation:", err);
    }

    return Response.json({ ok: true, id: record.id });
  } catch {
    return Response.json({ error: "Could not save reservation." }, { status: 500 });
  }
}
