import React from "react"
import styles from './InputBox.module.css'
import { useState } from "react"
import sendIcon from '../../assets/send.png'

export function InputBox({noOuterBorder, noSuggestedPrompts}: any) {

    const [text, setText] = useState("")
    const [isExpanded, setIsExpanded] = useState(false);
    const isEmpty = text.trim() === ""

    const research = (e: React.FormEvent) => {
     e.preventDefault();



     if(!isEmpty){
        console.log(`User Input: ${text}`)
        //make a post request to server via fetch/axios 
        // content-type application/json 
        // in body send text state in json form
        // make sure we get reponse in event format from backend
        // clear state after execution
     }
    }

    return (
        <React.Fragment>
            <div className={`${styles.container} ${noOuterBorder ? styles.noBorder: ""}`}>
                <form className={styles.form} onSubmit={research}>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className={`${styles.textArea} ${isExpanded ? styles.expanded : ""}`}
                        onFocus={() => {setIsExpanded(true)}}
                        onBlur={() => {setIsExpanded(false)}}
                        onKeyDown={() => setIsExpanded(false)}
                        placeholder="Describe your trading strategy idea..."
                        rows={4}
                    />

                   {isExpanded && !noSuggestedPrompts && (
                    <div>
                        <button>Predict the outcome of the next Solana price event and explain your reasoning</button>
                        <button>Analyze which side (YES/NO) has a better risk-to-reward ratio for this market</button>
                        <button>Suggest a trading strategy for low-volume but high-confidence markets</button>
                        <button>Estimate the probability of this event resolving as YES based on current liquidity</button>
                        <button>Summarize key signals that might affect the market outcome over the next 24 hours.</button>
                    </div>
                   )}
                    
                    <button
                        type="submit"
                        disabled={isEmpty}
                        className={` ${styles.sendBtn} ${isEmpty ? styles.disabled : ""}`} aria-label="Send">
                        <img src={sendIcon} alt="send" className={styles.sendIcon} />
                    </button>
                </form>
                {/*when some event is selected it should be placed here*/}
            </div>
        </React.Fragment>
    )
}