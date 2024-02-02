import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from "../../../src/accounts/services/accounts.service";

class AccountsServiceMock {
    getAll() {
        return [
            {
                userId: 1,
                username: 'admin',
            }
        ];
    }

    getAccountById(id: number) {
        return {
            userId: id,
            username: 'admin'
        };
    }

    getAllPoc(id: number) {
        return [
            {
                userId: 2,
                username: "duong"
            }
        ];
    }
}

describe("AccountsService", () => {
    let accountsService: AccountsService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: AccountsService,
                    useClass: AccountsServiceMock,
                },
            ],
        }).compile();
        accountsService = module.get<AccountsService>(AccountsService);
    });

    it('should be defined', () => {
        expect(accountsService).toBeDefined();
    });

    it('getAll should return an array', () => {
        const result = accountsService.getAll();
        expect(result).toEqual([
            {
                userId: 1,
                username: 'admin',
            }
        ]);
    });

    it('getAccountById should return an object', () => {
        const result = accountsService.getAccountById(1);
        expect(result).toEqual({
            userId: 1,
            username: 'admin',
        });
    });

    it('getAllPoc should return an array', () => {
        const result = accountsService.getAllPoc(2);
        expect(result).toEqual([
            {
                userId: 2,
                username: "duong"
            }
        ]);
    });
});
