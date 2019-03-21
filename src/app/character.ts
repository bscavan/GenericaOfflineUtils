import { Attributes, Defenses, Pools, AttributeKeys } from "./attribute-keys";
import { Job } from "./job";
import { AdventuringJob } from "./adventuring-job";
import { RacialJob } from "./racial-job";
import { CraftingJob } from "./crafting-job";

const ATTRIBUTE_SETS = AttributeKeys.getAttributeSets();

export class Character {

	// TODO: Write support for banking jobs!
	// TODO: Write unit-tests for this.
	// TODO: getter and setter methods for name and title
	protected name: string;
	protected title: string;
	protected racialJobLevels: Map<RacialJob, number>;
	protected adventuringJobLevels: Map<AdventuringJob, number>;
	protected craftingJobLevels: Map<CraftingJob, number>;

	protected baseAttributes: Map<Attributes, number> = new Map();
	protected totalAttributes: Map<Attributes, number> = new Map();

	protected baseDefenses: Map<Defenses, number> = new Map();
	protected totalDefenses: Map<Defenses, number> = new Map();

	// Some races, like manabeasts, have base values added to their pools
	protected basePools: Map<Pools, number> = new Map();
	protected totalPools: Map<Pools, number> = new Map();

	//TODO: Add support for listing the skills each class brings, along with their levels?
	// support for spending level points (calculating costs) and grind points (on skills or stats)?

	// TODO: Handle current values of pools?

	// multiple increases/decreases to the same attribute stack.
	protected increasesToAttributes: Map<string, {targetAttribute: Attributes; value: number}>;
	protected decreasesToAttributes: Map<string, {targetAttribute: Attributes; value: number}>;

	// Only the highest buff and highest debuff apply to each attribute
	protected buffsToAttributes: Map<string, {targetAttribute: Attributes; value: number}>;
	protected debuffsToAttributes: Map<string, {targetAttribute: Attributes; value: number}>;

	constructor(name: string, title: string,
	racialJobLevels: Map<RacialJob, number>,
	adventuringJobLevels: Map<AdventuringJob, number>,
	craftingJobLevels: Map<CraftingJob, number>) {
		this.name = name;
		this.title = title;
		this.racialJobLevels = racialJobLevels;
		this.adventuringJobLevels = adventuringJobLevels;
		this.craftingJobLevels = craftingJobLevels;
		this.recalculateAttributes();
	}

	public addIncrease(increaseSourceName: string, targetAttribute: Attributes, value: number) {
		this.increasesToAttributes.set(increaseSourceName, {targetAttribute, value});
	}

	public addJobLevels(newJob: Job, levelsTaken: number) {
		this.adventuringJobLevels.set(newJob, levelsTaken);
		this.recalculateAttributes();
	}

	public removeJob(job: Job) {
		this.adventuringJobLevels.delete(job);
		this.recalculateAttributes();
	}

	private recalculateAttributes() {
		this.baseAttributes = new Map();
		this.totalAttributes = new Map();

		this.baseDefenses = new Map();
		this.totalDefenses = new Map();

		this.basePools = new Map();
		this.totalPools = new Map();
		
		ATTRIBUTE_SETS.forEach((currentAttribute) => {
			this.baseAttributes.set(currentAttribute.offensiveAttribute, 0);
			this.totalAttributes.set(currentAttribute.offensiveAttribute, 0);

			this.baseAttributes.set(currentAttribute.defensiveAttribute, 0);
			this.totalAttributes.set(currentAttribute.defensiveAttribute, 0);

			this.baseDefenses.set(currentAttribute.defense, 0);
			this.totalDefenses.set(currentAttribute.defense, 0);

			this.basePools.set(currentAttribute.pool, 0);
			this.totalPools.set(currentAttribute.pool, 0);
		});

		// Adding racial job base values to attributes, defenses, and pools
		this.addRacialJobLevelsToBaseAttributes(this.baseAttributes, this.racialJobLevels);
		this.addRacialJobLevelsToBaseDefenses(this.baseDefenses, this.racialJobLevels);
		this.addRacialJobLevelsToPools(this.basePools, this.racialJobLevels);

		// TODO: Handle skill-point increases, the initial 2d10 added to your base, and the initial 100 stats added to that...

		// Adding job level-based increases to attributes
		this.addJobLevelsToAttributes(this.totalAttributes, this.racialJobLevels);
		this.addJobLevelsToAttributes(this.totalAttributes, this.adventuringJobLevels);
		this.addJobLevelsToAttributes(this.totalAttributes, this.craftingJobLevels);

		// Adding job level-based increases to defenses
		this.addJobLevelsToDefenses(this.totalDefenses, this.racialJobLevels);
		this.addJobLevelsToDefenses(this.totalDefenses, this.adventuringJobLevels);
		this.addJobLevelsToDefenses(this.totalDefenses, this.craftingJobLevels);

		// Adding base attributes to totals
		this.addAttributeSetsTogether(this.totalAttributes, this.baseAttributes);

		// Adding base defenses to totals
		this.addDefensesSetsTogether(this.totalDefenses, this.baseDefenses);

		// Calculating pools:
		this.totalPools = this.calcualtePools(this.basePools, this.totalAttributes);

		//TODO: Check and update FATE, as it's a special case!

		//TODO: Write a method to apply increases and put that code in a helper method.

		//TODO: Write a method to apply the highest buff affecting each stat and put that code in a helper method.

		//TODO: Handle how some increases/buffs don't affect an attribute's pool.

		// TODO: Apply equipment here?
		// Should that just fall under increases?
		// Should they get a list of equip slots?

		// TODO: Handle racial stat caps, like Beast's max INT, and Peskie's max STR

		// FIXME: this entire method is useless right now.
		// It doesn't do anything permenant...

		// Print stats here:
		this.printFullStats();
	}

	public getBaseAttribute(attribute: Attributes): number {
		return this.baseAttributes.get(attribute);
	}

	public getAttribute(attribute: Attributes): number {
		return this.totalAttributes.get(attribute);
	}

	public getBaseDefense(defense: Defenses): number {
		return this.baseDefenses.get(defense);
	}

	public getDefense(defense: Defenses): number {
		return this.totalDefenses.get(defense);
	}

	public getBasePool(pool: Pools): number {
		return this.basePools.get(pool);
	}

	public getPool(pool: Pools): number {
		return this.totalPools.get(pool);
	}

	private addAttributeSetsTogether(
	baseSet: Map<Attributes, number>, setToAddToBase: Map<Attributes, number>){
		ATTRIBUTE_SETS.forEach((currentAttribute) => {
			let newTotalOffensiveAttribute = baseSet.get(currentAttribute.offensiveAttribute)
				+ setToAddToBase.get(currentAttribute.offensiveAttribute);
			baseSet.set(currentAttribute.offensiveAttribute, newTotalOffensiveAttribute);

			let newTotalSecondaryAttribute = baseSet.get(currentAttribute.defensiveAttribute)
				+ setToAddToBase.get(currentAttribute.defensiveAttribute);
			baseSet.set(currentAttribute.defensiveAttribute, newTotalSecondaryAttribute);
		});
	}

	private addDefensesSetsTogether(
	baseDefensesSet: Map<Defenses, number>,
	setToAddToBaseDefenses: Map<Defenses, number>) {
		ATTRIBUTE_SETS.forEach((currentAttribute) => {
			let newTotalDefense = baseDefensesSet.get(currentAttribute.defense)
				+ setToAddToBaseDefenses.get(currentAttribute.defense);
			baseDefensesSet.set(currentAttribute.defense, newTotalDefense);
		});
	}

	private calcualtePools(basePools: Map<Pools, number>, totalAttributesSet: Map<Attributes, number>) {
		let poolsSet = new Map<Pools, number>();

		ATTRIBUTE_SETS.forEach((currentAttribute) => {
			let poolValue: number = totalAttributesSet.get(currentAttribute.offensiveAttribute) +
				totalAttributesSet.get(currentAttribute.defensiveAttribute)
				+ basePools.get(currentAttribute.pool);
			poolsSet.set(currentAttribute.pool, poolValue);
		});

		return poolsSet;
	}


	public addJobLevelsToAttributes(attributesMap: Map<Attributes, number>, jobMap: Map<Job, number>)
	{
		jobMap.forEach((levelsInCurrentJob, currentJob) =>
		{
			currentJob.affectedAttributes.forEach((currentAttributeElement) =>
			{
				// TODO: Ensure the value exists in this map now, or this line will result in a NullPointerException...
				attributesMap.set(currentAttributeElement.affectedAttribute,
					attributesMap.get(currentAttributeElement.affectedAttribute)
					+ levelsInCurrentJob * currentAttributeElement.pointsPerLevel);
			});
		});
	}

	public addRacialJobLevelsToBaseAttributes(attributesMap: Map<Attributes, number>, jobMap: Map<RacialJob, number>)
	{
		jobMap.forEach((levelsInCurrentJob, currentJob) =>
		{
			currentJob.getBaseAttributes().forEach((currentAttributeElement) =>
			{
				// TODO: Ensure the value exists in this map now, or this line will result in a NullPointerException...
				attributesMap.set(currentAttributeElement.affectedAttribute,
					attributesMap.get(currentAttributeElement.affectedAttribute)
					+ currentAttributeElement.baseValue);
			});
		});
	}

	public addJobLevelsToDefenses(defensesMap: Map<Defenses, number>, jobMap: Map<Job, number>)
	{
		// todo: handle base values for these stats
		jobMap.forEach((levelsInCurrentJob, currentJob) =>
		{
			currentJob.affectedDefenses.forEach((currentDefenseElement) =>
			{
				// TODO: Ensure the value exists in this map now, or this line will result in a NullPointerException...
				defensesMap.set(currentDefenseElement.affectedDefense,
					defensesMap.get(currentDefenseElement.affectedDefense)
					+ levelsInCurrentJob * currentDefenseElement.pointsPerLevel);
			});
		});
	}

	public addRacialJobLevelsToBaseDefenses(defensesMap: Map<Defenses, number>, jobMap: Map<RacialJob, number>)
	{
		// todo: handle base values for these stats
		jobMap.forEach((levelsInCurrentJob, currentJob) =>
		{
			currentJob.getBaseDefenses().forEach((currentDefenseElement) =>
			{
				// TODO: Ensure the value exists in this map now, or this line will result in a NullPointerException...
				defensesMap.set(currentDefenseElement.affectedDefense,
					defensesMap.get(currentDefenseElement.affectedDefense)
					+ currentDefenseElement.baseValue);
			});
		});
	}

	public addRacialJobLevelsToPools(poolsMap: Map<Pools, number>, jobMap: Map<RacialJob, number>)
	{
		jobMap.forEach((levelsInCurrentJob, currentJob) =>
		{
			// Do we need to account for currentJob.affectedPools?
			currentJob.basePools.forEach((currentPoolElement) =>
			{
				// TODO: Ensure the value exists in this map now, or this line will result in a NullPointerException...
				poolsMap.set(currentPoolElement.affectedPool,
					poolsMap.get(currentPoolElement.affectedPool)
					+ currentPoolElement.baseValue);
			});
		});
	}

	private printFullStats(): void {
		console.log("Printing character information:");
		console.log("name: " + this.name);
		console.log("title: " + this.title);
		console.log("stats: [");
		ATTRIBUTE_SETS.forEach((currentAttribute) => {
			console.log("Type: " + currentAttribute.type);

			console.log(currentAttribute.offensiveAttribute + ": "
				+ this.totalAttributes.get(currentAttribute.offensiveAttribute));
			console.log(currentAttribute.defensiveAttribute + ": "
				+ this.totalAttributes.get(currentAttribute.defensiveAttribute));
			console.log(currentAttribute.defense + ": "
				+ this.totalDefenses.get(currentAttribute.defense));
			console.log(currentAttribute.pool + ": "
				+ this.totalPools.get(currentAttribute.pool));
		});
		console.log("]");

		console.log("race(s): [");
		this.racialJobLevels.forEach((currentRace) => {
			// TODO: find a way to print the race names here...
			console.log("level [" + currentRace + "] ");
		});
		console.log("]")

		console.log("adventuring job levels(s): [");
		this.adventuringJobLevels.keys();
		this.adventuringJobLevels.forEach((currentJob) => {
			// TODO: find a way to print the race names here...
			console.log("level [" + currentJob + "] ");
		});
		console.log("]")

		console.log("crafting job levels(s): [");
		this.craftingJobLevels.forEach((currentJob) => {
			// TODO: find a way to print the race names here...
			console.log("level [" + currentJob + "] ");
		});
		console.log("]")
	}
}