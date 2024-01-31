import { EventBus } from "./event-bus";
import { CreateDesignEventListener } from "./eventListener-createDesignOrder";
import { CreateFabricationEventListener } from "./eventListener-createFabricationOrder";
import { CreateShipmentEventListener } from "./eventListener-createShipmentOrder";
import { OrchestratorEventListener } from "./eventListener-orchestrator";
import { ConsoleLogger, ILogger } from "./logger";
import { OrderCommandHandler } from "./order-command-handler";
import { ITaskExecutor, PlanTaskExecutor } from "./plan-executor";
import { IPlanRepository, InMemoryPlanRepository } from "./plan-repository";
import { IProductionPlanner, SingleOrderProductionPlanner } from "./production-planner";
import { IRequirementsCalculator, SimpleRequirementsCalculator } from "./requirements-calculator";
import { OrderItem } from "./types";
import * as uuid from 'uuid';

// setup
const logger: ILogger = new ConsoleLogger();
const eventBus: EventBus = new EventBus(logger);

const planRepository: IPlanRepository = new InMemoryPlanRepository();
const requirementsCalculator: IRequirementsCalculator = new SimpleRequirementsCalculator();
const productionPlanner: IProductionPlanner = new SingleOrderProductionPlanner(planRepository);
const planExecutor: ITaskExecutor = new PlanTaskExecutor(eventBus);
const orderCommandHandler = new OrderCommandHandler(logger, requirementsCalculator, productionPlanner, planExecutor);

const designEventLisitener = new CreateDesignEventListener(logger, eventBus);
const fabricationEventLisitener = new CreateFabricationEventListener(logger, eventBus);
const shipmentEventLisitener = new CreateShipmentEventListener(logger, eventBus);
const orchestratorEventListener = new OrchestratorEventListener(logger, eventBus, planExecutor, planRepository);

// test
const crownOrder: OrderItem[] = [{ id: uuid.v4(), catalogId: "crown" }];
orderCommandHandler.createOrder(crownOrder);
