import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

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


        try {
            const res = await fetch(`http://localhost:3000/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify([updatedMessages])
            })
            // after server is ready do =>
            //const data = await res.json();
            // store data in agent message as
            // data.reply => agentMessage = {role: "agent", content: data.reply}

        } catch (err) {
            console.log(err)
        }

        // hard coding agent response as of now until server is up
        const agentMessage: Message = { role: 'agent', content: "hard coded for now instead of server message" }
        setMessages(prev => [...prev, agentMessage])

    }

    return {
        messages,
        setMessages,
        handleUserQuery,
    };
}