import React, { useState } from "react";
import styles from './MobileLayout.module.css'
import { InputBox } from "../../InputBox/InputBox";
import { MobileNavbar } from "../../MobileNavbar/MobileNavbar";
import { useQueryHandler } from "../../../hooks/useQueryHandler"
import { useEventStore } from "../../../store/useSelectedEventStore";
import { formatVolumeUsd } from "../../../hooks/useFormatVolumeUsd";
import { Loader } from "../../Loader/Loader";
import { StreamingMessage } from "../../StreamingMessage/StreamingMessage";

export function MobileLayout() {

  const selectedEvents = useEventStore((s) => s.selectedEvents)
  const removeEvents = useEventStore((s) => s.removeEvent)

  const [stagQuery, setStagQuery] = useState(true);
  const [execution, setExecution] = useState(false);
  const {
    messages,
    handleUserQuery
  } = useQueryHandler();


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
              <div className={styles.messageArea}>
                {messages.map((message, index) => (
                  <p key={index} className={`${message.message_type == "user" ? styles.userQuery : styles.agentResponse}`}>
                    {message.message_type == "assistant" ? (
                      message.isLoading == true ? (
                        <Loader/>
                      )  : (
                        <StreamingMessage text={message.content}/>
                      )) : (
                      message.content
                    )}
                    {selectedEvents.length > 0 && message.message_type == "user" && index == 0 && (
                      <div className={styles.events}>
                        {selectedEvents.map((ev) => (
                          <div key={ev.title} className={styles.selectedEvent}>
                            <div className={styles.contest}>
                              <div className={styles.subSection}>
                                <span className={styles.title}>{ev.title}</span>
                                <button className={styles.closeBtn} onClick={() => removeEvents(ev.title)}>x</button>
                              </div>
                              <div className={styles.stats}>
                                <span className={styles.volume}>{formatVolumeUsd(ev.totalVolume / 1e6)}</span>
                                <span className={styles.markets}>
                                  <svg className={styles.chartIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
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
                  </p>
                ))}
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