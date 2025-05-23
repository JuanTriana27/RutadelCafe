import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <nav>
                <ul className={styles.navList}>
                    <li>
                        <Link to="/" className={styles.navLink}>INICIO</Link>
                    </li>
                    <li>
                        <Link to="/nosotros" className={styles.navLink}>NOSOTROS</Link>
                    </li>
                    <li>
                        <Link to="/contacto" className={styles.navLink}>CONTACTENOS</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;