import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEventStore } from "../store/useSelectedEventStore";
import { useConversationStore } from "../store/useConversationStore";
import { useMessageStore } from "../store/useMessageStore";

interface Messages {
    message_type: "user" | 'assistant',
    content: string
    isLoading?: boolean
    conversationHistory: boolean
}

export function useQueryHandler() {

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const incomingText = params.get("c");
    const messages = useMessageStore((message) => message.messages)
    const setMessages = useMessageStore((message) => message.setMessages)
    const hasRun = useRef(false)
    const selectedEvents = useEventStore((s) => s.selectedEvents)
    const { id: routeConversationId } = useParams<{ id?: string }>()
    const conversationId = routeConversationId ?? null
    const conversations = useConversationStore((conversation) => conversation.conversations);
    const addConversation = useConversationStore((conversation) => conversation.addConversation);
    const navigate = useNavigate();

    useEffect(() => {
        if (incomingText && !hasRun.current) {
            if (!incomingText) return;
            if (!conversations) return;
            if (hasRun.current) return;

            hasRun.current = true
            handleUserQuery(incomingText)
        }
    }, [incomingText])


    const handleUserQuery = async (input: string) => {
        if (!input.trim()) return;

        const userMessage: Messages = { message_type: "user", content: input, conversationHistory: false };
        const assistantMessage: Messages = { message_type: "assistant", content: "", isLoading: true, conversationHistory: false };

        setMessages((prev) => [...prev, userMessage, assistantMessage]);

        const payloadMessages = [...messages, userMessage];
        const safeConversationId = typeof conversationId === "string" &&
            conversationId.length > 0
            ? conversationId : null;

        try {
            const res = await fetch(`http://localhost:3000/api/chat`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messages: payloadMessages,
                    conversationId: safeConversationId,
                    selectedEvents
                }),
            })

            const data = await res.json();
            const output = data.response;

            if (!conversationId && data.id) {
                addConversation({
                    id: data.id,
                    title: data.title
                })

                navigate(`/query/${data.id}`)
            }

            if (res.status == 500) {
                alert("Something seems off please try again later")
            }

            setMessages(prev =>
                prev.map(msg =>
                    msg.isLoading
                        ? { ...msg, content: output, isLoading: false }
                        : msg
                ))

        } catch (err) {
            console.log(err);
        }
    }

    return {
        messages,
        setMessages,
        handleUserQuery
    };
}