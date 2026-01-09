import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pastes/${params.id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();

  return (
    <div>
      <pre>{data.content}</pre>
    </div>
  );
}
