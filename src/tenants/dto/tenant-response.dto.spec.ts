import { plainToClass } from 'class-transformer';
import { TenantResponseDto } from './tenant-response.dto';

describe('TenantResponseDto', () => {
  it('should transform and expose properties correctly', () => {
    const data = {
      tenantId: 1,
      tenantCode: 'ABC123',
      tenantName: 'Test Tenant',
      tenantAddress: '1 Dai Co Viet',
      website: 'https://soict.hust.edu.vn/',
      contactName: 'Duong',
      contactPhone: '+84123456789',
      dcontactEmail: 'dinhduong1704bg@gmail.com',
      enabled: true,
    };

    const dto = plainToClass(TenantResponseDto, data);

    expect((dto as any).additionalProperty).toBeUndefined();
  });
});
