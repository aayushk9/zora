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
                    {/*
                      BACKLOG
                      when user points cursor or keeps the pointer on text area you are supposed to
                      display suggested prompts with expanded view of entire container

                      how?
                      mainly two changes
                      if user keeps the pointer on textarea

                      a) in styles include a expanded area box of form ie textarea box and add a 
                         border in between noraml textarea which is plain and suggested prompts

                     b) how to display prompts on expanded view
                        add if else if pointer moves to textarea add suggested prompts to 
                        some jsx tag
                    
                    */}
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