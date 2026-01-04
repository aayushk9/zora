import styles from './SuggestedPrompts.module.css'
import type { suggestedPrompts } from '../../types/suggestedPrompts';

export function SuggestedPrompts({ onClick, prompts }: suggestedPrompts) {

    return (
        <div className={styles.parentContainer}>
            {prompts.map((prompt, index) => (
                <button
                    key={index}
                    className={styles.promptButton}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onClick(prompt);
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <span className={styles.promptText}>
                        {prompt}
                    </span>
                </button>
            ))}
        </div>
    )
}