import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {AccountResDto} from "./account-res.dto";

describe('AccountResDto', () => {
    it('should have properties decorated with ApiPropertyOptional', () => {
        const apiPropertyOptionalDecorator = ApiPropertyOptional();
        const exposeDecorator = Expose();

        expect(apiPropertyOptionalDecorator(AccountResDto.prototype, 'userId')).toBeUndefined();
        expect(exposeDecorator(AccountResDto.prototype, 'userId')).toBeUndefined();

        expect(apiPropertyOptionalDecorator(AccountResDto.prototype, 'username')).toBeUndefined();
        expect(exposeDecorator(AccountResDto.prototype, 'username')).toBeUndefined();

        expect(apiPropertyOptionalDecorator(AccountResDto.prototype, 'fullName')).toBeUndefined();
        expect(exposeDecorator(AccountResDto.prototype, 'fullName')).toBeUndefined();

        expect(apiPropertyOptionalDecorator(AccountResDto.prototype, 'phoneNumber')).toBeUndefined();
        expect(exposeDecorator(AccountResDto.prototype, 'phoneNumber')).toBeUndefined();

        expect(apiPropertyOptionalDecorator(AccountResDto.prototype, 'email')).toBeUndefined();
        expect(exposeDecorator(AccountResDto.prototype, 'email')).toBeUndefined();

        expect(apiPropertyOptionalDecorator(AccountResDto.prototype, 'active')).toBeUndefined();
        expect(exposeDecorator(AccountResDto.prototype, 'active')).toBeUndefined();

        expect(apiPropertyOptionalDecorator(AccountResDto.prototype, 'role')).toBeUndefined();
        expect(exposeDecorator(AccountResDto.prototype, 'role')).toBeUndefined();

        expect(apiPropertyOptionalDecorator(AccountResDto.prototype, 'tenantCode')).toBeUndefined();
        expect(exposeDecorator(AccountResDto.prototype, 'tenantCode')).toBeUndefined();

        expect(apiPropertyOptionalDecorator(AccountResDto.prototype, 'companyName')).toBeUndefined();
        expect(exposeDecorator(AccountResDto.prototype, 'companyName')).toBeUndefined();

        expect(apiPropertyOptionalDecorator(AccountResDto.prototype, 'enabled')).toBeUndefined();
        expect(exposeDecorator(AccountResDto.prototype, 'enabled')).toBeUndefined();
    });
});
