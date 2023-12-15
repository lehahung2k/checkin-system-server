import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {AccountsDto} from "./accounts.dto";

describe('AccountsDto', () => {
    it('should have properties decorated with ApiPropertyOptional', () => {
        const apiPropertyOptionalDecorator = ApiPropertyOptional();
        const exposeDecorator = Expose();

        expect(apiPropertyOptionalDecorator(AccountsDto.prototype, 'userId')).toBeUndefined();
        expect(exposeDecorator(AccountsDto.prototype, 'userId')).toBeUndefined();

        expect(apiPropertyOptionalDecorator(AccountsDto.prototype, 'username')).toBeUndefined();
        expect(exposeDecorator(AccountsDto.prototype, 'username')).toBeUndefined();

        expect(apiPropertyOptionalDecorator(AccountsDto.prototype, 'password')).toBeUndefined();
        expect(exposeDecorator(AccountsDto.prototype, 'password')).toBeUndefined();

        expect(apiPropertyOptionalDecorator(AccountsDto.prototype, 'fullName')).toBeUndefined();
        expect(exposeDecorator(AccountsDto.prototype, 'fullName')).toBeUndefined();

        expect(apiPropertyOptionalDecorator(AccountsDto.prototype, 'phoneNumber')).toBeUndefined();
        expect(exposeDecorator(AccountsDto.prototype, 'phoneNumber')).toBeUndefined();

        expect(apiPropertyOptionalDecorator(AccountsDto.prototype, 'email')).toBeUndefined();
        expect(exposeDecorator(AccountsDto.prototype, 'email')).toBeUndefined();

        expect(apiPropertyOptionalDecorator(AccountsDto.prototype, 'active')).toBeUndefined();
        expect(exposeDecorator(AccountsDto.prototype, 'active')).toBeUndefined();

        expect(apiPropertyOptionalDecorator(AccountsDto.prototype, 'role')).toBeUndefined();
        expect(exposeDecorator(AccountsDto.prototype, 'role')).toBeUndefined();

        expect(apiPropertyOptionalDecorator(AccountsDto.prototype, 'tenantCode')).toBeUndefined();
        expect(exposeDecorator(AccountsDto.prototype, 'tenantCode')).toBeUndefined();

        expect(apiPropertyOptionalDecorator(AccountsDto.prototype, 'companyName')).toBeUndefined();
        expect(exposeDecorator(AccountsDto.prototype, 'companyName')).toBeUndefined();

        expect(apiPropertyOptionalDecorator(AccountsDto.prototype, 'enabled')).toBeUndefined();
        expect(exposeDecorator(AccountsDto.prototype, 'enabled')).toBeUndefined();
    });
});
