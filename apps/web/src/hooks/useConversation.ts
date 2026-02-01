import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_BASE_URL } from '../env'

type Conversation = {
  id: string
  title: string
}

export const conversationsQuery = () => ({
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

export function useAddConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (conversation: Conversation) => {
      return conversation
    },

    onMutate: async (newConversation) => {
      await queryClient.cancelQueries({ queryKey: ['conversations'] })

      const previousConversations =
        queryClient.getQueryData<Conversation[]>(['conversations'])

      queryClient.setQueryData<Conversation[]>(
        ['conversations'],
        (old = []) => {
          const filtered = old.filter(c => c.id !== newConversation.id)
          return [newConversation, ...filtered]
        }
      )

      return { previousConversations }
    },

    onError: (err, newConversation, context) => {
      if (context?.previousConversations) {
        queryClient.setQueryData(
          ['conversations'],
          context.previousConversations
        )
        console.log(err);
        console.log(newConversation)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}