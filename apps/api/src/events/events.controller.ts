import { Body, Controller, Post } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller({path: "events", version: "1"})
export class EventsController {
    constructor(private readonly eventService: EventsService) {}

    @Post()
    renderEvents(
        @Body('activeCategory') activeCategory: string,
        @Body("start") start: number,
        @Body("end") end: number
      )
        {
        return this.eventService.fetchEvents(activeCategory, start, end)
    }
}
