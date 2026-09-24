import { decodeHtml } from "@/lib/decode-html";

const LOWER_WORDS = /\s(Ve|İle|Veya|İçin)(?=\s)/g;

/**
 * Tedarikciden BUYUK HARFLE gelen kategori adlarini okunur hale getirir:
 * "SANATSAL MALZ.VE BOYALAR" -> "Sanatsal Malz. ve Boyalar".
 * Admin panelinden elle duzeltilmis (karisik harfli) adlara dokunmaz.
 */
export function categoryName(raw: string | null | undefined): string {
  const name = decodeHtml(raw).trim();
  if (!name || name !== name.toLocaleUpperCase("tr-TR")) return name;

  return name
    .toLocaleLowerCase("tr-TR")
    .replace(/\.(?=\p{L})/gu, ". ")
    .replace(/(^|[\s\-/(&])(\p{L})/gu, (_, before: string, letter: string) => before + letter.toLocaleUpperCase("tr-TR"))
    .replace(LOWER_WORDS, (word) => word.toLocaleLowerCase("tr-TR"));
}
