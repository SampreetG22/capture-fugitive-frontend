import styles from "./page.module.css";
import { Link } from "react-router-dom";
export default function Header() {
  return (
    <>
      <div className={styles.headerContainer}>
        <Link to="/" className={styles.linkElement}>
          <div className={styles.logoAndTitleContainer}>
            <img
              src="/assets/yocket.png"
              className={styles.headerLogo}
              alt="logo"
            />
            <h2 className={styles.headerTitle}>Yocket Police Department</h2>
          </div>
        </Link>
        <p className={styles.welcomeText}>Welcome, Detective</p>
      </div>
    </>
  );
}
