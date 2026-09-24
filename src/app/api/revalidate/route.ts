import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

const ALLOWED_TAGS = new Set(["products", "categories", "store"]);

/**
 * Laravel senkron bitince buraya POST atar: { secret, tags: ["products","categories"] }
 * Ilgili ISR onbellekleri arka planda tazelenir (stale-while-revalidate).
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { secret?: string; tags?: string[] } | null;

  if (!process.env.REVALIDATE_SECRET || body?.secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const tags = (body.tags ?? ["products"]).filter((tag) => ALLOWED_TAGS.has(tag));
  for (const tag of tags) revalidateTag(tag, "max");

  return NextResponse.json({ ok: true, revalidated: tags, at: new Date().toISOString() });
}
