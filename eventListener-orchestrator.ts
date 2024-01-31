import { EventBus, TaskInfo } from "./event-bus";
import { ILogger } from "./logger";
import { ITaskExecutor } from "./plan-executor";
import { IPlanRepository } from "./plan-repository";

export class OrchestratorEventListener {
    constructor(
        private readonly logger: ILogger,
        private readonly eventBus: EventBus,
        private readonly planExecutor: ITaskExecutor,
        private readonly planRepository: IPlanRepository
    ) {
        this.eventBus.subscribeStartTask(this.handleStartEvent.bind(this));
        this.eventBus.subscribeCompleteTask(this.handleCompleteEvent.bind(this));
    }

    handleStartEvent(taskInfo: TaskInfo): void {
        const that = this;
        setTimeout(() => {
            that.logger.log("OrchestratorEventListener.handleStartEvent", { taskInfo });
            const completedTask = that.planRepository.getTask(taskInfo.taskId);
            completedTask.status = "in-progress";
        }, 1);
    }

    handleCompleteEvent(taskInfo: TaskInfo): void {
        const that = this;
        setTimeout(() => {
            that.logger.log("OrchestratorEventListener.handleCompleteEvent", { taskInfo });
            const completedTask = that.planRepository.getTask(taskInfo.taskId);
            completedTask.status = "complete";
            that.planExecutor.triggerFollowups(completedTask);
        }, 1);
    }
}
