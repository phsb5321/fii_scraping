import { B3Service } from '@/modules/b3/services/b3.service';
import { Controller, Inject, Get } from '@nestjs/common';

@Controller('b3-controller')
export class B3ControllerController {
  constructor(
    @Inject(B3Service)
    private b3Service: B3Service,
  ) { }

  @Get()
  async generate_stock_queue() {
    return this.b3Service.scrape_all_stocks();
  }
}
