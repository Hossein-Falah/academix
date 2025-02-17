import { PartialType } from '@nestjs/swagger';
import { CourseDto } from './course.dto';

export class UpdateCourseDto extends PartialType(CourseDto) {}
