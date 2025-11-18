import React, { useEffect, useState } from "react";
import styles from './MobileLayout.module.css'
import { InputBox } from "../../InputBox/InputBox";
import { MobileNavbar } from "../../MobileNavbar/MobileNavbar";
import { useLocation } from "react-router-dom";


export function MobileLayout() {

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const incomingText = params.get("text");

  const [stagQuery, setStagQuery] = useState(true);
  const [execution, setExecution] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (incomingText) {
      setQuery(incomingText)
    }
  }, [incomingText])

  const handleQuery = () => {
    setStagQuery(true);
    setExecution(false);
  }

  const handleExecution = () => {
    setStagQuery(false);
    setExecution(true);
  }

  const handleUserQuery = (input: string) => {
    setQuery(input)
    // now send this query to backend and expect reponse from it, store repsone in another state variable and present it here via reposne variable
  }

  return (
    <React.Fragment>
      <div className={styles.parentContainer}>
        <div>
          <MobileNavbar />
        </div>
        <div className={styles.toggle}>
          <button
            onClick={handleQuery}
            className={`${stagQuery ? styles.activeButton : styles.query}`}>
            Query
          </button>
          <button
            onClick={handleExecution}
            className={`${execution ? styles.activeButton : styles.execution}`}>
            Execution
          </button>
        </div>

        <div className={styles.queryExecutionPanel}>

          {stagQuery && (
            <div className={styles.queryPanel}>
              <div>
                <p style={{color:"white"}}>{query}</p>
              </div>
              <div className={styles.inputBox}><InputBox noSuggestedPrompts noOuterBorder onSend={handleUserQuery} /></div>
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