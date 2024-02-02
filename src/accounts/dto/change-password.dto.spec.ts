import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import {ChangePasswordDto} from "./change-password.dto";

describe('ChangePasswordDto', () => {
    let app: TestingModule;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            providers: [],
        }).compile();
    });

    it('should be valid with correct data', async () => {
        const dto = plainToClass(ChangePasswordDto, {
            oldPassword: 'admin123',
            newPassword: 'admin@123',
        });

        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('should require oldPassword', async () => {
        const dto = plainToClass(ChangePasswordDto, {
            newPassword: 'admin@123',
        });

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
    });

    it('should require newPassword', async () => {
        const dto = plainToClass(ChangePasswordDto, {
            oldPassword: 'admin123',
        });

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail for newPassword with less than 8 characters', async () => {
        const dto = plainToClass(ChangePasswordDto, {
            oldPassword: 'admin@23',
            newPassword: 'admin@123',
        });
    });

});
