import { UseGuards } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { CoursesService } from 'src/services/courses.service';
import { EnrollmentsService } from 'src/services/enrollments.service';
import { StudentsService } from 'src/services/students.service';
import { Enrollment } from '../models/enrollment';

@Resolver(() => Enrollment)
export class EnrollmentsResolver {
  constructor(
    private enrollmentsService: EnrollmentsService,
    private coursesService: CoursesService,
    private studentService: StudentsService,
  ) {}
  @Query(() => [Enrollment])
  @UseGuards(AuthorizationGuard)
  enrollments() {
    return this.enrollmentsService.listAllEnrollments();
  }

  @Query(() => [Enrollment])
  @UseGuards(AuthorizationGuard)
  activeEnrollments() {
    return this.enrollmentsService.listAllActiveEnrollments();
  }

  @ResolveField()
  course(@Parent() enrollment: Enrollment) {
    const { courseId } = enrollment;
    return this.coursesService.findCourseById(courseId);
  }

  @ResolveField()
  student(@Parent() enrollment: Enrollment) {
    const { studentId } = enrollment;
    return this.studentService.findStudentById(studentId);
  }
}
