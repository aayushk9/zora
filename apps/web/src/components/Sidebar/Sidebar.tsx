import React, { useState, useEffect } from "react"
import styles from "./Sidebar.module.css"
import { useNavigate } from "react-router-dom"
import { useConversationStore } from "../../store/useConversationStore"


export function Sidebar() {
  const navigate = useNavigate();
  const conversations = useConversationStore((conversation) => conversation.conversations)
  const setConversations = useConversationStore((conversation) => conversation.setConversations)
  const [historyTabOpen, setHistoryTabOpen] = useState(true)

  useEffect(() => {
    const fetchConversationOnLoad = async () => {

      const res = await fetch("http://localhost:3000/api/conversations", {
        method: "GET",
        credentials: "include"
      })
      const data = await res.json();
      setConversations(data)
    }
    fetchConversationOnLoad()
  }, [])


  const openNewChat = async () => {
    navigate(`/query`)
  }

  const fetchMessages = () => {
   
  }
  return (
    <React.Fragment>
      <div className={styles.parentContainer}>
        <div className={styles.sidebar}>
          <button onClick={() => { openNewChat() }} className={styles.chat}>
            Research
          </button>
          <div className={styles.historySection}>
            <div className={styles.historyHeader} onClick={() => setHistoryTabOpen(prev => !prev)}>
              <span>History</span>
              <span className={styles.arrow}>
                {historyTabOpen ? "▼" : "▶"}
              </span>
            </div>
            {historyTabOpen && (
              <div className={styles.titles}>
                {conversations.map((conversation) => (
                  <div key={conversation.id} onClick={() => {
                         navigate(`/query/${conversation.id}`);
                         fetchMessages()}
                       } 
                      className={styles.titleItem}>
                    {conversation.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}