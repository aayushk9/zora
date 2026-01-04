import React, { useState, useRef, useEffect } from "react"
import styles from './InputBox.module.css'
import sendIcon from '../../assets/send.png'
import { SuggestedPrompts } from "../SuggestedPrompts/SuggestedPrompts"
import { useEventStore } from "../../store/useSelectedEventStore"
import { formatVolumeUsd } from "../../hooks/useFormatVolumeUsd"

 const DEFAULT_PROMPTS = [
  "Predict the outcome of the next Solana price event and explain your reasoning",
  "Analyze which side (YES/NO) has a better risk to reward ratio for this market",
  "Suggest a trading strategy for low volume but high confidence markets",
  "Estimate the probability of this event resolving as YES based on current liquidity",
  "Summarize key signals that might affect the market outcome over the next 24 hours"
];

export function InputBox({ noOuterBorder, noSuggestedPrompts, onSend }: any) {

    const [query, setQuery] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [suggestedPrompts, setSuggestedPrompts] = useState(DEFAULT_PROMPTS);
    const [suggestionLoader, setSuggestionLoader] = useState(true);

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

    // generate suggested prompts based on selected event/s
    {/*
      how are we going to generate prompts based on selected events
      1) if certain event is selected send request at http://localhost:3000/api/generate=prompts with body as selected event
      2) instruct model at backend for suggesting prompts 
      3) from backend send request to llm model with selected event and instruction
      4) wait for suggested prompts from llm 
      5) recieve suggested prompts at backend
      6) backend sends prompts to frontend
      7) now data from backend (suggested prompts will be array) -> setPrompts(data) -> modify data here else in backend to be like prompts type
      8) suggest prompts i.e send request at backend whenever selected event state store is changed
    */}

    useEffect(() => {
        if(selectedEvents.length == 0) {
            setSuggestedPrompts(DEFAULT_PROMPTS)
            setSuggestionLoader(false);
            return;
        };

        setSuggestionLoader(true); // reset to true
        
        const fetchSuggestedPrompts = async() => {
        try {
          const res = await fetch("http://localhost:3000/api/suggested-prompts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({selectedEvents: selectedEvents})
          })

          if(!res.ok) {
            throw new Error("something went wrong")
          } 

          const suggestedPromptsInJson = await res.json();
          const suggestedPromptsData = suggestedPromptsInJson.data;
          setSuggestedPrompts(suggestedPromptsData)
        } catch(error){
            console.log(`error: ${error}`)
        } finally {
          setSuggestionLoader(false)
        }
        }
        fetchSuggestedPrompts()
    }, [selectedEvents])

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
                                    if(e.key == "Enter" && !e.shiftKey) {
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
                                {suggestionLoader && selectedEvents.length > 0 ? (
                                   
                                        <p style={{color: "gray"}}>genrtsaing suggestions</p>
                                 
                                ) : (
                                <SuggestedPrompts onClick={(text: string) => {
                                    setQuery(text);
                                    setIsExpanded(false)
                                }
                            }
                            prompts={suggestedPrompts}  
                                /> )}
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
                                                <button 
                                                className={styles.closeBtn} 
                                                onMouseDown={(e) => e.preventDefault()} 
                                                onClick={() => {
                                                removeEvents(ev.title)
                                                setIsExpanded(false)
                                                }}
                                                >
                                                    x
                                                </button>
                                            </div>
                                            <div className={styles.stats}>
                                                <span className={styles.volume}>{formatVolumeUsd(ev.totalVolume / 1e6)}</span>
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