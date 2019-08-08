import { Job } from "../job";
import { Attributes, Defenses, Pools, AttributeKeys } from "../attribute-keys";
import { SerializationUtil } from "../serialization-util";
import { JobTypes } from "../shared-constants"
import { JobWithBaseAttributes, TYPE } from "./job-with-base-attributes";

export class RacialJob extends Job implements JobWithBaseAttributes{
	type = TYPE;
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
	// TODO: Consider adding affectedPools. There are Skills that can affect them. What about jobs?
	numberOfsupplementalRacialJobSlots: number,
	numberOfAdventuringJobSlots: number,
	numberOfCraftingJobSlots: number,
	canBeSupplementalJob: boolean) {
		super(name, JobTypes.RACIAL_JOB, affectedAttributes, affectedDefenses, basePools);
		this.baseAttributes = new Set<{affectedAttribute: Attributes; baseValue: number;}>();
		this.baseDefenses = new Set<{affectedDefense: Defenses; baseValue: number; }>();
		this.numberOfsupplementalRacialJobSlots = numberOfsupplementalRacialJobSlots;
		this.numberOfAdventuringJobSlots = numberOfAdventuringJobSlots;
		this.numberOfCraftingJobSlots = numberOfCraftingJobSlots;
		this.canBeSupplementalJob = canBeSupplementalJob;

		// FIXME: Clean up this code
		// Tally up the provided stats
		let foundBaseAttributes = new Map<Attributes, number>();
		let foundBaseDefenses = new Map<Defenses, number>();

		baseAttributes.forEach(item => {
			foundBaseAttributes.set(item.affectedAttribute, item.baseValue);
		});

		baseDefenses.forEach(item => {
			foundBaseDefenses.set(item.affectedDefense, item.baseValue);
		});

		// Initialize every stat to the provided value or zero if none exists.
		AttributeKeys.getAttributeSets().forEach((currentAttributeSet) => {
			let currentOffensive = this.defaultIfUndefined(foundBaseAttributes.get(currentAttributeSet.offensiveAttribute));
			this.baseAttributes.add({affectedAttribute: currentAttributeSet.offensiveAttribute, baseValue: currentOffensive});

			// This is elsewhere called the "defensive" attribute, but that's really confusing when right next to "defense"
			let currentSecondary = this.defaultIfUndefined(foundBaseAttributes.get(currentAttributeSet.defensiveAttribute));
			this.baseAttributes.add({affectedAttribute: currentAttributeSet.defensiveAttribute, baseValue: currentSecondary});

			let currentDefense = this.defaultIfUndefined(foundBaseDefenses.get(currentAttributeSet.defense));
			this.baseDefenses.add({affectedDefense: currentAttributeSet.defense, baseValue: currentDefense});
		});
	}

	getEmptyRacialJob() {
		return new RacialJob("", new Set<{affectedAttribute: Attributes, baseValue: number}>(),
		new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>(),
		new Set<{affectedDefense: Defenses, baseValue: number}>(),
		new Set<{affectedDefense: Defenses, pointsPerLevel: number}>(),
		new Set<{affectedPool: Pools, baseValue: number}>(), 0, 0, 0, false);
	}

	//TODO: Add support for skills
	//TODO: add requirements for unlocking jobs?

	public getBaseAttributes() {
		return this.baseAttributes;
	}

	public setBaseAttributes(baseAttributes: Set<{affectedAttribute: Attributes, baseValue: number}>){
		this.baseAttributes = baseAttributes
	}

	public addBaseAttributes(newBaseAttribute: {affectedAttribute: Attributes, baseValue: number}) {
		this.baseAttributes.add(newBaseAttribute);
	}

	public getBaseDefenses() {
		return this.baseDefenses;
	}

	public setBaseDefenses(baseDefenses: Set<{affectedDefense: Defenses, baseValue: number}>) {
		this.baseDefenses = baseDefenses;
	}

	public addBaseDefenses(newBaseDefense: {affectedDefense: Defenses, baseValue: number}) {
		this.baseDefenses.add(newBaseDefense);
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