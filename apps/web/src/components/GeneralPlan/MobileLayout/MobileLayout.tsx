import React, { useEffect, useState } from "react";
import styles from './MobileLayout.module.css'
import { InputBox } from "../../InputBox/InputBox";
import { MobileNavbar } from "../../MobileNavbar/MobileNavbar";
import { useLocation } from "react-router-dom";
import { useQueryHandler} from "../../../hooks/useQueryHandler"


export function MobileLayout() {

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const incomingText = params.get("text");

  const [stagQuery, setStagQuery] = useState(true);
  const [execution, setExecution] = useState(false);
  const {queries, setQueries, responses, handleUserQuery} = useQueryHandler();

  useEffect(() => {
    if (incomingText) {
      setQueries(prev => [...prev, incomingText])
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
                <p style={{color:"white"}}>
                  {queries.map((query, index) => (
                     <p key={index}>
                       {query}
                     </p>
                  ))}
                </p>
                <p style={{color: "white"}}>
                  {responses.map((response, index) => (
                    <p key={index}>{response}</p>
                  ))}
                </p>
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