import { Injectable, UnauthorizedException } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { EnrollmentsService } from './enrollments.service';
import { StudentsService } from './students.service';

interface ICreateCourses {
  title: string;
  slug?: string;
}

interface IFindCourseBySlug {
  slug: string;
}

interface IFindbyCourseAndStudent {
  id: string;
  user_id: string;
}

@Injectable()
export class CoursesService {
  constructor(
    private prisma: PrismaService,
    private studentsService: StudentsService,
    private enrollmentsService: EnrollmentsService,
  ) {}

  listAllCourses() {
    return this.prisma.course.findMany();
  }

  findCourseById(id: string) {
    return this.prisma.course.findUnique({
      where: {
        id,
      },
    });
  }

  async createCourses({ title, slug }: ICreateCourses) {
    const courseSlug = slug ?? slugify(title, { lower: true });

    const courseWithSameSlug = await this.prisma.course.findUnique({
      where: {
        slug: courseSlug,
      },
    });

    if (courseWithSameSlug) {
      throw new Error('Course with same slug already exists');
    }

    return this.prisma.course.create({
      data: {
        slug: courseSlug,
        title,
      },
    });
  }

  async findEnrolledCourseById({ id, user_id }: IFindbyCourseAndStudent) {
    const student = await this.studentsService.findStudentByAuthUserId(user_id);

    if (!student) {
      throw new Error('Student not found');
    }

    const enrollment = await this.enrollmentsService.findByCourseAndStudent({
      courseId: id,
      studentId: student.id,
    });

    if (!enrollment) {
      throw new UnauthorizedException();
    }

    return this.findCourseById(id);
  }

  findCourseBySlug({ slug }: IFindCourseBySlug) {
    return this.prisma.course.findUnique({
      where: {
        slug,
      },
    });
  }
}
