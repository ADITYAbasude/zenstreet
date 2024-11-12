import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { EventService } from '../services/event.service';
import { CreateEventDto, UpdateEventDto } from '../dto/event.dto';
import { Event } from '../entities/event.entity';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async createEvent(@Body() data: CreateEventDto): Promise<Event> {
    return this.eventService.createEvent(data);
  }

  @Get()
  async getAllEvents(): Promise<Event[]> {
    return this.eventService.getAllEvents();
  }

  @Get(':id')
  async getEventById(@Param('id') id: string): Promise<Event> {
    return this.eventService.getEventById(id);
  }

  @Put(':id')
  async updateEvent(
    @Param('id') id: string,
    @Body() data: UpdateEventDto,
  ): Promise<Event> {
    return this.eventService.updateEvent(id, data);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteEvent(@Param('id') id: string): Promise<void> {
    await this.eventService.deleteEvent(id);
  }
}
