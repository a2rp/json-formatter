import { FiGithub } from "react-icons/fi";
import styles from "./styles.module.css";

const SiteFooter = () => (
    <footer className={styles.footer}>
        <div className={styles.footerInner}>
            <div className={styles.credit}>
                <a href="https://www.ashishranjan.net" target="_blank" rel="noreferrer" aria-label="Ashish Ranjan portfolio"><img src={`${import.meta.env.BASE_URL}logo.png`} alt="Ashish Ranjan logo" /></a>
                <p>© {new Date().getFullYear()} <a href="https://github.com/a2rp" target="_blank" rel="noreferrer">Ashish Ranjan</a>. All rights reserved.</p>
            </div>
            <nav className={styles.links} aria-label="Footer links">
                <a href="https://www.ashishranjan.net" target="_blank" rel="noreferrer">Portfolio</a>
                <a href="https://github.com/a2rp" target="_blank" rel="noreferrer">GitHub</a>
                <a href="https://github.com/a2rp/json-formatter" target="_blank" rel="noreferrer"><FiGithub aria-hidden="true" /> Source code</a>
                <a href="https://codepen.io/ash1198" target="_blank" rel="noreferrer">CodePen</a>
                <a href="https://www.linkedin.com/in/aashishranjan" target="_blank" rel="noreferrer">LinkedIn</a>
                <a href="https://www.facebook.com/theash.ashish/" target="_blank" rel="noreferrer">Facebook</a>
                <a href="https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1" target="_blank" rel="noreferrer">YouTube</a>
                <a href="mailto:ash.ranjan09@gmail.com">Email</a>
                <a href="https://a2rp-donation-page.netlify.app/" target="_blank" rel="noreferrer">Support</a>
                <a href="https://buymeacoffee.com/ashishranjan" target="_blank" rel="noreferrer">Buy Me a Coffee</a>
                <a href="https://www.patreon.com/ashishranjan" target="_blank" rel="noreferrer">Patreon</a>
            </nav>
        </div>
    </footer>
);

export default SiteFooter;
