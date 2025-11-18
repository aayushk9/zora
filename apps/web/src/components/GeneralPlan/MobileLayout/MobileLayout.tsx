import React, { useEffect, useState } from "react";
import styles from './MobileLayout.module.css'
import { InputBox } from "../../InputBox/InputBox";
import { MobileNavbar } from "../../MobileNavbar/MobileNavbar";
import { useLocation } from "react-router-dom";
import { useQueryHandler} from "../../../hooks/useQueryHandler"


export function MobileLayout() {

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const incomingText = params.get("c");

  const [stagQuery, setStagQuery] = useState(true);
  const [execution, setExecution] = useState(false);
  const {messages, setMessages, handleUserQuery} = useQueryHandler();

  useEffect(() => {
    if (incomingText) {
      setMessages([
        ...messages, 
        {
         role: 'user',
         content: incomingText
        }
      ])
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
                  {messages.map((message, index) => (
                     <p key={index}>
                       {message.content}
                     </p>
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