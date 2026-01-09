import { kv } from "@/lib/kv";
import { now as getNow } from "@/lib/time";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const key = `paste:${params.id}`;
  const data = await kv.get<any>(key);

  // Missing paste
  if (!data) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const currentTime = getNow(req);

  // Expired paste
  if (data.expires_at && currentTime > data.expires_at) {
    await kv.del(key);
    return Response.json({ error: "Expired" }, { status: 404 });
  }

  // View limit check
  if (data.remaining_views !== null) {
    if (data.remaining_views <= 0) {
      await kv.del(key);
      return Response.json({ error: "View limit exceeded" }, { status: 404 });
    }
    data.remaining_views -= 1;
  }

  // Persist updated views
  await kv.set(key, data);

  return Response.json({
    content: data.content,
    remaining_views: data.remaining_views,
    expires_at: data.expires_at
      ? new Date(data.expires_at).toISOString()
      : null,
  });
}
