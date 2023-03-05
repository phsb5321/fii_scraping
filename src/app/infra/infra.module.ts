import { Module } from '@nestjs/common';
import { CheerioProvider } from './cheerio-provider/cheerio-provider';

@Module({
  providers: [CheerioProvider],
})
export class InfraModule {}
