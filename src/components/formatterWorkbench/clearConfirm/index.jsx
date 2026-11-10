import { useEffect, useRef } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const ClearConfirm = ({ onCancel, onConfirm }) => {
    const dialogRef = useRef(null);
    const cancelButtonRef = useRef(null);
    const onCancelRef = useRef(onCancel);

    useEffect(() => {
        onCancelRef.current = onCancel;
    }, [onCancel]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return undefined;

        const previousFocus = document.activeElement;
        const getFocusable = () => Array.from(dialog.querySelectorAll(
            "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]",
        ));
        cancelButtonRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onCancelRef.current();
                return;
            }
            if (event.key !== "Tab") return;

            const focusable = getFocusable();
            if (!focusable.length) {
                event.preventDefault();
                dialog.focus();
                return;
            }
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (!dialog.contains(document.activeElement)) {
                event.preventDefault();
                (event.shiftKey ? last : first).focus();
            } else if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            const returnFocus = previousFocus instanceof HTMLElement && previousFocus.isConnected
                ? previousFocus
                : document.getElementById("json-input");
            returnFocus?.focus();
        };
    }, []);

    return (
        <div className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
            <section ref={dialogRef} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="clear-title" aria-describedby="clear-description" tabIndex={-1}>
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
