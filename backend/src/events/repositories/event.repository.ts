import { Injectable } from '@nestjs/common';
import { Event } from '../entities/event.entity';
import { CreateEventDto, UpdateEventDto } from '../dto/event.dto';
import { v4 as uuidv4 } from 'uuid';

export interface IEventRepository {
  create(data: CreateEventDto): Promise<Event>;
  findAll(): Promise<Event[]>;
  findById(id: string): Promise<Event>;
  update(id: string, data: UpdateEventDto): Promise<Event>;
  delete(id: string): Promise<void>;
}

@Injectable()
export class InMemoryEventRepository implements IEventRepository {
  private events: Event[] = [];

  async create(data: CreateEventDto): Promise<Event> {
    const event: Event = {
      id: uuidv4(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.events.push(event);
    return event;
  }

  async findAll(): Promise<Event[]> {
    return this.events;
  }

  async findById(id: string): Promise<Event> {
    return this.events.find(event => event.id === id);
  }

  async update(id: string, data: UpdateEventDto): Promise<Event> {
    const index = this.events.findIndex(event => event.id === id);
    if (index === -1) return null;

    this.events[index] = {
      ...this.events[index],
      ...data,
      updatedAt: new Date(),
    };
    return this.events[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.events.findIndex(event => event.id === id);
    if (index !== -1) {
      this.events.splice(index, 1);
    }
  }
}
