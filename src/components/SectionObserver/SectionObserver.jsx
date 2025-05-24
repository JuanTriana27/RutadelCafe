import React, { useRef, useEffect } from 'react';
import { useScrollDirection } from '../../hooks/useScrollDirection';

const SectionObserver = ({ children }) => {
    const sectionRef = useRef(null);
    const scrollDirection = useScrollDirection();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = scrollDirection.current === 'down'
                            ? 'translateY(0)'
                            : 'translateY(-20px)';
                    } else {
                        entry.target.style.opacity = '0';
                        entry.target.style.transform = scrollDirection.current === 'down'
                            ? 'translateY(50px)'
                            : 'translateY(-50px)';
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);

        return () => {
            if (sectionRef.current) observer.unobserve(sectionRef.current);
        };
    }, [scrollDirection]);

    return <div ref={sectionRef} style={{ transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}>{children}</div>;
};

export default SectionObserver;