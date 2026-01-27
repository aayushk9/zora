import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { API_BASE_URL } from '../env'

interface Conversation {
  id: string
  title: string
}

// Fetch all conversations
export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async (): Promise<Conversation[]> => {
      const res = await fetch(`${API_BASE_URL}/api/conversations`, {
        method: 'GET',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch conversations')
      return res.json()
    },
  })
}

// Add new conversation with optimistic update
export function useAddConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (conversation: Conversation) => {
      // If your API requires a request to add, do it here
      // Otherwise just return the conversation
      return conversation
    },
    
    // Optimistic update (runs immediately)
    onMutate: async (newConversation) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['conversations'] })

      // Snapshot the previous value
      const previousConversations = 
        queryClient.getQueryData<Conversation[]>(['conversations'])

      // Optimistically update to the new value
      queryClient.setQueryData<Conversation[]>(
        ['conversations'], 
        (old = []) => {
          // Remove duplicate if exists, add to top
          const filtered = old.filter(c => c.id !== newConversation.id)
          return [newConversation, ...filtered]
        }
      )

      // Return context with snapshot
      return { previousConversations }
    },
    
    // If mutation fails, rollback
    onError: (err, newConversation, context) => {
      if (context?.previousConversations) {
        queryClient.setQueryData(
          ['conversations'], 
          context.previousConversations
        )
      }
    },
    
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}