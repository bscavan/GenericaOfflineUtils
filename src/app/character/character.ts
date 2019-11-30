import { Attributes, Defenses, Pools, AttributeKeys } from "../attribute-keys";
import { Job } from "../job";
import { AdventuringJob } from "../adventuring-jobs/adventuring-job";
import { RacialJob } from "../racial-jobs/racial-job";
import { CraftingJob } from "../crafting-jobs/crafting-job";
import { BlankAdventuringJob } from "../adventuring-jobs/blank-adventuring-job";
import { BlankCraftingJob } from "../crafting-jobs/blank-crafting-job";
import { BlankRacialJob } from "../racial-jobs/blank-racial-job";
import { SerializationUtil } from "../serialization-util";
import { Races } from "../racial-jobs/races";
import { Professions } from "../crafting-jobs/professions";
import { AdventuringJobs } from "../adventuring-jobs/adventuring-jobs";
import { JsonSerializable } from "../json-serializable";
import { v4 as uuid } from 'uuid';
import { Skill } from "../skills/skill";

const ATTRIBUTE_SETS = AttributeKeys.getAttributeSets();

export class Character implements JsonSerializable {
	public static readonly LABEL = "character";
	// TODO: Write support for banking jobs!
	public uuid: string;
	public name: string;
	public title: string;
	primaryRacialJob: RacialJob;
	primaryRacialJobLevel: number;
	/* FIXME:
	 * This setup allows for duplicating jobs.
	 * A better approach would probably be to set this up as a map, with the
	 * jobs names being the keys and the combination of Job object and level
	 * being the values.
	 */
	supplementalRacialJobLevels: [{job: RacialJob, level: number}];
	adventuringJobLevels: [{job: AdventuringJob, level: number}];
	craftingJobLevels: [{job: CraftingJob, level: number}];

	protected baseAttributes: Map<Attributes, number> = new Map();
	public initialRandomAttributes: Map<Attributes, number> = new Map();
	public firstSetPointBuyAttributes: Map<Attributes, number> = new Map();
	public secondSetPointBuyAttributes: Map<Attributes, number> = new Map();
	protected totalAttributes: Map<Attributes, number> = new Map();

	protected baseDefenses: Map<Defenses, number> = new Map();
	protected totalDefenses: Map<Defenses, number> = new Map();

	// Some races, like manabeasts, have base values added to their pools
	protected basePools: Map<Pools, number> = new Map();
	protected totalPools: Map<Pools, number> = new Map();

	//TODO: Add support for listing the skills each class brings, along with their levels?
	// These are mapped by their UUID, not their names!
	public classSkills: Map<string, number> = new Map();
	// Generic skills requre a separate collection in skill-service?
	public genericSkills: Map<Skill, number> = new Map();

	// support for spending level points (calculating costs) and grind points (on skills or stats)?

	// TODO: Handle current values of pools?

	// multiple increases/decreases to the same attribute stack.
	protected increasesToAttributes: Map<string, {targetAttribute: Attributes; value: number}>;
	protected decreasesToAttributes: Map<string, {targetAttribute: Attributes; value: number}>;

	// Only the highest buff and highest debuff apply to each attribute
	protected buffsToAttributes: Map<string, {targetAttribute: Attributes; value: number}>;
	protected debuffsToAttributes: Map<string, {targetAttribute: Attributes; value: number}>;

	protected grindPoints: number;
	protected levelPoints: number;

	constructor(name: string, title: string,
	primaryRacialJob: RacialJob,
	levelsInPrimaryRacialJob: number,
	supplementalRacialJobLevels: [{ job: RacialJob; level: number; }],
	adventuringJobLevels: [{ job: AdventuringJob; level: number; }],
	craftingJobLevels: [{ job: CraftingJob; level: number; }],
	grindPoints,
	levelPoints) {
		this.uuid = uuid();
		this.name = name;
		this.title = title;
		this.primaryRacialJob = primaryRacialJob;
		this.primaryRacialJobLevel = levelsInPrimaryRacialJob;
		this.supplementalRacialJobLevels = supplementalRacialJobLevels
		this.adventuringJobLevels = adventuringJobLevels;
		this.craftingJobLevels = craftingJobLevels;

		this.increasesToAttributes = new Map<string, {targetAttribute: Attributes; value: number}>();
		this.decreasesToAttributes = new Map<string, {targetAttribute: Attributes; value: number}>();
		this.buffsToAttributes = new Map<string, {targetAttribute: Attributes; value: number}>();
		this.debuffsToAttributes = new Map<string, {targetAttribute: Attributes; value: number}>();

		this.grindPoints = grindPoints;
		this.levelPoints = levelPoints;

		this.enforceJobSlotLimits();
		this.initializeCharacterGenAttributes();
		// TODO: Add support for setting character gen attributes in this constructor?
		// TODO: Push them into a separate class?
		this.recalculateAttributes();
		this.printFullStats();
		this.classSkills.get("")
	}

	public static generateBlankCharacter(): Character {
		let racial: [{job: RacialJob, level: number}] = [{job: null, level: null}];
		racial.pop();
		let adventuring: [{job: AdventuringJob, level: number}] = [{job: null, level: null}];
		adventuring.pop();
		let crafting: [{job: CraftingJob, level: number}] = [{job: null, level: null}];
		crafting.pop();

		return new Character("", "", BlankRacialJob.generateBlankRacialJob(),
		0, racial, adventuring, crafting, 0, 0);
	}

	public addRacialJobLevels(newJob: RacialJob, levelsTaken: number) {
		if(this.primaryRacialJob == null) {
			this.primaryRacialJob = newJob;
			this.primaryRacialJobLevel = levelsTaken;
		} else if(this.primaryRacialJob == newJob) {
			this.primaryRacialJobLevel = levelsTaken;
		} else {
			let indexOfJob = this.findJobIndex(this.supplementalRacialJobLevels, newJob);

			// If newJob is a BlankRacialJob, then the normal limit doesn't apply to it...
			if(newJob instanceof BlankRacialJob == false && indexOfJob >= 0) {
				// TODO: Move this assignment to a helper method...
				this.supplementalRacialJobLevels[indexOfJob] = {
					job: newJob,
					level: levelsTaken
				}
			} else if(this.supplementalRacialJobLevels.length < this.primaryRacialJob.numberOfsupplementalRacialJobSlots) {
				this.supplementalRacialJobLevels.push({job: newJob, level: levelsTaken});
			} else {
				console.error("Attempted to add a new RacialJob when the maximum number of jobs has already been reached.")
				return;
			}
		}

		this.recalculateAttributes();
	}

	// Note: this assumes the user isn't being an idiot, entering a negative job slot or something...
	// TODO: Add defensive coding here.
	public removeSupplementalRacialJobs(jobSlot: number, jobsToRemove) {
		this.supplementalRacialJobLevels.splice(jobSlot, jobsToRemove);
	}

	/*
	 * TODO: Make sure to visibly warn the user if they're about to remove the
	 * primary racial job, as this will clear out all of the other jobs...
	 */
	public removeSpecificRacialJob(jobToRemove: RacialJob) {
		if(this.primaryRacialJob == jobToRemove) {
			if(this.supplementalRacialJobLevels.length <= 0) {
				this.primaryRacialJob = null;
				this.primaryRacialJobLevel = 0;
			} else {
				// TODO: Warn the user here!
				// TODO: Handle emptying out the other racial jobs and all of
				// the adventuring and crafting jobs lists here.
			}
		} else {
			let indexOfJob = this.findJobIndex(this.supplementalRacialJobLevels, jobToRemove);

			if(indexOfJob <= 0) {
				this.supplementalRacialJobLevels.splice(indexOfJob, 1);
			} else {
				console.error("Attempted to remove a racial job: ["
					+ jobToRemove.name
					+ "] from the character named: ["
					+ this.name
					+ "], but they had no levels in this job.")
			}
		}

		this.recalculateAttributes();
	}

	private enforceJobSlotLimits() {
		let supplementalRacialJobSlotDifference = this.primaryRacialJob.numberOfsupplementalRacialJobSlots - this.supplementalRacialJobLevels.length;
		
		if(supplementalRacialJobSlotDifference === 0) {
			// Do nothing.
		} else if (supplementalRacialJobSlotDifference > 0) {
			for(let counter = 0; counter < supplementalRacialJobSlotDifference; counter++) {
				this.addRacialJobLevels(BlankRacialJob.getBlankRacialJob(), 0);
			}
		} else {
			this.removeSupplementalRacialJobs(this.primaryRacialJob.numberOfsupplementalRacialJobSlots, supplementalRacialJobSlotDifference);
		}

		let adventuringJobSlotDifference = this.primaryRacialJob.numberOfAdventuringJobSlots - this.adventuringJobLevels.length;

		if(adventuringJobSlotDifference === 0) {
			// Do nothing.
		} else if (adventuringJobSlotDifference > 0) {
			for(let counter = 0; counter < adventuringJobSlotDifference; counter++) {
				this.addAdventuringJob(BlankAdventuringJob.getBlankAdventuringJob(), 0);
			}
		} else {
			this.removeAdventuringJobs(this.primaryRacialJob.numberOfAdventuringJobSlots, Math.abs(adventuringJobSlotDifference));
		}

		let craftingJobSlotDifference = this.primaryRacialJob.numberOfCraftingJobSlots - this.craftingJobLevels.length;

		if(craftingJobSlotDifference === 0) {
			// Do nothing.
		} else if (craftingJobSlotDifference > 0) {
			for(let counter = 0; counter < craftingJobSlotDifference; counter++) {
				this.addCraftingJob(BlankCraftingJob.getBlankCraftingJob(), 0);
			}
		} else {
			this.removeCraftingJobs(this.primaryRacialJob.numberOfCraftingJobSlots, Math.abs(craftingJobSlotDifference));
		}
	}

	public handlePrimaryRaceChange() {
		this.enforceJobSlotLimits();
		this.recalculateAttributes();
	}

	// TODO: Make this method header less ugly...
	private findJobIndex(jobArray: [{
		job: Job;
		level: number;
	}], jobToFind: Job): number {
		let indexOfJob = -1;

		jobArray.forEach((currentJob, currentIndex) => {
			if(currentJob.job == jobToFind) {
				indexOfJob = currentIndex;
				return;
			}
		})

		return indexOfJob;
	}

	public static makeAdventuringJobObject(newJob: AdventuringJob, levelsTaken: number) {
		return {job: newJob, level: levelsTaken}
	}

	public static makeCraftingJobObject(newJob: CraftingJob, levelsTaken: number) {
		return {job: newJob, level: levelsTaken}
	}

	public addIncrease(increaseSourceName: string, targetAttribute: Attributes, value: number) {
		this.increasesToAttributes.set(increaseSourceName, {targetAttribute, value});
	}

	public addAdventuringJob(newJob: AdventuringJob, levelsTaken: number) {
		let indexFound = this.indexOfJob(newJob, this.adventuringJobLevels);

		// If newJob is a BlankAdventuringJob, then the normal limit doesn't apply to it...
		if(newJob.name !== "" && indexFound >= 0) {
			this.setAdventuringJobLevel(indexFound, newJob, levelsTaken);
		} else if(this.adventuringJobLevels.length < this.primaryRacialJob.numberOfAdventuringJobSlots) {
			this.adventuringJobLevels.push(Character.makeAdventuringJobObject(newJob, levelsTaken));
		} else {
			console.error("Failed to add new adventuring Job: [" + newJob.name
				+ "] because the maximum number of adventuring jobs has already been reached.")
		}
	}

	public setAdventuringJobLevel(jobSlot: number, newJob: AdventuringJob, levelsTaken: number) {
		this.adventuringJobLevels[jobSlot] = Character.makeAdventuringJobObject(newJob, levelsTaken);
		this.recalculateAttributes();
	}

	public removeAdventuringJobs(jobSlot: number, jobsToRemove) {
		this.adventuringJobLevels.splice(jobSlot, jobsToRemove);
		//this.recalculateAttributes();
	}

	public addCraftingJob(newJob: CraftingJob, levelsTaken: number) {
		let indexFound = this.indexOfJob(newJob, this.craftingJobLevels);

		// If newJob is a BlankCraftingJob, then the normal limit doesn't apply to it...
		// FIXME: Get this working with "newJob instanceof BlankCraftingJob"
		if(newJob.name !== "" && indexFound >= 0) {
			this.setCraftingJobLevel(indexFound, newJob, levelsTaken);
		} else if(this.craftingJobLevels.length < this.primaryRacialJob.numberOfCraftingJobSlots) {
			this.craftingJobLevels.push(Character.makeCraftingJobObject(newJob, levelsTaken));
		} else {
			console.error("Failed to add new crafting Job: [" + newJob.name
				+ "] because the maximum number of crafting jobs has already been reached.")
		}
	}

	public setCraftingJobLevel(jobSlot: number, newJob: AdventuringJob, levelsTaken: number) {
		this.craftingJobLevels[jobSlot] = Character.makeCraftingJobObject(newJob, levelsTaken);
		this.recalculateAttributes();
	}

	public removeCraftingJobs(jobSlot: number, jobsToRemove) {
		this.craftingJobLevels.splice(jobSlot, jobsToRemove);
		//this.recalculateAttributes();
	}

	// Searches for a particular job in an array of {job, level} objects
	public indexOfJob(needle: Job, haystack) {
		let indexFound = -1;

		haystack.forEach((element, currentIndex) => {
			if(element.job === needle) {
				indexFound = currentIndex;
				return;
			}
		});
		
		return indexFound;
	}

	private initializeCharacterGenAttributes() {
		this.initialRandomAttributes = new Map();
		this.firstSetPointBuyAttributes = new Map();
		this.secondSetPointBuyAttributes = new Map();

		ATTRIBUTE_SETS.forEach((currentAttribute) => {
			this.initialRandomAttributes.set(currentAttribute.offensiveAttribute, 0);
			this.initialRandomAttributes.set(currentAttribute.defensiveAttribute, 0);

			this.firstSetPointBuyAttributes.set(currentAttribute.offensiveAttribute, 0);
			this.firstSetPointBuyAttributes.set(currentAttribute.defensiveAttribute, 0);

			this.secondSetPointBuyAttributes.set(currentAttribute.offensiveAttribute, 0);
			this.secondSetPointBuyAttributes.set(currentAttribute.defensiveAttribute, 0);
		});
	}

	public recalculateAttributes() {
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
		this.addRacialJobLevelsToBaseAttributes(this.baseAttributes);
		this.addRacialJobLevelsToBaseDefenses(this.baseDefenses);
		this.addRacialJobLevelsToPools(this.basePools);

		// TODO: Handle skill-point increases, the initial 2d10 added to your base, and the initial 100 stats added to that...

		// Adding job level-based increases to attributes
		this.addRacialJobLevelsToAttributes(this.totalAttributes);
		this.addJobLevelsToAttributes(this.totalAttributes, this.adventuringJobLevels);
		this.addJobLevelsToAttributes(this.totalAttributes, this.craftingJobLevels);

		// Adding job level-based increases to defenses
		this.addRacialJobLevelsToDefenses(this.totalDefenses);
		this.addJobLevelsToDefenses(this.totalDefenses, this.adventuringJobLevels);
		this.addJobLevelsToDefenses(this.totalDefenses, this.craftingJobLevels);

		this.addAttributeSetsTogether(this.totalAttributes, this.initialRandomAttributes);
		this.addAttributeSetsTogether(this.totalAttributes, this.firstSetPointBuyAttributes);
		this.addAttributeSetsTogether(this.totalAttributes, this.secondSetPointBuyAttributes);

		// Adding base attributes to totals
		this.addAttributeSetsTogether(this.totalAttributes, this.baseAttributes);

		// Adding base defenses to totals
		this.addDefensesSetsTogether(this.totalDefenses, this.baseDefenses);

		// Calculating pools:
		this.totalPools = this.calcualtePools(this.basePools, this.totalAttributes);

		// TODO: Handle the fact that "Beastkin" is a mix of Human and a beast. (only Humans work as the base)
		//TODO: Check and update FATE, as it's a special case!

		//TODO: Write a helper method to apply increases.

		//TODO: Write a helper method to apply the highest buff affecting each stat.

		//TODO: Handle how some increases/buffs don't affect an attribute's pool.

		// TODO: Apply equipment here?
		// Should that just fall under increases?
		// Should they get a list of equip slots?

		// TODO: Handle racial stat caps, like Beast's max INT, and Peskie's max STR
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

	public addRacialJobLevelsToAttributes(attributesMap: Map<Attributes, number>)
	{
		this.primaryRacialJob.affectedAttributes.forEach((currentAttributeElement) =>
		{
			attributesMap.set(currentAttributeElement.affectedAttribute,
				attributesMap.get(currentAttributeElement.affectedAttribute)
				+ this.primaryRacialJobLevel * currentAttributeElement.pointsPerLevel);
		});

		this.addJobLevelsToAttributes(attributesMap, this.supplementalRacialJobLevels);
	}

	public addJobLevelsToAttributes(attributesMap: Map<Attributes, number>, jobArray: [{job: Job, level: number}])
	{
		jobArray.forEach((currentJob) =>
		{
			currentJob.job.affectedAttributes.forEach((currentAttributeElement) =>
			{
				attributesMap.set(currentAttributeElement.affectedAttribute,
					attributesMap.get(currentAttributeElement.affectedAttribute)
					+ currentJob.level * currentAttributeElement.pointsPerLevel);
			});
		});
	}

	public addRacialJobLevelsToBaseAttributes(attributesMap: Map<Attributes, number>)
	{
		this.primaryRacialJob.getBaseAttributes().forEach((currentAttributeElement) =>
		{
			attributesMap.set(currentAttributeElement.affectedAttribute,
				attributesMap.get(currentAttributeElement.affectedAttribute)
				+ currentAttributeElement.baseValue);
		});


		this.supplementalRacialJobLevels.forEach((currentJob) =>
		{
			currentJob.job.getBaseAttributes().forEach((currentAttributeElement) =>
			{
				attributesMap.set(currentAttributeElement.affectedAttribute,
					attributesMap.get(currentAttributeElement.affectedAttribute)
					+ currentAttributeElement.baseValue);
			});
		});
	}

	public addRacialJobLevelsToDefenses(defensesMap: Map<Defenses, number>)
	{
		this.primaryRacialJob.affectedDefenses.forEach((currentDefenseElement) =>
		{
			defensesMap.set(currentDefenseElement.affectedDefense,
				defensesMap.get(currentDefenseElement.affectedDefense)
				+ this.primaryRacialJobLevel * currentDefenseElement.pointsPerLevel);
		});

		this.addJobLevelsToDefenses(this.baseDefenses, this.supplementalRacialJobLevels)
	}

	public addJobLevelsToDefenses(defensesMap: Map<Defenses, number>, jobArray: [{job: Job, level: number}])
	{
		jobArray.forEach((currentJob) =>
		{
			currentJob.job.affectedDefenses.forEach((currentDefenseElement) =>
			{
				defensesMap.set(currentDefenseElement.affectedDefense,
					defensesMap.get(currentDefenseElement.affectedDefense)
					+ currentJob.level * currentDefenseElement.pointsPerLevel);
			});
		});
	}

	public addRacialJobLevelsToBaseDefenses(defensesMap: Map<Defenses, number>)
	{
		this.primaryRacialJob.getBaseDefenses().forEach((currentDefenseElement) =>
		{
			defensesMap.set(currentDefenseElement.affectedDefense,
				defensesMap.get(currentDefenseElement.affectedDefense)
				+ currentDefenseElement.baseValue);
		});

		/**
		 * According to page 24 of the alpha rules, doll haunters don't
		 * add both parent's defenses together, they take the highest one.
		 * The same holds true for Toy Golems, as seen on page 32.
		 */
		this.supplementalRacialJobLevels.forEach((currentJob) =>
		{
			currentJob.job.getBaseDefenses().forEach((currentDefenseElement) =>
			{
				if(defensesMap.get(currentDefenseElement.affectedDefense) < currentDefenseElement.baseValue)
				{
					defensesMap.set(currentDefenseElement.affectedDefense,
						currentDefenseElement.baseValue);
				}
			});
		});
	}

	public addRacialJobLevelsToPools(poolsMap: Map<Pools, number>)
	{
		this.primaryRacialJob.basePools.forEach((currentPoolElement) =>
		{
			poolsMap.set(currentPoolElement.affectedPool,
				poolsMap.get(currentPoolElement.affectedPool)
				+ currentPoolElement.baseValue);
		});

		this.supplementalRacialJobLevels.forEach((currentJob) =>
		{
			// Do we need to account for currentJob.affectedPools?
			currentJob.job.basePools.forEach((currentPoolElement) =>
			{
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
		console.log("primary race: [" + this.primaryRacialJob.name
			+ "], level: [" + this.primaryRacialJobLevel + "];")

		this.supplementalRacialJobLevels.forEach((currentRace, index) => {
			if(currentRace.job.name.trim() !== "") {
				console.log("supplemental race " + (index + 1) + "["
					+ currentRace.job.name + "], level [" + currentRace.level + "] ");
			}
		});
		console.log("]")

		console.log("adventuring job levels(s): [");
		this.adventuringJobLevels.keys();
		this.adventuringJobLevels.forEach((currentJob) => {
			if(currentJob.job.name.trim() !== "") {
				console.log("Job: [" + currentJob.job.name + "], level [" + currentJob.level + "] ");
			}
		});
		console.log("]")

		console.log("crafting job levels(s): [");
		this.craftingJobLevels.forEach((currentJob) => {
			if(currentJob.job.name.trim() !== "") {
				console.log("Job: [" + currentJob.job.name + "], level [" + currentJob.level + "] ");
			}
		});
		console.log("]")
	}

	// TODO: Migrate all of these serialization methods into a helper class.
	public serializeJobItemArray(JobItemsArray) {
		let jobsJsonArray = [];

		JobItemsArray.forEach((currentJob) => {
			jobsJsonArray.push({job: currentJob.job.serializeToJSON(), level: currentJob.level})
		});

		return jobsJsonArray;
	}

	public deserializeAdventuringJobItemArray(json) {
		let jobItemsArray: [{job: AdventuringJob, level: number}] = [{job: null, level: null}];
		jobItemsArray.pop();

		for(let currentIndex in json) {
			let currentJobJson = json[currentIndex];
			let currentJob = AdventuringJobs.deserializeAdventuringJob(currentJobJson.job);
			jobItemsArray.push({job: currentJob, level: currentJobJson.level});;
		}

		return jobItemsArray;
	}

	public deserializeCraftingJobItemArray(json) {
		let jobItemsArray: [{job: CraftingJob, level: number}] = [{job: null, level: null}];
		jobItemsArray.pop();

		for(let currentIndex in json) {
			let currentJobJson = json[currentIndex];
			let currentJob = Professions.deserializeCraftingJob(currentJobJson.job);
			jobItemsArray.push({job: currentJob, level: currentJobJson.level});;
		}

		return jobItemsArray;
	}

	public deserializeRacialJobItemArray(json) {
		let jobItemsArray: [{job: RacialJob, level: number}] = [{job: null, level: null}];
		jobItemsArray.pop();

		for(let currentIndex in json) {
			let currentJobJson = json[currentIndex];
			let currentJob = Races.deserializeRacialJob(currentJobJson.job);
			jobItemsArray.push({job: currentJob, level: currentJobJson.level});
		}

		return jobItemsArray;
	}

	public serializeAdjustmentMap(attributeAdjustmentMap: Map<string, {targetAttribute: Attributes; value: number}>) {
		let json = {};

		attributeAdjustmentMap.forEach((currentValue, currentKey) =>{
			json[currentKey] =
			{
				targetAttribute: currentValue.targetAttribute.toString(),
				value: currentValue.value
			}
		});

		return json;
	}

	public deserializeAdjustmentMap(attributeAdjustmentJson) {
		let attributeAdjustmentMap : Map<string, {targetAttribute: Attributes; value: number}> = new Map();

		for(let adjustmentKey in attributeAdjustmentJson) {
			let currentAdjustmentJson = attributeAdjustmentJson[adjustmentKey];
			let attributeKey = currentAdjustmentJson.targetAttribute;

			// This is a means of converting a string into the matching enum type.
			let attributeValue: Attributes = (<any>Attributes)[attributeKey];

			attributeAdjustmentMap.set(adjustmentKey, {targetAttribute: attributeValue, value: currentAdjustmentJson.value});
		}

		return attributeAdjustmentMap;
	}

	public serializeToJSON() {
		let json = {};

		json["uuid"] = this.uuid;
		json["name"] = this.name;
		json["title"] = this.title;
		json["primaryRacialJob"] = this.primaryRacialJob.serializeToJSON();
		json["primaryRacialJobLevel"] = this.primaryRacialJobLevel;

		json["supplementalRacialJobLevels"] = this.serializeJobItemArray(this.supplementalRacialJobLevels);
		json["adventuringJobLevels"] = this.serializeJobItemArray(this.adventuringJobLevels);
		json["craftingJobLevels"] = this.serializeJobItemArray(this.craftingJobLevels);

		json["baseAttributes"] = SerializationUtil.serializeMap(this.baseAttributes);
		json["initialRandomAttributes"] = SerializationUtil.serializeMap(this.initialRandomAttributes);
		json["firstSetPointBuyAttributes"] = SerializationUtil.serializeMap(this.firstSetPointBuyAttributes);
		json["secondSetPointBuyAttributes"] = SerializationUtil.serializeMap(this.secondSetPointBuyAttributes);
		json["totalAttributes"] = SerializationUtil.serializeMap(this.totalAttributes);

		json["baseDefenses"] = SerializationUtil.serializeMap(this.baseDefenses);
		json["totalDefenses"] = SerializationUtil.serializeMap(this.totalDefenses);

		json["basePools"] = SerializationUtil.serializeMap(this.basePools);
		json["totalPools"] = SerializationUtil.serializeMap(this.totalPools);

		json["increasesToAttributes"] = this.serializeAdjustmentMap(this.increasesToAttributes);
		json["decreasesToAttributes"] = this.serializeAdjustmentMap(this.decreasesToAttributes);

		json["buffsToAttributes"] = this.serializeAdjustmentMap(this.buffsToAttributes);
		json["debuffsToAttributes"] = this.serializeAdjustmentMap(this.debuffsToAttributes);

		json["grindPoints"] = this.grindPoints;
		json["levelPoints"] = this.levelPoints;

		json["classSkills"] = SerializationUtil.serializeMap(this.classSkills);

		return json;
	}

	public deserializeSkillsMap(mapToDeserialize: Map<string, number>) {
		let returnMap = new Map<string, number>();

		for(let key in mapToDeserialize) {
			returnMap.set(key, mapToDeserialize[key]);
		}

		return returnMap;
	}

	/*
	 * FIXME: This method is very fragile. Rework it to handle malformed sections of JSON.
	 */
	public deserializeFromJSON(json) {
		this.uuid = json.uuid;
		this.name = json.name;
		this.title = json.title;

		this.primaryRacialJob = Races.deserializeRacialJob(json.primaryRacialJob);
		this.primaryRacialJobLevel = json.primaryRacialJobLevel;

		this.supplementalRacialJobLevels = this.deserializeRacialJobItemArray(json.supplementalRacialJobLevels);
		this.adventuringJobLevels = this.deserializeAdventuringJobItemArray(json.adventuringJobLevels);
		this.craftingJobLevels = this.deserializeCraftingJobItemArray(json.craftingJobLevels);

		this.initialRandomAttributes = SerializationUtil.deserializeAttributesMap(json.initialRandomAttributes);
		this.firstSetPointBuyAttributes = SerializationUtil.deserializeAttributesMap(json.firstSetPointBuyAttributes);
		this.secondSetPointBuyAttributes = SerializationUtil.deserializeAttributesMap(json.secondSetPointBuyAttributes);

		this.increasesToAttributes = this.deserializeAdjustmentMap(json.increasesToAttributes);
		this.decreasesToAttributes = this.deserializeAdjustmentMap(json.decreasesToAttributes);

		this.buffsToAttributes = this.deserializeAdjustmentMap(this.buffsToAttributes);
		this.debuffsToAttributes = this.deserializeAdjustmentMap(this.debuffsToAttributes);

		this.grindPoints = json.grindPoints;
		this.levelPoints = json.levelPoints;

		this.classSkills = this.deserializeSkillsMap(json.classSkills);

		this.recalculateAttributes();

		return this;
	}

	public getLabel() {
		return Job.LABEL;
	}
}
