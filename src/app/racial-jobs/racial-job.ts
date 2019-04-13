import { Job } from "../job";
import { Attributes, Defenses, Pools } from "../attribute-keys";
import { SerializationUtil } from "../serialization-util";

export class RacialJob extends Job {
	protected baseAttributes: Set<{affectedAttribute: Attributes, baseValue: number}>;
	protected baseDefenses: Set<{affectedDefense: Defenses, baseValue: number}>;
	// TODO: Javadoc these!
	numberOfsupplementalRacialJobSlots: number;
	numberOfAdventuringJobSlots: number;
	numberOfCraftingJobSlots: number;
	canBeSupplementalJob: boolean;


	// Adventuring jobs only affect attributes.
	constructor(name: string,
	baseAttributes: Set<{affectedAttribute: Attributes, baseValue: number}>,
	affectedAttributes: Set<{affectedAttribute: Attributes, pointsPerLevel: number}>,
	baseDefenses: Set<{affectedDefense: Defenses, baseValue: number}>,
	affectedDefenses: Set<{affectedDefense: Defenses, pointsPerLevel: number}>,
	basePools: Set<{affectedPool: Pools, baseValue: number}>,
	numberOfsupplementalRacialJobSlots: number,
	numberOfAdventuringJobSlots: number,
	numberOfCraftingJobSlots: number,
	canBeSupplementalJob: boolean) {
		super(name, affectedAttributes, affectedDefenses, basePools);
		this.baseAttributes = baseAttributes;
		this.baseDefenses = baseDefenses;
		this.numberOfsupplementalRacialJobSlots = numberOfsupplementalRacialJobSlots;
		this.numberOfAdventuringJobSlots = numberOfAdventuringJobSlots;
		this.numberOfCraftingJobSlots = numberOfCraftingJobSlots;
		this.canBeSupplementalJob = canBeSupplementalJob;
	}

	getEmptyRacialJob() {
		return new RacialJob("", new Set<{affectedAttribute: Attributes, baseValue: number}>(),
		new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>(),
		new Set<{affectedDefense: Defenses, baseValue: number}>(),
		new Set<{affectedDefense: Defenses, pointsPerLevel: number}>(),
		new Set<{affectedPool: Pools, baseValue: number}>(), 0, 0, 0, false);
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

	public serializeToJSON() {
		let json = super.serializeToJSON();

		json["baseAttributes"] = SerializationUtil.serializeBaseAttributesSet(this.baseAttributes);
		json["baseDefenses"] = SerializationUtil.serializeBaseDefensesSet(this.baseDefenses);
		json["numberOfsupplementalRacialJobSlots"] = this.numberOfsupplementalRacialJobSlots;
		json["numberOfAdventuringJobSlots"] = this.numberOfAdventuringJobSlots;
		json["numberOfCraftingJobSlots"] = this.numberOfCraftingJobSlots;
		json["canBeSupplementalJob"] = this.canBeSupplementalJob;

		return json;
	}

	public deserializeFromJSON(json): RacialJob {
		super.deserializeFromJSON(json);

		this.baseAttributes = SerializationUtil.deserializeBaseAttributesSet(json.baseAttributes);
		this.baseDefenses = SerializationUtil.deserializeBaseDefensesSet(json.baseDefenses);
		this.numberOfsupplementalRacialJobSlots = json.numberOfsupplementalRacialJobSlots;
		this.numberOfAdventuringJobSlots = json.numberOfAdventuringJobSlots;
		this.numberOfCraftingJobSlots = json.numberOfCraftingJobSlots;
		this.canBeSupplementalJob = json.canBeSupplementalJob;

		return this;
	}
}