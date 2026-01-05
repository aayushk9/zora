import styles from "./EventSkeleton.module.css";

export function EventSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.image} />
        <div className={styles.title} />
      </div>
      <div className={styles.lines}>
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}
