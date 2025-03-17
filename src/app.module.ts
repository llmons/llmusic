import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NeteaseModule } from './netease/netease.module';
import { TencentModule } from './tencent/tencent.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';

@Module({
  imports: [NeteaseModule, TencentModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
