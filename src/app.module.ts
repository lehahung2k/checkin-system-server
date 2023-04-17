import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsModule } from './tenants/tenants.module';
import { AccountsModule } from './accounts/accounts.module';
import { EventsManagerModule } from './events-manager/events-manager.module';
import { PointOfCheckinModule } from './point-of-checkin/point-of-checkin.module';
import { GuestsModule } from './guests/guests.module';
import { AuthModule } from './auth/auth.module';
import { databaseConfig } from './config/database.config';
import { TransactionsModule } from './transactions/transactions.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TenantsModule,
    AccountsModule,
    EventsManagerModule,
    PointOfCheckinModule,
    GuestsModule,
    AuthModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
