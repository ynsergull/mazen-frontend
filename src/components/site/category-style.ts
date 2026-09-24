import {
  Backpack, BookOpen, Briefcase, Cpu, Dumbbell, LayoutGrid, type LucideIcon,
  NotebookPen, Palette, Paintbrush, Pencil, Scissors, ToyBrick,
} from "lucide-react";

export type CategoryTone = "peach" | "yellow" | "mint" | "pink" | "lilac" | "blue";

type CategoryStyle = { icon: LucideIcon; tone: CategoryTone; priority: number };

/** Anahtar kelimeye gore kategori ikonu ve pastel rengi; ilk eslesen kazanir. */
const RULES: { match: RegExp; style: CategoryStyle }[] = [
  { match: /çanta|canta|sırt|beslenme|kalemlik/, style: { icon: Backpack, tone: "mint", priority: 1 } },
  { match: /kırtasiye|kirtasiye/, style: { icon: Pencil, tone: "yellow", priority: 0 } },
  { match: /kalem/, style: { icon: Pencil, tone: "yellow", priority: 0 } },
  { match: /defter|ajanda|bloknot/, style: { icon: NotebookPen, tone: "peach", priority: 2 } },
  { match: /fırça|firca/, style: { icon: Paintbrush, tone: "pink", priority: 3 } },
  { match: /sanat|hobi|boya|resim/, style: { icon: Palette, tone: "pink", priority: 3 } },
  { match: /oyuncak|oyun|puzzle|yapboz/, style: { icon: ToyBrick, tone: "lilac", priority: 4 } },
  { match: /kitap|yayın|okuma/, style: { icon: BookOpen, tone: "blue", priority: 5 } },
  { match: /kağıt|kagit|karton|makas|yapıştırıcı/, style: { icon: Scissors, tone: "peach", priority: 6 } },
  { match: /spor/, style: { icon: Dumbbell, tone: "mint", priority: 7 } },
  { match: /elektronik|hesap makine/, style: { icon: Cpu, tone: "blue", priority: 8 } },
  { match: /ofis|büro|dosya|arşiv/, style: { icon: Briefcase, tone: "lilac", priority: 9 } },
];

const FALLBACK: CategoryStyle = { icon: LayoutGrid, tone: "yellow", priority: 50 };

export function categoryStyle(name: string): CategoryStyle {
  const key = name.toLocaleLowerCase("tr-TR");
  return RULES.find((rule) => rule.match.test(key))?.style ?? FALLBACK;
}
