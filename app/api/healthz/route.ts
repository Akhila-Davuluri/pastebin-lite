
import { kv } from "@/lib/kv";

export async function GET() {
  try {
    await kv.ping();
    return Response.json({ ok: true });
  } catch (err) {
    // Still return fast JSON response
    return Response.json({ ok: false }, { status: 200 });
  }
}

