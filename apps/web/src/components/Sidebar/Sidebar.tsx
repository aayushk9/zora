import React from "react"
import styles from "./Sidebar.module.css"
import { Link } from "react-router-dom"

export function Sidebar () {
    return (
        <React.Fragment>
           <div className={styles.parentContainer}>
             <div className={styles.sidebar}>
               <Link to="/query" className={styles.chat}>Chat</Link>
               <Link to="/agents" className={styles.agents}>Agents</Link>
               <Link to="/query" className={styles.history}>History</Link> {/* for history there will be dynamic route such as /query/chatid */}
             </div>
           </div>
        </React.Fragment>
    )
}