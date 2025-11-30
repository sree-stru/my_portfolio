import React, { useState, useEffect, useRef } from 'react';

export default function Contact() {
  const [contactOpen, setContactOpen] = useState(false);
  const wrapRef = useRef(null);

  // optional: close when clicking outside
  useEffect(() => {
    function onDoc(e) {
      if (!wrapRef.current) return;
      if (contactOpen && !wrapRef.current.contains(e.target)) setContactOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [contactOpen]);

  return (
    <article className="section-card section-card--contact" ref={wrapRef}>
      <h3 className="section-title" aria-label="Get in touch">
        GET IN T
        <span
          className={`o-button o-circle contact-toggle ${contactOpen ? 'open' : ''}`}
          role="button"
          tabIndex={0}
          onClick={() => setContactOpen((s) => !s)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setContactOpen((s) => !s)}
          aria-expanded={contactOpen}
        >
          <a
            className="contact-label"
            href="mailto:anusree.k.jinan123@gmail.com"
            onClick={(e) => {
              // Prevent the parent span from toggling when the email link is clicked
              e.stopPropagation();
            }}
          >
            anusree.k.jinan123@gmail.com
          </a>
        </span>
        UCH
      </h3>
      <p className="section-copy island-moments">Whether it's work or a quick hello, I'm just a message away</p>
    </article>
  );
}
