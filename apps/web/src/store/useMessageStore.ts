import { create } from "zustand"

interface Messages {
    message_type: "user" | "assistant",
    content: string,
    isLoading?: boolean
    conversationHistory?: boolean
    chatLoader?: boolean
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