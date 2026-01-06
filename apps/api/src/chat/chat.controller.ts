import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SelectedEventsDto } from 'src/generate-prompts/dto/selected-events.dto';
import { Messages } from './dto/Messages';
@Controller('chat')
export class ChatController {

    constructor(private readonly chatService: ChatService) {}

    @Post()
    async sendResponse(
        @Body('messages') messages: Messages[], 
        @Body('selectedEvents') selectedEvents:SelectedEventsDto[]
    )
    {
       return await this.chatService.fetchResponse(messages, selectedEvents)
    }
}
