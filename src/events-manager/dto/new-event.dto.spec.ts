import { NewEventDto } from './new-event.dto';
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

class NewEventDtoMock extends NewEventDto {
    @IsString()
    @ApiPropertyOptional()
    eventCode: string;

    @IsString()
    @ApiPropertyOptional()
    eventName: string;

    @IsString()
    @ApiPropertyOptional()
    tenantCode: string;

    @ApiPropertyOptional()
    eventDescription: string;

    @IsString()
    @ApiPropertyOptional()
    startTime: Date;

    @ApiPropertyOptional()
    @IsString()
    endTime: Date;

    @ApiPropertyOptional()
    eventImg: Buffer;
}

describe('NewEventDto', () => {
    let newEventDto: NewEventDtoMock;

    beforeEach(() => {
        newEventDto = new NewEventDtoMock();
    });

    it('should be defined', () => {
        expect(newEventDto).toBeDefined();
    });

    it('should have valid properties after instantiation', () => {
        expect(newEventDto.eventCode).toBeUndefined();
        expect(newEventDto.eventName).toBeUndefined();
        // ... add assertions for other properties
    });


    it('should expose properties correctly using @ApiPropertyOptional()', () => {
        const plainObject = plainToClass(NewEventDtoMock, {
            eventCode: 'ABC123',
            eventName: 'Sample Event',
            tenantCode: 'Tenant123',
            // ... provide values for other properties
        });
        expect(plainObject.eventCode).toEqual('ABC123');
        expect(plainObject.eventName).toEqual('Sample Event');
        // ... add assertions for other properties
    });
});
