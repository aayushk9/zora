import React, { useState } from "react";
import styles from './MobileLayout.module.css'
import { InputBox } from "../../InputBox/InputBox";
import { MobileNavbar } from "../../MobileNavbar/MobileNavbar";

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
              <div>
                <MobileNavbar/>
              </div>
              <div className={styles.toggle}>
                 <button
                   onClick={handleQuery}
                  className={`${query ? styles.activeButton : styles.query}`}>
                    Query
                  </button>
                 <button 
                  onClick={handleExecution}
                  className={`${execution ? styles.activeButton : styles.execution}`}>
                    Execution
                 </button>
               </div>

              <div className={styles.queryExecutionPanel}>

                {query && (
                  <div className={styles.queryPanel}>
                    <div></div>
                    <div className={styles.inputBox}><InputBox noSuggestedPrompts noOuterBorder/></div>
                  </div>
                )}

                {execution && (
                 <div>
                  {/* display execution stpes here*/}
                  </div>
                )}
              </div>
            </div>
        </React.Fragment>
    )
}