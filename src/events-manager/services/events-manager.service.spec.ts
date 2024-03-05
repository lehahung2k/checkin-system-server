import { Test, TestingModule } from '@nestjs/testing';
import { EventsManagerService } from './events-manager.service';
import { EventsManagerRepository } from '../repository/events-manager.repository';
import { PointsOfCheckinService } from '../../points-of-checkin/services/point-of-checkin.service';
import { AccountsRepository } from "../../accounts/repository/accounts.repository";
import { NotFoundException } from '@nestjs/common';
import { EventResponseDto } from '../dto/event-response.dto';
import { Tenants } from "../../tenants/entities/tenants.entity";

// Import constants and mock data here

const mockUserId = 1;
const mockEventId = 1;
const mockEventDetails = {
    eventId: mockEventId,
    eventCode: 'E001',
    eventName: 'Sample Event',
    tenantCode: 'T001',
    eventDescription: 'This is a sample event description.',
    startTime: new Date('2024-01-01T10:00:00Z'),
    endTime: new Date('2024-01-01T15:00:00Z'),
    eventImg: Buffer.from('MockImageData'),
};

const mockTenant: Tenants = {
    tenantId: 1,
    tenantCode: 'T001',
    tenantName: 'Sample Tenant',
    tenantAddress: '123 Main Street',
    website: 'http://sample-website.com',
    contactName: 'John Doe',
    contactPhone: '1234567890',
    contactEmail: 'john.doe@example.com',
    enabled: true,
    accounts: [], // Add relevant mock data for accounts
    eventsManager: [], // Add relevant mock data for eventsManager
};

const mockEventsManagerRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    queryBuilder: jest.fn(),
};

const mockAccountsRepository = {
    findOne: jest.fn(),
};

const mockPointsOfCheckinService = {
    getPocDetails: jest.fn(),
    getPocListByEventCode: jest.fn(),
};

describe('EventsManagerService', () => {
    let service: EventsManagerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventsManagerService,
                {
                    provide: EventsManagerRepository,
                    useValue: mockEventsManagerRepository,
                },
                {
                    provide: AccountsRepository,
                    useValue: mockAccountsRepository,
                },
                {
                    provide: PointsOfCheckinService,
                    useValue: mockPointsOfCheckinService,
                },
            ],
        }).compile();

        service = module.get<EventsManagerService>(EventsManagerService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getEventDetails', () => {

        it('should throw NotFoundException if the tenant is not recognized', async () => {
            // Mock the findTenantByUserId method
            jest.spyOn(service, 'findTenantByUserId').mockResolvedValueOnce(null);

            await expect(service.getEventDetails(mockUserId, mockEventId)).rejects.toThrowError(
                NotFoundException,
            );

            expect(service.findTenantByUserId).toHaveBeenCalledWith(mockUserId);
            expect(mockEventsManagerRepository.queryBuilder).not.toHaveBeenCalled();
        });

        it('should throw NotFoundException if the event is not found', async () => {
            // Mock the findTenantByUserId method
            jest.spyOn(service, 'findTenantByUserId').mockResolvedValueOnce(mockTenant);

            // Mock the eventsMngRepo queryBuilder method
            mockEventsManagerRepository.queryBuilder.mockReturnValueOnce({
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValueOnce(null),
            });

            await expect(service.getEventDetails(mockUserId, mockEventId)).rejects.toThrowError(
                NotFoundException,
            );

            expect(service.findTenantByUserId).toHaveBeenCalledWith(mockUserId);
        });
    });
});
