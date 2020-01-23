import { Component, OnInit } from '@angular/core';
import { Job } from '../job';
import { Attributes, Defenses, Pools } from '../attribute-keys';
import * as FileSaver from 'file-saver';
import { AdventuringJobs } from '../adventuring-jobs/adventuring-jobs';
import { JobService } from '../job-service';
import { Professions } from '../crafting-jobs/professions';
import { Races } from '../racial-jobs/races';
import { JobTypes } from '../shared-constants'
import { RacialJob } from '../racial-jobs/racial-job';
import { JobWithBaseAttributes, isJobWithBaseAttributes } from '../racial-jobs/job-with-base-attributes';
import { CharacterService } from '../character/character-service';
import { SkillService } from '../skills/skill-service';
import { Skill, Qualifier, Currency, SpecialCost } from '../skills/skill';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-job-page',
  templateUrl: './job-page.component.html',
  styleUrls: ['./job-page.component.css']
})
export class JobPageComponent implements OnInit {
	public readonly LABEL = Job.LABEL;

	// These values are here so the skill section can recognize
	// them and handle displaying them differently.
	public NONE_QUALIFIER = Qualifier.NONE;
	public NONE_QUALIFIER_SPECIAL_COST = SpecialCost.NONE;
	public N_A_QUALIFIER = Currency.NOT_APPLICABLE;


	// This value exists to a ngbRadio group in the html will have something to bind to.
	// Its value is never important.
	public radioButtoSelection: number;

	public currentJob: Job;
	public currentJobsList: Job[];
	// TODO: Keep this list sorted alphabetically?
	public orderedAttributes: {affectedAttribute: Attributes; pointsPerLevel: number;}[] = [];
	public orderedBaseAttributes: {affectedAttribute: Attributes; baseValue: number;}[] = [];
	public orderedAffectedDefenses: {affectedDefense: Defenses, pointsPerLevel: number}[] = [];
	public orderedBaseDefenses: {affectedDefense: Defenses, baseValue: number}[] = [];
	public orderedBasePools: {affectedPool: Pools, baseValue: number}[];

	public adventuringJobSlotsOnDisplay;
	public craftingJobSlotsOnDisplay;

	public selectedJobType: JobTypes;

	public selectedSkillUUID;
	public selectedSkillLevel;
	public displaySkillSelect = false;

	public static job_service: JobService;

	constructor(private jobService: JobService, private characterService: CharacterService) {
		JobPageComponent.job_service = jobService;
	}

	ngOnInit() {
		this.selectedJobType = JobTypes.ADVENTURING_JOB;
		// TODO: Add a step to automatically click the Adventuring Job button here.

		this.resetOrderedAttributes();
		this.resetCurrentJobsList();
	}

	// TODO: Expand out from just orderedAttributes, eventually covering all of the features of the three job types...
	// TODO: Rename this resetAllAttributes()?
	public resetOrderedAttributes() {
		this.currentJob = this.jobService.getCurrentJob(this.selectedJobType);
		this.recreateOrderedAttributes();
	}

	recreateOrderedAttributes() {
		this.orderedAttributes = [];
		this.orderedBaseAttributes = [];
		this.orderedAffectedDefenses = []
		this.orderedBaseDefenses = [];
		this.orderedBasePools = [];

		this.currentJob.affectedAttributes.forEach((currentElement) => {
			this.orderedAttributes.push(currentElement);
		});

		this.currentJob.affectedDefenses.forEach((currentElement) => {
			this.orderedAffectedDefenses.push(currentElement);
		});

		this.currentJob.basePools.forEach((currentElement) => {
			this.orderedBasePools.push(currentElement);
		});

		if(isJobWithBaseAttributes(this.currentJob)) {
			/*
			 * Note, TS won't allow for a direct cast in this instance because
			 * it "may be a mistake." However, if we first cast to "any" then
			 * it's "A-OK"
			 */
			let jobInProgress = this.currentJob as any as JobWithBaseAttributes;

			jobInProgress.getBaseAttributes().forEach((currentElement) => {
				this.orderedBaseAttributes.push(currentElement);
			});

			// TODO: Consider splitting baseDefenses off from JobWithBaseAttributes.

			jobInProgress.getBaseDefenses().forEach((currentElement) => {
				this.orderedBaseDefenses.push(currentElement);
			});
		}
	}

	public clearOrderedAttributes() {
		this.currentJob = this.jobService.getCurrentJob(this.selectedJobType);
		this.orderedAttributes = [];
		this.orderedBaseAttributes = [];
		this.orderedAffectedDefenses = [];
		this.orderedBaseDefenses = [];

		// Set<{affectedAttribute: Attributes, pointsPerLevel: number}>;
		this.currentJob.affectedAttributes.forEach((currentElement) => {
			let newCurrentElement = {
				affectedAttribute: currentElement.affectedAttribute,
				pointsPerLevel: 0
			}
			this.orderedAttributes.push(newCurrentElement);
		});

		// TODO: Add a method of controlling whether or not affectedDefenses
		// are displayed in the UI.
		this.currentJob.affectedDefenses.forEach((currentElement) => {
			let newCurrentElement = {
				affectedDefense: currentElement.affectedDefense,
				pointsPerLevel: 0
			}
			this.orderedAffectedDefenses.push(newCurrentElement);
		});

		this.currentJob.basePools.forEach((currentElement) => {
			let newPoolElement = {
				affectedPool: currentElement.affectedPool,
				baseValue: 0
			};

			this.orderedBasePools.push(newPoolElement);
		});

		if(isJobWithBaseAttributes(this.currentJob)) {
			/*
			 * Note, TS won't allow for a direct cast in this instance because
			 * it "may be a mistake." However, if we first cast to "any" then
			 * it's "A-OK"
			 */
			let jobInProgress = this.currentJob as any as JobWithBaseAttributes;
			jobInProgress.getBaseAttributes().forEach((currentElement) => {
				let newCurrentElement = {
					affectedAttribute: currentElement.affectedAttribute,
					baseValue: 0
				}
				this.orderedBaseAttributes.push(newCurrentElement);
			});

			jobInProgress.getBaseDefenses().forEach((currentElement) => {
				let newCurrentElement = {
					affectedDefense: currentElement.affectedDefense,
					baseValue: 0
				}
				this.orderedBaseDefenses.push(newCurrentElement);
			});
		}
	}

	// FIXME: Currently these callbacks are not working.
	// It is related to the fact that they are being executed in a nested component.
	public adventuringJobCallback(adventuringJob: Job) {
		JobPageComponent.job_service.uploadJobIntoCollection(adventuringJob);
	}

	// FIXME: Currently these callbacks are not working.
	// It is related to the fact that they are being executed in a nested component.
	public craftingJobCallback(craftingJob: Job) {
		JobPageComponent.job_service.uploadJobIntoCollection(craftingJob);
	}

	// FIXME: Currently these callbacks are not working.
	// It is related to the fact that they are being executed in a nested component.
	public racialJobCallback(racialJob: Job) {
		JobPageComponent.job_service.uploadJobIntoCollection(racialJob);
	}

	resetCurrentJobsList() {
		switch(this.selectedJobType) {
			case JobTypes.ADVENTURING_JOB:
				this.currentJobsList = AdventuringJobs.getAllAdventuringJobs();
				break;

			case JobTypes.CRAFTING_JOB:
				this.currentJobsList = Professions.getAllCraftingJobs();
				break;

			case JobTypes.RACIAL_JOB:
				this.currentJobsList = Races.getAllRaces();
				break;
		}
	}

	public switchJob(newJob: Job) {
		this.currentJob = newJob;
		this.recreateOrderedAttributes();

		// Updates the job slot limits
		if(this.currentJobIsARacialJob()) {
			let currentJob = this.currentJob as RacialJob;
			this.adventuringJobSlotsOnDisplay = currentJob.numberOfAdventuringJobSlots;
			this.craftingJobSlotsOnDisplay = currentJob.numberOfCraftingJobSlots;
		} else {
			this.adventuringJobSlotsOnDisplay = -1;
			this.craftingJobSlotsOnDisplay = -1;
		}
	}

	updateJobBaseAttributes(attributeItem) {
		if(isJobWithBaseAttributes(this.currentJob) == false){
			console.error("updateJobBaseAttributes() was called on a Job that does not provide them.")
			return;
		}

		let targetJob = this.currentJob as RacialJob;
		targetJob.addBaseAttributes(attributeItem);
	}

	updateJobAffectedAttributes(attributeItem) {
		this.currentJob.affectedAttributes.add(attributeItem);
	}

	updateJobBaseDefense(defensesItem) {
		if(isJobWithBaseAttributes(this.currentJob) == false){
			console.error("updateJobBaseDefense() was called on a Job that does not provide them.")
			return;
		}

		let targetJob = this.currentJob as RacialJob;
		targetJob.addBaseDefenses(defensesItem);
	}

	updateJobAffectedDefenses(defensesItem) {
		this.currentJob.affectedDefenses.add(defensesItem);
	}

	updateJobBasePools(poolsItem) {
		this.currentJob.basePools.add(poolsItem);
	}

	// Currently this won't upload a job if every attribute is zero. Is this wrong?
	public loadIntoCollection(job: Job) {
		if(job.name.trim().length < 1) {
			alert("All jobs must have a name. Please name the job before attempting to upload it.")
		} else {
			this.jobService.uploadJobIntoCollection(job);
		}

		this.resetCurrentJobsList();
		this.clearCurrentJob();
	}

	public clearCurrentJob() {
		this.jobService.clearCurrentJob(this.selectedJobType)
		this.resetOrderedAttributes();
		// FIXME: This currently doesn't visually take effect until the user
		// switches to another view (either the characterPage or one of the
		// other tabs in the jobPage) and then switches back.
	}

	public deleteCurrentJob() {
		this.jobService.deleteJobFromCollection(this.currentJob);
	}

	public save() {
		let jobJson = this.currentJob.serializeToJSON();
		jobJson = JSON.stringify(jobJson);
		let jobJsonArray = [];
		jobJsonArray.push(jobJson);

		let blob = new Blob(jobJsonArray, {type: 'text/plain' });
		FileSaver.saveAs(blob, this.currentJob.name + ".json");
	}

	public newJob() {
		this.resetOrderedAttributes();
		this.resetCurrentJobsList();
	}

	public setSelectedJobTypeToAdventuring() {
		if(this.selectedJobType != JobTypes.ADVENTURING_JOB) {
			this.selectedJobType = JobTypes.ADVENTURING_JOB;
			this.resetOrderedAttributes();
		}

		this.resetCurrentJobsList();
	}

	public setSelectedJobTypeToCrafting() {
		if(this.selectedJobType != JobTypes.CRAFTING_JOB) {
			this.selectedJobType = JobTypes.CRAFTING_JOB;
			this.resetOrderedAttributes();
		}

		this.resetCurrentJobsList();
	}

	public setSelectedJobTypeToRacial() {
		if(this.selectedJobType != JobTypes.RACIAL_JOB) {
			this.selectedJobType = JobTypes.RACIAL_JOB;
			this.resetOrderedAttributes();
		}

		this.resetCurrentJobsList();
	}

	public getCurrentJobSkillCount() {
		return this.currentJob.skills.size;
	}

	public currentJobIsARacialJob() {
		return this.currentJob instanceof RacialJob;
	}

	public isJobWithBaseAttributes(input: Job) {
		return isJobWithBaseAttributes(this.currentJob);
	}

	// FIXME: consolidate these methods, reducing duplication.
	public changeCurrentAdventuringJobSlots() {
		if(this.currentJobIsARacialJob() == false) {
			return;
		}

		let currentJob = this.currentJob as RacialJob;

		if(currentJob === this.characterService.characterFocus.primaryRacialJob) {
			// The user is currently editing the job they are using in the characterPage!
			if(confirm("You are about to alter the number of adventuring job slots alotted to a character in progress. Are you sure you wish to do this?") == false) {
				this.adventuringJobSlotsOnDisplay = currentJob.numberOfAdventuringJobSlots;
				return;
			}
		}

		currentJob.numberOfAdventuringJobSlots = this.adventuringJobSlotsOnDisplay;
		this.characterService.characterFocus.handlePrimaryRaceChange();
	}

	public changeCurrentCraftingJobSlots() {
		if(this.currentJobIsARacialJob() == false) {
			return;
		}

		let currentJob = this.currentJob as RacialJob;

		if(currentJob === this.characterService.characterFocus.primaryRacialJob) {
			// The user is currently editing the job they are using in the characterPage!
			if(confirm("You are about to alter the number of crafting job slots alotted to a character in progress. Are you sure you wish to do this?") == false) {
				this.craftingJobSlotsOnDisplay = currentJob.numberOfCraftingJobSlots;
				return;
			}
		}

		currentJob.numberOfCraftingJobSlots = this.craftingJobSlotsOnDisplay;
		this.characterService.characterFocus.handlePrimaryRaceChange();
	}

	// TODO: Stop using this method for the *ngFor. It's causing errors in the console log.
	public getAllSkillKeys() {
		let allSkillKeys = [];

		SkillService.allClassSkills.forEach((value: Skill, key: string) => {
			allSkillKeys.push(key);
		});

		return allSkillKeys;
	}

	public getSkill(uuid: string) {
		return SkillService.allClassSkills.get(uuid);
	}

	public attemptToAddSkill() {
		if(this.selectedSkillLevel >= 0 && isNullOrUndefined(this.selectedSkillUUID) == false) {
			this.currentJob.addSkill(this.selectedSkillLevel, this.getSkill(this.selectedSkillUUID));
		}

		this.selectedSkillLevel = 0;
		this.selectedSkillUUID = null;
		this.displaySkillSelect = false;
	}

	public removeSkill(level: number, skillToRemove: Skill) {
		this.currentJob.removeSkill(level, skillToRemove);
	}
}
