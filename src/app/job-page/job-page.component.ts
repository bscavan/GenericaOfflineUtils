import { Component, OnInit, Input } from '@angular/core';
import { Job } from '../job';
import { BlankAdventuringJob } from '../adventuring-jobs/blank-adventuring-job';
import { Attributes, AttributeKeys } from '../attribute-keys';
import * as FileSaver from 'file-saver';
import { AdventuringJob } from '../adventuring-jobs/adventuring-job';
import { AdventuringJobs } from '../adventuring-jobs/adventuring-jobs';
import { JobService } from '../job-service';
import { Professions } from '../crafting-jobs/professions';
import { Races } from '../racial-jobs/races';
import { JobTypes } from '../shared-constants'
import { Skill, Currency, Duration, Qualifier, Denomination } from '../skills/skill';
import { RacialJob } from '../racial-jobs/racial-job';
import { JobWithBaseAttributes, isJobWithBaseAttributes } from '../racial-jobs/job-with-base-attributes';

@Component({
  selector: 'app-job-page',
  templateUrl: './job-page.component.html',
  styleUrls: ['./job-page.component.css']
})
export class JobPageComponent implements OnInit {
	public readonly LABEL = Job.LABEL;

	// This value exists to a ngbRadio group in the html will have something to bind to.
	// Its value is never important.
	public radioButtoSelection: number;
	public currentJob: Job;
	public currentJobsList: Job[];
	// TODO: Keep this list sorted alphabetically?
	public orderedAttributes: {affectedAttribute: Attributes; pointsPerLevel: number;}[] = [];
	public orderedBaseAttributes: {affectedAttribute: Attributes; pointsPerLevel: number;}[] = [];
	selectedJobType: JobTypes;

	public static job_service: JobService;

	constructor(private jobService: JobService) {
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

		this.currentJob.affectedAttributes.forEach((currentElement) => {
			this.orderedAttributes.push(currentElement);
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
		}
	}

	public clearOrderedAttributes() {
		this.currentJob = this.jobService.getCurrentJob(this.selectedJobType);
		this.orderedAttributes = [];
		this.orderedBaseAttributes = [];

		// Set<{affectedAttribute: Attributes, pointsPerLevel: number}>;
		this.currentJob.affectedAttributes.forEach((currentElement) => {
			let newCurrentElement = {
				affectedAttribute: currentElement.affectedAttribute,
				pointsPerLevel: 0
			}
			this.orderedAttributes.push(newCurrentElement);
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
					pointsPerLevel: 0
				}
				this.orderedBaseAttributes.push(newCurrentElement);
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

	public saveNewSkill() {
		let costs = [{
			costAmount: 1,
			costDenomination: Currency.GOLD_PIECES
		}];

		let duration= {
			amount: 1,
			timeDenomination: Duration.PASSIVE_CONSTANT,
			qualifier: Qualifier.NONE
		};

		let testSkill = new Skill("Weapon Mastery", "mastery of a weapon", costs, duration);
		let skillJson = testSkill.serializeToJSON();
		skillJson = JSON.stringify(skillJson);

		let jobFileAsJson = JSON.parse(skillJson.toString());

		let otherSkill = new Skill(null, null, null, null);
		otherSkill.deserializeFromJSON(jobFileAsJson);
	}

	public isJobWithBaseAttributes(input: Job) {
		return isJobWithBaseAttributes(this.currentJob);
	}
}
