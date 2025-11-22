import React, { useEffect, useRef } from "react";
import styles from './DesktopLayout.module.css'
import { Sidebar } from "../../Sidebar/Sidebar";
import { InputBox } from "../../InputBox/InputBox";
import DottedBackground from "../../DottedBackground/DottedBackground";
import { useQueryHandler } from "../../../hooks/useQueryHandler";


export function DesktopLayout() {

   const {
      messages,
      handleUserQuery
   } = useQueryHandler();

   const messagesEndRef: any = useRef(null);

   // 3. This function scrolls the anchor into view
   const scrollToBottom: any = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   };

   // 4. Triggers auto-scroll whenever messages changes
   useEffect(() => {
      scrollToBottom();
   }, [messages]);
   
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
                     <div className={styles.messagesArea}>
                        {messages.map((message, index) => (
                           <p key={index} style={{
                              color: "white"
                           }}>{message.content}</p>
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