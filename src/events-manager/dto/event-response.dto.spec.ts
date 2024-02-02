// event-response.dto.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { EventResponseDto } from './event-response.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { plainToClass } from 'class-transformer';

class EventResponseDtoMock extends EventResponseDto {
    @ApiPropertyOptional()
    @Expose()
    eventId: number;

    @ApiPropertyOptional()
    @Expose()
    eventCode: string;

    @ApiPropertyOptional()
    @Expose()
    eventName: string;

    @ApiPropertyOptional()
    @Expose()
    tenantCode: string;

    @ApiPropertyOptional()
    @Expose()
    eventDescription: string;

    @ApiPropertyOptional()
    @Expose()
    startTime: Date;

    @ApiPropertyOptional()
    @Expose()
    endTime: Date;

    @ApiPropertyOptional()
    @Expose()
    eventImg: string;

    @ApiPropertyOptional()
    @Expose()
    enabled: boolean;
}

describe('EventResponseDto', () => {
    let eventResponseDto: EventResponseDtoMock;

    beforeEach(() => {
        eventResponseDto = new EventResponseDtoMock();
    });

    it('should be defined', () => {
        expect(eventResponseDto).toBeDefined();
    });

    it('should have valid properties after instantiation', () => {
        expect(eventResponseDto.eventId).toBeUndefined();
        expect(eventResponseDto.eventCode).toBeUndefined();
    });

    it('should expose properties correctly using @Expose()', () => {
        const plainObject = plainToClass(EventResponseDtoMock, {
            eventId: 1,
            eventCode: 'EvtCode',
            eventName: 'EventName',
        });
        expect(plainObject.eventId).toEqual(1);
        expect(plainObject.eventCode).toEqual('EvtCode');
        expect(plainObject.eventName).toEqual('EventName');
    });
});
