import { validate } from 'class-validator';
import { AddTenantDto } from './add-tenant.dto';

describe('AddTenantDto', () => {
    it('should pass validation with valid input', async () => {
        const dto = new AddTenantDto();
        dto.tenantCode = 'Code 123';
        dto.tenantName = 'Test Tenant';
        dto.tenantAddress = '1 Dai Co Viet';
        dto.website = 'https://soict.hust.edu.vn/';
        dto.contactName = 'Duong';
        dto.contactPhone = '+84123456789';
        dto.contactEmail = 'dinhduong1704bg@gmail.com';

        const errors = await validate(dto);

        expect(errors.length).toBe(0);
    });

    it('should fail validation when tenantCode is not provided', async () => {
        const dto = new AddTenantDto();
        dto.tenantName = 'Test Tenant';
        dto.tenantAddress = '1 Dai Co Viet';
        dto.website = 'https://soict.hust.edu.vn/';
        dto.contactName = 'Duong';
        dto.contactPhone = '+84123456789';
        dto.contactEmail = 'dinhduong1704bg@gmail.com';

        const errors = await validate(dto);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('tenantCode');
    });

});
