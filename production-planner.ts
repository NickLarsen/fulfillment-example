import { ProductionPlan, ProductionRequirement } from "./types";

export interface IProductionPlanner {
    generatePlan(requirements: ProductionRequirement[]): ProductionPlan;
}

export class SingleOrderProductionPlanner implements IProductionPlanner {
    generatePlan(requirements: ProductionRequirement[]): ProductionPlan {
        throw new Error("Method not implemented.");
    }
}