import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { userRequest } from './dto/userRequest.dto';
import { SelectedEventsDto } from 'src/generate-prompts/dto/selected-events.dto';
import { throwError } from 'rxjs';

@Injectable()
export class ChatService {
    constructor(private openai: OpenAI) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      })
    }
    
    async fetchResponse(userQuery: userRequest[], selectedeVENTS: SelectedEventsDto[]) {
      // ACCEPT USER QUERY ONLY IF ITS FROM USER AND add selected event and train llm with these details adn fed into open ai 
      const prompt = `train llm here`
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
            role: "user",
            content: prompt
        }]
      })
      console.log(response);
      
      // extract actual content
      const content = response.choices[0].message.content;

      if(!content) {
        throw new Error("no content found in response from llm")
      }

      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if(!jsonMatch) {
        throw new Error("no json found in response")
      }

      // comvert jsonMatch into json by parsing
      const data = JSON.parse(jsonMatch[0])
      return {
        data: data.prompt
    }
    }
}
