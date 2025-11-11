import React from "react"
import styles from './InputBox.module.css'

export function InputBox () {
    return (
        <React.Fragment>
          
           <div className={styles.container}>
             <input className={styles.input} type="text"  placeholder="Describe your trading strategy idea"/>
           </div>
          
        </React.Fragment>
    )
}