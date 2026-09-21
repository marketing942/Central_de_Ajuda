import { revalidateTag } from "next/cache";
import { HELP_CENTER_TAG } from "@/lib/notion/help-center";

// Publicação imediata: POST /api/revalidate com o header x-revalidate-secret
// (ou ?secret=) descarta o cache de 5 min na hora. Pode ser disparado por um
// botão/automação do Notion.
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const provided = request.headers.get("x-revalidate-secret") ?? new URL(request.url).searchParams.get("secret");
  if (!secret || provided !== secret) return Response.json({ ok: false }, { status: 401 });

  revalidateTag(HELP_CENTER_TAG, { expire: 0 });
  return Response.json({ ok: true, revalidated: HELP_CENTER_TAG });
}
