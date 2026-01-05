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
        const prompts = `
             You are a financial analysis assistant.

             Events:
              ${selectedEvents}

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
                - Output JSON only
                - Output ONLY valid JSON
                - Do NOT use markdown
                - Do NOT wrap response in json
                - Do NOT add any text outside JSON
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

        const jsonMatch = content.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("No JSON found in OpenAI response");
        }

        // parse this json formatted string into actual json
        const data = JSON.parse(jsonMatch[0]);
        console.log("data: ", data)
        return {
            prompts: data.prompts
        }
    }
}