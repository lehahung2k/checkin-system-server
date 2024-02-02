import { TransactionsDto } from './transactions.dto';
import { validate } from 'class-validator';

describe('TransactionsDto', () => {
    it('should pass validation when all properties are provided', async () => {
        const dto = new TransactionsDto();
        dto.pointCode = 'P001';
        dto.guestCode = 'G001';
        dto.note = 'Abc';
        dto.createdAt = new Date();
        dto.checkinImg1 = Buffer.from('MockImageData1');
        dto.checkinImg2 = Buffer.from('MockImageData2');

        const errors = await validate(dto);
        expect(dto.pointCode).toBeDefined();
        expect(dto.guestCode).toBeDefined();
        expect(dto.note).toBeDefined();
        expect(errors.length).toBe(0);
    });


});
