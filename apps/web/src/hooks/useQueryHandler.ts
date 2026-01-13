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

        const userMessage: Messages = { role: "user", content: input };
        const assistantMessage: Messages = { role: "assistant", content: "", isLoading: true };

        const updatedMessages = [...messages, userMessage, assistantMessage];
        setMessages(updatedMessages);

        try {
            const res = await fetch(`http://localhost:3000/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messages: [
                        ...messages, userMessage
                    ],
                    selectedEvents
                }),
                credentials: "include"
            })
            //const output = await res.text()
            //console.log(output)

            const data = await res.text();
            const output = data;
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
            setMessages((prev) =>
                prev.map((msg, i) =>
                    i == prev.length - 1 ?
                        { ...msg, content: "server has some problems pleasse try later" } :
                        { ...msg }
                )
            )
        }
    }

    return {
        messages,
        setMessages,
        handleUserQuery,

    };
}