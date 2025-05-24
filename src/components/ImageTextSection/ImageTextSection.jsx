import React, { useRef } from 'react';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import styles from './ImageTextSection.module.css';

const ImageTextSection = ({ imageUrl, title, text, fact }) => {
    const sectionRef = useRef(null);
    const scrollDirection = useScrollDirection();

    return (
        <section
            ref={sectionRef}
            className={`${styles.section} ${scrollDirection.current === 'down' ? styles.animateIn : styles.animateOut}`}
        >
            <div className={styles.contentWrapper}>
                <div className={styles.textContainer}>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.text}>{text}</p>
                    {fact && <div className={styles.factBox}>{fact}</div>}
                </div>
                <div className={styles.imageContainer}>
                    <img
                        src={imageUrl}
                        alt={title}
                        className={styles.image}
                        loading="lazy"
                    />
                </div>
            </div>
        </section>
    );
};

export default ImageTextSection;