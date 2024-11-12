import { Module } from '@nestjs/common';
import { EventController } from './controllers/event.controller';
import { EventService } from './services/event.service';
import { InMemoryEventRepository } from './repositories/event.repository';
import { EVENT_REPOSITORY } from './constants/constants';

@Module({
  controllers: [EventController],
  providers: [
    EventService,
    {
      provide: EVENT_REPOSITORY,
      useClass: InMemoryEventRepository,
    }
  ],
  exports: [EventService]
})
export class EventModule {}
