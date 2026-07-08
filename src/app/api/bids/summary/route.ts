import { getBidSummaries } from "@/lib/reservations-store";

export async function GET() {
  const summaries = await getBidSummaries();
  return Response.json({ summaries });
}
