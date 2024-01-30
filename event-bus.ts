import { ILogger } from "./logger";

type TaskInfo = { taskId: string };
type Action = (payload: TaskInfo) => void;

export class EventBus {
    private readonly startTaskEventName = 'startTask';
    private readonly completeTaskEventName = 'completeTask';

    private readonly subscriptions: Record<string, Action[]> = {};

    constructor(private readonly logger: ILogger) {}

    subscribeTaskStart(action: Action): void {
        this.subscribe(this.startTaskEventName, action);
    }

    subscribeCompleteTask(action: Action): void {
        this.subscribe(this.completeTaskEventName, action);
    }

    private subscribe(eventName: string, action: Action): void {
        if (eventName in this.subscriptions) {
            this.subscriptions[eventName].push(action);
        } else {
            this.subscriptions[eventName] = [action];
        }
        this.logger.log("EventBus.subscribe", { eventName });
    }

    startTask(taskId: string) {
        this.publish(this.startTaskEventName, { taskId });
    }

    completeTask(taskId: string) {
        this.publish(this.completeTaskEventName, { taskId });
    }

    private publish(eventName: string, payload: TaskInfo): void {
        setTimeout(() => {
            const actions = this.subscriptions[eventName];
            if (actions === undefined) return;
            for(const subscriberAction of actions) {
                subscriberAction(payload);
            }
        }, 1);
        this.logger.log("EventBus.publish", { eventName, payload });
    }
}