import { TransResponseDto } from './trans-response.dto';
import { classToPlain, plainToClass } from 'class-transformer';

describe('TransResponseDto', () => {
    it('should correctly transform plain object to class instance', () => {
        const plainObject = {
            tranId: 1,
            pointCode: 'Point001',
            guestCode: 'Guest001',
            note: 'Test',
            createdAt: new Date(),
            checkinImg1: 'MockImageData1',
            checkinImg2: 'MockImageData2',
        };

        const dto = plainToClass(TransResponseDto, plainObject);

        expect(dto).toBeInstanceOf(TransResponseDto);
        expect(dto.tranId).toEqual(1);
        expect(dto.pointCode).toEqual('Point001');
        expect(dto.guestCode).toEqual('Guest001');
        expect(dto.note).toEqual('Test');
        expect(dto.createdAt).toBeInstanceOf(Date);
        expect(dto.checkinImg1).toEqual('MockImageData1');
        expect(dto.checkinImg2).toEqual('MockImageData2');
    });
});
