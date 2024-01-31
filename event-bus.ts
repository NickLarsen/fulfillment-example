import { ILogger } from "./logger";

export type TaskInfo = { taskId: string };
export type Action = (payload: TaskInfo) => void;

export class EventBus {
    private readonly completeTaskEventName = 'completeTask';
    private readonly startTaskEventName = 'startTask';

    private readonly subscriptions: Record<string, Action[]> = {};

    constructor(private readonly logger: ILogger) {}

    subscribeCompleteTask(action: Action): void {
        this.subscribe(this.completeTaskEventName, action);
    }

    subscribeStartTask(action: Action): void {
        this.subscribe(this.startTaskEventName, action);
    }

    public subscribe(eventName: string, action: Action): void {
        if (eventName in this.subscriptions) {
            this.subscriptions[eventName].push(action);
        } else {
            this.subscriptions[eventName] = [action];
        }
        this.logger.log("EventBus.subscribe", { eventName });
    }

    publishCompleteTask(taskId: string) {
        this.publish(this.completeTaskEventName, { taskId });
    }

    publishStartTask(taskId: string) {
        this.publish(this.startTaskEventName, { taskId });
    }

    public publish(eventName: string, payload: TaskInfo): void {
        const that = this;
        setTimeout(() => {
            const actions = that.subscriptions[eventName];
            if (actions === undefined) return;
            for(const subscriberAction of actions) {
                subscriberAction(payload);
            }
        }, 1);
        this.logger.log("EventBus.publish", { eventName, payload });
    }
}