import { UpdatePocDto } from './update-poc.dto';
import { validate } from 'class-validator';

describe('UpdatePocDto', () => {
  it('should pass validation when all properties are provided', async () => {
    const dto = new UpdatePocDto();
    dto.pointName = 'Name';
    dto.pointNote = 'Abc test';

    const errors = await validate(dto);
    expect(dto.pointName).toBeDefined();
    expect(dto.pointNote).toBeDefined();
    expect(errors.length).toBe(0);
  });
});
