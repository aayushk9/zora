import React from "react"
import styles from './GeneralPlan.module.css'
import { InputBox } from "../InputBox/InputBox"
import { Sidebar } from "../Sidebar/Sidebar"
import DottedBackground from "../DottedBackground/DottedBackground"

export function GeneralPlan() {
   return (
      <React.Fragment>
         <div className={styles.parentContainer}>
            <div id="sidebar">
               <Sidebar />
            </div>
            <div id="queryExecutionBox" className={styles.queryExecutionBox}>
               
               <div id="query" className={styles.queryBox}>
                  <br />
                  <span className={styles.queryHeader}>Query</span>
                  <br />
                  <br />
                  <div className={styles.queryBorder}></div>
                  <div className={styles.inputBox}>
                     <InputBox noOuterBorder noSuggestedPrompts/>
                  </div>
               </div>

               <div id="execution" className={styles.executionBox}>
                  <br />
                  <span className={styles.executionHeader}>Execution</span>
                  <br />
                  <br />
                  <div className={styles.executionBorder}></div>
                  <div className={styles.executionBody}>
                     <DottedBackground />
                  </div>
               </div>
            </div>
         </div>
      </React.Fragment>
   )
}