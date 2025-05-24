import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <button
                    className={styles.hamburger}
                    onClick={handleMenuToggle}
                    aria-label="Abrir menú"
                >
                    <span className={styles.bar}></span>
                    <span className={styles.bar}></span>
                    <span className={styles.bar}></span>
                </button>
                <ul className={`${styles.navList} ${menuOpen ? styles.open : ''}`}>
                    <li>
                        <Link to="/" className={styles.navLink} onClick={() => setMenuOpen(false)}>INICIO</Link>
                    </li>
                    <li>
                        <Link to="/nosotros" className={styles.navLink} onClick={() => setMenuOpen(false)}>NOSOTROS</Link>
                    </li>
                    <li>
                        <Link to="/contacto" className={styles.navLink} onClick={() => setMenuOpen(false)}>CONTACTENOS</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;