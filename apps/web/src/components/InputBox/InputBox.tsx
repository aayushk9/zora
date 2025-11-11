import React from "react"
import styles from './InputBox.module.css'
import { useState } from "react"
import sendIcon from '../../assets/send.png'

export function InputBox() {

    const [text, setText] = useState("")
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
            <div className={styles.container}>
                <form className={styles.form} onSubmit={research}>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className={styles.textArea}
                        placeholder="Describe your trading strategy idea..."
                        rows={4}
                    />
                    <button
                        type="submit"
                        disabled={isEmpty}
                        className={` ${styles.sendBtn} ${isEmpty ? styles.disabled : ""}`} aria-label="Send">
                        <img src={sendIcon} alt="send" className={styles.sendIcon} />
                    </button>
                </form>
            </div>
        </React.Fragment>
    )
}