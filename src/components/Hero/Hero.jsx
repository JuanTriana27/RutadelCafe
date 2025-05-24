import React, { useRef, useEffect, useState } from 'react';
import styles from './HeroSection.module.css';
import useScrollDirection from '../../hooks/useScrollDirection';

const HeroSection = () => {
  const heroRef = useRef(null);
  const scrollDirection = useScrollDirection();
  const [currentSection, setCurrentSection] = useState(0);

  // Secciones: Hero inicial + 3 pasos del proceso
  const sections = [
    {
      type: 'hero',
      image: '/images/rutadelcafe.jpg',
      title: 'LA RUTA DEL CAFE',
      subtitles: [
        'AVANZA CON EL SCROLL Y',
        'EXPLORA LA RUTA DEL CAFE'
      ],
      overlayOpacity: 0.7
    },
    {
      type: 'process',
      image: '/images/siembra.jpg',
      title: 'SIEMBRA',
      content: 'Plantación de semillas en viveros controlados',
      fact: '3-4 años para primera cosecha'
    },
    {
      type: 'process',
      image: '/images/cosecha.jpg',
      title: 'COSECHA',
      content: 'Recolección manual selectiva de granos maduros',
      fact: 'Un recolector experto cosecha hasta 100 kg diarios'
    },
    {
      type: 'process',
      image: '/images/procesado.jpg',
      title: 'PROCESADO',
      content: 'Fermentación y secado natural de los granos',
      fact: '8-10 días de secado al sol'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const sectionIndex = Number(entry.target.dataset.section);
          const direction = scrollDirection.current;

          if (entry.isIntersecting) {
            entry.target.classList.add(styles.animateIn);
            entry.target.classList.remove(
              direction === 'down' ? styles.animateOutDown : styles.animateOutUp
            );
            setCurrentSection(sectionIndex);
          } else {
            entry.target.classList.remove(styles.animateIn);
            entry.target.classList.add(
              direction === 'down' ? styles.animateOutDown : styles.animateOutUp
            );
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -30% 0px'
      }
    );

    document.querySelectorAll('[data-section]').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [scrollDirection]);

  // Actualizamos el handleWheel para scroll suave
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    const newSection = currentSection + delta;

    if (newSection >= 0 && newSection < sections.length) {
      window.scrollTo({
        top: window.innerHeight * newSection,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={styles.container} onWheel={handleWheel}>
      {sections.map((section, index) => (
        <section
          key={index}
          data-section={index}
          ref={index === 0 ? heroRef : null}
          className={`${styles.section} ${section.type === 'hero' ? styles.hero : styles.process}`}
          style={{ '--bg-image': `url(${section.image})` }}
        >
          <div className={styles.overlay} style={{ opacity: section.overlayOpacity || 0.5 }}></div>

          <div className={styles.content}>
            {section.type === 'hero' ? (
              <>
                <h1 className={styles.mainTitle}>{section.title}</h1>
                <div className={styles.subtitleContainer}>
                  {section.subtitles.map((subtitle, i) => (
                    <p key={i} className={styles.subtitle}>{subtitle}</p>
                  ))}
                </div>
              </>
            ) : (
              <div className={styles.processContent}>
                <h2 className={styles.processTitle}>{section.title}</h2>
                <p className={styles.processText}>{section.content}</p>
                <div className={styles.processFact}>
                  <span>DATO CURIOSO</span>
                  <p>{section.fact}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
};

export default HeroSection;