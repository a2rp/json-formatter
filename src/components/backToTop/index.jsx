import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import styles from "./styles.module.css";

const BackToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const updateVisibility = () => setVisible(window.scrollY > 50);
        updateVisibility();
        window.addEventListener("scroll", updateVisibility, { passive: true });
        return () => window.removeEventListener("scroll", updateVisibility);
    }, []);

    return visible ? <button className={styles.button} type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><FiArrowUp aria-hidden="true" /></button> : null;
};

export default BackToTop;
