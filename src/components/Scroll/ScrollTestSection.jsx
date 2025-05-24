// components/ScrollTestSection/ScrollTestSection.jsx
import React from 'react';
import styles from './ScrollTestSection.module.css';

const ScrollTestSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <h2>Sección de Prueba</h2>
        <div className={styles.imageContainer}>
          <img 
            src="/images/siembra.jpg" 
            alt="Prueba de scroll" 
            className={styles.image}
          />
        </div>
        <p>Desliza hacia arriba para ver el efecto en el Hero</p>
      </div>
    </section>
  );
};

export default ScrollTestSection;