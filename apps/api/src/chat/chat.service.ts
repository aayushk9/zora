import { Injectable, Inject, Req } from '@nestjs/common';
import Groq from 'groq-sdk';
import { Messages } from './dto/Messages';
import { SelectedEventsDto } from 'src/generate-prompts/dto/selected-events.dto';
import { DatabaseService } from 'src/database/database.service';
import { GROQ_CLIENT } from 'src/groq/groq.constant';
import { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import { LLMQuotaService } from 'src/llm-quota/llm-quota.service';


@Injectable()
export class ChatService {

  constructor(
    private readonly db: DatabaseService,
    @Inject(GROQ_CLIENT)
    private readonly groq: Groq,
    private readonly quotaService: LLMQuotaService,
  ) { }

  async fetchResponse(messages: Messages[], selectedEvents: SelectedEventsDto[], userId: string | null, conversationId: string | null) {

    if (!Array.isArray(messages)) {
      throw new Error("messages must be an array");
    }

    if (!Array.isArray(selectedEvents)) {
      throw new Error("selectedEvents must be an array");
    }

    // sanitize user data

    if (
      !conversationId ||
      typeof conversationId !== "string" ||
      conversationId.trim() === "" ||
      conversationId === "{}"
    ) {
      conversationId = null;
    }

    if (
      !userId ||
      typeof userId !== "string" ||
      userId.trim() === "" ||
      userId === "{}"
    ) {
      userId = null;
    }

    if (!conversationId || conversationId === "") {
      conversationId == null
    }

    if (conversationId && userId) {
      const exists = await this.db.query(
        `
         SELECT id
         FROM conversations
         WHERE id = $1
         AND user_id = $2
       `,
        [conversationId, userId]
      );

      if (exists.rowCount === 0) {
        conversationId = null;
      }
    }

    const isFirstMessage = !conversationId;
    const userMessage = messages.filter(message => message.message_type == "user");
    const firstUserMessage = userMessage[0]?.content ?? "New conversation"
    const latestUserMessage = userMessage[userMessage.length - 1]?.content;
    const recentMessages = messages.slice(-3)

    if (!latestUserMessage) {
      throw new Error("No user message provided");
    }

    function buildSelectedEventsContext(events: SelectedEventsDto[]) {
      if (!events || events.length === 0) {
        return `No specific events selected.`;
      }

      return `
        Selected Events:
         ${events.map((e, i) => `
           ${i + 1}. ${e.title}
           - Category: ${e.category}
           - Total Volume: ${e.totalVolume}
           - Markets: ${e.marketCount}
         `).join("")}
        `;
    }

    const systemPrompt = `You are an educational assistant for a prediction market platform. Your role is to help users understand and analyze market events

                      Your Responsibilities
                      - Answer user questions about the selected events or prediction markets
                      - Explain prediction market concepts in simple, beginner-friendly language
                      - Provide objective analysis of factors that could influence event outcome
                      
                      Rules
                     - Explain concepts clearly and neutrally
                     - Never give trading, betting, or investment advice
                     - Never recommend positions or outcomes

                      Response Style
                        - Beginner-friendly
                        - Use headers when helpful
                   `;

    const messagesForLLM: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "system",
        content: buildSelectedEventsContext(selectedEvents)
      },
      ...recentMessages.map(recentMessage => ({
        role: recentMessage.message_type,
        content: recentMessage.content
      }))
    ]

    let response;
    let content: string;
    let tokensUsed: number = 0;
    let assistantId: string = "";
    let title: string = "";

    try {
      response = await this.groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: messagesForLLM,
        max_tokens: 2,
        temperature: 0.4
      })

      content = response.choices[0].message?.content;
      tokensUsed = response.usage?.total_tokens ?? 0;

      title = "New chat"
      if (!conversationId && userId) {
        const result = await this.db.query(
          `INSERT INTO conversations (user_id, title)
         VALUES ($1, $2)
         RETURNING id, title
        `, [userId, firstUserMessage.slice(0, 30)]
        )
        conversationId = result.rows[0].id;
        title = result.rows[0].title;
      }

      const isEventSelected = isFirstMessage && Array.isArray(selectedEvents) && selectedEvents.length > 0
      if (userId && conversationId) {
        await this.db.query(
          `INSERT INTO messages (id, conversation_id, message_type, content, selected_events)
         VALUES (gen_random_uuid(), $1, 'user', $2, $3)
        `, [conversationId, latestUserMessage, isEventSelected ? JSON.stringify(selectedEvents) : null]
        )

        const assistantResponse = await this.db.query(
          `INSERT INTO messages (id, conversation_id, message_type, content)
         VALUES(gen_random_uuid(), $1, 'assistant' , $2 )
         RETURNING id
        `, [conversationId, content]
        )

        assistantId = assistantResponse.rows[0].id;

        await this.quotaService.consumeTokens(userId, tokensUsed);

        // this will run only when conversation title is New chat whic is at initial user request
        await this.db.query(
          `
      UPDATE conversations
      SET title = $1
      WHERE id = $2
        AND title = 'New chat'
      `,
          [firstUserMessage.slice(0, 60), conversationId]
        );

      }

      if (!content) {
        throw new Error("no content found in response from llm")
      }

    } catch (error) {
      if (error.status === 429 || error.code === 'rate_limit_exceeded') {
        throw new Error('AI service is temporarily rate limited. Please try again in a moment.');
      }
      if (error.status === 503 || error.status === 500) {
        throw new Error('AI service temporarily unavailable. Please try again.');
      }
      throw error;
    }

    const quota = await this.quotaService.getRemainingQuota(userId);
    
    return {
      response: content,
      id: conversationId,
      title,
      messageId: assistantId,
      tokensUsed,
      quota
    }
  }
}