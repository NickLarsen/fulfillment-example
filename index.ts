import { EventBus } from "./event-bus";
import { ConsoleLogger, ILogger } from "./logger";
import { OrderCommandHandler } from "./order-command-handler";
import { ITaskExecutor, PlanTaskExecutor } from "./plan-executor";
import { IProductionPlanner, SingleOrderProductionPlanner } from "./production-planner";
import { IRequirementsCalculator, SimpleRequirementsCalculator } from "./requirements-calculator";
import { OrderItem } from "./types";
import * as uuid from 'uuid';

// setup
const logger: ILogger = new ConsoleLogger();
const eventBus: EventBus = new EventBus(logger);
const requirementsCalculator: IRequirementsCalculator = new SimpleRequirementsCalculator();
const productionPlanner: IProductionPlanner = new SingleOrderProductionPlanner();
const planExecutor: ITaskExecutor = new PlanTaskExecutor(eventBus);
const orderCommandHandler = new OrderCommandHandler(logger, requirementsCalculator, productionPlanner, planExecutor);

// test
const crownOrder: OrderItem[] = [{ id: uuid.v4(), catalogId: "crown" }];
orderCommandHandler.createOrder(crownOrder);
