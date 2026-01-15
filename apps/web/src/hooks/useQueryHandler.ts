import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate} from "react-router-dom";
import { useEventStore } from "../store/useSelectedEventStore";
import { useConversationStore } from "../store/useConversationStore";

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
    const [conversationId, setConversationId] = useState<string>("")
    const  conversations  = useConversationStore.getState().conversations;
    const addConversation = useConversationStore((conversation) => conversation.addConversation)
    const navigate = useNavigate();
    // we need to send only once post request to /conversations from here when the user sends first request as it grabs conversation ids from there and attaches here to post request of chat so in same
    // chat we dont need another id unless its new chat


    // apart from intial conversation id change we will empty satte messages whenever conversationn id changes and send request to chat ednpoint with this changes conversdation id  for messages existing in that conversation id 
    // flow => client -> api call -> db -> api call - client\

   // sedn request based on 2 cases. firstly when we send the request when conversation id = 0 and when that 0 keeps changin


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

        const userMessage: Messages = { role: "user", content: input };
        const assistantMessage: Messages = { role: "assistant", content: "", isLoading: true };
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

            if(!conversationId && conversations.length == 0) {
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
        handleUserQuery
    };
}