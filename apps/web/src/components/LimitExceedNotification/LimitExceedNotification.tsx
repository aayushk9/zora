import styles from "./LimitExceedNotification.module.css";
import { useQuotaStore } from "../../store/useQuotaStore";

export function LimitExceedNotification() {
  const { resetAt, message, isTemporary } = useQuotaStore();

  const getResetTime = () => {
    if (!resetAt) return "7:30 PM";
    return new Date(resetAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const displayMessage = isTemporary
    ? message
    : `You've hit your limit for using me. Limits will reset at ${getResetTime()}. For higher limits we will soon be including pro & pro max plans`;

  return (
    <div className={styles.bannerContainer}>
      <div className={styles.iconSection}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>

      <div className={styles.textSection}>
        {displayMessage}
      </div>
    </div>
  );
}