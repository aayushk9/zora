import { Controller, Body, Post } from '@nestjs/common';
import { GeneratePromptsService } from './generate-prompts.service';
import { SelectedEventsDto } from './dto/selected-events.dto';
import { Throttle } from '@nestjs/throttler';

@Controller("generate-prompts")
export class GeneratePromptsController {
    constructor(private readonly generatepromptService: GeneratePromptsService) {}

    @Throttle({
        generatePrompts: {
         ttl: 60,
         limit: 10
        }
    })
    @Post()
    async generateSuggestions(@Body() body: {selectedEvents: SelectedEventsDto[]}) {
       const {selectedEvents} = body
       return await this.generatepromptService.generateSuggestedPrompts(selectedEvents)
    }
}