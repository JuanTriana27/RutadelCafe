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

  useEffect(() => {
    // Precargar recursos
    const img = new Image();
    img.src = "/images/rutadelcafe.jpg";
    img.onload = () => {
      if (heroContainerRef.current && !showSiembra) {
        heroContainerRef.current.style.backgroundImage = `url(${img.src})`;
      }
    };

    // 1) Configurar imagen inicial
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

    // 3) Handler de scroll proporcional
    const handleScroll = (deltaY) => {
      if (!metadataLoaded || isTransitioning.current) return;

      const now = Date.now();
      const timeDiff = now - lastScrollTime.current;
      lastScrollTime.current = now;

      // Limpiar timeout de pausa anterior
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Configurar timeout para pausa automática
      scrollTimeout.current = setTimeout(() => {
        if (videoRef.current && showSiembra) {
          videoRef.current.pause();
        }
      }, 100);

      const video = videoRef.current;
      if (!video) return;

      // Activación inicial con scroll hacia abajo
      if (!showSiembra && deltaY > 0) {
        setShowSiembra(true);
        document.querySelector('header')?.classList.add(styles.hideHeader);
        heroContainerRef.current.style.backgroundImage = 'none';
        video.currentTime = 0;
        video.play().catch(err => console.log("Play error:", err));
        return;
      }

      if (showSiembra) {
        // Calcular velocidad basada en tiempo entre eventos
        const speedFactor = timeDiff > 0 ? Math.min(2, 100 / timeDiff) : 1;

        // Scroll hacia abajo (deltaY positivo) avanza el video
        const SCROLL_FACTOR = 0.0005;
        const deltaTime = deltaY * SCROLL_FACTOR * speedFactor;

        let newTime = video.currentTime + deltaTime;

        // Manejar límites
        if (newTime < 0) {
          newTime = 0;
        }

        if (newTime > video.duration) {
          newTime = video.duration;
        }

        // Actualizar tiempo del video
        video.currentTime = newTime;

        // Asegurar reproducción si no está reproduciendo
        if (video.paused) {
          video.play().catch(err => console.log("Play error:", err));
        }

        // Comprobar si debemos volver a la imagen
        if (newTime <= 0 && deltaY < 0) {
          isTransitioning.current = true;

          // Esperar a que la transición de opacidad termine
          setTimeout(() => {
            setShowSiembra(false);
            document.querySelector('header')?.classList.remove(styles.hideHeader);
            heroContainerRef.current.style.backgroundImage = `url(/images/rutadelcafe.jpg)`;
            video.pause();
            isTransitioning.current = false;
          }, 400); // Tiempo igual a la duración de la transición en CSS
        }
      }
    };

    // 4) Handler de wheel para desktop
    const onWheel = (e) => {
      e.preventDefault();
      handleScroll(e.deltaY);
    };

    // 5) Handlers para touch en móvil
    const onTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
      lastTouchY.current = e.touches[0].clientY;
      touchStartTime.current = Date.now();
    };

    const onTouchMove = (e) => {
      e.preventDefault();
      const touchY = e.touches[0].clientY;
      const deltaY = lastTouchY.current - touchY; // Diferencia desde el último movimiento
      lastTouchY.current = touchY;

      // Calcular velocidad de desplazamiento
      const now = Date.now();
      const timeDiff = now - touchStartTime.current;
      touchStartTime.current = now;

      // Factor de sensibilidad para móvil (puede ajustarse)
      const mobileSensitivity = 1.5;
      handleScroll(deltaY * mobileSensitivity);
    };

    const onTouchEnd = () => {
      // No se necesita acción adicional
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