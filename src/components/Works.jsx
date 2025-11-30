import React, { useState, useEffect } from 'react';
import '../styles/works.css';
import ImageWithFallback from './ImageWithFallback';
import WorksFeatured from './WorksFeatured';
import WorksRow from './WorksRow';
import WorksCapsules from './WorksCapsules';
// Centralized image lists — put actual image files under `public/images/...`
// and update these paths in `src/images/index.js` if you use different names.
import { featured, row1, row2, capsules } from '../images';

export default function Works() {
  const [open, setOpen] = useState(false);
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const featuredTimer = React.useRef(null);

  // Auto-rotate featured images when expanded
  useEffect(() => {
    if (!open) return;
    featuredTimer.current = setInterval(() => {
      setFeaturedIdx((i) => (i + 1) % featured.length);
    }, 2800);
    return () => clearInterval(featuredTimer.current);
  }, [open]);

  // NOTE: Auto-scroll is now handled by each `WorksRow` component.

  // Featured area should only show the predefined "featured" set and auto-rotate.
  // Do NOT allow selecting images from the rows or capsules to replace the featured image.
  const featuredSrc = featured[featuredIdx];

  // Preview modal for clicking scrolling images (shows slightly larger view)
  const [previewSrc, setPreviewSrc] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const openPreview = (src) => {
    setPreviewSrc(src);
    setPreviewOpen(true);
  };
  const closePreview = () => {
    setPreviewOpen(false);
    setPreviewSrc(null);
  };
  // previously we allowed capsules to expand visually; that behaviour was removed

  return (
    <article className="section-card section-card--works">
      <h3 className="section-title" aria-label="Works">
        W
        <button
          className={`o-button o-circle works-toggle ${open ? 'open' : ''}`}
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
        />
        RKS
      </h3>

      <p className="section-copy island-moments">A curated collection of work that proves I do more than attend meetings</p>

      <div className={`works-expanded ${open ? 'open' : ''}`} aria-hidden={!open}>
        <WorksFeatured src={featuredSrc} />

        <WorksRow images={[...row1, ...row1]} onClick={openPreview} open={open} direction="forward" always={true} />

        <WorksRow images={[...row2, ...row2]} onClick={openPreview} open={open} direction="backward" always={true} />

        <WorksCapsules capsules={capsules} selected={selected} setSelected={setSelected} onClick={openPreview} />

        {/* Preview modal (click scrolling images to open) */}
        {previewOpen && (
          <div className="preview-overlay" onClick={closePreview}>
              <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
              <button className="preview-close" onClick={closePreview} aria-label="Close preview">×</button>
              <ImageWithFallback src={previewSrc} alt="Preview" />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
