import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

interface ICourseAndStudent {
  courseId: string;
  studentId: string;
}

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  listAllEnrollments() {
    return this.prisma.enrollment.findMany();
  }

  listAllActiveEnrollments() {
    return this.prisma.enrollment.findMany({
      where: {
        canceled_at: null,
      },
    });
  }

  listEnrollmentsByStudent(studentId: string) {
    return this.prisma.enrollment.findMany({
      where: {
        studentId,
        canceled_at: null,
      },
    });
  }

  findByCourseAndStudent({ studentId, courseId }: ICourseAndStudent) {
    return this.prisma.enrollment.findFirst({
      where: {
        studentId,
        courseId,
      },
    });
  }

  createEnrollment({ studentId, courseId }: ICourseAndStudent) {
    return this.prisma.enrollment.create({
      data: {
        studentId,
        courseId,
      },
    });
  }
}
