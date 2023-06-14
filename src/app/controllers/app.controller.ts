import { Controller, Get } from '@nestjs/common';
import { AppService } from '@/app/services/app.service';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
@ApiTags('Your API Tags')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @ApiOperation({ summary: 'Summary of your API operation' })
  @ApiResponse({ status: 200, description: 'Success message' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
