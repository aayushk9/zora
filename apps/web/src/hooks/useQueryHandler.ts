import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEventStore } from "../store/useSelectedEventStore";
import { useConversationStore } from "../store/useConversationStore";
import { useMessageStore } from "../store/useMessageStore";
import { API_BASE_URL } from "../env";
import type { SelectedEventProps } from "../types/event";

interface Messages {
    message_id?: string
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
            if (!incomingText) return;
            if (!conversations) return;
            if (hasRun.current) return;

            hasRun.current = true;
            isNewConversation.current = true;

            setMessages([]);
            handleUserQuery(incomingText, src);
            navigate(`/query`, { replace: true });

        }
    }, [incomingText])

    useEffect(() => {
        if (!conversationId) return;
        if (!isNewConversation.current) return;

        const fetchHistory = async () => {
            setMessages([
                {
                    message_id: crypto.randomUUID(),
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
                    console.log(data)
                    const formatMesssage: Messages[] = data.map((msg: any) => ({
                        ...msg,
                        conversationHistory: true,
                        chatLoader: false
                    }))
                    console.log(formatMesssage)
                    setMessages(formatMesssage)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchHistory()
    }, [conversationId])


    const handleUserQuery = async (input: string, source?: string | null) => {
        if (!input.trim()) return;

        const userId = crypto.randomUUID();
        const assistantId = crypto.randomUUID();

        const userMessage: Messages = {
            message_id: userId,
            message_type: "user",
            content: input,
            conversationHistory: false,
            selected_events: source == "landing" ? selectedEvents : [],
        };

        const assistantMessage: Messages = {
            message_id: assistantId,
            message_type: "assistant",
            content: "",
            isLoading: true,
            conversationHistory: false
        };

        setMessages((prev) => [...prev, userMessage, assistantMessage]);

        const payloadMessages = isNewConversation.current ?
            [userMessage] :
            useMessageStore.getState().messages.filter(m => !m.isLoading).concat(userMessage);


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
                addConversation({ id: data.id, title: data.title })
                navigate(`/query/${data.id}`)
            }

            setMessages(prev =>
                prev.map((m) =>
                    m.message_id === assistantId ?
                        {
                            ...m,
                            message_id: data.messageId, content: data.response, isLoading: false, selected_events: source == "landing" ? selectedEvents : []
                        }
                        : m
                )
            )

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