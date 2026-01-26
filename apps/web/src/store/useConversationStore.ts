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
      const serverIds = new Set(serverConversations.map(c => c.id));
      const localOnly = state.conversations.filter(c => !serverIds.has(c.id));

      return {
        conversations: [...localOnly, ...serverConversations]
      }
    }),

  addConversation: (conversation) =>
    set((state) => {

      const filter = state.conversations.filter(
        (c) => c.id !== conversation.id
      );

      return {
        conversations: [conversation, ...filter],
      };
    }),
}));