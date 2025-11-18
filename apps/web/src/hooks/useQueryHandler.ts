import { useState } from "react";

interface Message {
    role: "user" | "agent",
    content: string
}

export function useQueryHandler () {
    const [messages, setMessages] = useState<Message[]>([]);
    const handleUserQuery = async(input: string) => {
       
        const updatedMessage: Message[] = [
            ...messages, 
            {
                role: "user",
                content: input
            }
        ]

        setMessages(updatedMessage)

        const res = await fetch(`http://localhost:3000/chat`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedMessage)
        })

        const data = await res.json();

        setMessages(prev => [
            ...prev, 
            {
                role: 'agent',
                content: data.reply
            }
        ])
        
    }
    return {handleUserQuery, messages, setMessages}
}