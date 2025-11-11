import React from "react"
import styles from './InputBox.module.css'
import { useState } from "react"
import sendIcon from '../../assets/send.png'

export function InputBox() {

    const [text, setText] = useState("")

    return (
        <React.Fragment>
            <div className={styles.container}>
                <div>
                   <textarea 
                   value={text}
                   onChange={(e) => setText(e.target.value)}
                   className={styles.input} 
                   placeholder="Describe your trading strategy idea"
                   />
                  <button className={styles.sendBtn}>
        <img src={sendIcon} alt="send" className={styles.sendIcon} />
      </button>
                </div>
            </div>
        </React.Fragment>
    )
}