import React, { useState } from "react"
import styles from "./Sidebar.module.css"
import { useNavigate, useParams } from "react-router-dom"
import { useMessageStore } from "../../store/useMessageStore"
import { API_BASE_URL } from "../../env"
import { useEventStore } from "../../store/useSelectedEventStore"
import type { SelectedEventProps } from "../../types/event"
import { useConversations } from '../../hooks/useConversation'

interface Messages {
  client_id: string
  server_id?: string
  message_type: "user" | 'assistant',
  content: string
  isLoading?: boolean
  conversationHistory?: boolean
  chatLoader?: boolean
  selected_events?: SelectedEventProps[],
}

export function Sidebar() {

  const navigate = useNavigate();
  const { id: activeConversationId } = useParams<{ id: string }>();
   const { data: conversations = []} = useConversations()
  const setMessages = useMessageStore((message) => message.setMessages)
  const clearEvents = useEventStore((event) => event.clearEvents);

  const [historyTabOpen, setHistoryTabOpen] = useState(true)

  const openNewChat = () => {
    setMessages([])
    clearEvents();
    navigate(`/query`)
  }

  const openConversation = async (conversationId: string) => {
    try {
      if (conversationId == activeConversationId) {
        return;
      }
      setMessages([
        {
          client_id: crypto.randomUUID(),
          message_type: "assistant",
          content: "",
          conversationHistory: true,
          chatLoader: true
        }
      ])

      navigate(`/query/${conversationId}`)

      const res = await fetch(`${API_BASE_URL}/api/chat/history`, {
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
      const formatMessage: Messages[] = data.map((msg: any) => ({
        client_id: crypto.randomUUID(),
        server_id: msg.message_id,
        message_type: msg.message_type,
        content: msg.content,
        selected_events: msg.selected_events,
        conversationHistory: true,
        chatLoader: false
      }))
      setMessages(formatMessage)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <React.Fragment>
      <div className={styles.parentContainer}>
        <div className={styles.sidebar}>
          <button onClick={() => { openNewChat() }} className={styles.chat}>
            New chat
          </button>
          <div className={styles.historySection}>
            <div className={styles.historyHeader} onClick={() => setHistoryTabOpen(prev => !prev)}>
              <span className={styles.history}>Recents</span>
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