import { Injectable } from '@nestjs/common';
import { PointOfCheckinRepository } from '../repository/point-of-checkin.repository';
import { PointsOfCheckin } from '../entities/point-of-checkin.entity';

@Injectable()
export class PointOfCheckinService {
  constructor(private readonly pointOfCheckinRepo: PointOfCheckinRepository) {}

  async getAllPointsOfCheckin(): Promise<PointsOfCheckin[]> {
    return await this.pointOfCheckinRepo.find();
  }

  async getPointOfCheckinById(pointId: number): Promise<PointsOfCheckin> {
    return await this.pointOfCheckinRepo.findOne({
      where: { pointId: pointId },
    });
  }
}
