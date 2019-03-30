import { Attributes, Defenses, Pools, AttributeKeys } from "../attribute-keys";
import { Job } from "../job";
import { AdventuringJob } from "../adventuring-jobs/adventuring-job";
import { RacialJob } from "../racial-jobs/racial-job";
import { CraftingJob } from "../crafting-jobs/crafting-job";
import { BlankAdventuringJob } from "../adventuring-jobs/blank-adventuring-job";
import { BlankCraftingJob } from "../crafting-jobs/blank-crafting-job";
import { BlankRacialJob } from "../racial-jobs/blank-racial-job";

const ATTRIBUTE_SETS = AttributeKeys.getAttributeSets();

export class Character {

	// TODO: Write support for banking jobs!
	public name: string;
	public title: string;
	primaryRacialJob: RacialJob;
	// TODO: Determine if this is still necessary...
	primaryRacialJobLevel: number;
	supplementalRacialJobLevels: [{job: RacialJob, level: number}];
	adventuringJobLevels: [{job: AdventuringJob, level: number}];
	craftingJobLevels: [{job: CraftingJob, level: number}];

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
	primaryRacialJob: RacialJob,
	levelsInPrimaryRacialJob: number,
	supplementalRacialJobLevels: [{ job: RacialJob; level: number; }],
	adventuringJobLevels: [{ job: AdventuringJob; level: number; }],
	craftingJobLevels: [{ job: CraftingJob; level: number; }] ) {
		this.name = name;
		this.title = title;
		this.primaryRacialJob = primaryRacialJob;
		this.primaryRacialJobLevel = levelsInPrimaryRacialJob;
		this.supplementalRacialJobLevels = supplementalRacialJobLevels
		this.adventuringJobLevels = adventuringJobLevels;
		this.craftingJobLevels = craftingJobLevels;
		this.enforceJobSlotLimits();
		this.recalculateAttributes();
		this.printFullStats();
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
			/*
			for(let indexCounter = this.adventuringJobLevels.length; indexCounter > this.primaryRacialJob.numberOfAdventuringJobSlots; indexCounter--) {
				this.removeSupplementalRacialJobs(indexCounter, 1);
				// TODO: Once banking jobs is supported, consider banking these instead of deleting them...
				// Then, that player can't take levels in those jobs anymore, only re-add them from the bank.
			}
			*/

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
			/*
			for(let indexCounter = this.adventuringJobLevels.length; indexCounter > this.primaryRacialJob.numberOfAdventuringJobSlots; indexCounter--) {
				this.removeAdventuringJobs(indexCounter, 1);
				// TODO: Once banking jobs is supported, consider banking these instead of deleting them...
				// Then, that player can't take levels in those jobs anymore, only re-add them from the bank.
			}
			*/
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
			/*
			for(let indexCounter = this.craftingJobLevels.length; indexCounter > this.primaryRacialJob.numberOfCraftingJobSlots; indexCounter--) {
				this.removeCraftingJobs(indexCounter, 1);
			}
			*/
			this.removeCraftingJobs(this.primaryRacialJob.numberOfCraftingJobSlots, Math.abs(craftingJobSlotDifference));
		}
	}

	public handlePrimaryRaceChange() {
		// TODO: Be sure to account for the difference in the number of
		// adventuring and crafting job slots here!
		// If jobs would be lost then be sure to warn the user!

		/*
		// TODO: Handle the change in supplemental racial jobSlots here...
		if(this.primaryRacialJob.numberOfAdventuringJobSlots === this.previousPrimaryRacialJob.numberOfAdventuringJobSlots) {
			// Do nothing.
		} else if (this.primaryRacialJob.numberOfAdventuringJobSlots > this.previousPrimaryRacialJob.numberOfAdventuringJobSlots) {
			// TODO: Add additional slots
			// Is this actually necessary? I can just "allow" more jobs to be
			// added by placing the restrictions on adding jobs...

			// Or, I can just ignore all tracking on adding, but that would
			// require supporting dead spaces in these arrays.
			// Actually, that's the best option, since I want to allow the user
			// to actually use dropdowns like normal.
			// So, I need to add a default value to the blank dropdowns in
			// character-page-component.html and upgrade recalculateAttributes
			// and the methods it uses so they ignore the empty/null jobs.
		} else {
			for(let indexCounter = this.adventuringJobLevels.length; indexCounter > this.primaryRacialJob.numberOfAdventuringJobSlots; indexCounter--) {
				this.removeAdventuringJob(indexCounter);
			}
		}

		if(this.primaryRacialJob.numberOfCraftingJobSlots === this.previousPrimaryRacialJob.numberOfCraftingJobSlots) {
			// Do nothing.
		} else if (this.primaryRacialJob.numberOfCraftingJobSlots > this.previousPrimaryRacialJob.numberOfCraftingJobSlots) {
			// TODO: Add additional slots
			// Is this actually necessary? I can just "allow" more jobs to be
			// added by placing the restrictions on adding jobs...

			// Or, I can just ignore all tracking on adding, but that would
			// require supporting dead spaces in these arrays.
			// Actually, that's the best option, since I want to allow the user
			// to actually use dropdowns like normal.
			// So, I need to add a default value to the blank dropdowns in
			// character-page-component.html and upgrade recalculateAttributes
			// and the methods it uses so they ignore the empty/null jobs.
		} else {
			for(let indexCounter = this.craftingJobLevels.length; indexCounter > this.primaryRacialJob.numberOfCraftingJobSlots; indexCounter--) {
				this.removeCraftingJob(indexCounter);
			}
		}
		*/
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
		this.addRacialJobLevelsToBaseAttributes(this.baseAttributes);
		this.addRacialJobLevelsToBaseDefenses(this.baseDefenses);
		this.addRacialJobLevelsToPools(this.basePools);

		// TODO: Handle skill-point increases, the initial 2d10 added to your base, and the initial 100 stats added to that...

		// Adding job level-based increases to attributes
		this.addRacialJobLevelsToAttributes_array(this.totalAttributes);
		this.addJobLevelsToAttributes_array(this.totalAttributes, this.adventuringJobLevels);
		this.addJobLevelsToAttributes_array(this.totalAttributes, this.craftingJobLevels);

		// Adding job level-based increases to defenses
		this.addRacialJobLevelsToDefenses_array(this.totalDefenses);
		this.addJobLevelsToDefenses_array(this.totalDefenses, this.adventuringJobLevels);
		this.addJobLevelsToDefenses_array(this.totalDefenses, this.craftingJobLevels);

		// Adding base attributes to totals
		this.addAttributeSetsTogether(this.totalAttributes, this.baseAttributes);

		// Adding base defenses to totals
		this.addDefensesSetsTogether(this.totalDefenses, this.baseDefenses);

		// Calculating pools:
		this.totalPools = this.calcualtePools(this.basePools, this.totalAttributes);

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

	public addRacialJobLevelsToAttributes_array(attributesMap: Map<Attributes, number>)
	{
		this.primaryRacialJob.affectedAttributes.forEach((currentAttributeElement) =>
		{
			attributesMap.set(currentAttributeElement.affectedAttribute,
				attributesMap.get(currentAttributeElement.affectedAttribute)
				+ this.primaryRacialJobLevel * currentAttributeElement.pointsPerLevel);
		});

		this.addJobLevelsToAttributes_array(attributesMap, this.supplementalRacialJobLevels);
	}

	public addJobLevelsToAttributes_array(attributesMap: Map<Attributes, number>, jobArray: [{job: Job, level: number}])
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

	public addJobLevelsToAttributes(attributesMap: Map<Attributes, number>, jobMap: Map<Job, number>)
	{
		jobMap.forEach((levelsInCurrentJob, currentJob) =>
		{
			currentJob.affectedAttributes.forEach((currentAttributeElement) =>
			{
				attributesMap.set(currentAttributeElement.affectedAttribute,
					attributesMap.get(currentAttributeElement.affectedAttribute)
					+ levelsInCurrentJob * currentAttributeElement.pointsPerLevel);
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

	/*
	public addRacialJobLevelsToBaseAttributes_old(attributesMap: Map<Attributes, number>, jobMap: Map<RacialJob, number>)
	{
		jobMap.forEach((levelsInCurrentJob, currentJob) =>
		{
			currentJob.getBaseAttributes().forEach((currentAttributeElement) =>
			{
				attributesMap.set(currentAttributeElement.affectedAttribute,
					attributesMap.get(currentAttributeElement.affectedAttribute)
					+ currentAttributeElement.baseValue);
			});
		});
	}
	*/
	public addRacialJobLevelsToDefenses_array(defensesMap: Map<Defenses, number>)
	{
		this.primaryRacialJob.affectedDefenses.forEach((currentDefenseElement) =>
		{
			defensesMap.set(currentDefenseElement.affectedDefense,
				defensesMap.get(currentDefenseElement.affectedDefense)
				+ this.primaryRacialJobLevel * currentDefenseElement.pointsPerLevel);
		});

		this.addJobLevelsToDefenses_array(this.baseDefenses, this.supplementalRacialJobLevels)
	}

	public addJobLevelsToDefenses_array(defensesMap: Map<Defenses, number>, jobArray: [{job: Job, level: number}])
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

	public addJobLevelsToDefenses(defensesMap: Map<Defenses, number>, jobMap: Map<Job, number>)
	{
		jobMap.forEach((levelsInCurrentJob, currentJob) =>
		{
			currentJob.affectedDefenses.forEach((currentDefenseElement) =>
			{
				defensesMap.set(currentDefenseElement.affectedDefense,
					defensesMap.get(currentDefenseElement.affectedDefense)
					+ levelsInCurrentJob * currentDefenseElement.pointsPerLevel);
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

		this.supplementalRacialJobLevels.forEach((currentJob) =>
		{
			currentJob.job.getBaseDefenses().forEach((currentDefenseElement) =>
			{
				defensesMap.set(currentDefenseElement.affectedDefense,
					defensesMap.get(currentDefenseElement.affectedDefense)
					+ currentDefenseElement.baseValue);
			});
		});
	}

	/**
	 public addRacialJobLevelsToBaseDefenses_old(defensesMap: Map<Defenses, number>, jobMap: Map<RacialJob, number>)
	{
		jobMap.forEach((levelsInCurrentJob, currentJob) =>
		{
			currentJob.getBaseDefenses().forEach((currentDefenseElement) =>
			{
				defensesMap.set(currentDefenseElement.affectedDefense,
					defensesMap.get(currentDefenseElement.affectedDefense)
					+ currentDefenseElement.baseValue);
			});
		});
	}
	 */

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

	/**
	 public addRacialJobLevelsToPools_old(poolsMap: Map<Pools, number>, jobMap: Map<RacialJob, number>)
	{
		jobMap.forEach((levelsInCurrentJob, currentJob) =>
		{
			// Do we need to account for currentJob.affectedPools?
			currentJob.basePools.forEach((currentPoolElement) =>
			{
				poolsMap.set(currentPoolElement.affectedPool,
					poolsMap.get(currentPoolElement.affectedPool)
					+ currentPoolElement.baseValue);
			});
		});
	}
	 */

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
			console.log("supplemental race " + (index + 1) + "["
				+ currentRace.job.name + "], level [" + currentRace.level + "] ");
		});
		console.log("]")

		// FIXME: Prevent BlankAdventuringJob levels from showing up here...
		console.log("adventuring job levels(s): [");
		this.adventuringJobLevels.keys();
		this.adventuringJobLevels.forEach((currentJob) => {
			console.log("Job: [" + currentJob.job.name + "], level [" + currentJob.level + "] ");
		});
		console.log("]")

		// FIXME: Prevent BlankCraftingJob levels from showing up here...
		console.log("crafting job levels(s): [");
		this.craftingJobLevels.forEach((currentJob) => {
			console.log("Job: [" + currentJob.job.name + "], level [" + currentJob.level + "] ");
		});
		console.log("]")
	}
}