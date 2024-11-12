import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IEventRepository } from '../repositories/event.repository';
import { CreateEventDto, UpdateEventDto } from '../dto/event.dto';
import { Event } from '../entities/event.entity';
import { EVENT_REPOSITORY } from '../constants/constants';

@Injectable()
export class EventService {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: IEventRepository,
  ) {}

  async createEvent(data: CreateEventDto): Promise<Event> {
    return this.eventRepository.create(data);
  }

  async getAllEvents(): Promise<Event[]> {
    return this.eventRepository.findAll();
  }

  async getEventById(id: string): Promise<Event> {
    const event = await this.eventRepository.findById(id);
    console.log(event);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async updateEvent(id: string, data: UpdateEventDto): Promise<Event> {
    const event = await this.eventRepository.update(id, data);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async deleteEvent(id: string): Promise<void> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    await this.eventRepository.delete(id);
  }
}
