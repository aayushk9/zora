import styles from './ChatSkeleton.module.css';

export function ChatSkeleton() {
    return (
        <div className={styles.messagesArea}>

            <div className={styles.userMessageContainer}>
                <div className={styles.userMessage} />
            </div>

            <div className={styles.assistantContainer}>
                <div className={styles.skeletonLine} style={{ width: '85%' }}></div>
                <div className={styles.skeletonLine} style={{ width: '92%' }}></div>
                <div className={styles.skeletonLine} style={{ width: '78%' }}></div>
                <div className={styles.skeletonLine} style={{ width: '88%' }}></div>
                <div className={styles.skeletonLine} style={{ width: '45%' }}></div>
                 <div className={styles.skeletonLine} style={{ width: '85%' }}></div>
                <div className={styles.skeletonLine} style={{ width: '92%' }}></div>
                <div className={styles.skeletonLine} style={{ width: '78%' }}></div>
                <div className={styles.skeletonLine} style={{ width: '88%' }}></div>
                <div className={styles.skeletonLine} style={{ width: '45%' }}></div>
            </div>
        </div>
    );
}