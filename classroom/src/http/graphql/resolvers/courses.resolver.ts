import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { AuthUser, CurrentUser } from 'src/http/auth/current-user.decorator';
import { CoursesService } from 'src/services/courses.service';
import { CreateCourseInput } from '../inputs/create-course-input';
import { Course } from '../models/course';

@Resolver(() => Course)
export class CoursesResolver {
  constructor(private coursesService: CoursesService) {}
  @Query(() => [Course])
  @UseGuards(AuthorizationGuard)
  courses() {
    return this.coursesService.listAllCourses();
  }

  @Mutation(() => Course)
  @UseGuards(AuthorizationGuard)
  createCourses(@Args('data') data: CreateCourseInput) {
    return this.coursesService.createCourses(data);
  }

  @Query(() => Course)
  @UseGuards(AuthorizationGuard)
  course(@Args('id') id: string, @CurrentUser() user: AuthUser) {
    return this.coursesService.findEnrolledCourseById({
      id,
      user_id: user.sub,
    });
  }
}
