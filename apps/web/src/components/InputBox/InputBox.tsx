import React from "react"
import styles from './InputBox.module.css'

export function InputBox () {
    return (
        <React.Fragment>
          
           <div className={styles.container}>
             <textarea className={styles.input} placeholder="Describe your trading strategy idea"/>
           </div>
          
        </React.Fragment>
    )
}