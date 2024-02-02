import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateTenantDto } from './update-tenant.dto';
import { INVALID_EMAIL } from '../../utils/message.utils';

describe('UpdateTenantDto', () => {
  it('should transform and validate properties correctly', async () => {
    const data = {
      tenantAddress: '1 Dai Co Viet',
      website: 'https://soict.hust.edu.vn/',
      contactName: 'Duong',
      contactPhone: '+84123456789',
      contactEmail: 'dinhduong1704bg@gmail.com',
    };

    const dto = plainToClass(UpdateTenantDto, data);
    const validationErrors = await validate(dto);

    expect(dto.tenantAddress).toEqual(data.tenantAddress);
    expect(dto.website).toEqual(data.website);
    expect(dto.contactName).toEqual(data.contactName);
    expect(dto.contactPhone).toEqual(data.contactPhone);
    expect(dto.contactEmail).toEqual(data.contactEmail);
  });

  it('should not validate incorrect email format', async () => {
    const data = {
      contactEmail: 'dinhduong1704bg@gmail.com',
    };

    const dto = plainToClass(UpdateTenantDto, data);
    const validationErrors = await validate(dto);

    expect(validationErrors).toHaveLength(4);
  });
});
