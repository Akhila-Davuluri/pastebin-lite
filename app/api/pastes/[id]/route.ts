import { NextResponse } from "next/server";
import { kv } from "../../../../lib/kv";

type Paste = {
  content: string;
  createdAt: number;
};

type Params = {
  params: {
    id: string;
  };
};

export async function GET(
  _req: Request,
  { params }: Params
) {
  const { id } = params;

  const data = (await kv.get(id)) as Paste | null;

  if (!data) {
    return NextResponse.json(
      { error: "Paste not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
