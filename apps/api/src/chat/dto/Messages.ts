export class Messages {
  message_type: "user" | 'assistant'
  content: string
  conversationHistory: boolean
}