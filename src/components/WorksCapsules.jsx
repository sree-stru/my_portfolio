import React from 'react';
import '../styles/works-capsules.css';
import ImageWithFallback from './ImageWithFallback';

export default function WorksCapsules({ capsules = [], selected, setSelected, onClick }) {
  if (process.env.NODE_ENV !== 'production') {
    try {
      // eslint-disable-next-line no-console
      console.log('WorksCapsules: capsule URLs', capsules);
    } catch (e) {}
  }

  const handleClick = (src) => {
    if (setSelected) setSelected(src);
    if (onClick) onClick(src);
  };

  return (
    <div className="works-capsules">
      {capsules.map((src, i) => (
        <button
          key={`c-${i}`}
          className={`works-capsule ${selected === src ? 'active' : ''}`}
          onClick={() => handleClick(src)}
          aria-pressed={selected === src}
          aria-label={`Open capsule ${i + 1}`}
        >
          <ImageWithFallback src={src} alt={`thumb ${i + 1}`} />
        </button>
      ))}
    </div>
  );
}
