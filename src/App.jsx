import { FiArrowRight, FiCheck, FiDatabase, FiShield } from "react-icons/fi";
import FormatterWorkbench from "./components/formatterWorkbench/index.jsx";
import SiteHeader from "./components/siteHeader/index.jsx";
import SiteFooter from "./components/siteFooter/index.jsx";
import BackToTop from "./components/backToTop/index.jsx";
import styles from "./App.module.css";

const App = () => (
    <div className={styles.appShell} id="top">
        <SiteHeader />
        <main>
            <section className={styles.hero} aria-labelledby="hero-title">
                <div className={styles.heroInner}>
                    <div className={styles.heroCopy}>
                        <p className={styles.heroLabel}><FiDatabase aria-hidden="true" /> Browser JSON toolkit</p>
                        <h1 id="hero-title">Make messy JSON<br /><span>make sense.</span></h1>
                        <p className={styles.heroDescription}>Format, check, and share structured data without sending it anywhere. Drop in a payload and get a result you can actually read.</p>
                        <a className={styles.heroButton} href="#formatter">Open the formatter <FiArrowRight aria-hidden="true" /></a>
                        <div className={styles.trustNote}><FiShield aria-hidden="true" /><span>Private by default. Your data stays on this device.</span></div>
                    </div>
                    <div className={styles.previewCard} aria-label="Preview of formatted JSON" role="img">
                        <div className={styles.previewHeader}><span className={styles.windowDots}><i /><i /><i /></span><span>payload.json</span><span className={styles.previewValid}><FiCheck aria-hidden="true" /> valid</span></div>
                        <div className={styles.previewCode}>
                            <p><span>1</span><code><b>{"{"}</b></code></p>
                            <p><span>2</span><code>  <em>"account"</em>: <strong>{"{"}</strong></code></p>
                            <p><span>3</span><code>    <em>"plan"</em>: <i>"studio"</i>,</code></p>
                            <p><span>4</span><code>    <em>"seats"</em>: <mark>8</mark></code></p>
                            <p><span>5</span><code>  <strong>{"}"}</strong></code></p>
                            <p><span>6</span><code><b>{"}"}</b></code></p>
                        </div>
                        <div className={styles.previewFooter}><span>6 lines</span><span>2 spaces</span><span>UTF-8</span></div>
                    </div>
                </div>
                <div className={styles.heroBottom}><span>Paste a value. Shape a result.</span><span>NO ACCOUNT <i /> NO UPLOADS</span></div>
            </section>
            <FormatterWorkbench />
            <section className={styles.guide} id="guide" aria-labelledby="guide-title">
                <div className={styles.guideHeading}><p>Good to know</p><h2 id="guide-title">A small tool with clear boundaries.</h2></div>
                <div className={styles.guideCards}>
                    <article><span className={styles.guideNumber}>01</span><div><h3>Syntax, not schema</h3><p>Validation checks whether the text follows JSON syntax. It does not know if a field is allowed by your API or whether a value has the right business meaning.</p></div></article>
                    <article><span className={styles.guideNumber}>02</span><div><h3>Standard JSON only</h3><p>Comments, trailing commas, single-quoted strings, and undefined values are not part of JSON and will be reported as invalid.</p></div></article>
                    <article><span className={styles.guideNumber}>03</span><div><h3>Nothing is saved</h3><p>Formatting and validation happen in this browser tab. Input is not sent to a server and is cleared when you leave or refresh the page.</p></div></article>
                </div>
            </section>
        </main>
        <SiteFooter />
        <BackToTop />
    </div>
);

export default App;
