import { Test, TestingModule } from '@nestjs/testing';
import { validate } from 'class-validator';
import { UpdateEventDto } from './update-event.dto';

describe('UpdateEventDto', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [],
        }).compile();
    });

    it('should be defined', () => {
        const dto = new UpdateEventDto();
        expect(dto).toBeDefined();
    });
});
