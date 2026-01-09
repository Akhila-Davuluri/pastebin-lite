import { NextResponse } from "next/server";
import { kv } from "../../../../lib/kv";

type Paste = {
  content: string;
  createdAt: number;
};

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // Note the await here!

  const data = (await kv.get(id)) as Paste | null;

  if (!data) {
    return NextResponse.json(
      { error: "Paste not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
