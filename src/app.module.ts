import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsModule } from './tenants/tenants.module';
import { AccountsModule } from './accounts/accounts.module';
import { EventsManagerModule } from './events-manager/events-manager.module';
import { PointsOfCheckinModule } from './points-of-checkin/point-of-checkin.module';
import { GuestsModule } from './guests/guests.module';
import { AuthModule } from './auth/auth.module';
import { databaseConfig } from './config/database.config';
import { TransactionsModule } from './transactions/transactions.module';
import { DevicesModule } from './devices/devices.module';
import { MailerModule} from "@nestjs-modules/mailer";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

@Module({

  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService)=> ({
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          }
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`
        },
      }),
      inject: [ConfigService],
    }),
    TenantsModule,
    AccountsModule,
    EventsManagerModule,
    PointsOfCheckinModule,
    GuestsModule,
    AuthModule,
    TransactionsModule,
    DevicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
