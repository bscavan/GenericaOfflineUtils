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
		let baseAttributes: Map<Attributes, number> = new Map();
		let totalAttributes: Map<Attributes, number> = new Map();

		let baseDefenses: Map<Defenses, number> = new Map();
		let totalDefenses: Map<Defenses, number> = new Map();

		// Some races, like manabeasts, have base values added to their pools
		let basePools: Map<Pools, number> = new Map();
		let totalPools: Map<Pools, number> = new Map();
		
		ATTRIBUTE_SETS.forEach((currentAttribute) => {
			baseAttributes.set(currentAttribute.offensiveAttribute, 0);
			totalAttributes.set(currentAttribute.offensiveAttribute, 0);

			baseAttributes.set(currentAttribute.defensiveAttribute, 0);
			totalAttributes.set(currentAttribute.defensiveAttribute, 0);

			baseDefenses.set(currentAttribute.defense, 0);
			totalDefenses.set(currentAttribute.defense, 0);

			basePools.set(currentAttribute.pool, 0);
			totalPools.set(currentAttribute.pool, 0);
		});

		// Adding racial job base values to attributes, defenses, and pools
		this.addRacialJobLevelsToBaseAttributes(baseAttributes, this.racialJobLevels);
		this.addRacialJobLevelsToBaseDefenses(baseDefenses, this.racialJobLevels);
		this.addRacialJobLevelsToPools(basePools, this.racialJobLevels);

		// TODO: Handle skill-point increases, the initial 2d10 added to your base, and the initial 100 stats added to that...

		// Adding job level-based increases to attributes
		this.addJobLevelsToAttributes(totalAttributes, this.racialJobLevels);
		this.addJobLevelsToAttributes(totalAttributes, this.adventuringJobLevels);
		this.addJobLevelsToAttributes(totalAttributes, this.craftingJobLevels);

		// Adding job level-based increases to defenses
		this.addJobLevelsToDefenses(totalDefenses, this.racialJobLevels);
		this.addJobLevelsToDefenses(totalDefenses, this.adventuringJobLevels);
		this.addJobLevelsToDefenses(totalDefenses, this.craftingJobLevels);
		

		// Adding base attributes to totals
		this.addAttributeSetsTogether(totalAttributes, baseAttributes);

		// Adding base defenses to totals
		this.addDefensesSetsTogether(totalDefenses, baseDefenses);

		// Calculating pools:
		totalPools = this.calcualtePools(basePools, totalAttributes);

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
		this.printFullStats(totalAttributes, totalDefenses, totalPools);
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

	private printFullStats(totalAttributes: Map<Attributes, number>,
	totalDefenses: Map<Defenses, number>,
	totalPools: Map<Pools, number>): void {
		console.log("Printing character information:");
		console.log("name: " + this.name);
		console.log("title: " + this.title);
		console.log("stats: [");
		ATTRIBUTE_SETS.forEach((currentAttribute) => {
			console.log("Type: " + currentAttribute.type);

			console.log(currentAttribute.offensiveAttribute + ": "
				+ totalAttributes.get(currentAttribute.offensiveAttribute));
			console.log(currentAttribute.defensiveAttribute + ": "
				+ totalAttributes.get(currentAttribute.defensiveAttribute));
			console.log(currentAttribute.defense + ": "
				+ totalDefenses.get(currentAttribute.defense));
			console.log(currentAttribute.pool + ": "
				+ totalPools.get(currentAttribute.pool));
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