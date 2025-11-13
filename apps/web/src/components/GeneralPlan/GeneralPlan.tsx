import React from "react"
import styles from './GeneralPlan.module.css'

export function GeneralPlan () {
    return (
        <React.Fragment>
           <div className={styles.parentContainer}>
              <div className={styles.chatbox}>
                <div className={styles.query}>

                </div>
                <div className={styles.execution}>

                </div>
              </div>
           </div>
        </React.Fragment>
    )
}