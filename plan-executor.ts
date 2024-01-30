import { EventBus } from "./event-bus";
import { ProductionTask } from "./types";

export interface ITaskExecutor {
    triggerFollowups(lastTask: ProductionTask): void;
}

export class PlanTaskExecutor implements ITaskExecutor {
    constructor(private readonly eventBus: EventBus) {}

    triggerFollowups(lastTask: ProductionTask): void {
        if (lastTask.status !== 'complete') {
            throw new Error("cannot trigger follow-ups for incomplete task");
        }
        const nextTasks = lastTask.followUps;
        const unblockedTasks = nextTasks.filter(task => task.prerequisites.every(p => p.status === "complete"));
        for(const task of unblockedTasks) {
            this.eventBus.startTask(task.id);
        }
    }
}