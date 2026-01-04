import { Injectable } from '@nestjs/common';
import { SelectedEventsDto } from './dto/selected-events.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class GeneratePromptsService {
    constructor(private readonly http: HttpService) {}

    async generateSuggestedPrompts (selectedEvents: SelectedEventsDto[]){
         // send request to llm api with selected event as body with some instructions like for every selected event give just 5 prompts and expect a response 
    }
}
