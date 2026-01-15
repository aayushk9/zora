import { create } from "zustand";

interface Conversation {
  id: string;
  title: string;
}

interface ConversationState {
  conversations: Conversation[];
  setConversations: (c: Conversation[]) => void;
  addConversation: (c: Conversation) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
  addConversation: (conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    })),
}));
