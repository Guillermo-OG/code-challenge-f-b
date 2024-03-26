import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetricsService } from './metrics/metrics.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriberSchema } from './subscribers/schemas/subscriber.schema';
import { MetricsSchema } from './metrics/schemas/metrics.schema';
import { FileUploadModule } from './file-upload/file-upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_DB_URL'),
        user: configService.get('MONGO_INITDB_ROOT_USERNAME'),
        pass: configService.get('MONGO_INITDB_ROOT_PASSWORD'),
      }),
      inject: [ConfigService],
    }),
    FileUploadModule,
  ],
  controllers: [AppController],
  providers: [AppService, MetricsService],
})
export class AppModule {}
