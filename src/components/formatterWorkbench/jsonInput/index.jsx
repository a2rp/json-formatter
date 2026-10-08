import { FiRefreshCw } from "react-icons/fi";
import styles from "./styles.module.css";

const JsonInput = ({ value, onChange, onLoadExample, lineCount }) => (
    <section className={styles.pane} aria-labelledby="input-title">
        <div className={styles.paneHeader}>
            <div className={styles.paneTitle}><span className={styles.paneDot} /><div><h2 id="input-title">Input JSON</h2><p>Paste or type your data</p></div></div>
            <button className={styles.exampleButton} type="button" onClick={onLoadExample}><FiRefreshCw aria-hidden="true" /> Load example</button>
        </div>
        <label className={styles.editorLabel} htmlFor="json-input">JSON input</label>
        <textarea
            className={styles.editor}
            id="json-input"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            spellCheck="false"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            aria-describedby="input-help"
            placeholder="Paste a JSON object, array, or value..."
        />
        <div className={styles.paneFooter}>
            <span id="input-help">Your content stays in this browser tab.</span>
            <span>{lineCount} lines</span>
        </div>
    </section>
);

export default JsonInput;
