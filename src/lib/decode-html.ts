const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#039;": "'",
  "&nbsp;": " ",
};

const ENTITY_PATTERN = /&(?:amp|lt|gt|quot|nbsp|#0?39);/g;

/**
 * Tedarikci verisinde kalan HTML varliklarini duz metne cevirir (ornegin "Kalem &amp; Defter").
 * Cikti her zaman metin olarak basilir; dangerouslySetInnerHTML ile kullanilmaz.
 */
export function decodeHtml(value: string | null | undefined): string {
  if (!value) return "";
  let result = value;
  // Cift kodlanmis veriler (&amp;amp;) icin sinirli sayida tekrar.
  for (let pass = 0; pass < 3; pass += 1) {
    const next = result.replace(ENTITY_PATTERN, (match) => ENTITIES[match] ?? match);
    if (next === result) break;
    result = next;
  }
  return result;
}
