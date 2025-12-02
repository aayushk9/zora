import styles from './SuggestedPrompts.module.css'

export function SuggestedPrompts({ onSelect }: any) {

  const prompts = [
        "Predict the outcome of the next Solana price event and explain your reasoning",
        "Analyze which side (YES/NO) has a better risk to reward ratio for this market",
        "Suggest a trading strategy for low volume but high confidence markets",
        "Estimate the probability of this event resolving as YES based on current liquidity",
        "Summarize key signals that might affect the market outcome over the next 24 hours"
    ]

    return (
        <div className={styles.parentContainer}>
            {prompts.map((prompt, index) => (
                <button
                    key={index}
                    className={styles.promptButton}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onSelect(prompt);
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