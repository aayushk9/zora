import styles from "./QuotaLimitMessage.module.css";
import { useQuotaStore } from "../../store/useQuotaStore";

export function QuotaLimitMessage() {
    const { resetAt, limit } = useQuotaStore();

    const getTimeUntilReset = () => {
        if (!resetAt) return "";

        const now = new Date().getTime();
        const reset = new Date(resetAt).getTime();
        const diff = reset - now;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes} minutes`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.iconWrapper}>
                <svg
                    className={styles.icon}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                        fill="currentColor"
                    />
                </svg>
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>Daily Quota Exceeded</h3>
                <p className={styles.message}>
                    You've reached your daily limit of{" "}
                    {typeof limit === "number" ? limit.toLocaleString() : "—"} tokens.
                </p>
                <p className={styles.reset}>
                    Your quota will reset in <strong>{getTimeUntilReset()}</strong>
                </p>
            </div>
        </div>
    );
}