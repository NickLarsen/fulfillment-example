import { EventBus, TaskInfo } from "./event-bus";
import { ILogger } from "./logger";

export class CreateFabricationEventListener {
    constructor(
        private readonly logger: ILogger,
        private readonly eventBus: EventBus
    ) {
        this.eventBus.subscribe("createFabrication", this.handleEvent.bind(this));
    }

    handleEvent(taskInfo: TaskInfo): void {
        const that = this;
        setTimeout(() => {
            that.logger.log("CreateFabricationEventListener.handleEvent", { taskInfo });
            that.eventBus.publishStartTask(taskInfo.taskId);
            that.eventBus.publishCompleteTask(taskInfo.taskId);
        }, 1);
    }
}
