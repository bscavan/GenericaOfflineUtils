import { Skill, Qualifier, Denomination, Duration } from "./skill";

export class ClassSkill extends Skill {
    public constructor(name: string, description: string,
        costs: {costAmount: number, costDenomination: Denomination}[],
        duration: {amount: number, timeDenomination: Duration, qualifier: Qualifier},
        doesLevel: boolean) {
            super(name, description, costs, duration, doesLevel);
        }
}