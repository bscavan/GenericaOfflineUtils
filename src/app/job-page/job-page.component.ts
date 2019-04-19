import { Component, OnInit, Input } from '@angular/core';
import { Job } from '../job';
import { BlankAdventuringJob } from '../adventuring-jobs/blank-adventuring-job';
import { Attributes, AttributeKeys } from '../attribute-keys';
import * as FileSaver from 'file-saver';
import { AdventuringJob } from '../adventuring-jobs/adventuring-job';
import { AdventuringJobs } from '../adventuring-jobs/adventuring-jobs';
import { JobService } from '../job-service';

export enum JOB_TYPES {
	RACIAL_JOB,
	CRAFTING_JOB,
	ADVENTURING_JOB
}

@Component({
  selector: 'app-job-page',
  templateUrl: './job-page.component.html',
  styleUrls: ['./job-page.component.css']
})
export class JobPageComponent implements OnInit {

	public orderedAttributes: {affectedAttribute: Attributes; pointsPerLevel: number;}[] = [];
	@Input() jobType: JOB_TYPES;

	constructor(private jobService: JobService) { }

	ngOnInit() {
		// Set<{affectedAttribute: Attributes, pointsPerLevel: number}>;
		this.jobService.adventuringJobInProgress.affectedAttributes.forEach((currentElement) => {
			this.orderedAttributes.push(currentElement);
		});
	}

	updateJobAttributes(attributeItem) {
		this.jobService.adventuringJobInProgress.affectedAttributes.add(attributeItem);
	}

	// Currently this won't upload a job if every attribute is zero. Is this wrong?
	public loadIntoCollection(job: AdventuringJob) {
		if(job.name.trim().length < 1) {
			alert("All jobs must have a name. Please name the job before attempting to upload it.")
		} else {
			AdventuringJobs.addAdventuringJob(job);
		}
	}

	// Note: Currently, the JSON for jobs don't contain notes as to what type
	// of jobs they refer to. So, it would be really easy to import a crafting
	// job in as an adventuring, or to accidentally try to load a racial in as
	// a crafting... Would that break things?
	public save() {
		let filename = this.jobService.adventuringJobInProgress.name + ".json";
		let jobJson = this.jobService.adventuringJobInProgress.serializeToJSON();
		jobJson = JSON.stringify(jobJson);
		let jobJsonArray = [];
		jobJsonArray.push(jobJson);

		let blob = new Blob(jobJsonArray, {type: 'text/plain' });
		FileSaver.saveAs(blob, filename);
	}
}
