import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const sql = getDb();
    const [{ connected }] = await sql`SELECT 1 AS connected`;
    return Response.json({ ok: connected === 1 });
  } catch {
    return Response.json({ ok: false }, { status: 503 });
  }
}
