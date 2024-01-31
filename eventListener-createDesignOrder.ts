import { EventBus, TaskInfo } from "./event-bus";
import { ILogger } from "./logger";

export class CreateDesignEventListener {
    constructor(
        private readonly logger: ILogger,
        private readonly eventBus: EventBus
    ) {
        this.eventBus.subscribe("createDesign", this.handleEvent.bind(this));
    }

    handleEvent(taskInfo: TaskInfo): void {
        const that = this;
        setTimeout(() => {
            that.logger.log("CreateDesignEventListener.handleEvent", { taskInfo });
            that.eventBus.publishStartTask(taskInfo.taskId);
            that.eventBus.publishCompleteTask(taskInfo.taskId);
        }, 1);
    }
}
