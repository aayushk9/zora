import { useState } from "react";

interface Message {
    role: "user" | 'agent',
    content: string 
}

export function useQueryHandler() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);


    const handleUserQuery = async () => {

        if (!input.trim()) return;

        const userMessage: Message = { role: "user", content: input }

        setMessages((prev) => [...prev, userMessage]);
        setInput("")

        const res = await fetch(`http://localhost:3000/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(messages)
        })

        const data = await res.json();

        const agentMessage: Message = { role: 'agent', content: "hard coded for now instead of server message"}

        setMessages(prev => [...prev, agentMessage])

        //const data = await res.json();

    }

     return {
    input,
    setInput,
    messages,
    setMessages,
    handleUserQuery,
  };
}