import React, { useState, useEffect } from "react"
import styles from "./Sidebar.module.css"
import { useNavigate, useParams } from "react-router-dom"
import { useConversationStore } from "../../store/useConversationStore"
import { useMessageStore } from "../../store/useMessageStore"
import { API_BASE_URL } from "../../env"

export function Sidebar() {

  const navigate = useNavigate();
  const { id: activeConversationId } = useParams<{ id: string }>();

  const conversations = useConversationStore((conversation) => conversation.conversations)
  const setConversations = useConversationStore((conversation) => conversation.setConversations)
  const setMessages = useMessageStore((message) => message.setMessages)

  const [historyTabOpen, setHistoryTabOpen] = useState(true)

  useEffect(() => {
    const fetchConversations = async () => {
      setConversations([])
      const res = await fetch(`${API_BASE_URL}/api/conversations`, {
        method: "GET",
        credentials: "include"
      })
      const data = await res.json();
      setConversations(data)
    }
    fetchConversations()
  }, [])

  const openNewChat =  () => {
    setMessages([])
    navigate(`/query`)
  }

  const openConversation = async (conversationId: string) => {
    setMessages([
      {
        message_type: "assistant",
        content: "",
        chatLoader: true,
        conversationHistory: true
      }
    ])
    navigate(`/query/${conversationId}`)
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
              <span className={styles.history}>History</span>
              <span className={styles.arrow}>
                {historyTabOpen ? "▼" : "▶"}
              </span>
            </div>
            {historyTabOpen && (
              <div className={styles.titles}>
                {conversations.map((conversation) => (
                  <div key={conversation.id} onClick={() => openConversation(conversation.id)} className={
                    conversation.id === activeConversationId
                      ? styles.activeConversation
                      : styles.titleItem
                  }>
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