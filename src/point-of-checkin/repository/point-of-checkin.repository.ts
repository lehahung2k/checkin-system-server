import { DataSource, Repository } from 'typeorm';
import { PointsOfCheckin } from '../entities/point-of-checkin.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PointOfCheckinRepository extends Repository<PointsOfCheckin> {
  constructor(private readonly dataSource: DataSource) {
    super(PointsOfCheckin, dataSource.createEntityManager());
  }
}
