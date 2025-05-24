import React from 'react';
import Header from '../../components/Header/Header';
import styles from './Contacto.module.css';

const Contacto = () => {
    return (
        <div className={styles.contactoContainer}>
            <Header />
            <div className={styles.heroSection}>
                <h1>CONTÁCTENOS</h1>
                <p>¿Tienes preguntas? Escríbenos.</p>
            </div>

            {/* Formulario de contacto */}
            <section className={styles.formSection}>
                <form className={styles.contactForm}>
                    <input type="text" placeholder="Nombre" required />
                    <input type="email" placeholder="Correo electrónico" required />
                    <textarea placeholder="Mensaje" rows="5" required></textarea>
                    <button type="submit">Enviar</button>
                </form>
            </section>
        </div>
    );
};

export default Contacto;