import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Tenants } from './tenants.entity';

/**
 * TenantsRepository class for tenant repository
 */
@Injectable()
export class TenantsRepository extends Repository<Tenants> {
  constructor(private readonly dataSource: DataSource) {
    super(Tenants, dataSource.createEntityManager());
  }
}
