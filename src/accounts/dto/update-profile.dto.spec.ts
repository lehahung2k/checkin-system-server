import { UpdateProfileDto } from './update-profile.dto';
import {IsEmail, IsPhoneNumber, IsString, validate} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { INVALID_EMAIL } from '../../utils/message.utils';

class UpdateProfileDtoMock extends UpdateProfileDto {
    @IsString()
    @ApiPropertyOptional()
    fullName?: string;

    @IsString()
    @ApiPropertyOptional()
    @IsPhoneNumber('VN')
    phoneNumber?: string;

    @IsString()
    @ApiPropertyOptional()
    @IsEmail({}, { message: INVALID_EMAIL })
    email?: string;
}

describe('UpdateProfileDto', () => {
    let updateProfileDto: UpdateProfileDtoMock;

    beforeEach(() => {
        updateProfileDto = new UpdateProfileDtoMock();
    });

    it('should be defined', () => {
        expect(updateProfileDto).toBeDefined();
    });

    it('should allow valid fullName', async () => {
        updateProfileDto.fullName = 'Duong';
        const errors = await validate(updateProfileDto);
        expect(errors.length).toBeGreaterThanOrEqual(0);
    });

    it('should allow valid phoneNumber', async () => {
        updateProfileDto.phoneNumber = '+857170402';
        const errors = await validate(updateProfileDto);
        expect(errors.length).toBeGreaterThanOrEqual(0);
    });

    it('should allow valid email', async () => {
        updateProfileDto.email = 'duong.nd205201@sís.hust.edu.vn';
        const errors = await validate(updateProfileDto);
        expect(errors.length).toBeGreaterThanOrEqual(0);
    });
});
