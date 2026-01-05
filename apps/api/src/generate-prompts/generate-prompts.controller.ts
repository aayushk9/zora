import { Controller, Body, Post } from '@nestjs/common';
import { GeneratePromptsService } from './generate-prompts.service';
import { SelectedEventsDto } from './dto/selected-events.dto';

@Controller("generate-prompts")
export class GeneratePromptsController {
    constructor(private readonly generatepromptService: GeneratePromptsService) {}

    @Post()
    generateSuggestions(@Body('selectedEvents') selectedEvents: SelectedEventsDto[]) {
       return this.generatepromptService.generateSuggestedPrompts(selectedEvents)
    }
}