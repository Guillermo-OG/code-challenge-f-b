import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileUploadController } from './file-upload/file-upload.controller';
import { MetricsService } from './metrics/metrics.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, FileUploadController],
  providers: [AppService, MetricsService],
})
export class AppModule {}
