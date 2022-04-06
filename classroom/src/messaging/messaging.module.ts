import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CoursesService } from 'src/services/courses.service';
import { EnrollmentsService } from 'src/services/enrollments.service';
import { StudentsService } from 'src/services/students.service';
import { PurchaseController } from './controllers/purchase.controller';

@Module({
  imports: [DatabaseModule],
  providers: [StudentsService, EnrollmentsService, CoursesService],
  controllers: [PurchaseController],
})
export class MessagingModule {}
