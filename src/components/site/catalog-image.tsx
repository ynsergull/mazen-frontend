"use client";

import Image, { type ImageProps } from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";

/** Supplier images go directly to the browser: no disk cache on our Next server. */
export function CatalogImage({ src, alt, ...props }: ImageProps) {
  const [failedSource, setFailedSource] = useState<ImageProps["src"] | null>(null);
  if (!src || failedSource === src) {
    return <span className="flex h-full min-h-20 w-full items-center justify-center bg-stone-50 text-stone-400" role="img" aria-label={`${alt}: görsel bulunmuyor`}><ImageOff className="size-8" /></span>;
  }
  return <Image {...props} src={src} alt={alt} unoptimized={typeof src === "string" && src.startsWith("https://d1y8qveuwztoxr.cloudfront.net/")} onError={() => setFailedSource(src)} />;
}
