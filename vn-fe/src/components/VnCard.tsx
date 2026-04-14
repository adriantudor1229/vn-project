import type { Vn } from "../types";
import styles from "./VnCard.module.css";

function getDisplayTitle(vn: Vn): string {
  const official = vn.titles.find((t) => t.official && t.lang === "en");
  if (official) return official.title;

  const latin = vn.titles.find((t) => t.latin);
  if (latin?.latin) return latin.latin;

  const first = vn.titles[0];
  return first?.title ?? "Untitled";
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "...";
}

export default function VnCard({ vn }: { vn: Vn }) {
  const title = getDisplayTitle(vn);
  const description = vn.description
    ? truncate(vn.description, 150)
    : "No description available.";

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <div className={styles.imagePlaceholder} />
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        {vn.cRating != null && (
          <div className={styles.rating}>
            <span className={styles.ratingValue}>
              {(vn.cRating / 100).toFixed(1)}
            </span>
            <span className={styles.ratingLabel}>/ 10</span>
          </div>
        )}
      </div>
    </article>
  );
}
