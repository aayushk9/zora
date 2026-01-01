import React, { useEffect, useRef } from "react";
import styles from './DesktopLayout.module.css'
import { Sidebar } from "../../Sidebar/Sidebar";
import { InputBox } from "../../InputBox/InputBox";
import DottedBackground from "../../DottedBackground/DottedBackground";
import { useQueryHandler } from "../../../hooks/useQueryHandler";
import { useEventStore } from "../../../store/useSelectedEventStore";
import { useFormatVolumeUsd } from "../../../hooks/useFormatVolumeUsd";

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
   const selectedEvents = useEventStore((s) => s.selectedEvents); // store selected events
   const removeEvents = useEventStore((s) => s.removeEvent) // to remove event

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
                            {selectedEvents.length > 0 && message.role == "user" && index == 0 && (
                               <div className={styles.events}>
                                {selectedEvents.map((ev) => (
                                    <div key={ev.title} className={styles.selectedEvent}>
                                        <div className={styles.contest}>
                                            <div className={styles.subSection}>
                                                <span className={styles.title}>{ev.title}</span>
                                                <button className={styles.closeBtn} onClick={() => removeEvents(ev.title)}>x</button>
                                            </div>
                                            <div className={styles.stats}>
                                                <span className={styles.volume}>{useFormatVolumeUsd(ev.totalVolume / 1e6)}</span>
                                                <span className={styles.markets}>
                                                    <svg className={styles.chartIcon} width="12" height="12" viewBox="0 0 16 16" fill="none">
                                                        <path d="M2 14V8M8 14V2M14 14V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    </svg>
                                                    <span className={styles.marketCount}>{ev.marketCount == 1 ? ev.marketCount + " MARKET" : ev.marketCount + " MARKETS"}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            )}
                            {/* currently if we are selecting event and navigating to query page the selected event is attached to 
                                query, but it does not look good with i/p box, instead we can attach selected event below the first 
                                user query

                                // how do we achive it?
                                1. we will be using useSelectedEvent store here
                                2. as we redirect from / to /query, we will be removing selected event from inputbox
                                3. add selected event to first message by the user

                                loader?
                                currenlty we are hard coding message on behalf of agent, but when the server will be activated the repsone time
                                will be increased, therefore loader is needed

                                how do we add a loader?
                                1. add a loader state
                                2. give a default value of false
                                3. when the user sends query change state value to true
                                4. when loader -> show loader else -> response

                                5. if message.role == "user" && message.content == input -> setLoader(true)
                                6. as loader is true display loader 
                                7. when agent response is ready set loader to false and show agent response

                                now we have removed selected event from getting displayed alongside inputbox when on /query path 
                                we need to manually display event inside query page
                                // addd 2 conditions to display an event along user's first query
                                  1) if selected event.length ? 0 && message.role == user and its their first request in current conversation
                            */}
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