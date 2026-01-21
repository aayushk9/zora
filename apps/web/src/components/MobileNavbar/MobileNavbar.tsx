import { useState, useEffect } from "react";
import styles from "./MobileNavbar.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useConversationStore } from "../../store/useConversationStore";
import { useMessageStore } from "../../store/useMessageStore";
import { API_BASE_URL } from "../../env";
import type { SelectedEventProps } from "../../types/event";

interface Messages {
  message_id?: string
  message_type: "user" | "assistant",
  content: string,
  isLoading?: boolean
  conversationHistory?: boolean
  chatLoader?: boolean
  selected_events?: SelectedEventProps[],
}

export function MobileNavbar() {

  const navigate = useNavigate();
  const { id: activeConversationId } = useParams<{ id: string }>();

  const conversations = useConversationStore((conversation) => conversation.conversations);
  const setConversations = useConversationStore((conversation) => conversation.setConversations);
  const setMessages = useMessageStore((message) => message.setMessages);

  const [historyTabOpen, setHistoryTabOpen] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);


  useEffect(() => {
    const fetchConversations = async () => {
      setConversations([]);
      const res = await fetch(`${API_BASE_URL}/api/conversations`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setConversations(data);
    };
    fetchConversations();
  }, []);

  const openNewChat = () => {
    setMessages([]);
    navigate(`/query`);
    setIsDrawerOpen(false);
  };

  const openConversation = async (conversationId: string) => {
    try {
      if (conversationId == activeConversationId) {
        return;
      }
      setMessages([
        {
          message_type: "assistant",
          content: "",
          chatLoader: true,
          conversationHistory: true,
          selected_events: []
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
        conversationHistory: true,
      }))
      setMessages(formattedMessages)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <button
        className={styles.mobileHamburger}
        onClick={() => setIsDrawerOpen(true)}
      >
        ☰
      </button>

      {isDrawerOpen && (
        <div className={styles.overlay} onClick={() => setIsDrawerOpen(false)} />
      )}

      <div
        className={`${styles.drawer} ${isDrawerOpen ? styles.open : ""}`}
      >
        <div className={styles.sidebar}>
          <button onClick={openNewChat} className={styles.chat}>
            New chat
          </button>

          <div className={styles.historySection}>
            <div
              className={styles.historyHeader}
              onClick={() => setHistoryTabOpen((prev) => !prev)}
            >
              <span className={styles.history}>History</span>
              <span className={styles.arrow}>
                {historyTabOpen ? "▼" : "▶"}
              </span>
            </div>

            {historyTabOpen && (
              <div className={styles.titles}>
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => openConversation(conversation.id)}
                    className={
                      conversation.id === activeConversationId
                        ? styles.activeConversation
                        : styles.titleItem
                    }
                  >
                    {conversation.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}