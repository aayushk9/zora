import React, { useEffect} from "react";
import styles from './DesktopLayout.module.css'
import { Sidebar } from "../../Sidebar/Sidebar";
import { InputBox } from "../../InputBox/InputBox";
import DottedBackground from "../../DottedBackground/DottedBackground";
import { useLocation } from "react-router-dom";
import { useQueryHandler } from "../../../hooks/useQueryHandler";


export function DesktopLayout() {

   const location = useLocation();
   const params = new URLSearchParams(location.search);
   const incomingText = params.get("text");
   const {queries, setQueries, responses, handleUserQuery} = useQueryHandler();

   useEffect(() => {
      if (incomingText) {
         setQueries(prev => [...prev, incomingText])
      }
   }, [incomingText])


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
                       
                           {queries.map((query, index) => (
                               <p key={index} style={{
                           color: "white"
                        }}>{query}</p>
                           ))}
                        
                     </div>
                     <div>
                        {responses.map((response, index) => (
                           <p key={index} style={{color: "white"}}>
                              {response}
                           </p>
                        ))}
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