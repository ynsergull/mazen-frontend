"use client";

import Image, { type ImageProps } from "next/image";
import { Asterisk } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

/** Supplier images go directly to the browser: no disk cache on our Next server. */
export function CatalogImage({ src, alt, ...props }: ImageProps) {
  const [failedSource, setFailedSource] = useState<ImageProps["src"] | null>(null);

  if (!src || failedSource === src) {
    const { fill, width, height } = props;
    return (
      <span
        role="img"
        aria-label={alt ? `${alt}: ürün görseli yakında eklenecek` : "Ürün görseli yakında eklenecek"}
        style={fill ? undefined : { width, height }}
        className={cn(
          "flex flex-col items-center justify-center gap-1 overflow-hidden bg-[#f7f3ea] text-center text-[#8d8779]",
          fill ? "absolute inset-0 h-full w-full" : "h-full min-h-20 w-full"
        )}
      >
        <Asterisk aria-hidden="true" className="size-6 shrink-0 text-[#dba694]" strokeWidth={1.8} />
        <span className="max-w-full truncate px-1 text-[8px] font-medium uppercase tracking-[0.14em]">
          Görsel yakında
        </span>
      </span>
    );
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      unoptimized={typeof src === "string" && src.startsWith("https://d1y8qveuwztoxr.cloudfront.net/")}
      onError={() => setFailedSource(src)}
    />
  );
}
