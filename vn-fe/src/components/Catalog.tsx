import { useEffect, useState } from "react";
import { fetchVns } from "../api";
import type { Vn } from "../types";
import VnCard from "./VnCard";
import styles from "./Catalog.module.css";

export default function Catalog() {
  const [vns, setVns] = useState<Vn[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchVns(page, 20)
      .then((data) => {
        setVns(data.content);
        setTotalPages(data.totalPages);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <section id="catalog" className={styles.catalog}>
      <div className={styles.container}>
        <h2 className={styles.heading}>
          Visual Novel <span className={styles.accent}>Catalog</span>
        </h2>

        {loading && (
          <div className={styles.status}>
            <div className={styles.spinner} />
          </div>
        )}

        {error && (
          <div className={styles.status}>
            <p className={styles.error}>Failed to load: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className={styles.grid}>
              {vns.map((vn, i) => (
                <VnCard key={`${page}-${i}`} vn={vn} />
              ))}
            </div>

            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {page + 1} of {totalPages}
              </span>
              <button
                className={styles.pageBtn}
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
