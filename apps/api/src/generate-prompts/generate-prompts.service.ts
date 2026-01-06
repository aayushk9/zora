import { Injectable, Inject } from '@nestjs/common';
import { SelectedEventsDto } from './dto/selected-events.dto';
import OpenAI from 'openai';
import { OPENAI_CLIENT } from "src/openai/openai.constant"

@Injectable()
export class GeneratePromptsService {
    constructor(
        @Inject(OPENAI_CLIENT) 
        private readonly openai: OpenAI
    ) {}

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

        // raw response from open ai with all parameters
        const response = await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{
                role: 'user',
                content: prompts
            }]
        })

        console.log("response", response)
        // extract the actual response i.e prompts
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