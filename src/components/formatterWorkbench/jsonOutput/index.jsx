import { FiCheck, FiCopy, FiDownload, FiFileText } from "react-icons/fi";
import styles from "./styles.module.css";

const highlightLine = (line, lineIndex) => {
    const tokenPattern = /"(?:\\.|[^"\\])*"(?=\s*:)|"(?:\\.|[^"\\])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\b(?:true|false|null)\b/g;
    const parts = [];
    let lastIndex = 0;
    let tokenIndex = 0;
    let match = tokenPattern.exec(line);

    while (match) {
        if (match.index > lastIndex) parts.push(line.slice(lastIndex, match.index));
        const token = match[0];
        let tokenClass = styles.punctuation;
        if (token.startsWith('"')) tokenClass = /^\s*:/.test(line.slice(tokenPattern.lastIndex)) ? styles.key : styles.string;
        else if (/^-?\d/.test(token)) tokenClass = styles.number;
        else if (token === "true" || token === "false") tokenClass = styles.boolean;
        else if (token === "null") tokenClass = styles.nullValue;
        parts.push(<span className={tokenClass} key={`${lineIndex}-${tokenIndex}`}>{token}</span>);
        lastIndex = tokenPattern.lastIndex;
        tokenIndex += 1;
        match = tokenPattern.exec(line);
    }
    if (lastIndex < line.length) parts.push(line.slice(lastIndex));
    return parts;
};

const JsonOutput = ({ value, emptyMessage, onCopy, onDownload, copyState }) => (
    <section className={styles.pane} aria-labelledby="output-title">
        <div className={styles.paneHeader}>
            <div className={styles.paneTitle}><span className={styles.paneDot} /><div><h2 id="output-title">Formatted output</h2><p>{value ? `${value.split("\n").length} lines` : "Waiting for an action"}</p></div></div>
            <div className={styles.outputActions}>
                <button type="button" onClick={onCopy} disabled={!value} aria-label="Copy formatted JSON">{copyState === "copied" ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}<span>{copyState === "copied" ? "Copied" : copyState === "failed" ? "Unavailable" : "Copy"}</span></button>
                <button type="button" onClick={onDownload} disabled={!value} aria-label="Download JSON file"><FiDownload aria-hidden="true" /><span>Download</span></button>
                <span className={styles.outputType}><FiFileText aria-hidden="true" /> JSON</span>
            </div>
        </div>
        {value ? (
            <div className={styles.codeView} role="region" aria-label="Formatted JSON output" tabIndex="0" aria-live="polite">
                <ol>{value.split("\n").map((line, index) => <li key={`${index}-${line}`}><span className={styles.lineNumber} aria-hidden="true">{index + 1}</span><code>{highlightLine(line, index)}</code></li>)}</ol>
            </div>
        ) : (
            <div className={styles.emptyOutput}><span className={styles.outputGlyph}>{"{}"}</span><p>{emptyMessage}</p><small>Choose Format, Minify, or Validate to begin.</small></div>
        )}
        <div className={styles.paneFooter}><span>UTF-8</span><span>Local only</span></div>
    </section>
);

export default JsonOutput;
