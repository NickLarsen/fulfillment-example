import { ProductionPlan, ProductionRequirement, ProductionTask } from "./types";
import { toDictionary } from "./util";
import * as uuid from 'uuid';

export interface IProductionPlanner {
    generatePlan(requirements: ProductionRequirement[]): ProductionPlan;
}

class SingleOrderProductionPlan implements ProductionPlan {
    private root: ProductionTask;
    private lookup: Record<string, ProductionTask>;

    constructor(tasks: ProductionTask[]) {
        this.lookup = toDictionary(tasks, task => task.id, task => task);
        const unblocked = tasks.filter(t => t.prerequisites.length === 0);
        if (unblocked.length === 0) {
            throw new Error("cannot have a plan with no root");
        }
        if (unblocked.length > 1) {
            throw new Error("cannot have a plan with more than one root");
        }
        this.root = unblocked[0];
    }

    findTask(id: string): ProductionTask {
        const task = this.lookup[id];
        if (task === undefined) {
            throw new Error("task not found");
        }
        return task;
    }

    getRoot(): ProductionTask {
        return this.root;
    }
}

export class SingleOrderProductionPlanner implements IProductionPlanner {
    generatePlan(requirements: ProductionRequirement[]): ProductionPlan {
        // proof of concept to get end to end working, just hardcoded
        // TODO: actual requirements mapping
        const tasks: ProductionTask[] = [{ 
            id: uuid.v4(),
            prerequisites: [],
            followUps: [],
            appliesToRequirements: [],
            status: 'pending',
            event: 'start',
        }];
        const plan = new SingleOrderProductionPlan(tasks);
        return plan;
    }
}