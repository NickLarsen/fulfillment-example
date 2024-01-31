import { ProductionPlan, ProductionTask } from "./types";

export interface IPlanRepository {
    getTask(taskId: string): ProductionTask;
    savePlan(plan: ProductionPlan): void;
}

export class InMemoryPlanRepository implements IPlanRepository {
    private readonly taskLookup: Record<string, ProductionTask> = {};

    getTask(taskId: string): ProductionTask {
        const task = this.taskLookup[taskId];
        if (task === undefined) {
            throw new Error("task not found");
        }
        // TODO: ideally this returns a clone but it's a whole grash and I'm not writing
        // that for this proof of concept
        return task;
    }

    savePlan(plan: ProductionPlan): void {
        for(const task of plan.getAllTasks()) {
            const p = this.taskLookup[task.id];
            if (p !== undefined) {
                if (p !== task) {
                    throw new Error("duplicate task id detected");
                }
                continue;
            }
            // TODO: should store a copy too so caller can mutate at will with no consequences
            this.taskLookup[task.id] = task;
        }
    }
}