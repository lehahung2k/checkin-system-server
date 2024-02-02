import { PointsOfCheckinDto } from './points-of-checkin.dto';
import { validate } from 'class-validator';

describe('PointsOfCheckinDto', () => {
    it('should pass validation when all properties are provided', async () => {
        const dto = new PointsOfCheckinDto();
        dto.pointCode = 'P001';
        dto.pointName = 'Name';
        dto.pointNote = 'Abc test';
        dto.eventCode = 'Evt001';
        dto.username = 'DuongND';

        const errors = await validate(dto);
        expect(dto.pointCode).toBeDefined();
        expect(dto.pointName).toBeDefined();
        expect(dto.pointNote).toBeDefined();
        expect(dto.eventCode).toBeDefined();
        expect(dto.username).toBeDefined();
        expect(errors.length).toBe(0);
    });

});
