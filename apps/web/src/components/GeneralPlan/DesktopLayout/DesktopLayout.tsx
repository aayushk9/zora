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
   const messagesAreaRef = useRef<HTMLDivElement>(null);
   const scrollToBottom = () => {
      if (messagesEndRef.current) {
         messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
   };

   useEffect(() => {
      scrollToBottom();
   }, [messages]);

   return (
      <React.Fragment>
         <div className={styles.parentContainer}>
            <div>
               <Sidebar />
            </div>
            <div id="queryExecutionBox" className={styles.queryExecutionBox}>
               <div id="query" className={styles.queryBox}>
                  <div className={styles.headerSection}>
                     <span className={styles.queryHeader}>Query</span>
                  </div>

                  <div className={styles.queryBorder}></div>
                  <div className={styles.userInterface}>
                     <div className={styles.messagesArea} ref={messagesAreaRef}>
                        {messages.map((message, index) => (
                           <p key={index} className={`${message.role == "user" ? styles.userQuery : styles.agentResponse}`}>
                            {message.content}
                          </p>
                        ))}
                        <div ref={messagesEndRef} />
                     </div>
                  </div>
                  <div className={styles.inputBox}>
                     <InputBox noOuterBorder noSuggestedPrompts onSend={handleUserQuery} />
                  </div>
               </div>

               <div id="execution" className={styles.executionBox}>
                  <div className={styles.headerSection}>
                     <span className={styles.executionHeader}>Execution</span>
                  </div>
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