import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dtos/create-tour.dto';
import { UpdateToursDto } from './dtos/update-tour.dto';
import { AuthGuard } from '../users/auth/guards/auth.guard';
import { Roles } from 'src/users/auth/decorators/roles.decorator';
import { RoleGuards } from 'src/users/auth/guards/roles.guard';

@Controller('api/v1/tours')
export class ToursController {
  constructor(private toursService: ToursService) {}
  @Get()
  async getAllTours(@Query() query: any) {
    const tours = await this.toursService.getAllTours(query);
    return {
      status: 'success',
      results: tours.length,
      data: { tours },
    };
  }

  @Post()
  async createTour(@Body() body: CreateTourDto) {
    const newTour = await this.toursService.createTour(body);
    return {
      status: 'success',
      data: { newTour },
    };
  }

  @Get('/tour-stats')
  @Roles('admin', 'user')
  @UseGuards(AuthGuard, RoleGuards)
  async getTourStats() {
    const stats = await this.toursService.getTourStats();

    return {
      status: 'success',
      data: {
        stats,
      },
    };
  }

  @UseGuards(AuthGuard)
  @Get('/monthly-plan/:year')
  async getMonthlyPlan(@Param('year') year: string) {
    const plan = await this.toursService.getMonthlyPlan(year);
    return {
      status: 'success',
      data: {
        plan,
      },
    };
  }

  @Get('/:id')
  async getTour(@Param('id') id: string) {
    const tour = await this.toursService.getTour(id);
    return {
      status: 'success',
      data: { tour },
    };
  }

  @Patch('/:id')
  async updateTour(@Param('id') id: string, @Body() body: UpdateToursDto) {
    const tour = await this.toursService.updateTour(id, body);
    return {
      status: 'success',
      data: { tour },
    };
  }

  @Delete('/:id')
  async deleteTour(@Param('id') id: string) {
    await this.toursService.deleteTour(id);
    return {
      status: 'success',
      data: null,
    };
  }
}
