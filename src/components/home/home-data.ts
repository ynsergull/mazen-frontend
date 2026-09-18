export type Collection = "Tümü" | "Defter & ajanda" | "Kalem & boya" | "Masa düzeni";

// Tasarım önizlemesi: bu ürünler gerçek katalog veya sepet kimlikleri taşımaz.
export interface ShowcaseProduct {
  key: string;
  name: string;
  subtitle: string;
  collection: Exclude<Collection, "Tümü">;
  image: string;
  price: number;
  badge: string;
  colors: string[];
  description: string;
  searchTerm: string;
}

export const collections: Collection[] = ["Tümü", "Defter & ajanda", "Kalem & boya", "Masa düzeni"];

export const showcaseProducts: ShowcaseProduct[] = [
  {
    key: "linen-notebooks",
    name: "Keten kapaklı defter ikilisi",
    subtitle: "Güzel fikirlerin yeni adresi",
    collection: "Defter & ajanda",
    image: "/images/home/notebooks.webp",
    price: 249.9,
    badge: "Yeni keşif",
    colors: ["#d38a77", "#eac5ad"],
    description: "Notlarını, hayallerini ve günlük planlarını bir araya getiren sıcak tonlar. Keten dokulu kapak ve sade detaylarla her gün yanında taşımak isteyeceğin bir ikili.",
    searchTerm: "defter",
  },
  {
    key: "pastel-pencils",
    name: "Pastel renkli boya kalemleri",
    subtitle: "Çizgilerin biraz renklensin",
    collection: "Kalem & boya",
    image: "/images/home/pencils.webp",
    price: 189.9,
    badge: "Renkli seçim",
    colors: ["#f19e99", "#e7cc74", "#9bc4ac", "#9abbe3", "#c9b3df"],
    description: "Küçük karalamalardan büyük fikirlere, renklerle kendini ifade et. Yumuşak pastel tonlarıyla çizim saatlerine neşe katacak bir masa arkadaşı.",
    searchTerm: "boya",
  },
  {
    key: "blue-organizer",
    name: "Dalga desenli metal kalemlik",
    subtitle: "Masanda küçük bir tasarım dokunuşu",
    collection: "Masa düzeni",
    image: "/images/home/desk.webp",
    price: 159.9,
    badge: "Masa favorisi",
    colors: ["#274da1"],
    description: "Sevdiğin kalemlere güzel bir yer aç. Canlı mavi tonu ve dalgalı formuyla çalışma alanına karakter katan bir düzenleyici. Görseldeki aksesuarlar dekor amaçlıdır.",
    searchTerm: "kalemlik",
  },
  {
    key: "creative-starter",
    name: "Yaratıcı başlangıç seçkisi",
    subtitle: "Yeni bir sayfa, yepyeni fikirler",
    collection: "Defter & ajanda",
    image: "/images/home/hero.webp",
    price: 449.9,
    badge: "Birlikte güzel",
    colors: ["#dc7050", "#305b44", "#e7c469"],
    description: "Defter, kalem ve küçük masa aksesuarlarını bir araya getiren örnek bir ilham seçkisi. Renkleri birbiriyle konuşan parçalarla kendi çalışma köşeni oluştur.",
    searchTerm: "defter",
  },
];
