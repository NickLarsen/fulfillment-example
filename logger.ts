export interface ILogger {
    log(message: string, context?: any): void;
}

export class ConsoleLogger implements ILogger {
    log(message: string, context?: any): void {
        console.log(message, context);
    }
}