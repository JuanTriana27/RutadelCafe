import React from 'react';
import HeroSection from '../Hero/Hero';
import SectionObserver from '../SectionObserver/SectionObserver';
import styles from './HomePage.module.css';

const HomePage = () => {
    return (
        <div className={styles.pageContainer}>
            <HeroSection
                backgroundImage="/images/siembra.jpg"
                overlayOpacity={0.7}
            />

            <SectionObserver>
                <section className={styles.contentSection}>
                    <div className={styles.textContent}>
                        <h2>Proceso de Siembra</h2>
                        <p>El cafeto requiere condiciones específicas para su cultivo:</p>
                        <ul className={styles.list}>
                            <li>Altitud entre 800 y 1,800 msnm</li>
                            <li>Temperatura promedio de 19-25°C</li>
                            <li>Suelos ricos en materia orgánica</li>
                        </ul>
                    </div>

                    <div className={styles.imageWrapper}>
                        <img
                            src="/images/siembra-detalle.jpg"
                            alt="Detalle de siembra"
                            className={styles.detailImage}
                        />
                    </div>
                </section>
            </SectionObserver>

            {/* Repite para más secciones */}
        </div>
    );
};

export default HomePage;