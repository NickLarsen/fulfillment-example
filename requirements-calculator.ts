import { OrderItem, ProductionOrder, ProductionRequirement } from "./types";
import * as uuid from 'uuid';
import { toDictionary } from "./util";

export interface IRequirementsCalculator {
    getRequirements(order: ProductionOrder): ProductionRequirement[];
}

type RequirementTemplate = {
    id: string;
    prerequisites: string[];
};

interface IProductionRequirementsRepository {
    getRequirements(item: OrderItem): ProductionRequirement[];
}

class ProductionRequirementsRepository implements IProductionRequirementsRepository {
    private readonly catalogRequirements: Record<string, RequirementTemplate[]> = {
        "crown": [
            { id: 'crownDesign', prerequisites: [] },
            { id: 'crownFabrication', prerequisites: ['crownDesign'] },
            { id: 'crownShipment', prerequisites: ['crownShipment'] },
        ],
        "digitalWaxup": [
            { id: 'digitalWaxupDesign', prerequisites: [] },
        ],
        "impant": [
            { id: 'implantAbutmentDesign', prerequisites: [] },
            { id: 'implantCrownDesign', prerequisites: ['implantAbutmentDesign'] },
            { id: 'implantAbutmentFabrication', prerequisites: ['implantAbutmentDesign'] },
            { id: 'implantCrownFabrication', prerequisites: ['implantCrownDesign'] },
            { id: 'impantShipment', prerequisites: ['implantAbutmentFabrication', 'implantCrownFabrication'] },
        ],
        "extraScrew": [
            { id: 'extraScrewFabrication', prerequisites: [] },
            { id: 'extraScrewShipment', prerequisites: ['extraScrewFabrication'] },
        ],
        "nightguard": [
            { id: 'nightguardDesign', prerequisites: [] },
            { id: 'nightguardFabrication', prerequisites: ['nightguardDesign'] },
            { id: 'nightguardShipment', prerequisites: ['nightguardFabrication'] },
        ],
    };

    getRequirements(item: OrderItem): ProductionRequirement[] {
        const template = this.catalogRequirements[item.catalogId] ?? [];
        const reqs = template.map(template => ({
            template,
            requirement: {
                id: uuid.v4() as string,
                itemId: item.id,
                prerequisites: []
            } as ProductionRequirement,
        }));
        const lookup = toDictionary(
            reqs,
            req => req.template.id,
            req => req.requirement
        );
        const requirements = reqs.map(({ template: t, requirement}) => {
            requirement.prerequisites = t.prerequisites.map(p => lookup[p]);
            return requirement;
        });
        return requirements;
    }
}

export class SimpleRequirementsCalculator implements IRequirementsCalculator {
    requirementsRepository;

    constructor() {
        this.requirementsRepository = new ProductionRequirementsRepository();
    }

    getRequirements(order: ProductionOrder): ProductionRequirement[] {
        const requirements: ProductionRequirement[][] = order.items
            .map(item => this.requirementsRepository.getRequirements(item));
        const merged = this.mergeRequirements(requirements);
        return merged;
    }

    private mergeRequirements(requirementGroups: ProductionRequirement[][]): ProductionRequirement[] {
        // TODO: some kind of interesting logic to know if there are item dependencies
        // this is where we might enforce that design of crown happens before design of nightguard
        return requirementGroups.flatMap(m => m);
    }
}