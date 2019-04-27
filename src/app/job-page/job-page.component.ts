import { Component, OnInit, Input } from '@angular/core';
import { Job } from '../job';
import { BlankAdventuringJob } from '../adventuring-jobs/blank-adventuring-job';
import { Attributes, AttributeKeys } from '../attribute-keys';
import * as FileSaver from 'file-saver';
import { AdventuringJob } from '../adventuring-jobs/adventuring-job';
import { AdventuringJobs } from '../adventuring-jobs/adventuring-jobs';
import { JobService, JobTypes } from '../job-service';
import { Professions } from '../crafting-jobs/professions';
import { Races } from '../racial-jobs/races';

@Component({
  selector: 'app-job-page',
  templateUrl: './job-page.component.html',
  styleUrls: ['./job-page.component.css']
})
export class JobPageComponent implements OnInit {
	// This value exists to a ngbRadio group in the html will have something to bind to.
	// Its value is never important.
	public radioButtoSelection: number;

	public currentJob: Job;
	public currentJobsList: Job[];
	public orderedAttributes: {affectedAttribute: Attributes; pointsPerLevel: number;}[] = [];
	selectedJobType: JobTypes;

	constructor(private jobService: JobService) { }

	ngOnInit() {
		this.selectedJobType = JobTypes.ADVENTURING_JOB;
		// TODO: Add a step to automatically click the Adventuring Job button here.

		this.resetOrderedAttributes();
		this.resetCurrentJobsList();
	}

	// TODO: Expand out from just orderedAttributes, eventually covering all of the features of the three job types...
	public resetOrderedAttributes() {
		this.currentJob = this.jobService.getCurrentJob(this.selectedJobType);
		this.orderedAttributes = [];

		// Set<{affectedAttribute: Attributes, pointsPerLevel: number}>;
		this.currentJob.affectedAttributes.forEach((currentElement) => {
			this.orderedAttributes.push(currentElement);
		});
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

	updateJobAttributes(attributeItem) {
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
	}

	public clearCurrentJob() {
		this.jobService.clearCurrentJob(this.selectedJobType)
	}

	// Note: Currently, the JSON for jobs don't contain notes as to what type
	// of jobs they refer to. So, it would be really easy to import a crafting
	// job in as an adventuring, or to accidentally try to load a racial in as
	// a crafting... Would that break things?
	public save() {
		let jobInProgress = this.jobService.getCurrentJob(this.selectedJobType);
		let filename = jobInProgress.name + ".json";
		let jobJson = jobInProgress.serializeToJSON();
		jobJson = JSON.stringify(jobJson);
		let jobJsonArray = [];
		jobJsonArray.push(jobJson);

		let blob = new Blob(jobJsonArray, {type: 'text/plain' });
		FileSaver.saveAs(blob, filename);
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
}
