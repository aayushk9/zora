import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEventStore } from "../store/useSelectedEventStore";
import { useMessageStore } from "../store/useMessageStore";
import { API_BASE_URL } from "../env";
import type { SelectedEventProps } from "../types/event";
import { useQuotaStore } from "../store/useQuotaStore";
import { useAddConversation } from "../hooks/useConversation"

type Messages = {
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

    const setQuotaExceeded = useQuotaStore((state) => state.setQuotaExceeded);
    const setQuotaData = useQuotaStore((state) => state.setQuotaData);

    const hasRun = useRef(false);
    const isNewConversation = useRef(true);

    const { id: routeConversationId } = useParams<{ id?: string }>()
    const conversationId = routeConversationId ?? null;
    const selectedEvents = useEventStore((s) => s.selectedEvents)

    const addConversationMutation = useAddConversation();
    
    useEffect(() => {
        const fetchQuota = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/chat/quota`, {
                    method: "GET",
                    credentials: "include",
                });

                if (res.ok) {
                    const data = await res.json();
                    setQuotaData(data);
                }
            } catch (error) {
                console.error("Failed to fetch quota:", error);
            }
        };

        fetchQuota();
    }, []);

    useEffect(() => {
        if (incomingText && !hasRun.current) {
            if (!incomingText) return;
            if (hasRun.current) return;

            hasRun.current = true;
            isNewConversation.current = false;

            setMessages([]);
            handleUserQuery(incomingText, src);
            navigate("/query", { replace: true });
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
            selected_events: src === "landing" ? selectedEvents : [],
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

            if (res.status === 403) {
                const error = await res.json();

                if (error.code === 'LLM_QUOTA_EXCEEDED') {
                    setQuotaExceeded({
                        used: error.used,
                        limit: error.limit,
                        resetAt: error.resetAt,
                        message: error.message,
                        isTemporary: false
                    });
                    // Remove the loading assistant message
                    setMessages(prev => prev.filter(m => m.client_id !== assistantId));
                    return;
                }
            }

            if (res.status === 429) { // this either due to to many requst in 60 seconds by user or global rate limit of api, 
                let errorMessage = "Too many requests. Please slow down and try again.";
                try {
                    const contentType = res.headers.get('content-type');

                    if (contentType?.includes('application/json')) {
                        const error = await res.json();
                        errorMessage = error.message || errorMessage;
                    } else {
                        const textError = await res.text();
                        errorMessage = textError || errorMessage;
                    }
                } catch (parseError) {
                    console.error('Failed to parse 429 error:', parseError);
                }

                setQuotaExceeded({
                    message: errorMessage,
                    isTemporary: true
                });

                setMessages(prev => prev.filter(m => m.client_id !== assistantId));
                return;
            }


            if (!res.ok) {
                 setQuotaExceeded({
                    message: "Due to high traffic on the free tier, this request couldn’t be processed. Please retry shortly — premium plans are coming soon.",
                    isTemporary: true
                });
                setMessages(prev => prev.filter(m => m.client_id !== assistantId));
                return;
            }

            const data = await res.json();

            if (data.tokensUsed) {
                setQuotaData({
                    remaining: data.quota.remaining,
                    limit: data.quota.limit,
                    resetAt: data.quota.resetAt
                });
            }

            if (!conversationId && data.id) {
                isNewConversation.current = false
                addConversationMutation.mutate({
                    id: data.id, title: data.title
                })
                navigate(`/query/${data.id}`)
            }

            setMessages(prev =>
                prev.map((m) =>
                    m.client_id === assistantId ?
                        {
                            ...m,
                            server_id: data.messageId, 
                            content: data.response, 
                            isLoading: false, 
                            selected_events: src === "landing" ? selectedEvents : []
                        }
                        : m
                )
            )
        } catch (err) {
            console.error('Chat request failed:', err);

            setMessages(prev => prev.filter(m => m.client_id !== assistantId));
            setQuotaExceeded({
                message: "Connection error. Please check your internet and try again.",
                isTemporary: true
            });
        }
    }

    return {
        messages,
        setMessages,
        handleUserQuery,
    };
}