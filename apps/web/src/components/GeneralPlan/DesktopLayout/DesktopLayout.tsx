import React, { useEffect, useRef } from "react";
import styles from './DesktopLayout.module.css'
import { Sidebar } from "../../Sidebar/Sidebar";
import { InputBox } from "../../InputBox/InputBox";
import DottedBackground from "../../DottedBackground/DottedBackground";
import { useQueryHandler } from "../../../hooks/useQueryHandler";
import { formatVolumeUsd } from "../../../hooks/useFormatVolumeUsd";
import { StreamingMessage } from "../../StreamingMessage/StreamingMessage";
import { Loader } from "../../Loader/Loader";
import { MonitorEventFlow } from "../../MonitorEventFlow/MonitorEventFlow";
import { ChatSkeleton } from "../../ChatSkeleton/ChatSkeleton";

export function DesktopLayout() {

   const {
      messages,
      handleUserQuery,
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

   const firstUserIndex = messages.findIndex(
      (m) => m.message_type === "user"
   );

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

                  <div className={styles.queryBorder}/>
                  <div className={styles.userInterface}>
                     <div className={styles.messagesArea} ref={messagesAreaRef}>

                        {messages.map((message, index) => (
                           message.chatLoader ? (<ChatSkeleton key={message.client_id}/>) :
                              <div key={message.client_id} className={`${message.message_type == "user" ? styles.userQuery : styles.agentResponse}`}>
                                 {message.message_type == "assistant" ? (
                                    message.isLoading ? (
                                       <Loader />
                                    ) : (
                                       message.conversationHistory ? (
                                          message.chatLoader ? (
                                             <ChatSkeleton />
                                          ) : (
                                             message.content
                                          )) : (
                                          <StreamingMessage text={message.content} />)
                                    )
                                 ) : (
                                    message.message_type === "user" && index === firstUserIndex && (message.selected_events?.length ?? 0) > 0 ? (
                                       <>
                                          {message.content}
                                          <div className={styles.events}>
                                             {message.selected_events?.map((ev) => (
                                                <div key={ev.title} className={styles.selectedEvent}>
                                                   <div className={styles.contest}>
                                                      <div className={styles.subSection}>
                                                         <span className={styles.title}>{ev.title}</span>
                                                      </div>

                                                      <div className={styles.stats}>
                                                         <span className={styles.volume}>
                                                            {formatVolumeUsd(ev.totalVolume / 1e6)}
                                                         </span>

                                                         <span className={styles.markets}>
                                                            <svg
                                                               className={styles.chartIcon}
                                                               width="12"
                                                               height="12"
                                                               viewBox="0 0 16 16"
                                                               fill="none"
                                                            >
                                                               <path
                                                                  d="M2 14V8M8 14V2M14 14V6"
                                                                  stroke="currentColor"
                                                                  strokeWidth="1.5"
                                                                  strokeLinecap="round"
                                                               />
                                                            </svg>
                                                            <span className={styles.marketCount}>
                                                               {ev.marketCount === 1
                                                                  ? "1 MARKET"
                                                                  : `${ev.marketCount} MARKETS`}
                                                            </span>
                                                         </span>
                                                      </div>
                                                   </div>
                                                </div>
                                             ))}
                                          </div>

                                       </>
                                    ) : (
                                       message.content
                                    )
                                 )}
                              </div>
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
                     <span className={styles.executionHeader}>Monitor Event</span>
                  </div>
                  <div className={styles.executionBorder}></div>
                  <div className={styles.executionBody}>
                     <DottedBackground>
                        <div style={{
                           position: 'absolute',
                           marginTop: "1rem",
                           justifyContent: "center",
                           padding: '6px 10px',
                           borderRadius: 8,
                           fontSize: 11,
                           color: '#ffffffd1',
                           zIndex: 10,
                           marginLeft: "15rem",
                           fontFamily: "sans-serif"
                        }}>
                           Live monitoring coming soon
                        </div>
                        <MonitorEventFlow />
                     </DottedBackground>
                  </div>
               </div>
            </div>
         </div>
      </React.Fragment>
   )
}