// src/components/HeroSection.jsx
import React, { useRef, useEffect, useState } from 'react';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const heroContainerRef = useRef(null);
  const videoRef = useRef(null);
  const [showSiembra, setShowSiembra] = useState(false);
  const [metadataLoaded, setMetadataLoaded] = useState(false);
  const lastScrollTime = useRef(0);
  const scrollTimeout = useRef(null);
  const isTransitioning = useRef(false);
  const touchStartY = useRef(0);
  const lastTouchY = useRef(0);
  const touchStartTime = useRef(0);
  const hasMoved = useRef(false);

  // Umbrales y factores
  const SCROLL_THRESHOLD = 5;       // px mínimos para contar como scroll significativo
  const SCROLL_FACTOR = 0.0005;     // factor para mapear deltaY → segundos de video
  const MOBILE_SENSITIVITY = 1.5;   // sensibilidad touch

  useEffect(() => {
    // 1) Precargar y configurar imagen inicial
    const img = new Image();
    img.src = "/images/rutadelcafe.jpg";
    img.onload = () => {
      if (heroContainerRef.current && !showSiembra) {
        heroContainerRef.current.style.backgroundImage = `url(${img.src})`;
      }
    };
    if (heroContainerRef.current) {
      heroContainerRef.current.style.backgroundImage = `url(/images/rutadelcafe.jpg)`;
      heroContainerRef.current.style.backgroundSize = "cover";
      heroContainerRef.current.style.backgroundPosition = "center";
    }

    // 2) Manejar metadatos del video
    const videoEl = videoRef.current;
    const handleLoadedData = () => {
      setMetadataLoaded(true);
      videoEl.currentTime = 0;
      videoEl.pause();
    };
    if (videoEl) {
      if (videoEl.readyState >= 1) {
        handleLoadedData();
      } else {
        videoEl.addEventListener('loadeddata', handleLoadedData);
      }
    }

    // 3) Handler de scroll proporcional + threshold + fade
    const handleScroll = (deltaY) => {
      if (!metadataLoaded || isTransitioning.current) return;
      if (Math.abs(deltaY) < SCROLL_THRESHOLD) return;

      const now = Date.now();
      const timeDiff = now - lastScrollTime.current;
      lastScrollTime.current = now;

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = setTimeout(() => {
        if (videoRef.current && showSiembra) {
          videoRef.current.pause();
        }
      }, 100);

      const video = videoRef.current;
      if (!video) return;

      // Activación inicial: scroll hacia abajo
      if (!showSiembra && deltaY > 0) {
        setShowSiembra(true);
        document.querySelector('header')?.classList.add(styles.hideHeader);
        heroContainerRef.current.style.backgroundImage = 'none';
        video.currentTime = 0;
        video.classList.add(styles.showVideo);
        video.play().catch(() => {});
        return;
      }

      if (showSiembra) {
        // velocidad relativa
        const speedFactor = timeDiff > 0 ? Math.min(2, 100 / timeDiff) : 1;
        const deltaTime = deltaY * SCROLL_FACTOR * speedFactor;
        let newTime = video.currentTime + deltaTime;

        if (newTime < 0) newTime = 0;
        if (newTime > video.duration) newTime = video.duration;
        video.currentTime = newTime;

        if (video.paused) {
          video.play().catch(() => {});
        }

        // Detectar retroceso al inicio
        if (newTime <= 0 && deltaY < 0) {
          isTransitioning.current = true;
          video.currentTime = 0;
          video.classList.remove(styles.showVideo);
          setTimeout(() => {
            setShowSiembra(false);
            document.querySelector('header')?.classList.remove(styles.hideHeader);
            heroContainerRef.current.style.backgroundImage = `url(/images/rutadelcafe.jpg)`;
            video.pause();
            isTransitioning.current = false;
          }, 400);
        }

        // Detectar fin del video para liberar scroll
        if (newTime >= video.duration - 0.01) {
          window.removeEventListener('wheel', onWheel);
          window.removeEventListener('touchmove', onTouchMove);
          document.body.style.overflow = 'auto';
        }
      }
    };

    // 4) onWheel (desktop)
    const onWheel = (e) => {
      e.preventDefault();
      handleScroll(e.deltaY);
    };

    // 5) Handlers touch (móvil)
    const onTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
      lastTouchY.current = e.touches[0].clientY;
      touchStartTime.current = Date.now();
      hasMoved.current = false;
    };

    const onTouchMove = (e) => {
      const currentY = e.touches[0].clientY;
      const dyTotal = touchStartY.current - currentY;
      

      // Si no se ha movido lo suficiente, permitir scroll nativo
      if (!hasMoved.current && Math.abs(dyTotal) < 10) {
        return;
      }
      hasMoved.current = true;
      e.preventDefault();

      const deltaY = lastTouchY.current - currentY;
      lastTouchY.current = currentY;
      handleScroll(deltaY * MOBILE_SENSITIVITY);
    };

    const onTouchEnd = () => {
      // nada adicional
    };

    // 6) Añadir listeners
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: false });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (videoEl) videoEl.removeEventListener('loadeddata', handleLoadedData);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      document.body.style.overflow = ''; // restaurar overflow si fue modificado
    };
  }, [showSiembra, metadataLoaded]);

  return (
    <div className={styles.wrapperRoot}>
      <div className={styles.heroContainer} ref={heroContainerRef}>
        <video
          ref={videoRef}
          src="/videos/siembra.mp4"
          className={`${styles.video} ${showSiembra ? styles.showVideo : ''}`}
          muted
          playsInline
          preload="auto"
        />

        <div className={styles.overlay}></div>

        {/* Texto inicial */}
        <div className={`${styles.frameText} ${!showSiembra ? styles.visible : styles.hidden}`}>
          <div className={styles.initialText}>
            <h1 className={styles.mainTitle}>LA RUTA DEL CAFÉ</h1>
            <p className={styles.subtitle}>DESLIZA HACIA ABAJO PARA</p>
            <p className={styles.subtitle}>EXPLORAR LA RUTA DEL CAFÉ</p>
          </div>
        </div>

        {/* Texto de "Siembra" */}
        <div className={`${styles.frameText} ${showSiembra ? styles.visible : styles.hidden}`}>
          <div className={styles.stageText}>
            <h1 className={styles.stageTitle}>Siembra</h1>
            <p className={styles.stageDesc}>
              Plantación de semillas en viveros controlados. Se seleccionan las variedades adecuadas para la región y se da un ambiente
              óptimo para el crecimiento inicial de la planta.
            </p>
          </div>
        </div>
      </div>

      {/* Sección "Siembra" tras el héroe */}
      <section className={styles.process}>
        <h2>SIEMBRA</h2>
        <p>Plantación de semillas en viveros controlados</p>
        <span>3-4 años para primera cosecha</span>
      </section>
    </div>
  );
};

export default HeroSection;