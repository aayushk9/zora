import React, { useEffect, useState } from "react";
import styles from './DesktopLayout.module.css'
import { Sidebar } from "../../Sidebar/Sidebar";
import { InputBox } from "../../InputBox/InputBox";
import DottedBackground from "../../DottedBackground/DottedBackground";
import { useLocation } from "react-router-dom";


export function DesktopLayout() {

   const location = useLocation();
   const params = new URLSearchParams(location.search);
   const incomingText = params.get("text");
   const [query, setQuery] = useState("")
   const [response, setResponse] = useState("");

   useEffect(() => {
      if (incomingText) {
         setQuery(incomingText)
      }
   }, [incomingText])

   const handleUserQuery = (input: string) => {
      // stored user input in query state
      setQuery(input);

      // now as we have user requested input in our local query state variable we can send a POST
      // request to our backend in form of body: query and exprect response from server and update
      // in our reposne as setResponse(backend from backend)
      setResponse("hadr coded resposne from developer")
   }


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
                  <div className={styles.userInterface}>
                     <div>
                        <p style={{
                           color: "white"
                        }}>{query}</p>
                     </div>
                     <div>
                        {response}
                     </div>
                  </div>
                  <div className={styles.inputBox}>
                     <InputBox noOuterBorder noSuggestedPrompts onSend={handleUserQuery} />
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