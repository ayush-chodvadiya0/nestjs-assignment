import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { TaskRepository } from '../tasks/repositories/task.repository';
import { TaskStatus } from '../tasks/enums/task-status.enum';

@Injectable()
export class OverdueTasksService {
  constructor(
    @InjectQueue('task-processing')
    private taskQueue: Queue,
    private readonly taskRepository: TaskRepository,
  ) {}

  async processOverdueTasks() {
    const overdueTasks = await this.taskRepository
      .createQueryBuilder('task')
      .where('task.dueDate < :now', { now: new Date() })
      .andWhere('task.status != :status', { status: TaskStatus.COMPLETED })
      .getMany();

    for (const task of overdueTasks) {
      await this.taskQueue.add('task-status-update', {
        taskId: task.id,
        status: TaskStatus.OVERDUE,
      });
    }

    return { processed: overdueTasks.length };
  }
} 