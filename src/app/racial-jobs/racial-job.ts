import { Job } from "../job";
import { Attributes, Defenses, Pools } from "../attribute-keys";

export class RacialJob extends Job {
	protected baseAttributes: Set<{affectedAttribute: Attributes, baseValue: number}>;
	protected baseDefenses: Set<{affectedDefense: Defenses, baseValue: number}>;

	// Adventuring jobs only affect attributes.
	constructor(name: string,
	baseAttributes: Set<{affectedAttribute: Attributes, baseValue: number}>,
	affectedAttributes: Set<{affectedAttribute: Attributes, pointsPerLevel: number}>,
	baseDefenses: Set<{affectedDefense: Defenses, baseValue: number}>,
	affectedDefenses: Set<{affectedDefense: Defenses, pointsPerLevel: number}>,
	basePools: Set<{affectedPool: Pools, baseValue: number}>) {
		super(name, affectedAttributes, affectedDefenses, basePools);
		this.baseAttributes = baseAttributes;
		this.baseDefenses = baseDefenses;
	}

	/*
	constructor(name: string,
    affectedAttributes: Set<{affectedAttribute: Attributes, pointsPerLevel: number}>,
    affectedDefenses: Set<{affectedDefense: Defenses, pointsPerLevel: number}>,
    affectedPools: Set<{affectedPool: Pools, pointsPerLevel: number}>) {
	*/

	protected setBaseAttributes(baseAttributes: Set<{affectedAttribute: Attributes, baseValue: number}>){
		this.baseAttributes = baseAttributes
	}
	//TODO: Add support for skills
	//TODO: add requirements for unlocking jobs?

	public getBaseAttributes() {
		return this.baseAttributes;
	}

	public getBaseDefenses() {
		return this.baseDefenses;
	}
}