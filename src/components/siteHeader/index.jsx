import { FiGithub } from "react-icons/fi";
import styles from "./styles.module.css";

const SiteHeader = () => (
    <header className={styles.header}>
        <a className={styles.brand} href="#top" aria-label="JSON Formatter home"><span className={styles.brandMark}>{"{}"}</span><span>json<span className={styles.brandAccent}>/</span>shape</span></a>
        <nav className={styles.navigation} aria-label="Main navigation">
            <a href="#formatter">Formatter</a>
            <a href="#guide">Usage notes</a>
        </nav>
        <a className={styles.repository} href="https://github.com/a2rp/json-formatter" target="_blank" rel="noreferrer"><FiGithub aria-hidden="true" /><span>Repository</span></a>
    </header>
);

export default SiteHeader;
