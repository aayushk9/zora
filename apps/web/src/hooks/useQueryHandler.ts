import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEventStore } from "../store/useSelectedEventStore";
import { useConversationStore } from "../store/useConversationStore";
import { useMessageStore } from "../store/useMessageStore";
import { API_BASE_URL } from "../env";
import type { SelectedEventProps } from "../types/event";

interface Messages {
    message_type: "user" | 'assistant',
    content: string
    isLoading?: boolean
    conversationHistory?: boolean
    chatLoader?: boolean
    selectedEvents?: SelectedEventProps[]
}

export function useQueryHandler() {

    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const incomingText = params.get("c");

    const messages = useMessageStore((message) => message.messages)
    const setMessages = useMessageStore((message) => message.setMessages)

    const hasRun = useRef(false);
    const isNewConversation = useRef(true);

    const { id: routeConversationId } = useParams<{ id?: string }>()
    const conversationId = routeConversationId ?? null

    const conversations = useConversationStore((conversation) => conversation.conversations);
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
            handleUserQuery(incomingText);
            navigate(`/query`, { replace: true });

        }
    }, [incomingText])

    useEffect(() => {
        if (!conversationId) return;

        hasRun.current = true;
    }, [conversationId])

    useEffect(() => {
        // this effect should only run when we are refreshing or reloading page
        if (!conversationId) return;

         if (!isNewConversation.current) return; // this condition avoides recenlty created conversation dual api request

        const fetchExistingChatFromDB = async () => {
            setMessages([
                {
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
                    const formatMesssage: Messages[] = data.map((msg: any) => ({
                        ...msg,
                        conversationHistory: true,
                        chatLoader: false
                    }))
                    setMessages(formatMesssage)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchExistingChatFromDB()
    }, [conversationId])


    const handleUserQuery = async (input: string) => {
        if (!input.trim()) return;

        const userMessage: Messages = { message_type: "user", content: input, conversationHistory: false };
        const assistantMessage: Messages = { message_type: "assistant", content: "", isLoading: true, conversationHistory: false };

        setMessages((prev) => [...prev, userMessage, assistantMessage]);

        const payloadMessages = isNewConversation.current ? [userMessage] : [...useMessageStore.getState().messages, userMessage];
        const safeConversationId = typeof conversationId === "string" &&
            conversationId.length > 0
            ? conversationId : null;

        try {
            const res = await fetch(`${API_BASE_URL}/api/chat`, {
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
                isNewConversation.current = false;
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
                )
            )

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