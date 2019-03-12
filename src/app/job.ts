import { Attributes, Defenses, Pools } from "./attribute-keys";

export class Job {
	//TODO: Add support for skills
    name: string;
    affectedAttributes: Set<{affectedAttribute: Attributes, pointsPerLevel: number}>;
    affectedDefenses: Set<{affectedDefense: Defenses, pointsPerLevel: number}>;
    basePools: Set<{affectedPool: Pools, baseValue: number}>;
    // skills go here?

    constructor(name: string,
    affectedAttributes: Set<{affectedAttribute: Attributes, pointsPerLevel: number}>,
    affectedDefenses: Set<{affectedDefense: Defenses, pointsPerLevel: number}>,
    basePools: Set<{affectedPool: Pools, baseValue: number}>) {
        this.name = name;
        this.affectedAttributes = affectedAttributes;
        this.affectedDefenses = affectedDefenses;
        this.basePools = basePools;
    }
}