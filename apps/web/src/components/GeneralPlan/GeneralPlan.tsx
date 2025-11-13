import React from "react"
import styles from './GeneralPlan.module.css'
import { InputBox } from "../InputBox/InputBox"

export function GeneralPlan () {
    return (
        <React.Fragment>
           <div className={styles.parentContainer}>
              <div className={styles.chatbox}>
                <div className={styles.query}>
                  <div className={styles.inputBox}>
                    <InputBox/>
                  </div>
                </div>
                <div className={styles.execution}>

                </div>
              </div>
           </div>
        </React.Fragment>
    )
}