/*
And order item is a fundamental thing that a doctor has ordered.  Some metadata
might be attached which alters the production requirements.
*/
export type OrderItem = {
    id: string;
};

/*
A production order is a collection of information from which production
requirements can be generated.  This includes items and additional metadata
such as doctor preferences.  A production order is also responsible for
communicating updates to other systems for status updates.  When all requirements
are satisfied, the order production order is considered to be fulflled.
*/
export type ProductionOrder = {
    items: OrderItem[];
};

/*
Production requirements are a coarse representation of the steps necessary
to complete the order.  When all production requirements satisfied, the production
order is considered complete and fulfilled.  Production requirements are a DAG
and are an intermediate representation for defining dependencies in multi-item orders.
Production requirements always belong to a particular order.
*/
export type ProductionRequirement = {
    prerequisites: ProductionRequirement[];
};

/*
A production task is a single unit of work from the orchestrator's perspective.
These respresent nodes in a graph (a DAG more specifically) and support fast
lookup of ancestors and descendents.  Tasks are much finer grained than requirements
in that a single production requirement might generate multiple production tasks.
Production tasks can also relate to multiple orders! e.g. many orders might ship
in the same box so a single shipment task can satisfy requirements for numerous 
production requirements.
*/
export type ProductionTask = {
    id: string;
    prerequisites: ProductionTask[];
    followUps: ProductionTask[];
    status: 'pending' | 'in-progress' | 'complete';
    event: string; // this is the event which gets triggered to start the task
};

/*
A production plan is a graph (a DAG more specifically) of tasks that need to happen
in order to satisfy the production requirements for a production order.
The plan is an interface which exposes queries for finding specific tasks.
*/
export interface ProductionPlan {
    findTask(id: string): ProductionTask;
    getRoot(): ProductionTask;
}
