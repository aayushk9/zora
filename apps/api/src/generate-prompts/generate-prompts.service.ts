import { Injectable } from '@nestjs/common';
import { SelectedEventsDto } from './dto/selected-events.dto';
import { HttpService } from '@nestjs/axios';
import OpenAI from 'openai';

@Injectable()
export class GeneratePromptsService {
    private openai: OpenAI;

    constructor(private readonly http: HttpService) {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        })
     }
    
    

    async generateSuggestedPrompts(selectedEvents: SelectedEventsDto[]) {
    
        const prompt = `
             You are a financial analysis assistant.

             Events:
              ${JSON.stringify(selectedEvents, null, 2)}

             Task:
             Generate suggested prompts a user can ask to better understand the selected market events.

             Rules:
                - If 1 event → generate 5 prompts for that event
                - If multiple events → generate 1 prompt per event
                - Maximum 5 prompts total
                - Do NOT predict prices
                - Do NOT give trading advice
                - Do NOT mention specific numbers
                - Keep prompts concise
                - Output JSON only

        `;

        const res$ = await this.openai.chat.completions.create({
           model: "gpt-4o-mini",
           messages: [{
            role: 'user',
            content: prompt
           }]
        })

        const res = res$.choices[0].message.content;
        return res;
    }
}