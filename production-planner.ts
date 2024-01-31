import { IPlanRepository } from "./plan-repository";
import { ProductionPlan, ProductionRequirement, ProductionTask } from "./types";
import { toDictionary } from "./util";
import * as uuid from 'uuid';

export interface IProductionPlanner {
    generatePlan(requirements: ProductionRequirement[]): ProductionPlan;
}

class SingleOrderProductionPlan implements ProductionPlan {
    private root: ProductionTask;
    private lookup: Record<string, ProductionTask>;
    private tasks: ProductionTask[];

    constructor(tasks: ProductionTask[]) {
        this.tasks = tasks;
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

    getAllTasks(): ProductionTask[] {
        return this.tasks;
    }
}

export class SingleOrderProductionPlanner implements IProductionPlanner {
    constructor(private readonly planRepository: IPlanRepository) {}

    generatePlan(requirements: ProductionRequirement[]): ProductionPlan {
        // proof of concept to get end to end working, just hardcoded
        // TODO: actual requirements mapping
        const startTask: ProductionTask = { 
            id: "startTaskId", //uuid.v4(),
            prerequisites: [],
            followUps: [],
            appliesToRequirements: [],
            status: 'pending',
            event: 'start',
        };
        const designTask: ProductionTask = { 
            id: "designTaskId", //uuid.v4(),
            prerequisites: [startTask],
            followUps: [],
            appliesToRequirements: [],
            status: 'pending',
            event: 'createDesign',
        };
        const fabricationTask: ProductionTask = { 
            id: "fabricationTaskId", //uuid.v4(),
            prerequisites: [designTask],
            followUps: [],
            appliesToRequirements: [],
            status: 'pending',
            event: 'createFabrication',
        };
        const shippingTask: ProductionTask = { 
            id: "shipmentTaskId", //uuid.v4(),
            prerequisites: [fabricationTask],
            followUps: [],
            appliesToRequirements: [],
            status: 'pending',
            event: 'createShipment',
        };
        startTask.followUps.push(designTask);
        designTask.followUps.push(fabricationTask);
        fabricationTask.followUps.push(shippingTask);
        const tasks: ProductionTask[] = [startTask, designTask, fabricationTask, shippingTask];
        const plan = new SingleOrderProductionPlan(tasks);
        this.planRepository.savePlan(plan);
        return plan;
    }
}