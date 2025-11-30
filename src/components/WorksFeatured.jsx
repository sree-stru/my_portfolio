import React from 'react';
import '../styles/works-featured.css';
import ImageWithFallback from './ImageWithFallback';

export default function WorksFeatured({ src }) {
  return (
    <div className="works-frame">
      <ImageWithFallback src={src} alt="Featured work" />
    </div>
  );
}
