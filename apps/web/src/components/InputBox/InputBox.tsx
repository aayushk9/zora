import React, { useState, useRef, useEffect } from "react"
import styles from './InputBox.module.css'
import sendIcon from '../../assets/send.png'
import { SuggestedPrompts } from "../SuggestedPrompts/SuggestedPrompts"

export function InputBox({ noOuterBorder, noSuggestedPrompts, onSend }: any) {

    const [query, setQuery] = useState("")
    const [isExpanded, setIsExpanded] = useState(false);

    const containerRef = useRef<HTMLDivElement | null>(null);

    const isEmpty = query.trim() === ""
    const showSuggestions = isExpanded && !noSuggestedPrompts && isEmpty

     useEffect(() => {

        if (isEmpty) {
            setIsExpanded(true)
        }

    }, [query])

    const research = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEmpty) {
            if (onSend) onSend(query);
            setQuery("");
            setIsExpanded(false);
        }
    }

    return (
        <React.Fragment>
            <div className={`${styles.container} ${noOuterBorder ? styles.noBorder : ""}`}>
                <div
                    className={`${styles.wrapper} ${isExpanded ? styles.expandedWrapper : ""} ${noOuterBorder ? styles.noBorder : ""}`}
                    ref={containerRef}
                >
                    <form className={`${styles.form}`} onSubmit={research}>
                        <div className={styles.inputSection}>
                            <textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className={styles.textArea}
                                onFocus={() => { setIsExpanded(true) }}
                                onBlur={(e) => {
                                    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
                                        setIsExpanded(false);
                                    }
                                }}
                                placeholder="Describe your trading strategy idea..."
                                rows={isExpanded ? 3 : 1}
                            />

                            <button
                                type="submit"
                                disabled={isEmpty}
                                className={`${styles.sendBtn} ${isEmpty ? styles.disabled : ""}`} aria-label="Send">
                                <img src={sendIcon} alt="send" className={styles.sendIcon} />
                            </button>
                        </div>

                        {showSuggestions && (
                            <div className={styles.suggestions}>
                                <div className={styles.divider}></div>
                                <SuggestedPrompts onSelect={(text: string) => {
                                    setQuery(text);
                                    setIsExpanded(false)
                                }}
                                />
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </React.Fragment>
    )
}