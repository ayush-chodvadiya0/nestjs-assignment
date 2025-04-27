import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskPriority } from '../enums/task-priority.enum';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async findTasksWithPagination(
    pagination: PaginationDto,
    filters?: {
      status?: TaskStatus;
      priority?: TaskPriority;
      userId?: string;
    },
  ) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const query = this.createQueryBuilder('task')
      .leftJoinAndSelect('task.user', 'user')
      .take(limit)
      .skip(skip);

    if (filters?.status) {
      query.andWhere('task.status = :status', { status: filters.status });
    }

    if (filters?.priority) {
      query.andWhere('task.priority = :priority', { priority: filters.priority });
    }

    if (filters?.userId) {
      query.andWhere('task.userId = :userId', { userId: filters.userId });
    }

    const [tasks, total] = await query.getManyAndCount();

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTaskStatistics(userId?: string) {
    const query = this.createQueryBuilder('task')
      .select([
        'COUNT(*) as total',
        'SUM(CASE WHEN status = :completed THEN 1 ELSE 0 END) as completed',
        'SUM(CASE WHEN status = :inProgress THEN 1 ELSE 0 END) as inProgress',
        'SUM(CASE WHEN status = :pending THEN 1 ELSE 0 END) as pending',
        'SUM(CASE WHEN priority = :high THEN 1 ELSE 0 END) as highPriority',
      ])
      .setParameters({
        completed: TaskStatus.COMPLETED,
        inProgress: TaskStatus.IN_PROGRESS,
        pending: TaskStatus.PENDING,
        high: TaskPriority.HIGH,
      });

    if (userId) {
      query.andWhere('task.userId = :userId', { userId });
    }

    return query.getRawOne();
  }

  async batchUpdateStatus(taskIds: string[], status: TaskStatus) {
    return this.createQueryBuilder()
      .update(Task)
      .set({ status })
      .where('id IN (:...taskIds)', { taskIds })
      .execute();
  }

  async batchDelete(taskIds: string[]) {
    return this.createQueryBuilder()
      .delete()
      .from(Task)
      .where('id IN (:...taskIds)', { taskIds })
      .execute();
  }
} 