import { DataSource, Repository } from 'typeorm';
import { PointsOfCheckin } from '../entities/points-of-checkin.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PointsOfCheckinRepository extends Repository<PointsOfCheckin> {
  constructor(private readonly dataSource: DataSource) {
    super(PointsOfCheckin, dataSource.createEntityManager());
  }
}
