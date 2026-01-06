import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useEventStore } from "../store/useSelectedEventStore";

interface Messages {
    role: "user" | 'assistant',
    content: string 
}

export function useQueryHandler() {

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const incomingText = params.get("c");
    const [messages, setMessages] = useState<Messages[]>([]);
    const hasRun = useRef(false)
    const selectedEvents = useEventStore((s) => s.selectedEvents)

    useEffect(() => {
        if (incomingText && !hasRun.current) {
            hasRun.current = true
            handleUserQuery(incomingText)
        }
    }, [incomingText])

    const handleUserQuery = async (input: string) => {
        if (!input.trim()) return;
        const userMessage: Messages = { role: "user", content: input }
        let updatedMessages: Messages[] = [];

        setMessages(prev => {
            updatedMessages = [...prev, userMessage];
            return updatedMessages;
        });

        console.log(updatedMessages)

        try {
            // json body
            const res = await fetch(`http://localhost:3000/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    messages: updatedMessages,
                    selectedEvents 
                })
            })
            // parse from json body/text to js object
            const output = await res.text() 
            console.log(output)
            const agentMessage: Messages = { role: 'assistant', content: output }
            setMessages(prev => [...prev, agentMessage])
        } catch (err) {
            console.log(err)
        }
    }

    return {
        messages,
        setMessages,
        handleUserQuery,
    };
}