import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SelectedEventsDto } from 'src/generate-prompts/dto/selected-events.dto';
import { userRequest } from './dto/userRequest.dto';
@Controller('chat')
export class ChatController {

    constructor(private readonly chatService: ChatService) {}

    @Post()
    sendResponse(@Body('userQuery, selectedEvents') userQuery: userRequest[], selectedEvents: SelectedEventsDto[]){
       this.chatService.fetchResponse(userQuery, selectedEvents)
    }
}
