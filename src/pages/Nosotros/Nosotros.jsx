import React from 'react';
import Header from '../../components/Header/Header';
import styles from './Nosotros.module.css';

const Nosotros = () => {
    return (
        <div className={styles.nosotrosContainer}>
            <Header />
            <div className={styles.heroSection}>
                <h1>NOSOTROS</h1>
                <p>Conoce nuestra historia y pasión por el café.</p>
            </div>

            {/* Contenido adicional */}
            <section className={styles.content}>
                <h2>Nuestra Tradición</h2>
                <p>Desde 1990, cultivamos café con métodos sostenibles...</p>
            </section>
        </div>
    );
};

export default Nosotros;