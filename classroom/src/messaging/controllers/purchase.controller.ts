import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CoursesService } from 'src/services/courses.service';
import { EnrollmentsService } from 'src/services/enrollments.service';
import { StudentsService } from 'src/services/students.service';

interface Customer {
  authUserId: string;
}

interface Product {
  id: string;
  title: string;
  slug: string;
}

export interface IPurchaseCreatedPayload {
  customer: Customer;
  product: Product;
}

@Controller('purchase')
export class PurchaseController {
  constructor(
    private enrollmentsService: EnrollmentsService,
    private coursesService: CoursesService,
    private studentsService: StudentsService,
  ) {}

  @EventPattern('purchase.new-purchase')
  async purchaseCreated(@Payload('value') payload: IPurchaseCreatedPayload) {
    let student = await this.studentsService.findStudentByAuthUserId(
      payload.customer.authUserId,
    );

    if (!student) {
      student = await this.studentsService.createStudent({
        authUserId: payload.customer.authUserId,
      });
    }

    let course = await this.coursesService.findCourseBySlug({
      slug: payload.product.slug,
    });

    if (!course) {
      course = await this.coursesService.createCourses({
        title: payload.product.title,
      });
    }

    await this.enrollmentsService.createEnrollment({
      courseId: course.id,
      studentId: student.id,
    });

    console.log('Student enrolled with success');
  }
}
