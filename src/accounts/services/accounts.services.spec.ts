import { Test, TestingModule } from '@nestjs/testing';
import {AccountsService} from "./accounts.service";

class AccountsServiceMock {
    getAll (){
        return {
            userId: 1,
            username: 'admin',
        }
    }
    getAccountById (id: Number) {
        return {
            username: 'admin'
        }
    }
    getAllPoc (id: Number) {
        return {
            userId: 2,
            username: "duong"
        }
    }
}

describe.only("AccountsService", () => {

    let accountsService: AccountsService;

    beforeAll(async () => {
        const ApiServiceProvider = {
            provide: AccountsService,
            useClass: AccountsServiceMock,
        }
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AccountsService, ApiServiceProvider,
            ],
        }).compile();
        accountsService = module.get<AccountsService>(AccountsService);
    });


    it('ApiService - should be defined', () => {
        expect(accountsService).toBeDefined();
    });

    it('should call getAll method with expected params', async () => {
        const accounts = await accountsService.getAll();
        expect(accounts).toEqual({"userId": 1, "username": "admin"});
    });

    it('should call getAccountById method with expected params', async () => {
        const accounts = await accountsService.getAccountById(1);
        expect(accounts.username).toEqual("admin");
    });

    it('should call getAllPoc method with expected params', async () => {
        const accounts = await accountsService.getAllPoc(2);
        console.log("Resulut: " + accounts);
        expect(accounts).toEqual({"userId": 2, "username": "duong"});
    });
})