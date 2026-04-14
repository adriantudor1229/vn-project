import Sidebar from "./components/Sidebar";
import CherryBlossoms from "./components/CherryBlossoms";
import Catalog from "./components/Catalog";
import Footer from "./components/Footer";
import styles from "./App.module.css";

export default function App() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <CherryBlossoms />
        <Catalog />
        <Footer />
      </main>
    </div>
  );
}
