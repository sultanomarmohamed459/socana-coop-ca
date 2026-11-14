import { useState } from 'react';
import { Leaf } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function ResilientImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackLabel,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="w-full h-full min-h-[160px] bg-gradient-to-br from-[#124B3B] to-[#0B382E] flex flex-col items-center justify-center p-6 text-center text-white/90"
      >
        <Leaf className="w-7 h-7 text-[#D0AC69] mb-2" strokeWidth={1.5} />
        <span className="text-xs tracking-wide text-white/80 max-w-[24ch]">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
