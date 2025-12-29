import React, { useState, useRef, useEffect } from "react"
import styles from './InputBox.module.css'
import sendIcon from '../../assets/send.png'
import { SuggestedPrompts } from "../SuggestedPrompts/SuggestedPrompts"
import { useEventStore } from "../../store/useSelectedEventStore"


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

    // some conditional logic behind how events can occur below inputbox wrapper when clicked on any event

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
                    
                      {selectedEvents.length > 0 && (
                        <div>
                            <h3 style={{color: 'white'}}>Selected Events</h3>
                            <div>
                            {selectedEvents.map((ev) => (
                                <div key={ev.title} className={styles.selectedEvent}>
                                  <img className={styles.img} src={ev.imgUrl}/>
                                  <span className={styles.title}>{ev.title}</span>
                                  <span className={styles.totalVolume}>{ev.totalVolume}</span>
                                  <button onClick={() => removeEvents(ev.title)}>x</button>
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