"use client";

import { useState } from "react";
import Image from "next/image";

export default function WatermarkImage({
  src,
  alt,
  fallbackLabel
}: {
  src: string;
  alt: string;
  fallbackLabel: string;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="aspect-square rounded-xl bg-paper border border-line flex items-center justify-center overflow-hidden fabric-texture">
        <span className="text-steel/50 text-xs text-center px-2">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <div className="relative aspect-square rounded-xl overflow-hidden border border-line bg-paper">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover"
        onError={() => setErrored(true)}
      />
      {/* Elegant corner watermark — real logo, applied automatically to every product photo */}
      <div className="absolute bottom-2 end-2 opacity-85">
        <Image
          src="/logo/logo.png"
          alt="First Class For Uniform"
          width={34}
          height={34}
          className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
        />
      </div>
    </div>
  );
}
