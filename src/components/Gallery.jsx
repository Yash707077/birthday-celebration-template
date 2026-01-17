import { gsap } from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import "./Gallery.css";

function Gallery({ isActive }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photosRevealed, setPhotosRevealed] = useState(false);

  const photosRef = useRef([]);
  const lightboxImgRef = useRef(null);

  const photos = [
    { src: "/IMG_20260115_182706_321.jpg", alt: "Memory 1" },
    { src: "/IMG_20260115_182708_368.jpg", alt: "Memory 2" },
    { src: "/IMG_20260115_182713_309.jpg", alt: "Memory 3" },
    { src: "/IMG_20260115_182715_146.jpg", alt: "Memory 4" },
    { src: "/IMG_20260115_214915_769.jpg", alt: "Memory 5" },
    { src: "/IMG_20260115_214918_361.jpg", alt: "Memory 6" },
    { src: "/IMG_20260115_214921_306.jpg", alt: "Memory 7" },
    { src: "/IMG_20260115_214929_911.jpg", alt: "Memory 8" },
    { src: "/IMG_20260115_214931_810.jpg", alt: "Memory 9" },
    { src: "/IMG_20260115_214947_729.jpg", alt: "Memory 10" },
  ];

  // Reveal photos with GSAP when page becomes active
  useEffect(() => {
    if (isActive && !photosRevealed) {
      setTimeout(() => setPhotosRevealed(true), 10);
    }
  }, [isActive, photosRevealed]);

  useEffect(() => {
    if (photosRevealed) {
      // Stagger animation for photos
      gsap.fromTo(
        photosRef.current,
        {
          opacity: 0,
          scale: 0.8,
          y: 50,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [photosRevealed]);

  const openLightbox = useCallback((index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const nextPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const prevPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Animate lightbox image when it changes
  useEffect(() => {
    if (lightboxOpen && lightboxImgRef.current) {
      gsap.fromTo(
        lightboxImgRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [currentIndex, lightboxOpen]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, closeLightbox, nextPhoto, prevPhoto]);

  return (
    <div className="gallery-container">
      <h2 className="gallery-title">
        📷 📸 my gurll! 📷
      </h2>

      <div className="photo-grid">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="photo-item"
            ref={(el) => (photosRef.current[index] = el)}
            onClick={() => openLightbox(index)}
          >
            <img src={photo.src} alt={photo.alt} loading="lazy" />
            <div className="photo-overlay">
              <span>{photo.alt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>
            ✕
          </button>
          <button
            className="lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              prevPhoto();
            }}
          >
            ❮
          </button>
          <img
            ref={lightboxImgRef}
            src={photos[currentIndex].src}
            alt={photos[currentIndex].alt}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
          >
            ❯
          </button>
          <div className="lightbox-caption">{photos[currentIndex].alt}</div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
