import styles from './ProfileHeader.module.css';

export default function ProfileHeader({ size = "large" }: { size: "small" | "large" }) {
  return (
    <div className={`${size === "large" ? styles.navContainer : styles.container}`}>
      <div className={`${size === "large" ? styles.largeIndicator : styles.smallIndicator}`} />
    </div>
  );
};
