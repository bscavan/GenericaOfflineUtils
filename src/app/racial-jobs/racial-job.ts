import { Job } from "../job";
import { Attributes, Defenses, Pools } from "../attribute-keys";

export class RacialJob extends Job {
	protected baseAttributes: Set<{affectedAttribute: Attributes, baseValue: number}>;
	protected baseDefenses: Set<{affectedDefense: Defenses, baseValue: number}>;
	// TODO: Javadoc these!
	numberOfsupplementalRacialJobSlots: number;
	numberOfAdventuringJobSlots: number;
	numberOfCraftingJobSlots: number;


	// Adventuring jobs only affect attributes.
	constructor(name: string,
	baseAttributes: Set<{affectedAttribute: Attributes, baseValue: number}>,
	affectedAttributes: Set<{affectedAttribute: Attributes, pointsPerLevel: number}>,
	baseDefenses: Set<{affectedDefense: Defenses, baseValue: number}>,
	affectedDefenses: Set<{affectedDefense: Defenses, pointsPerLevel: number}>,
	basePools: Set<{affectedPool: Pools, baseValue: number}>,
	numberOfsupplementalRacialJobSlots: number,
	numberOfAdventuringJobSlots: number,
	numberOfCraftingJobSlots: number) {
		super(name, affectedAttributes, affectedDefenses, basePools);
		this.baseAttributes = baseAttributes;
		this.baseDefenses = baseDefenses;
		this.numberOfsupplementalRacialJobSlots = numberOfsupplementalRacialJobSlots;
		this.numberOfAdventuringJobSlots = numberOfAdventuringJobSlots;
		this.numberOfCraftingJobSlots = numberOfCraftingJobSlots;
	}

	getEmptyRacialJob() {
		return new RacialJob("", new Set<{affectedAttribute: Attributes, baseValue: number}>(),
		new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>(),
		new Set<{affectedDefense: Defenses, baseValue: number}>(),
		new Set<{affectedDefense: Defenses, pointsPerLevel: number}>(),
		new Set<{affectedPool: Pools, baseValue: number}>(), 0, 0, 0)
	}

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