import React from "react"
import styles from './GeneralPlan.module.css'
import { InputBox } from "../InputBox/InputBox"
import { Sidebar } from "../Sidebar/Sidebar"

export function GeneralPlan () {
    return (
        <React.Fragment>
           <div className={styles.parentContainer}>
              <div id="sidebar">
               <Sidebar/>
              </div>
              <div id="queryExecutionBox" className={styles.queryExecutionBox}>
                   <div id="query" className={styles.query}>
                        <h1>Query</h1>
                        <div className={styles.queryBorder}></div>
                        <div className={styles.inputBox}>
                          <InputBox/>
                        </div>
                   </div>
                 
                 <div className={styles.executionBorder}></div>
                   <div id="execution" className={styles.execution}>
                      <h1>Execution</h1>
                      
                   </div>
              </div>
           </div>
        </React.Fragment>
    )
}