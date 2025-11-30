import React, { useState, useEffect } from 'react';

export default function ImageWithFallback({ src, alt, className, ...rest }) {
  const [current, setCurrent] = useState(src);
  const [triedFallback, setTriedFallback] = useState(false);

  useEffect(() => {
    setCurrent(src);
    setTriedFallback(false);
  }, [src]);

  const onError = () => {
    // Log the failing URL to help debugging (use browser console to inspect)
    try {
      // eslint-disable-next-line no-console
      console.warn('ImageWithFallback failed to load:', current, 'alt:', alt);
    } catch (e) {}

    if (triedFallback) return;
    setTriedFallback(true);

    // Instead of guessing alternate extensions (which may not exist when
    // Vite emits hashed filenames), use a small inline SVG placeholder so
    // the layout remains intact and the console warning points to the URL
    // that failed to load. This avoids infinite onError loops and gives a
    // visible indicator for debugging.
    const placeholder = `data:image/svg+xml;utf8,${encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120"><rect width="100%" height="100%" fill="#2b0f0f"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-size="14">Image missing</text></svg>'
    )}`;
    setCurrent(placeholder);
  };

  return <img src={current} alt={alt} className={className} onError={onError} {...rest} />;
}
