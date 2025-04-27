import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskPriority } from '../enums/task-priority.enum';

export class TaskResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Automate Daily Database Backup Script' })
  title: string;

  @ApiProperty({ example: 'Create a script to automatically backup MongoDB collections and store them in AWS S3' })
  description: string;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.PENDING })
  status: TaskStatus;

  @ApiProperty({ enum: TaskPriority, example: TaskPriority.HIGH })
  priority: TaskPriority;

  @ApiProperty({ example: '2024-06-30T04:00:00Z' })
  dueDate: Date;

  @ApiProperty({ example: '9876dcba-e89b-41d4-a716-446655440000' })
  userId: string;

  @ApiProperty({ example: '2024-01-15T08:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T08:00:00.000Z' })
  updatedAt: Date;
} 