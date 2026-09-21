import { decodeHtml } from "@/lib/decode-html";
import type { Category } from "@/types/api";

export type Crumb = { name: string; slug: string };

/** Kategori agacini duz bir listeye cevirir. */
export function flattenCategories(tree: Category[]): Category[] {
  const flat: Category[] = [];
  const walk = (nodes: Category[]) => {
    for (const node of nodes) {
      flat.push(node);
      if (node.children?.length) walk(node.children);
    }
  };
  walk(tree);
  return flat;
}

/**
 * Bir kategorinin ust kategorilerini agactan cozer.
 * Once `path` icindeki slug/isim parcalari, bulunamazsa `parent_id` zinciri kullanilir.
 */
export function resolveAncestors(category: Category, tree: Category[]): Crumb[] {
  const flat = flattenCategories(tree);
  const bySlug = new Map(flat.map((item) => [item.slug, item]));
  const byName = new Map(flat.map((item) => [item.name.toLocaleLowerCase("tr"), item]));
  const byId = new Map(flat.map((item) => [item.id, item]));

  const segments = (category.path ?? "")
    .split(/[/>›»]/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  const fromPath: Crumb[] = [];
  for (const segment of segments) {
    const match = bySlug.get(segment) ?? byName.get(segment.toLocaleLowerCase("tr"));
    if (!match || match.slug === category.slug) continue;
    if (fromPath.some((crumb) => crumb.slug === match.slug)) continue;
    fromPath.push({ name: decodeHtml(match.name), slug: match.slug });
  }
  if (fromPath.length > 0) return fromPath;

  const fromParents: Crumb[] = [];
  let parentId = category.parent_id;
  while (parentId !== null && fromParents.length < 5) {
    const parent = byId.get(parentId);
    if (!parent) break;
    fromParents.unshift({ name: decodeHtml(parent.name), slug: parent.slug });
    parentId = parent.parent_id;
  }
  return fromParents;
}
