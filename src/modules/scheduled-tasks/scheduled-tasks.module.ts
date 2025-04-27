import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TasksModule } from '../tasks/tasks.module';
import { OverdueTasksService } from './overdue-tasks.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'task-processing',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    }),
    TasksModule,
  ],
  providers: [OverdueTasksService],
  exports: [OverdueTasksService],
})
export class ScheduledTasksModule {} 