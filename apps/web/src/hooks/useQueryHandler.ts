import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEventStore } from "../store/useSelectedEventStore";
import { useConversationStore } from "../store/useConversationStore";
import { useMessageStore } from "../store/useMessageStore";
import { API_BASE_URL } from "../env";
import type { SelectedEventProps } from "../types/event";

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

export function useQueryHandler() {

    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const incomingText = params.get("c");
    const src = params.get("src");

    const messages = useMessageStore((message) => message.messages)
    const setMessages = useMessageStore((message) => message.setMessages)

    const hasRun = useRef(false);
    const isNewConversation = useRef(true);

    const { id: routeConversationId } = useParams<{ id?: string }>()
    const conversationId = routeConversationId ?? null
    const conversations = useConversationStore((state) => state.conversations)
    const addConversation = useConversationStore((conversation) => conversation.addConversation);
    const selectedEvents = useEventStore((s) => s.selectedEvents)

    useEffect(() => {
        if (incomingText && !hasRun.current) {
            {
                if (!incomingText) return;
                if (!conversations) return;
                if (hasRun.current) return;

                hasRun.current = true;
                isNewConversation.current = true;

                setMessages([]);
                handleUserQuery(incomingText, src);
                navigate("/query", { replace: true });
            }
        }
    }, [incomingText])

    useEffect(() => {
        if (!conversationId) return;

        if (!isNewConversation.current) return;

        const fetchHistory = async () => {
            setMessages([
                {
                    client_id: crypto.randomUUID(),
                    message_type: "assistant",
                    content: "",
                    conversationHistory: true,
                    chatLoader: true
                }
            ])

            try {
                if (conversationId) {
                    const res = await fetch(`${API_BASE_URL}/api/chat/history`, {
                        method: 'POST',
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
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchHistory();
    }, [conversationId])


    const handleUserQuery = async (input: string, src?: string | null) => {
        if (!input.trim()) return;

        const userId = crypto.randomUUID();
        const assistantId = crypto.randomUUID();

        const userMessage: Messages = {
            client_id: userId,
            message_type: "user",
            content: input,
            conversationHistory: false,
            selected_events: src == "landing" ? selectedEvents : [],
        };

        const assistantMessage: Messages = {
            client_id: assistantId,
            message_type: "assistant",
            content: "",
            isLoading: true,
            conversationHistory: false
        };

        setMessages((prev) => [...prev, userMessage, assistantMessage]);

        const payloadMessages = [userMessage]

        try {
            const res = await fetch(`${API_BASE_URL}/api/chat`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messages: payloadMessages,
                    conversationId: conversationId ?? null,
                    selectedEvents
                }),
            })

            const data = await res.json();


            if (!conversationId && data.id) {
                isNewConversation.current = false
                addConversation({
                    id: data.id, title: data.title
                })
                navigate(`/query/${data.id}`)
            }

            setMessages(prev =>
                prev.map((m) =>
                    m.client_id === assistantId ?
                        {
                            ...m,
                            server_id: data.messageId, content: data.response, isLoading: false, selected_events: src == "landing" ? selectedEvents : []
                        }
                        : m
                )
            )
            console.log("messages after server", messages)
        } catch (err) {
            console.log(err);
        }
    }

    return {
        messages,
        setMessages,
        handleUserQuery,
    };
}