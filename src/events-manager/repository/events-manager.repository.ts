import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EventsManager } from '../entities/events-manager.entity';

@Injectable()
export class EventsManagerRepository extends Repository<EventsManager> {
  constructor(private readonly dataSource: DataSource) {
    super(EventsManager, dataSource.createEntityManager());
  }
}
