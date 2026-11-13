import { useState } from 'react';
import { Package } from 'lucide-react';

interface ProductThumbnailProps {
  src?: string;
  alt: string;
  sizeClass?: string;
}

export function ProductThumbnail({
  src,
  alt,
  sizeClass = 'w-11 h-11',
}: ProductThumbnailProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`${sizeClass} shrink-0 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200/80 border border-slate-200/80 flex items-center justify-center text-slate-400`}
        aria-label={alt}
      >
        <Package className="w-5 h-5" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`${sizeClass} shrink-0 rounded-xl object-cover border border-slate-200/80 bg-slate-100`}
    />
  );
}
