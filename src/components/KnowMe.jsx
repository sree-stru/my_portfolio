import React, { useState, useRef, useEffect } from 'react';

export default function KnowMe() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const toggleRef = useRef(null);

  const modalText = `hey

I'm a graphic designer who truly loves creating unique and meaningful visuals.
I'm passionate about turning ideas into designs that stand out and leave a strong impression.
With experience working for several clubs and international conferences, I've learned to adapt my creativity to different styles and audiences while still keeping every design fresh and original.`;

  useEffect(() => {
    function handleDocPointer(e) {
      if (!wrapRef.current) return;
      // if click/touch is outside the article, close
      if (!wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }

    // pointerdown covers mouse, pen, and touch
    document.addEventListener('pointerdown', handleDocPointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handleDocPointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  // compute the initial translate offset for the expanding circle so it
  // appears to grow out of the small O button. When opening, set CSS vars
  // on the article element that the CSS reads to animate from the O's
  // position into the centered circle.
  useEffect(() => {
    const el = wrapRef.current;
    const btn = toggleRef.current;
    if (!el || !btn) return undefined;

    const setVars = () => {
      const artRect = el.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      // center positions
      const artCx = artRect.left + artRect.width / 2;
      const artCy = artRect.top + artRect.height / 2;
      const btnCx = btnRect.left + btnRect.width / 2;
      const btnCy = btnRect.top + btnRect.height / 2;
      // delta from article center to button center (px)
      const dx = btnCx - artCx;
      const dy = btnCy - artCy;
      el.style.setProperty('--know-init-x', `${dx}px`);
      el.style.setProperty('--know-init-y', `${dy}px`);
    };

    // set immediately and on resize so offsets remain correct
    setVars();
    window.addEventListener('resize', setVars);
    return () => window.removeEventListener('resize', setVars);
  }, [open]);

  // compute vars on demand (used before opening so the circle can animate
  // from the O position into its centered size)
  const computeVars = () => {
    const el = wrapRef.current;
    const btn = toggleRef.current;
    if (!el || !btn) return;
    const artRect = el.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const artCx = artRect.left + artRect.width / 2;
    const artCy = artRect.top + artRect.height / 2;
    const btnCx = btnRect.left + btnRect.width / 2;
    const btnCy = btnRect.top + btnRect.height / 2;
    const dx = btnCx - artCx;
    const dy = btnCy - artCy;
    el.style.setProperty('--know-init-x', `${dx}px`);
    el.style.setProperty('--know-init-y', `${dy}px`);
  };

  return (
    <>
      <article ref={wrapRef} className={`section-card section-card--know ${open ? 'open' : ''}`}>
        <h3 className="section-title" aria-label="Know me">
          <span className="title-left">KN</span>
          <span
            ref={toggleRef}
            className="o-button o-circle know-toggle"
            role="button"
            tabIndex={0}
            onClick={() => {
              if (!open) {
                computeVars();
                // small timeout to ensure CSS var is applied before toggling open
                requestAnimationFrame(() => setOpen(true));
              } else setOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (!open) {
                  computeVars();
                  requestAnimationFrame(() => setOpen(true));
                } else setOpen(false);
                e.preventDefault();
              }
            }}
            aria-expanded={open}
          />
          <span className="title-right">W ME</span>
        </h3>
        <p className="section-copy island-moments">Meet the person behind the work... don't worry, I keep it short.</p>

        {/* Inline expanding circle (no overlay) - scales up in place when open */}
        <div
          className={`know-circle ${open ? 'open' : ''}`}
          role="region"
          aria-hidden={!open}
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setOpen(false)}
        >
          <div className="know-inner">
            {(() => {
              const lines = modalText.split('\n');
              return (
                <>
                  <h2 className="know-heading">{lines[0] ? lines[0].trim() : 'hey'}</h2>
                  {lines.slice(1).map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </>
              );
            })()}
          </div>
        </div>
      </article>
    </>
  );
}
