import { GuestsDto } from './guests.dto';
import { validate } from 'class-validator';
import { classToPlain, plainToClass } from 'class-transformer';

describe('GuestsDto', () => {
  it('should be valid with all properties', async () => {
    const dto = new GuestsDto();
    dto.guestCode = 'Guest001';
    dto.guestDescription = 'Abc 123';
    dto.frontImg = Buffer.from('MockFrontImage');
    dto.backImg = Buffer.from('MockBackImage');
    dto.identityType = 'Passport';
    dto.pointCode = 'Point001';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should transform plain object to class instance and vice versa', () => {
    const plainObject = {
      guestCode: 'Guest001',
      guestDescription: 'Abc 123',
      frontImg: Buffer.from('MockFrontImage'),
      backImg: Buffer.from('MockBackImage'),
      identityType: 'Passport',
      pointCode: 'Point001',
    };

    const dto = plainToClass(GuestsDto, plainObject);
    expect(dto).toBeInstanceOf(GuestsDto);
    expect(dto.guestCode).toEqual('Guest001');
    expect(dto.guestDescription).toEqual('Abc 123');
    expect(dto.frontImg).toEqual(Buffer.from('MockFrontImage'));
    expect(dto.backImg).toEqual(Buffer.from('MockBackImage'));
    expect(dto.identityType).toEqual('Passport');
    expect(dto.pointCode).toEqual('Point001');
  });
});
