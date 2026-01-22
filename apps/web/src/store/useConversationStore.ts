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

  setConversations: (serverConversations) =>
    set((state) => {
      const map = new Map<string, Conversation>();

      state.conversations.forEach((c) =>
        map.set(c.id, c)
      );

      serverConversations.forEach((c) =>
        map.set(c.id, c)
      );

      return {
        conversations: Array.from(map.values()),
      };
    }),


  addConversation: (conversation) =>
    set((state) => {
      const exists = state.conversations.some(
        (c) => c.id === conversation.id
      );

      if (exists) return state;

      return {
        conversations: [conversation, ...state.conversations],
      };
    }),
}));
