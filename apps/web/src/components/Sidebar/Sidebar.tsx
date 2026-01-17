import React, { useState, useEffect } from "react"
import styles from "./Sidebar.module.css"
import { useNavigate, useParams } from "react-router-dom"
import { useConversationStore } from "../../store/useConversationStore"
import { useMessageStore } from "../../store/useMessageStore"

interface Messages {
  message_type: "user" | "assistant",
  isLoading?: boolean;
  content: string;
  conversationHistory: boolean;
  chatLoader: boolean
}

export function Sidebar() {
  const navigate = useNavigate();
  const conversations = useConversationStore((conversation) => conversation.conversations)
  const setConversations = useConversationStore((conversation) => conversation.setConversations)
  const setMessages = useMessageStore((message) => message.setMessages)
  const [historyTabOpen, setHistoryTabOpen] = useState(true)
  const { activeConversationId } = useParams<{ activeConversationId: string }>();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      const res = await fetch("http://localhost:3000/api/conversations", {
        method: "GET",
        credentials: "include"
      })
      const data = await res.json();
      setConversations(data)
    }
    fetchConversations()
  }, [])

  useEffect(() => {
    if (conversations.length > 0 && activeIndex === null) {
      setActiveIndex(0);
    }
  }, [conversations, activeIndex]);

  const openNewChat = async () => {
    setMessages([])
    navigate(`/query`)
  }

  const openConversation = async (conversationId: string, index: number) => {

    try {
      if (conversationId == activeConversationId) return;
      setActiveIndex(index)
      setMessages([
        {
          message_type: "assistant",
          content: "",
          chatLoader: true,
          conversationHistory: true
        }
      ])

      navigate(`/query/${conversationId}`)
      const res = await fetch("http://localhost:3000/api/chat/history", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          conversationId: conversationId
        })
      })

      const data = await res.json();

      const formattedMessages: Messages[] = data.map((m: any) => ({
        ...m,
        chatLoader: false,
        conversationHistory: true
      }))
      setMessages(formattedMessages)
    } catch (error) {
      console.log(error)
    }
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
                {conversations.map((conversation, index) => (
                  <div key={index} onClick={() => openConversation(conversation.id, index)} className={
                    index === activeIndex
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