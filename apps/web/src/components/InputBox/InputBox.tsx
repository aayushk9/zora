import React, { useState, useRef, useEffect } from "react"
import styles from './InputBox.module.css'
import sendIcon from '../../assets/send.png'
import { SuggestedPrompts } from "../SuggestedPrompts/SuggestedPrompts"
import { useEventStore } from "../../store/useSelectedEventStore"
import { useFormatVolumeUsd } from "../../hooks/useFormatVolumeUsd"

export function InputBox({ noOuterBorder, noSuggestedPrompts, onSend }: any) {

    const [query, setQuery] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const selectedEvents = useEventStore((s) => s.selectedEvents);
    const removeEvents = useEventStore((s) => s.removeEvent);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const isEmpty = query.trim() === ""

    // conditional logic behind how input box expands
    const showSuggestions = isExpanded && !noSuggestedPrompts && isEmpty

    useEffect(() => {
        if (isEmpty && isFocused) {
            setIsExpanded(true)
        }
    }, [query, isEmpty])

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
            <div className={`${styles.container} ${noOuterBorder && styles.noBorder}`}>
                <div
                    className={`${styles.wrapper} ${isExpanded && styles.expandedWrapper} ${noOuterBorder && styles.noBorder}`}
                    ref={containerRef}
                >
                    <form className={`${styles.form}`} onSubmit={research}>
                        <div className={styles.inputSection}>
                            <textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className={styles.textArea}
                                onFocus={() => { 
                                    setIsExpanded(true);
                                    setIsFocused(true);
                                }}
                                onBlur={(e) => {
                                    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
                                        setIsExpanded(false);
                                        setIsFocused(false)
                                    }
                                }}
                                placeholder="Describe your trading strategy idea..."
                                rows={isExpanded ? 3 : 1}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if(e.key == "Enter") {
                                        research(e)
                                    }
                                }}
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
                <div>
                    
                    {selectedEvents.length > 0 && location.pathname == "/" && (
                        <div>
                            <p className={styles.header}>Selected Events</p>
                            <div className={styles.events}>
                                {selectedEvents.map((ev) => (
                                    <div key={ev.title} className={styles.selectedEvent}>
                                        <div className={styles.contest}>
                                            <div className={styles.subSection}>
                                                <img className={styles.img} src={ev.imgUrl} />
                                                <span className={styles.title}>{ev.title}</span>
                                                <button className={styles.closeBtn} onClick={() => removeEvents(ev.title)}>x</button>
                                            </div>
                                            <div className={styles.stats}>
                                                <span className={styles.volume}>{useFormatVolumeUsd(ev.totalVolume / 1e6)}</span>
                                                <span className={styles.markets}>
                                                    <svg className={styles.chartIcon} width="14" height="14" viewBox="0 0 16 16" fill="none">
                                                        <path d="M2 14V8M8 14V2M14 14V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    </svg>
                                                    <span className={styles.marketCount}>{ev.marketCount == 1 ? ev.marketCount + " MARKET" : ev.marketCount + " MARKETS"}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>
    )
}