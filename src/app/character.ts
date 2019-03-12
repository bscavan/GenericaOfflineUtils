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

		// TODO: apply racial base attributes (ex: 25's across the board for humans...)
		/*
		this.racialJobLevels.forEach((currentRacialJob) => {
			currentRacialJob.
		})
		*/
		console.log("printing keys of racial job levels:")
		let racialJobIterator = this.racialJobLevels.keys();
		let racialJobIteratorResult = racialJobIterator.next();

		// Iterate over all racial jobs
		while(racialJobIteratorResult.done == false) {
			let currentJob = racialJobIteratorResult.value;
			let currentJobLevel = this.racialJobLevels.get(currentJob);
			console.log("Job: [" + currentJob.name + "], level: [" + currentJobLevel + "];")

			// TODO: Disect these sections and convert them to helper methods...
			// This will help you handle applying the same approach to the adventuring and crafting jobs...
			let baseAttributeIterator = currentJob.getBaseAttributes().keys();
			let baseAttributeIteratorResult = baseAttributeIterator.next();

			// Iterate over each base attribute value the current job increases
			while(baseAttributeIteratorResult.done == false) {
				// Increase the current base attribute by the amount this class provides...
				let currentBaseAttribute = baseAttributeIteratorResult.value;
				let currentBaseAttributeValue = baseAttributes.get(currentBaseAttribute.affectedAttribute)
					+ (currentBaseAttribute.baseValue);
				baseAttributes.set(currentBaseAttribute.affectedAttribute, currentBaseAttributeValue);
				baseAttributeIteratorResult = baseAttributeIterator.next();
			}

			let attributeIterator = currentJob.affectedAttributes.keys();
			let attributeIteratorResult = attributeIterator.next();

			// Iterate over each attribute the current job increases
			while(attributeIteratorResult.done == false) {
				// Increase the current attribute by the amount this many levels in this class provides...
				let currentAffectedAttribute = attributeIteratorResult.value;
				let currentAttributeValue = totalAttributes.get(currentAffectedAttribute.affectedAttribute);
				currentAttributeValue = currentAttributeValue + (currentAffectedAttribute.pointsPerLevel * currentJobLevel);
				totalAttributes.set(currentAffectedAttribute.affectedAttribute, currentAttributeValue);
				attributeIteratorResult = attributeIterator.next();
			}

			let baseDefensesIterator = currentJob.getBaseDefenses().keys();
			let baseDefensesIteratorResult = baseDefensesIterator.next();

			// Iterate over each base defense value the current job increases
			while(baseDefensesIteratorResult.done == false) {
				// Increase the current base defense by the amount this class provides...
				let currentBaseAttribute = baseDefensesIteratorResult.value;
				let currentBaseAttributeValue = baseDefenses.get(currentBaseAttribute.affectedDefense)
					+ (currentBaseAttribute.baseValue);
				baseDefenses.set(currentBaseAttribute.affectedDefense, currentBaseAttributeValue);
				baseDefensesIteratorResult = baseDefensesIterator.next();
			}

			racialJobIteratorResult = racialJobIterator.next();
		}
		/*
		let racialJobKeys = Object.keys(this.racialJobLevels);
		racialJobKeys.forEach((currentKey, currentIndex) =>
			{
				console.log("Current Key: [" + currentKey + "]; Current value: ["
				//+ this.racialJobLevels.get(currentKey) + "];"
				);
				console.log("Current Index: [" + currentIndex + "];");
			}
		);*/

		/*
		baseAttributes.forEach((value, currentAttribute) => {
			totalAttributes.set(currentAttribute, value);
		});
		*/

		// Handle base attributes and defenses (set by race):
		this.addJobLevelsToAttributes(baseAttributes, this.racialJobLevels);
		this.addJobLevelsToDefenses(baseDefenses, this.racialJobLevels);
		// TODO: Add racial job levels to pools

		// TODO: Handle skill-point increases, the initial 2d10 added to your base, and the initial 100 stats added to that...

		// Handle non-racial job-increased attributes
		// TODO: Add racial job levels to pools
		this.addJobLevelsToAttributes(totalAttributes, this.adventuringJobLevels);
		this.addJobLevelsToAttributes(totalAttributes, this.craftingJobLevels);
		this.addJobLevelsToDefenses(totalDefenses, this.adventuringJobLevels);
		this.addJobLevelsToDefenses(totalDefenses, this.craftingJobLevels);

		// Add base attributes and defenses to totals:
		this.addAttributeSetsTogether(totalAttributes, baseAttributes);

		// Add defenses together:
		this.addDefensesSetsTogether(totalDefenses, baseDefenses);

		// Calculate pools:
		totalPools = this.calcualtePools(basePools, totalAttributes);

		//TODO: Check and update FATE, as it's a special case!

		//TODO: Write a method to apply increases and put that code in a helper method.

		//TODO: Write a method to apply the highest buff affecting each stat and put that code in a helper method.

		//TODO: Handle how some increases/buffs don't affect an attribute's pool.

		// TODO: Apply equipment here?
		// Should that just fall under increases?
		// Should they get a list of equip slots?


		// FIXME: this method is useless right now.
		// It doesn't do anything permenant...

		// Print stats here:
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

	public addJobLevelsToPools(poolsMap: Map<Pools, number>, jobMap: Map<Job, number>)
	{
		// FIXME: Rewrite this method.
		/*
		jobMap.forEach((levelsInCurrentJob, currentJob) =>
		{
			// Do we need to account for currentJob.affectedPools?
			currentJob.basePools.forEach((currentPoolElement) =>
			{
				// TODO: Ensure the value exists in this map now, or this line will result in a NullPointerException...
				poolsMap.set(currentPoolElement.affectedPool,
					poolsMap.get(currentPoolElement.affectedPool)
					+ levelsInCurrentJob * currentPoolElement.pointsPerLevel);
			});
		});
		*/
	}
}