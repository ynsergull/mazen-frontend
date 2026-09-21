"use client";

import { useState } from "react";

import { CatalogImage } from "@/components/site/catalog-image";
import type { ProductImageSet } from "@/types/api";

import styles from "./storefront.module.css";

/** Buyuk gorsel + kucuk onizlemeler; onizlemeye tiklayinca ana gorsel degisir. */
export function ProductGallery({ name, images }: { name: string; images: ProductImageSet[] }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  const source = current ? current.zoom ?? current.card : "";

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImage}>
        <CatalogImage
          src={source}
          alt={name}
          fill
          preload
          sizes="(max-width: 850px) 92vw, 45vw"
          className="object-contain p-6"
        />
      </div>

      {images.length > 1 && (
        <div className={styles.thumbs} role="group" aria-label="Ürün görselleri">
          {images.map((image, index) => (
            <button
              key={`${image.thumb}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`${index + 1}. görseli göster`}
              aria-pressed={index === active}
              className={`${styles.thumb} ${index === active ? styles.thumbActive : ""}`}
            >
              <CatalogImage
                src={image.thumb}
                alt=""
                fill
                sizes="72px"
                className="object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
