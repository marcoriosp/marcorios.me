"use client";

import { useCallback, useEffect, useState } from "react";

interface SliderImage {
  src: string;
  alt: string;
}

const AUTOPLAY_MS = 3000;

export function PostSlider({ images }: { images: SliderImage[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const count = images.length;

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);

  useEffect(() => {
    if (paused || lightbox !== null || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, lightbox, count, go]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      else if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % count));
      else if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? i : (i - 1 + count) % count));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, count]);

  if (count === 0) return null;
  const current = lightbox === null ? null : images[lightbox];

  return (
    <div
      className="su-slider"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="su-slider-slides">
        {images.map((image, i) => (
          <div
            key={image.src}
            className={`su-slider-slide${i === index ? " is-active" : ""}`}
            aria-hidden={i !== index}
          >
            <button type="button" tabIndex={i === index ? 0 : -1} onClick={() => setLightbox(i)} aria-label={`Open ${image.alt}`}>
              <img src={image.src} alt={image.alt} loading={i === 0 ? "eager" : "lazy"} decoding="async" />
              <span className="su-slider-slide-title">{image.alt}</span>
            </button>
          </div>
        ))}
        {count > 1 && (
          <>
            <button type="button" className="su-slider-prev" aria-label="Previous slide" onClick={() => go(-1)}>
              <i className="fa fa-chevron-left" aria-hidden="true" />
            </button>
            <button type="button" className="su-slider-next" aria-label="Next slide" onClick={() => go(1)}>
              <i className="fa fa-chevron-right" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
      {count > 1 && (
        <div className="su-slider-pages">
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              className={i === index ? "is-active" : undefined}
              aria-label={`Slide ${i + 1}`}
              aria-current={i === index || undefined}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}

      {current && lightbox !== null && (
        <div className="pf-lightbox" role="dialog" aria-modal="true" aria-label={current.alt} onClick={() => setLightbox(null)}>
          <figure className="pf-lightbox-figure" onClick={(e) => e.stopPropagation()}>
            <img src={current.src} alt={current.alt} />
            <figcaption>
              <span className="pf-meta">
                {lightbox + 1} / {count}
              </span>
              <span className="pf-title">{current.alt}</span>
            </figcaption>
          </figure>
          <button type="button" className="pf-lightbox-close" aria-label="Close" onClick={() => setLightbox(null)}>
            &#10005;
          </button>
          {count > 1 && (
            <>
              <button
                type="button"
                className="pf-lightbox-nav is-prev"
                aria-label="Previous"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((lightbox - 1 + count) % count);
                }}
              >
                &#8249;
              </button>
              <button
                type="button"
                className="pf-lightbox-nav is-next"
                aria-label="Next"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((lightbox + 1) % count);
                }}
              >
                &#8250;
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
