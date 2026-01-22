import React, { useState } from "react";
import styles from './MobileLayout.module.css'
import { InputBox } from "../../InputBox/InputBox";
import { MobileNavbar } from "../../MobileNavbar/MobileNavbar";
import { useQueryHandler } from "../../../hooks/useQueryHandler"
import { formatVolumeUsd } from "../../../hooks/useFormatVolumeUsd";
import { Loader } from "../../Loader/Loader";
import { StreamingMessage } from "../../StreamingMessage/StreamingMessage";
import { ChatSkeleton } from "../../ChatSkeleton/ChatSkeleton";
import DottedBackground from "../../DottedBackground/DottedBackground";
import { MonitorEventFlow } from "../../MonitorEventFlow/MonitorEventFlow";

export function MobileLayout() {

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

  const firstUserIndex = messages.findIndex(
    (m) => m.message_type === "user"
  );

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
                  message.chatLoader ? <ChatSkeleton /> :
                    <div key={message.client_id} className={`${message.message_type == "user" ? styles.userQuery : styles.agentResponse}`}>
                      {message.message_type == "assistant" ? (
                        message.isLoading ? (
                          <Loader />
                        ) : (
                          message.conversationHistory ? (
                            message.chatLoader ? (
                              <ChatSkeleton />
                            ) :
                              message.content
                          )
                            :
                            <StreamingMessage key={index} text={message.content} />
                        )
                      ) : (
                        message.message_type == "user", index == firstUserIndex && (message.selected_events?.length ?? 0) ? (
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
              </div>
              <div className={styles.inputBox}><InputBox noSuggestedPrompts noOuterBorder onSend={handleUserQuery} /></div>
            </div>
          )}

          {execution && (
            <div className={styles.executionBody}>
              <DottedBackground>
                <MonitorEventFlow />
              </DottedBackground>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  )
}