import { Test, TestingModule } from '@nestjs/testing';
import { TenantsService } from './tenants.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TenantsRepository } from '../repository/tenants.repository';
import { AccountsRepository } from '../../accounts/repository/accounts.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { AddTenantDto } from '../dto/add-tenant.dto';
import { Tenants } from '../entities/tenants.entity';

const mockTenantData: Tenants = {
    tenantId: 1,
    tenantCode: 'T001',
    tenantName: 'Duong',
    tenantAddress: 'Ha Noi',
    website: 'http://localhost:2000/',
    contactName: 'DuongND',
    contactPhone: '0812345678',
    contactEmail: 'dinhduong1704bg@gmail.com',
    enabled: true,
    accounts: [],
    eventsManager: [],
};

const mockAccountsRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
};

const mockTenantsRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
};

describe('TenantsService', () => {
    let service: TenantsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TenantsService,
                {
                    provide: getRepositoryToken(TenantsRepository),
                    useValue: mockTenantsRepository,
                },
                {
                    provide: getRepositoryToken(AccountsRepository),
                    useValue: mockAccountsRepository,
                },
            ],
        }).compile();

        service = module.get<TenantsService>(TenantsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllTenants', () => {
        it('should return an array of tenants', async () => {
            mockTenantsRepository.find.mockResolvedValue([mockTenantData]);

            const result = await service.getAllTenants();

            expect(result).toEqual([mockTenantData]);
        });
    });

    describe('addTenant', () => {
        it('should add a new tenant and associate it with the user', async () => {
            const addTenantDto: AddTenantDto = {
                tenantCode: 'T001',
                tenantName: 'Duong',
                tenantAddress: 'Ha Noi',
                website: 'http://localhost:2000/',
                contactName: 'DuongND',
                contactPhone: '0812345678',
                contactEmail: 'dinhduong1704bg@gmail.com',
            };

            const userId = 1;

            mockAccountsRepository.findOne.mockResolvedValue({
                userId,
                companyName: 'TestCompany',
                tenants: [],
            });

            mockTenantsRepository.create.mockReturnValue(mockTenantData);

            await expect(service.addTenant(addTenantDto, userId)).resolves.toEqual(
                mockTenantData,
            );

            expect(mockTenantsRepository.save).toHaveBeenCalledWith(mockTenantData);
            expect(mockAccountsRepository.save).toHaveBeenCalledWith({
                userId,
                companyName: 'TestCompany',
                tenants: [mockTenantData],
            });
        });

        it('should throw BadRequestException when saving fails', async () => {
            const addTenantDto: AddTenantDto = {
                tenantCode: 'T001',
                tenantName: 'Duong',
                tenantAddress: 'Ha Noi',
                website: 'http://localhost:2000/',
                contactName: 'DuongND',
                contactPhone: '0812345678',
                contactEmail: 'dinhduong1704bg@gmail.com',
            };

            const userId = 1;

            mockAccountsRepository.findOne.mockResolvedValue({
                userId,
                companyName: 'TestCompany',
                tenants: [],
            });

            mockTenantsRepository.create.mockReturnValue(mockTenantData);
            mockTenantsRepository.save.mockRejectedValue(new Error('DB Error'));

            await expect(service.addTenant(addTenantDto, userId)).rejects.toThrow(
                BadRequestException,
            );
        });

        it('should throw NotFoundException when user is not found', async () => {
            const addTenantDto: AddTenantDto = {
                tenantCode: 'T001',
                tenantName: 'Duong',
                tenantAddress: 'Ha Noi',
                website: 'http://localhost:2000/',
                contactName: 'DuongND',
                contactPhone: '0812345678',
                contactEmail: 'dinhduong1704bg@gmail.com',
            };

            const userId = 1;

            mockAccountsRepository.findOne.mockResolvedValue(undefined);

        });
    });

});
