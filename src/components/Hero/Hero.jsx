// src/components/HeroSection.jsx
import React, { useRef, useEffect, useState, useMemo } from 'react';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const heroContainerRef = useRef(null);
  const videoRef = useRef(null);
  const [currentStage, setCurrentStage] = useState(null);
  const [metadataLoaded, setMetadataLoaded] = useState(false);
  const lastScrollTime = useRef(0);
  const scrollTimeout = useRef(null);
  const isTransitioning = useRef(false);
  const touchStartY = useRef(0);
  const lastTouchY = useRef(0);
  const touchStartTime = useRef(0);
  const hasMoved = useRef(false);
  const stageTextRef = useRef(null);
  const [videosLoaded, setVideosLoaded] = useState(false);
  const previousStageRef = useRef(null);

  // Definición de etapas memoizada
  const stages = useMemo(() => [
    {
      title: "Siembra",
      description: "Plantación de semillas en viveros controlados. Se seleccionan las variedades adecuadas para la región y se da un ambiente óptimo para el crecimiento inicial de la planta.",
      video: "/videos/siembra.mp4",
      textStart: 2,
      textEnd: 5
    },
    {
      title: "Cosecha",
      description: "Recolección manual de los granos de café en su punto óptimo de maduración. Esta etapa requiere de gran precisión para seleccionar solo los frutos maduros.",
      video: "/videos/cosecha.mp4",
      textStart: 1.5,
      textEnd: 4.5
    },
    {
      title: "Lavado",
      description: "Proceso de fermentación y lavado para eliminar la pulpa del grano. Los granos se clasifican por densidad y calidad mediante canales de agua.",
      video: "/videos/lavado.mp4",
      textStart: 1.8,
      textEnd: 4.8
    },
    {
      title: "Trillado",
      description: "El proceso en el que se elimina la cáscara seca del grano de café para obtener el grano verde.",
      video: "/videos/trillado.mp4",
      textStart: 2.2,
      textEnd: 5.2
    },
    {
      title: "Secado",
      description: "Un segundo secado que asegura que los granos estén completamente secos antes del almacenamiento o exportación.",
      video: "/videos/secado.mp4",
      textStart: 2.2,
      textEnd: 5.2
    },
    {
      title: "Tostado",
      description: "El proceso de tostar los granos de café para desarrollar su sabor y aroma característicos.",
      video: "/videos/tostado.mp4",
      textStart: 2.2,
      textEnd: 5.2
    },
    {
      title: "Molienda",
      description: "El proceso de moler los granos de café tostados para preparar el café.",
      video: "/videos/molienda.mp4",
      textStart: 2.2,
      textEnd: 5.2
    },
    {
      title: "Preparación",
      description: "El proceso de preparar el café a partir de los granos molidos.",
      video: "/videos/preparacion.mp4",
      textStart: 2.2,
      textEnd: 5.2
    },
    {
      title: "Consumo",
      description: "El proceso de preparar el café a partir de los granos molidos.",
      video: "/videos/final.mp4",
      textStart: 2.2,
      textEnd: 5.2
    }
  ], []);

  // Precargar todos los videos
  useEffect(() => {
    const videoPromises = stages.map(stage => {
      return new Promise((resolve) => {
        const video = document.createElement('video');
        video.src = stage.video;
        video.preload = 'auto';
        video.onloadeddata = () => resolve();
        video.load();
      });
    });

    Promise.all(videoPromises).then(() => {
      setVideosLoaded(true);
    });
  }, [stages]); // Añadido stages como dependencia

  // Umbrales y factores
  const SCROLL_THRESHOLD = 3;
  const SCROLL_FACTOR = 0.0020;
  const MOBILE_SENSITIVITY = 1.5;

  useEffect(() => {
    // 1) Precargar imagen inicial
    const img = new Image();
    img.src = "/images/rutadelcafe.jpg";
    img.onload = () => {
      if (heroContainerRef.current && currentStage === null) {
        heroContainerRef.current.style.backgroundImage = `url(${img.src})`;
      }
    };
    if (heroContainerRef.current && currentStage === null) {
      heroContainerRef.current.style.backgroundImage = `url(/images/rutadelcafe.jpg)`;
      heroContainerRef.current.style.backgroundSize = "cover";
      heroContainerRef.current.style.backgroundPosition = "center";
    }

    // 2) Manejar metadatos del video
    const videoEl = videoRef.current;
    const handleLoadedData = () => {
      setMetadataLoaded(true);
      if (videoEl) {
        videoEl.currentTime = 0;
        videoEl.pause();
      }
    };

    const handleVideoChange = () => {
      if (videoEl) {
        // Si ya está cargado, manejamos inmediatamente
        if (videoEl.readyState >= 1) {
          handleLoadedData();
        } else {
          // Agregar listener para cuando cargue
          videoEl.addEventListener('loadeddata', handleLoadedData);
        }
      }
    };

    // Si hay un video activo y los videos están cargados, configurarlo
    if (currentStage !== null && videosLoaded) {
      previousStageRef.current = currentStage;
      videoEl.src = stages[currentStage].video;
      handleVideoChange();
    }

    // 3) Handler de scroll proporcional + threshold + fade
    const handleScroll = (deltaY) => {
      if (!metadataLoaded || isTransitioning.current || currentStage === null) return;
      if (Math.abs(deltaY) < SCROLL_THRESHOLD) return;

      const now = Date.now();

      lastScrollTime.current = now;

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = setTimeout(() => {
        if (videoRef.current && currentStage !== null) {
          videoRef.current.pause();
        }
      }, 300);

      const video = videoRef.current;
      if (!video) return;

      // Velocidad relativa
      const speedFactor = 1;
      const deltaTime = deltaY * SCROLL_FACTOR * speedFactor;

      let newTime = video.currentTime + deltaTime;

      if (newTime < 0) newTime = 0;
      if (newTime > video.duration) newTime = video.duration;
      video.currentTime = newTime;

      if (video.paused) {
        video.play().catch(() => { });
      }

      // Control de opacidad del texto basado en el tiempo del video
      if (stageTextRef.current) {
        const stage = stages[currentStage];
        let opacity = 0;

        // Aparecer gradualmente después del tiempo de inicio
        if (newTime >= stage.textStart && newTime < stage.textEnd) {
          opacity = (newTime - stage.textStart) / (stage.textEnd - stage.textStart);
        }
        // Mantener visible hasta el tiempo final
        else if (newTime >= stage.textEnd && newTime < stage.textEnd + 1) {
          opacity = 1;
        }
        // Desaparecer gradualmente después del tiempo final
        else if (newTime >= stage.textEnd + 1) {
          opacity = 1 - (newTime - (stage.textEnd + 1)) / 1;
          if (opacity < 0) opacity = 0;
        }

        stageTextRef.current.style.opacity = opacity;
      }

      // Detectar retroceso al inicio
      if (newTime <= 0 && deltaY < 0) {
        isTransitioning.current = true;
        video.currentTime = 0;
        video.classList.remove(styles.showVideo);

        setTimeout(() => {
          // Si es la primera etapa, volver a inicio
          if (currentStage === 0) {
            setCurrentStage(null);
            document.querySelector('header')?.classList.remove(styles.hideHeader);
            heroContainerRef.current.style.backgroundImage = `url(/images/rutadelcafe.jpg)`;
          } else {
            // Retroceder a la etapa anterior
            setCurrentStage(currentStage - 1);
          }

          video.pause();
          isTransitioning.current = false;
        }, 400);
      }

      // Avanzar a la siguiente etapa al final del video
      if (newTime >= video.duration - 0.1 && currentStage < stages.length - 1) {
        setCurrentStage(currentStage + 1);
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

      if (!hasMoved.current && Math.abs(dyTotal) < 10) {
        return;
      }
      hasMoved.current = true;
      e.preventDefault();

      const deltaY = lastTouchY.current - currentY;
      lastTouchY.current = currentY;
      handleScroll(deltaY * MOBILE_SENSITIVITY);
    };

    const onTouchEnd = () => { };

    // 6) Añadir listeners solo si hay una etapa activa
    if (currentStage !== null) {
      window.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('touchstart', onTouchStart, { passive: false });
      window.addEventListener('touchmove', onTouchMove, { passive: false });
    }

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (videoEl && currentStage !== null) {
        videoEl.removeEventListener('loadeddata', handleLoadedData);
      }
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [currentStage, metadataLoaded, videosLoaded, stages]); // Añadido stages como dependencia

  // Iniciar etapa al hacer scroll hacia abajo en la pantalla inicial
  useEffect(() => {
    const handleInitialScroll = (e) => {
      if (currentStage === null && e.deltaY > 0) {
        setCurrentStage(0);
        document.querySelector('header')?.classList.add(styles.hideHeader);
        heroContainerRef.current.style.backgroundImage = 'none';
      }
    };

    if (currentStage === null) {
      window.addEventListener('wheel', handleInitialScroll);
    }

    return () => {
      window.removeEventListener('wheel', handleInitialScroll);
    };
  }, [currentStage]);

  return (
    <div className={styles.wrapperRoot}>
      <div
        className={styles.heroContainer}
        ref={heroContainerRef}
        style={{
          backgroundImage: currentStage === null
            ? `url(/images/rutadelcafe.jpg)`
            : 'none'
        }}
      >
        {currentStage !== null && videosLoaded && (
          <video
            ref={videoRef}
            className={`${styles.video} ${styles.showVideo}`}
            muted
            playsInline
            preload="auto"
            key={stages[currentStage].video} // Forzar nueva instancia para evitar destellos
          />
        )}

        <div className={styles.overlay}></div>

        {/* Pantalla inicial */}
        {currentStage === null && (
          <div className={`${styles.frameText} ${styles.visible}`}>
            <div className={styles.initialText}>
              <h1 className={styles.mainTitle}>LA RUTA DEL CAFÉ</h1>
              <p className={styles.subtitle}>DESLIZA HACIA ABAJO PARA</p>
              <p className={styles.subtitle}>EXPLORAR LA RUTA DEL CAFÉ</p>
            </div>
          </div>
        )}

        {/* Texto de la etapa actual */}
        {currentStage !== null && (
          <div
            ref={stageTextRef}
            className={`${styles.frameText} ${styles.visible}`}
            style={{ opacity: 0 }}
          >
            <div className={styles.stageText}>
              <h1 className={styles.stageTitle}>{stages[currentStage].title}</h1>
              <p className={styles.stageDesc}>
                {stages[currentStage].description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Secciones de cada etapa */}
      <section className={styles.process}>
        {stages.map((stage, index) => (
          <div
            key={index}
            className={styles.stageSection}
            style={{ top: `${100 * (index + 1)}vh` }}
          >
            <h2>{stage.title.toUpperCase()}</h2>
            <p>{stage.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default HeroSection;