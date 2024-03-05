import { Test, TestingModule } from '@nestjs/testing';
import { GuestsService } from './guests.service';
import { GuestsRepository } from '../repository/guests.repository';
import { TransactionsRepository } from '../../transactions/repository/transactions.repsitory';
import { TransactionsService } from '../../transactions/services/transactions.service';
import { plainToClass } from 'class-transformer';
import {GuestResponseDto} from "../dto/guest-response.dto";

// Mock your dependencies
jest.mock('../repository/guests.repository');
jest.mock('../../transactions/repository/transactions.repsitory');
jest.mock('../../transactions/services/transactions.service');

describe('GuestsService', () => {
    let service: GuestsService;
    let guestsRepo: GuestsRepository;
    let transRepo: TransactionsRepository;
    let transService: TransactionsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GuestsService, GuestsRepository, TransactionsRepository, TransactionsService],
        }).compile();

        service = module.get<GuestsService>(GuestsService);
        guestsRepo = module.get<GuestsRepository>(GuestsRepository);
        transRepo = module.get<TransactionsRepository>(TransactionsRepository);
        transService = module.get<TransactionsService>(TransactionsService);
    });

    describe('getAllGuests', () => {
        it('should return an array of GuestResponseDto', async () => {
            // Mock the behavior of the repository
            const guests = [];
            jest.spyOn(guestsRepo, 'find').mockResolvedValue(guests);

            const result = await service.getAllGuests();

            const expectedResults = guests.map((guest) => plainToClass(GuestResponseDto, {
                ...guest,
                frontImg: guest.frontImg.toString('utf8'),
                backImg: guest.backImg.toString('utf8'),
            }));

            expect(result).toEqual(expectedResults);
        });
    });


    afterEach(() => {
        jest.clearAllMocks();
    });
});
