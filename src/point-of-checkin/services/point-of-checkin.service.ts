import { Injectable } from '@nestjs/common';
import { PointOfCheckinRepository } from "../repository/point-of-checkin.repository";

@Injectable()
export class PointOfCheckinService {
  constructor(private readonly pointOfCheckinRepo: PointOfCheckinRepository) {}
}
