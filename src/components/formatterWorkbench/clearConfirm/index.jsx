import { useEffect, useRef } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const ClearConfirm = ({ onCancel, onConfirm }) => {
    const cancelButtonRef = useRef(null);

    useEffect(() => {
        cancelButtonRef.current?.focus();
        const handleKeyDown = (event) => {
            if (event.key === "Escape") onCancel();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onCancel]);

    return (
        <div className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
            <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="clear-title" aria-describedby="clear-description">
                <button className={styles.closeButton} type="button" aria-label="Close clear dialog" onClick={onCancel}><FiX aria-hidden="true" /></button>
                <span className={styles.icon}><FiAlertTriangle aria-hidden="true" /></span>
                <h2 id="clear-title">Clear the editor?</h2>
                <p id="clear-description">The input and formatted output will be removed from this page. This action cannot be undone.</p>
                <div className={styles.actions}>
                    <button ref={cancelButtonRef} className={styles.cancelButton} type="button" onClick={onCancel}>Keep my JSON</button>
                    <button className={styles.confirmButton} type="button" onClick={onConfirm}>Clear content</button>
                </div>
            </section>
        </div>
    );
};

export default ClearConfirm;
