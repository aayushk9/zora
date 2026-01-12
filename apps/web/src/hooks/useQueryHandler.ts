import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useEventStore } from "../store/useSelectedEventStore";

interface Messages {
    role: "user" | 'assistant',
    content: string
    isLoading?: boolean
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


        setMessages((prev) => [
            ...prev,
            { role: "user", content: input },
            { role: "assistant", content: "", isLoading: true }
        ])

        try {
            const res = await fetch(`http://localhost:3000/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messages: [
                        ...messages,
                        { role: "user", content: input }
                    ],
                    selectedEvents
                })
            })
            const output = await res.text()
            console.log(output)

            if(res.status == 500) {
                alert("Something seems off please try again later")
            }

            setMessages((prev) => [

                ...prev,
                {
                    role: "assistant",
                    content: output,
                    isLoading: false
                }
            ])
        } catch (err) {
            console.log(err);
            setMessages((prev) => [

                ...prev,
                {
                    role: "assistant",
                    content: "Something went wrong. Plese try again later",
                    isLoading: false
                }
            ])
        }
    }

    return {
        messages,
        setMessages,
        handleUserQuery,

    };
}