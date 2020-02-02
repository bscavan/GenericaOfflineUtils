import { Injectable } from '@angular/core';
import { Job } from './job';
import { AdventuringJob } from './adventuring-jobs/adventuring-job';
import { CraftingJob } from './crafting-jobs/crafting-job';
import { RacialJob } from './racial-jobs/racial-job';
import { BlankAdventuringJob } from './adventuring-jobs/blank-adventuring-job';
import { BlankCraftingJob } from './crafting-jobs/blank-crafting-job';
import { BlankRacialJob } from './racial-jobs/blank-racial-job';
import { AdventuringJobs } from './adventuring-jobs/adventuring-jobs';
import { Professions } from './crafting-jobs/professions';
import { Races } from './racial-jobs/races';
import { isNullOrUndefined } from 'util';
import { JobTypes } from './shared-constants'
import { ConfigService } from './config-service';

@Injectable()
export class JobService {
	// TODO: Heavily consider doing away with the job collections (Races, Professions, and AdventuringJobs)
	// and migrating all of their functionality into here...

	// TODO: Determine if we wish to keep all three of these. One variable of type Job may be enough.
	public adventuringJobInProgress: AdventuringJob;
	public craftingJobInProgress: CraftingJob;
	public racialJobInProgress: RacialJob;

	constructor(configService: ConfigService) {
		this.adventuringJobInProgress = BlankAdventuringJob.generateFullyPopulatedBlankAdventuringJob();
		this.craftingJobInProgress = BlankCraftingJob.generateFullyPopulatedBlankCraftingJob();
		this.racialJobInProgress = BlankRacialJob.generateFullyPopulatedBlankRacialJob();

		// These are here to force initialization of the underlying collections.
		// Once these classes' features have been migrated into this class these lines
		// will no longer be necessary.
		Races.getAllRaces();
		Professions.getAllCraftingJobs();
		AdventuringJobs.getAllAdventuringJobs();

		let foundJobsJson = configService.getJobsJson();
		// TODO: Confirm this isn't giving us a 404 or anything before plugging it into the upload method...
	}

	public getCurrentJob(jobType: JobTypes): Job {
		switch(jobType) {
			case JobTypes.ADVENTURING_JOB:
				return this.adventuringJobInProgress;

			case JobTypes.CRAFTING_JOB:
				return this.craftingJobInProgress;

			case JobTypes.RACIAL_JOB:
				return this.racialJobInProgress;
		}
	}

	public clearCurrentJob(jobType: JobTypes): void {
		switch(jobType) {
			case JobTypes.ADVENTURING_JOB:
				this.adventuringJobInProgress = BlankAdventuringJob.generateFullyPopulatedBlankAdventuringJob();

			case JobTypes.CRAFTING_JOB:
				this.craftingJobInProgress = BlankCraftingJob.generateFullyPopulatedBlankCraftingJob();

			case JobTypes.RACIAL_JOB:
				this.racialJobInProgress = BlankRacialJob.generateFullyPopulatedBlankRacialJob();
		}
	}

	// FIXME: This method is being used for importing and uploading.
	// When importing it's overwriting the job in progress.
	public uploadJobIntoCollection(job: Job) {
		if(job instanceof AdventuringJob) {
			AdventuringJobs.addAdventuringJob(job);
			this.adventuringJobInProgress = BlankAdventuringJob.generateFullyPopulatedBlankAdventuringJob();
		} else if (job instanceof CraftingJob) {
			Professions.addCraftingJob(job);
			this.craftingJobInProgress = BlankCraftingJob.generateFullyPopulatedBlankCraftingJob();
		} else if (job instanceof RacialJob) {
			Races.addRacialJob(job);
			this.racialJobInProgress = BlankRacialJob.generateFullyPopulatedBlankRacialJob();
		}
	}

	public uploadJobIntoCollectionFromJSON(json) {
		let newJob = this.deserializeJobFromJSON(json);
		if(newJob instanceof AdventuringJob) {
			AdventuringJobs.addAdventuringJob(newJob);
		} else if (newJob instanceof CraftingJob) {
			Professions.addCraftingJob(newJob);
		} else if (newJob instanceof RacialJob) {
			Races.addRacialJob(newJob);
		}
	}

	public uploadJobsIntoCollectionFromJSONArray(jsonArray) {
		if(isNullOrUndefined(jsonArray)) {
			// TODO: Fail. Loudly.
			return null;
		} else {
			// TODO: Test this out.
			jsonArray.forEach(jobElement => {
				this.uploadJobIntoCollectionFromJSON(jobElement);
			});
		}
	}

	public deleteJobFromCollection(job: Job) {
		if(job instanceof AdventuringJob) {
			AdventuringJobs.deleteAdventuringJob(job);
			this.adventuringJobInProgress = BlankAdventuringJob.generateFullyPopulatedBlankAdventuringJob();
		} else if (job instanceof CraftingJob) {
			Professions.deleteCraftingJob(job);
			this.craftingJobInProgress = BlankCraftingJob.generateFullyPopulatedBlankCraftingJob();
		} else if (job instanceof RacialJob) {
			Races.deleteRacialJob(job);
			this.racialJobInProgress = BlankRacialJob.generateFullyPopulatedBlankRacialJob();
		}
	}

	public deserializeJobFromJSON(json): Job {
		if(isNullOrUndefined(json.jobType)) {
			// TODO: Fail. Loudly.
			return null;
		} else {
			switch(json.jobType) {
				case JobTypes.ADVENTURING_JOB:
					let newAdventuringJobInProgress = BlankAdventuringJob.generateFullyPopulatedBlankAdventuringJob();
					newAdventuringJobInProgress.deserializeFromJSON(json);
					return newAdventuringJobInProgress;

				case JobTypes.CRAFTING_JOB:
					let newCraftingJobInProgress = BlankCraftingJob.generateFullyPopulatedBlankCraftingJob();
					newCraftingJobInProgress.deserializeFromJSON(json);
					return newCraftingJobInProgress;
	
				case JobTypes.RACIAL_JOB:
					let newRacialJobInProgress = BlankRacialJob.generateFullyPopulatedBlankRacialJob();
					newRacialJobInProgress.deserializeFromJSON(json);
					return newRacialJobInProgress;
			}
		}
	}
}
