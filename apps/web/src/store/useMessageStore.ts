import { create } from "zustand"
import type { SelectedEventProps } from "../types/event"

interface Messages {
    client_id: string,
    server_id?: string
    message_type: "user" | "assistant",
    content: string,
    isLoading?: boolean
    conversationHistory?: boolean
    chatLoader?: boolean
    selected_events?: SelectedEventProps[],
}

interface MessagesState {
    messages: Messages[],
    setMessages: (message: Messages[] | ((prev: Messages[]) => Messages[])) => void,
    addMessages: (message: Messages) => void
}

export const useMessageStore = create<MessagesState>((set) => ({
    messages: [],
    setMessages: (messages) => set((state) => ({
        messages:
            typeof messages === "function"
                ? messages(state.messages) :
                messages
    })),
    addMessages: (message) =>
        set((state) => ({
            messages: [message, ...state.messages]
        }))
}))