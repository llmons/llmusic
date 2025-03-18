import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NeteaseModule } from './netease/netease.module';
import { TencentModule } from './tencent/tencent.module';

@Module({
  imports: [NeteaseModule, TencentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
