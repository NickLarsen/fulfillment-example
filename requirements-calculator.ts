import { ProductionOrder, ProductionRequirement } from "./types";

export interface IRequirementsCalculator {
    getRequirements(order: ProductionOrder): ProductionRequirement[];
}

export class SimpleRequirementsCalculator implements IRequirementsCalculator {
    getRequirements(order: ProductionOrder): ProductionRequirement[] {
        throw new Error("Method not implemented.");
    }
}