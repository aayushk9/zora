import { Injectable, Inject } from '@nestjs/common';
import OpenAI from 'openai';
import { Messages } from './dto/Messages';
import { SelectedEventsDto } from 'src/generate-prompts/dto/selected-events.dto';
import { OPENAI_CLIENT } from 'src/openai/openai.constant';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ChatService {

  constructor(
    @Inject(OPENAI_CLIENT)
    private readonly openai: OpenAI,
    private readonly db: DatabaseService
  ) { }

  async fetchResponse(messages: Messages[], selectedEvents: SelectedEventsDto[]) {
    // SELECTED EVENTS CONSIST 25-35 TOKENS PER EVENT
    try {
      if (!Array.isArray(messages)) {
        throw new Error("messages must be an array");
      }

      if (!Array.isArray(selectedEvents)) {
        throw new Error("selectedEvents must be an array");
      }

      const userMessage = messages.filter(message => message.role == "user"); 
      const assistantMessage = messages.filter(message => message.role == "assistant");

      const lastTwoUserQueries = userMessage.slice(-2);
      const lastAssistantResponse = assistantMessage.slice(-1)

      const recentMessages = [
        ...lastTwoUserQueries,
        ...lastAssistantResponse
      ]

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

      const messagesForLLM: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "system",
          content: buildSelectedEventsContext(selectedEvents)
        },
        ...recentMessages.map( recentMessage=> ({
          role: recentMessage.role,
          content: recentMessage.content
        }))
      ]

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messagesForLLM,
        max_tokens: 150
      })

      console.log(response);

      const content = response.choices[0].message?.content;
      console.log(messages)

      // INSERT INTO users with gen random uuid(), current conversation id, Message type as user/assitanr and content as content from user/assistant

      if (!content) {
        throw new Error("no content found in response from llm")
      }

      return content;
    } catch (error) {
      if (error.status === 429) {
        throw new error(
          'AI is temporarily rate limited. Please try again later.',
          429
        );
      }
    }
  }
}
