import { ITaskExecutor, PlanTaskExecutor } from "./plan-executor";
import { IProductionPlanner, SingleOrderProductionPlanner } from "./production-planner";
import { IRequirementsCalculator, SimpleRequirementsCalculator } from "./requirements-calculator";
import { OrderItem, ProductionOrder } from "./types";

export interface IOrderCommandHandler {
    createOrder(items: OrderItem[]): void;
}

export class OrderCommandHandler implements IOrderCommandHandler {
    private readonly requirementsCalculator: IRequirementsCalculator = new SimpleRequirementsCalculator();
    private readonly planner: IProductionPlanner = new SingleOrderProductionPlanner();
    private readonly planExecutor: ITaskExecutor = new PlanTaskExecutor();

    createOrder(items: OrderItem[]): void {
        this.createOrderNaive(items);
    }

    private createOrderNaive(items: OrderItem[]): void {
        const order: ProductionOrder = { items };
        const requirements = this.requirementsCalculator.getRequirements(order);
        const plan = this.planner.generatePlan(requirements);
        this.planExecutor.triggerFollowups(plan.getRoot());
    }
}
