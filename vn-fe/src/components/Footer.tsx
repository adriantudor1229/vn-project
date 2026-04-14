import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.links}>
          <a href="#">About</a>
          <span className={styles.sep}>|</span>
          <a href="#">FAQ</a>
          <span className={styles.sep}>|</span>
          <a href="#">API</a>
          <span className={styles.sep}>|</span>
          <a href="#">Contact</a>
        </div>
        <p className={styles.memorial}>R.I.P Yorhei</p>
      </div>
    </footer>
  );
}
