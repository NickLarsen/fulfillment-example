import { ILogger } from "./logger";
import { ITaskExecutor } from "./plan-executor";
import { IProductionPlanner } from "./production-planner";
import { IRequirementsCalculator } from "./requirements-calculator";
import { OrderItem, ProductionOrder } from "./types";

export interface IOrderCommandHandler {
    createOrder(items: OrderItem[]): void;
}

export class OrderCommandHandler implements IOrderCommandHandler {
    constructor(
        private readonly logger: ILogger,
        private readonly requirementsCalculator: IRequirementsCalculator,
        private readonly planner: IProductionPlanner,
        private readonly planExecutor: ITaskExecutor
    ) {}

    createOrder(items: OrderItem[]): void {
        this.createOrderNaive(items);
    }

    private createOrderNaive(items: OrderItem[]): void {
        const order: ProductionOrder = { items };
        this.logger.log("createOrderNaive", { order });
        
        const requirements = this.requirementsCalculator.getRequirements(order);
        this.logger.log("createOrderNaive", { requirements });
        
        const plan = this.planner.generatePlan(requirements);
        this.logger.log("createOrderNaive", { plan });

        const planRoot = plan.getRoot();
        planRoot.status = 'complete';
        this.planExecutor.triggerFollowups(planRoot);
    }
}
