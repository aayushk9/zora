import React from "react"
import styles from "./Sidebar.module.css"

export function Sidebar () {
    return (
        <React.Fragment>
           <div className={styles.parentContainer}>
             <div className={styles.newChat}>
               <button className={styles.button}>Chat</button>
               <button className={styles.button}>Agents</button>
             </div>
             <div className={styles.chatHistory}>
                <span className={styles.history}>History</span>
             </div>
           </div>
        </React.Fragment>
    )
}