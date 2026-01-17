import { Injectable, Inject } from '@nestjs/common';
import { SelectedEventsDto } from './dto/selected-events.dto';
import Groq from 'groq-sdk';
import { GROQ_CLIENT } from 'src/groq/groq.constant';
import { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

@Injectable()
export class GeneratePromptsService {
    constructor(
        @Inject(GROQ_CLIENT)
        private readonly groq: Groq
    ) { }

    async generateSuggestedPrompts(selectedEvents: SelectedEventsDto[]) {
        const prompts = `
             You are a financial analysis assistant.

             Task:    
             Generate suggested prompts a user can ask to better understand the selected market events

             Rules:
                - If 1 event is selected → generate 5 prompts for that event
                - If multiple events are selected → generate 1 prompt per event
                - Maximum return 5 prompts total
                - Keep prompts concise
                - return only prompts
            for example when user selects event returt just 5 promptsx thats it no other words such as here are the prompts just return the prompts and note that
            prompts should not begin with -
        `;

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

        const instructionsForLLM: ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: prompts
            },
            {
                role: "system",
                content: buildSelectedEventsContext(selectedEvents)
            }
        ]

        const response = await this.groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: instructionsForLLM
        })

        const content = response.choices[0].message.content;
    
        if (!content) {
            throw new Error("api retruned no content")
        }
        
        const arrayOfPrompts = content
            .split(/\n|\r\n/)
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => line.replace(/^\d+\.\s*/, ''));

        return arrayOfPrompts;
    }
}