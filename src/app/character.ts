import { Attributes, Defenses, Pools, AttributeKeys } from "./attribute-keys";
import { Job } from "./job";
import { AdventuringJob } from "./adventuring-job";
import { RacialJob } from "./racial-job";
import { CraftingJob } from "./crafting-job";

const ATTRIBUTE_SETS = AttributeKeys.initializeAttributeSets();

export class Character {

	// TODO: Write support for banking jobs!
	protected racialJobLevels: Map<RacialJob, number>;
	protected adventuringJobLevels: Map<AdventuringJob, number>;
	protected craftingJobLevels: Map<CraftingJob, number>;

	constructor(name: string, title: string,
	racialJobLevels: Map<RacialJob, number>,
	adventuringJobLevels: Map<AdventuringJob, number>,
	craftingJobLevels: Map<CraftingJob, number>) {
		this.racialJobLevels = racialJobLevels;
		this.adventuringJobLevels = adventuringJobLevels;
		this.craftingJobLevels = craftingJobLevels;
		//this.initializeBaseAttributes();
	}

	//TODO: Add support for skills



	// Handle pools here. Need 2 values? (total and current)
	//protected basePools: Map<Pools, number>;
	// Are "base pools" even logically necessary? They're always derrived from adding their two respective attributes together.


	// multiple increases/decreases to the same attribute stack.
	protected increasesToAttributes: Map<string, {targetAttribute: Attributes; value: number}>;
	protected decreasesToAttributes: Map<string, {targetAttribute: Attributes; value: number}>;

	// Only the highest buff and highest debuff apply to each attribute
	protected buffsToAttributes: Map<string, {targetAttribute: Attributes; value: number}>;
	protected debuffsToAttributes: Map<string, {targetAttribute: Attributes; value: number}>;

	/*
	initializeBaseAttributes() {
		ATTRIBUTE_SETS.forEach((currentAttribute) => {
			this.baseAttributes.set(currentAttribute.offensiveAttribute, 0);
			this.baseAttributes.set(currentAttribute.defensiveAttribute, 0);
			this.baseDefenses.set(currentAttribute.defense, 0);
			this.basePools.set(currentAttribute.pool, 0);
		});
	}
	*/

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
		
		let baseAttributes: Map<Attributes, number>= new Map();
		let totalAttributes: Map<Attributes, number> = new Map();

		let baseDefenses: Map<Defenses, number>= new Map();
		let totalDefenses: Map<Defenses, number> = new Map();

		let totalPools: Map<Pools, number>= new Map();

		// TODO: apply racial base attributes (ex: 25's across the board for humans...)

		// Apply character base attributes
		baseAttributes.forEach((value, currentAttribute) => {
			totalAttributes.set(currentAttribute, value);
		});

		// Handle base attributes and defenses (set by race):
		this.addJobLevelsToAttributes(baseAttributes, this.racialJobLevels);
		this.addJobLevelsToDefenses(baseDefenses, this.racialJobLevels);

		// TODO: Handle skill-point increases, the initial 2d10 added to your base, and the initial 100 stats added to that...

		// Handle non-racial job-increased attributes
		this.addJobLevelsToAttributes(totalAttributes, this.adventuringJobLevels);
		this.addJobLevelsToAttributes(totalAttributes, this.craftingJobLevels);
		this.addJobLevelsToDefenses(totalDefenses, this.adventuringJobLevels);
		this.addJobLevelsToDefenses(totalDefenses, this.craftingJobLevels);

		// Add base attributes and defenses to totals:
		this.addAttributeSetsTogether(totalAttributes, baseAttributes);

		// Add defenses together:
		this.addDefensesSetsTogether(totalDefenses, baseDefenses);

		// Calculate pools:
		let poolsSet = this.calcualtePools(totalAttributes);

		//TODO: Check and update FATE, as it's a special case!

		//TODO: Write a method to apply increases and put that code in a helper method.

		//TODO: Write a method to apply the highest buff affecting each stat and put that code in a helper method.

		//TODO: Handle how some increases/buffs don't affect an attribute's pool.

		// TODO: Apply equipment here?
		// Should that just fall under increases?
		// Should they get a list of equip slots?
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

	private calcualtePools(totalAttributesSet: Map<Attributes, number>) {
		let poolsSet = new Map<Pools, number>();

		ATTRIBUTE_SETS.forEach((currentAttribute) => {
			poolsSet.set(currentAttribute.pool, totalAttributesSet.get(currentAttribute.offensiveAttribute) +
			totalAttributesSet.get(currentAttribute.defensiveAttribute));
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

	public addJobLevelsToDefenses(defensesMap: Map<Defenses, number>, jobMap: Map<Job, number>)
	{
		jobMap.forEach((levelsInCurrentJob, currentJob) =>
		{
			// currentJob.affectedDefenses.forEach goes here...
			currentJob.affectedDefenses.forEach((currentDefenseElement) =>
			{
				// TODO: Ensure the value exists in this map now, or this line will result in a NullPointerException...
				defensesMap.set(currentDefenseElement.affectedDefense,
					defensesMap.get(currentDefenseElement.affectedDefense)
					+ levelsInCurrentJob * currentDefenseElement.pointsPerLevel);
			});
		});
	}

	public addJobLevelsToPools(poolsMap: Map<Pools, number>, jobMap: Map<Job, number>)
	{
		jobMap.forEach((levelsInCurrentJob, currentJob) =>
		{
			// Do we need to account for currentJob.affectedPools?
			currentJob.affectedPools.forEach((currentPoolElement) =>
			{
				// TODO: Ensure the value exists in this map now, or this line will result in a NullPointerException...
				poolsMap.set(currentPoolElement.affectedPool,
					poolsMap.get(currentPoolElement.affectedPool)
					+ levelsInCurrentJob * currentPoolElement.pointsPerLevel);
			});
		});
	}
}