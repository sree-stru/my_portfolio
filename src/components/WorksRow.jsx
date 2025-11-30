import React, { useEffect, useRef } from 'react';
import '../styles/works-row.css';
import ImageWithFallback from './ImageWithFallback';

// direction: 'forward' (left->right) or 'backward' (right->left)
export default function WorksRow({ images = [], onClick, open = false, direction = 'forward', always = false }) {
  const elRef = useRef(null);
  const rafRef = useRef(null);
  const startedRef = useRef(false);
  const trackRef = useRef(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return undefined;

    // If CSS-based auto scroll is enabled for this row, skip the JS RAF auto-scroll.
    if (always) {
      return undefined;
    }

    let running = true;
    let lastTime = null;

    // speed in pixels per second; tune this to change scroll speed
    const speed = 40; // px/sec

    const getHalf = () => Math.max(1, el.scrollWidth / 2);

    const initPosition = () => {
      const half = getHalf();
      if (direction === 'forward') el.scrollLeft = 0;
      else el.scrollLeft = Math.max(1, half - 1);
    };

    const onResize = () => {
      if (!el) return;
      const half = getHalf();
      if (el.scrollLeft > half) el.scrollLeft = el.scrollLeft % half;
    };

    const imgs = Array.from(el.querySelectorAll('img'));
    const onImgLoad = () => onResize();

    if (!open && !always) {
      window.removeEventListener('resize', onResize);
      imgs.forEach((img) => img.removeEventListener('load', onImgLoad));
      return undefined;
    }

    window.addEventListener('resize', onResize);
    imgs.forEach((img) => img.addEventListener('load', onImgLoad));

    // use RAF for smooth continuous scrolling
    const step = (ts) => {
      if (!running || !el) return;
      if (lastTime == null) lastTime = ts;
      const dt = (ts - lastTime) / 1000; // seconds
      lastTime = ts;

      const half = getHalf();
      // if there's no overflow to scroll, skip
      if (half <= el.clientWidth + 1) {
        // nothing to scroll
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      const delta = speed * dt; // pixels to move this frame
      if (direction === 'forward') {
        el.scrollLeft = (el.scrollLeft + delta) % half;
      } else {
        let next = el.scrollLeft - delta;
        if (next <= 0) next += half;
        el.scrollLeft = next;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    // slight delay to allow layout/images to stabilize
    const start = () => {
      if (startedRef.current) return;
      initPosition();
      startedRef.current = true;
      rafRef.current = requestAnimationFrame(step);
    };

    // start after a short timeout to allow images to render
    const startTimeout = setTimeout(start, 80);

    return () => {
      running = false;
      lastTime = null;
      startedRef.current = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      clearTimeout(startTimeout);
      window.removeEventListener('resize', onResize);
      imgs.forEach((img) => img.removeEventListener('load', onImgLoad));
    };
  }, [direction, images, open, always]);

  // compute a duration (seconds) proportional to number of images so longer strips scroll slower
  const durationSec = Math.max(18, Math.round(images.length * 3));
  const cssVars = { '--scroll-duration': `${durationSec}s` };

  // If CSS-based auto-scroll is enabled, measure the scroll-track and set
  // precise CSS variables so the animation translates by the exact half-width
  // (prevents seams caused by padding/rounding). This runs only when `always`.
  useEffect(() => {
    if (!always) return undefined;
    const track = trackRef.current;
    if (!track) return undefined;

    const speed = 40; // px/sec used to compute duration

    const measure = () => {
      // total width of the duplicated track; half will be one loop
      const total = track.scrollWidth;
      const half = total / 2;
      // set precise scroll distance and duration
      track.style.setProperty('--scroll-distance', `${half}px`);
      const dur = Math.max(10, Math.round(half / speed));
      track.style.setProperty('--scroll-duration', `${dur}s`);
      // switch to pixel-based keyframes to use the CSS variable
      track.style.animationName = 'scroll-left-px';
    };

    // measure once and on resize
    measure();
    window.addEventListener('resize', measure);
    // also re-measure after images load inside the track
    const imgs = Array.from(track.querySelectorAll('img'));
    const onImg = () => setTimeout(measure, 60);
    imgs.forEach((img) => img.addEventListener('load', onImg));

    return () => {
      window.removeEventListener('resize', measure);
      imgs.forEach((img) => img.removeEventListener('load', onImg));
    };
  }, [always, images]);

  return (
    <div className="works-band">
      <div className={`works-row scroll ${always ? 'auto-scroll auto-css' : ''}`} ref={elRef} aria-hidden={!open}>
        <div
          ref={trackRef}
          className={`scroll-track ${direction === 'backward' ? 'reverse' : ''}`}
          style={always ? cssVars : undefined}
        >
          {([...images, ...images]).map((src, i) => (
            <div className="works-square" key={`row-${i}`} onClick={() => onClick && onClick(src)}>
              <ImageWithFallback src={src} alt={`Work ${i + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

