import { Test, TestingModule } from '@nestjs/testing';
import { PointsOfCheckinRepository } from '../repository/point-of-checkin.repository';
import { EventsManagerRepository } from '../../events-manager/repository/events-manager.repository';
import { AccountsRepository } from '../../accounts/repository/accounts.repository';
import { AccountsService } from '../../accounts/services/accounts.service';
import { GuestsService } from '../../guests/services/guests.service';
import { PointsOfCheckinService } from './point-of-checkin.service';

// Mock your dependencies
jest.mock('../repository/point-of-checkin.repository');
jest.mock('../../events-manager/repository/events-manager.repository');
jest.mock('../../accounts/repository/accounts.repository');
jest.mock('../../accounts/services/accounts.service');
jest.mock('../../guests/services/guests.service');

describe('PointsOfCheckinService', () => {
  let service: PointsOfCheckinService;
  let pointsOfCheckinRepo: PointsOfCheckinRepository;
  let eventsManagerRepo: EventsManagerRepository;
  let accountsRepo: AccountsRepository;
  let accountsService: AccountsService;
  let guestsService: GuestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PointsOfCheckinService,
        PointsOfCheckinRepository,
        EventsManagerRepository,
        AccountsRepository,
        AccountsService,
        GuestsService,
      ],
    }).compile();

    service = module.get<PointsOfCheckinService>(PointsOfCheckinService);
    pointsOfCheckinRepo = module.get<PointsOfCheckinRepository>(
      PointsOfCheckinRepository,
    );
    eventsManagerRepo = module.get<EventsManagerRepository>(
      EventsManagerRepository,
    );
    accountsRepo = module.get<AccountsRepository>(AccountsRepository);
    accountsService = module.get<AccountsService>(AccountsService);
    guestsService = module.get<GuestsService>(GuestsService);
  });

  describe('getAllPointsOfCheckin', () => {
    it('should return an array of PointsOfCheckin', async () => {
      const expectedPointsOfCheckin = [];
      jest
        .spyOn(pointsOfCheckinRepo, 'find')
        .mockResolvedValue(expectedPointsOfCheckin);
      const result = await service.getAllPointsOfCheckin();
      expect(result).toEqual(expectedPointsOfCheckin);
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
