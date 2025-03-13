import { Module } from '@nestjs/common';
import { TencentController } from './tencent.controller';
import { TencentService } from './tencent.service';

@Module({
  controllers: [TencentController],
  providers: [TencentService]
})
export class TencentModule {}
