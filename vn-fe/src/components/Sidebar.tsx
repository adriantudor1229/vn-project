import styles from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoAccent}>VN</span>DB
      </div>

      <nav className={styles.nav}>
        <span className={styles.sectionLabel}>Menu</span>
        <a href="#" className={styles.navLink}>
          Home
        </a>
        <a href="#catalog" className={styles.navLink}>
          Visual Novels
        </a>
        <a href="#" className={styles.navLink}>
          Releases
        </a>
        <a href="#" className={styles.navLink}>
          Producers
        </a>
        <a href="#" className={styles.navLink}>
          Staff
        </a>
        <a href="#" className={styles.navLink}>
          Characters
        </a>
        <a href="#" className={styles.navLink}>
          Tags
        </a>
      </nav>

      <nav className={styles.nav}>
        <span className={styles.sectionLabel}>User</span>
        <a href="#" className={styles.navLink}>
          Login
        </a>
        <a href="#" className={styles.navLink}>
          Register
        </a>
      </nav>

      <nav className={styles.nav}>
        <span className={styles.sectionLabel}>Database</span>
        <a href="#" className={styles.navLink}>
          Stats
        </a>
        <a href="#" className={styles.navLink}>
          Recent Changes
        </a>
        <a href="#" className={styles.navLink}>
          Random VN
        </a>
      </nav>

      <div className={styles.sidebarFooter}>
        <span className={styles.footerText}>vndb-fe v0.1</span>
      </div>
    </aside>
  );
}
