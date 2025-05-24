import { useRef, useEffect } from "react";

const useScrollDirection = () => {
    const scrollDirection = useRef("down");
    const prevScrollY = useRef(window.scrollY);
    const lastUpdate = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const now = Date.now();
            if (now - lastUpdate.current < 100) return; // Limitar a 10fps

            const currentScrollY = window.scrollY;
            scrollDirection.current = currentScrollY > prevScrollY.current ? "down" : "up";
            prevScrollY.current = currentScrollY;
            lastUpdate.current = now;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return scrollDirection;
};

export default useScrollDirection;