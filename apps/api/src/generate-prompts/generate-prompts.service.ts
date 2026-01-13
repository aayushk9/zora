import { Injectable, Inject } from '@nestjs/common';
import { SelectedEventsDto } from './dto/selected-events.dto';
import Groq from 'groq-sdk';
import { GROQ_CLIENT } from 'src/groq/groq.constant';

@Injectable()
export class GeneratePromptsService {
    constructor(
        @Inject(GROQ_CLIENT)
        private readonly groq: Groq
    ) { }

    async generateSuggestedPrompts(selectedEvents: SelectedEventsDto[]) {
        const prompts = `
             You are a financial analysis assistant.

             Events:
              ${JSON.stringify(selectedEvents, null, 2)}

             Task:    
             Generate suggested prompts a user can ask to better understand the selected market events

             Rules:
                - If 1 event → generate 5 prompts for that event
                - If multiple events → generate 1 prompt per event
                - Maximum 5 prompts total
                - Do NOT predict prices
                - Do NOT give trading advice
                - Do NOT mention specific numbers
                - Keep prompts concise
        `;

        const response = await this.groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [{
                role: 'user',
                content: prompts
            }]
        })

        console.log("response", response)
        const content = response.choices[0].message.content;
        console.log("content" + content)
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