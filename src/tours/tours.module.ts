import { Module } from '@nestjs/common';
import { ToursController } from './tours.controller';
import { ToursService } from './tours.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tour, TourSchema } from './schemas/tour.schema';
import { UsersModule } from 'src/users/users.module';
@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }]),
  ],
  controllers: [ToursController],
  providers: [ToursService],
})
export class ToursModule {}
