import React, { useState } from "react";
import styles from './MobileLayout.module.css'
import { InputBox } from "../../InputBox/InputBox";

export function MobileLayout () {

    const [query, setQuery] = useState(true);
    const [execution, setExecution] = useState(false);

    const handleQuery = () => {
        setQuery(true);
        setExecution(false);
    }
    
    const handleExecution = () => {
        setQuery(false);
        setExecution(true);
    }

    return (
        <React.Fragment>
            <div className={styles.parentContainer}>
              <div className={styles.toggle}>
                 <button
                   onClick={handleQuery}
                  className={styles.query}>
                    Query
                  </button>
                 <button 
                  onClick={handleExecution}
                  className={styles.execution}>
                    Execution
                 </button>
               </div>

              <div className={styles.queryEexecutionPanel}>

                {query && (
                  <div className={styles.queryPanel}>

                    <div className={styles.inputBox}><InputBox noSuggestedPrompts/></div>
                  </div>
                )}

                {execution && (
                    <div>
                        <h1 style={{color: "white"}}>fkenfekfnekf</h1>
                    </div>
                )}
              </div>
            </div>
        </React.Fragment>
    )
}