import { useState } from "react";
import { FiCheck, FiCode, FiMinimize2, FiShield, FiTrash2 } from "react-icons/fi";
import { formatJson, getJsonErrorDetails, minifyJson, parseJson } from "../../utils/jsonFormatter.js";
import ClearConfirm from "./clearConfirm/index.jsx";
import JsonInput from "./jsonInput/index.jsx";
import JsonOutput from "./jsonOutput/index.jsx";
import styles from "./styles.module.css";

const sampleJson = `{
  "project": "Northstar",
  "owner": {
    "name": "Ari Kim",
    "team": "Platform"
  },
  "active": true,
  "release": 3,
  "labels": ["api", "internal", "v2"],
  "settings": {
    "retryLimit": 4,
    "timeoutSeconds": 12,
    "regions": ["us-east", "eu-west"]
  }
}`;

const FormatterWorkbench = () => {
    const [input, setInput] = useState(sampleJson);
    const [output, setOutput] = useState("");
    const [indentation, setIndentation] = useState("2");
    const [sortKeys, setSortKeys] = useState(false);
    const [result, setResult] = useState({ kind: "idle", message: "Format, minify, or validate your input." });
    const [copyState, setCopyState] = useState("idle");
    const [clearOpen, setClearOpen] = useState(false);
    const lineCount = input ? input.split("\n").length : 0;

    const updateInput = (nextInput) => {
        setInput(nextInput);
        setOutput("");
        setCopyState("idle");
        setResult({ kind: "idle", message: nextInput ? "Input changed. Run an action to update the output." : "Enter JSON or load the sample to begin." });
    };

    const runAction = (action) => {
        if (!input.trim()) {
            setOutput("");
            setResult({ kind: "error", message: "Enter JSON before running this action." });
            return;
        }

        try {
            if (action === "validate") {
                parseJson(input);
                setOutput("");
                setResult({ kind: "valid", message: "Valid JSON. No syntax issues found." });
                return;
            }

            const nextOutput = action === "minify"
                ? minifyJson(input, sortKeys)
                : formatJson(input, Number(indentation), sortKeys);
            setOutput(nextOutput);
            setCopyState("idle");
            setResult({ kind: "success", message: action === "minify" ? "JSON minified successfully." : `JSON formatted with ${indentation} spaces.` });
        } catch (error) {
            const details = getJsonErrorDetails(error, input);
            const position = details.line ? `Line ${details.line}, column ${details.column}. ` : "";
            setOutput("");
            setResult({ kind: "error", message: `${position}${details.message}` });
        }
    };

    const copyOutput = async () => {
        if (!output) return;
        try {
            await navigator.clipboard.writeText(output);
            setCopyState("copied");
            window.setTimeout(() => setCopyState("idle"), 1500);
        } catch {
            setCopyState("failed");
            window.setTimeout(() => setCopyState("idle"), 2000);
        }
    };

    const downloadOutput = () => {
        if (!output) return;
        const objectUrl = URL.createObjectURL(new Blob([output], { type: "application/json;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = "formatted.json";
        link.click();
        URL.revokeObjectURL(objectUrl);
        setResult({ kind: "success", message: "Downloaded formatted.json." });
    };

    const loadExample = () => updateInput(sampleJson);
    const cancelClear = () => setClearOpen(false);
    const confirmClear = () => {
        setInput("");
        setOutput("");
        setCopyState("idle");
        setResult({ kind: "idle", message: "Editor cleared. Your JSON was only held in this page." });
        setClearOpen(false);
    };

    const emptyMessage = result.kind === "error"
        ? "Correct the input, then run an action again."
        : result.kind === "valid"
            ? "The input is valid. Choose Format or Minify to create output."
            : "Your formatted result will appear here.";

    return (
        <section className={styles.workbench} id="formatter" aria-labelledby="workbench-title">
            <div className={styles.headingRow}>
                <div>
                    <p className={styles.sectionLabel}><FiCode aria-hidden="true" /> JSON workbench</p>
                    <h2 id="workbench-title">Shape your data.</h2>
                    <p className={styles.description}>Paste JSON, choose how it should read, and check the result before you use it.</p>
                </div>
                <span className={styles.privacy}><FiShield aria-hidden="true" /> Local processing</span>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.options}>
                    <label className={styles.indentControl} htmlFor="indent-size"><span>Indent</span>
                        <select id="indent-size" value={indentation} onChange={(event) => setIndentation(event.target.value)}>
                            <option value="2">2 spaces</option>
                            <option value="4">4 spaces</option>
                        </select>
                    </label>
                    <label className={styles.sortControl}>
                        <input type="checkbox" checked={sortKeys} onChange={(event) => setSortKeys(event.target.checked)} />
                        <span className={styles.customCheck}><FiCheck aria-hidden="true" /></span>
                        Sort object keys
                    </label>
                </div>
                <div className={styles.actions}>
                    <button className={styles.formatButton} type="button" onClick={() => runAction("format")}>Format JSON</button>
                    <button type="button" onClick={() => runAction("minify")}><FiMinimize2 aria-hidden="true" /> Minify</button>
                    <button type="button" onClick={() => runAction("validate")}>Validate</button>
                    <button className={styles.clearButton} type="button" onClick={() => setClearOpen(true)}><FiTrash2 aria-hidden="true" /> Clear</button>
                </div>
            </div>

            <p className={`${styles.resultMessage} ${styles[result.kind]}`} role="status" aria-live="polite">
                {result.kind === "valid" || result.kind === "success" ? <FiCheck aria-hidden="true" /> : result.kind === "error" ? <span className={styles.errorMark}>!</span> : <span className={styles.infoMark}>i</span>}
                {result.message}
            </p>

            <div className={styles.panes}>
                <JsonInput value={input} onChange={updateInput} onLoadExample={loadExample} lineCount={lineCount} />
                <JsonOutput value={output} emptyMessage={emptyMessage} onCopy={copyOutput} onDownload={downloadOutput} copyState={copyState} />
            </div>
            <div className={styles.footnote}><span>Tip</span><p>Sorting keys changes their order for readability. It does not change the values in your JSON.</p></div>
            {clearOpen && <ClearConfirm onCancel={cancelClear} onConfirm={confirmClear} />}
        </section>
    );
};

export default FormatterWorkbench;
