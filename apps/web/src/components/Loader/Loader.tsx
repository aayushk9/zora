import styles from "./Loader.module.css"

export function Loader() {
    return (
        <div className={styles.loadWrapper}>
               <span className={styles.spinner}>
                    <span className={styles.arc} />
                 </span>
        </div>
    )
}