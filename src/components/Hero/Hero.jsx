import React from 'react';
import styles from './HeroSection.module.css';

const HeroSection = ({ backgroundImage }) => {
    return (
        <div
            className={styles.heroContainer}
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className={styles.heroContent}>
                <h1 className={styles.title}>LA RUTA DEL CAFE</h1>
                <p className={styles.subtitle}>AVANZA CON EL SCROLL Y</p>
                <p className={styles.subtitle}>EXPLORA LA RUTA DEL CAFE</p>
            </div>
        </div>
    );
};

export default HeroSection;