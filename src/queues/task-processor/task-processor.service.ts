import { Injectable } from '@nestjs/common';
import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TasksService } from '../../modules/tasks/tasks.service';
import { TaskStatus } from '../../modules/tasks/enums/task-status.enum';

@Injectable()
export class TaskProcessorService extends WorkerHost {
  constructor(private readonly tasksService: TasksService) {
    super();
  }

  async process(job: Job<{ taskId: string; status: TaskStatus }>) {
    const { taskId, status } = job.data;
    try {
      await this.tasksService.updateStatus(taskId, status);
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
} 