import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate} from "react-router-dom";
import { useEventStore } from "../store/useSelectedEventStore";
import { useConversationStore } from "../store/useConversationStore";
import { useMessageStore } from "../store/useMessageStore";

interface Messages {
    message_type : "user" | 'assistant',
    content: string
    isLoading?: boolean
}

export function useQueryHandler() {

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const incomingText = params.get("c");
    const messages = useMessageStore((message) => message.messages)
    const setMessages = useMessageStore((message) => message.setMessages)
    const hasRun = useRef(false)
    const selectedEvents = useEventStore((s) => s.selectedEvents)
    const [conversationId, setConversationId] = useState<string>("")
    const  conversations  = useConversationStore((conversation) => conversation.conversations);
    const addConversation = useConversationStore((conversation) => conversation.addConversation)
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

        const userMessage: Messages = { message_type: "user", content: input };
        const assistantMessage: Messages = { message_type: "assistant", content: "", isLoading: true };
        const updatedMessages = [...messages, userMessage, assistantMessage];
        setMessages(updatedMessages);

        try {
            const res = await fetch(`http://localhost:3000/api/chat`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messages: [
                        ...messages, userMessage
                    ],
                    selectedEvents,
                    conversationId
                }),
            })

            const data = await res.json();
            const output = data.response;
            const id = data.id

            if(!conversationId && data.id) {
                setConversationId(data.id)
                navigate(`/query/${id}`)

                addConversation({
                    id: data.id,
                    title: data.title
                })
            }
            
            if (res.status == 500) {
                alert("Something seems off please try again later")
            }

            setMessages((prev) =>
                prev.map((msg, i) =>
                    i == prev.length - 1 ?
                        { ...msg, content: output, isLoading: false } :
                        { ...msg }
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