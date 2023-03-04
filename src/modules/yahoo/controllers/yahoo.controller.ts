import { Controller } from '@nestjs/common';
import { YahooService } from '@/modules/yahoo/services/yahoo.service';

@Controller()
export class YahooController {
  constructor(private readonly yahooService: YahooService) { }
}
