import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useEventStore } from "../store/useSelectedEventStore";

interface Message {
    role: "user" | 'agent',
    content: string 
}

export function useQueryHandler() {

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const incomingText = params.get("c");
    const [messages, setMessages] = useState<Message[]>([]);
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
        const userMessage: Message = { role: "user", content: input }
        let updatedMessages: Message[] = [];

        setMessages(prev => {
            updatedMessages = [...prev, userMessage];
            return updatedMessages;
        });
        console.log(updatedMessages)

        try {
            const res = await fetch(`http://localhost:3000/chat    `, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userQuery: [updatedMessages], selectedEvents })
            })
            const output = await res.json()
            console.log(output.data)
            const agentMessage: Message = { role: 'agent', content: output.data }
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