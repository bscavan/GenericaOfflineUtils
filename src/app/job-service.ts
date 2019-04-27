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

export enum JobTypes {
	ADVENTURING_JOB = "Adventuring",
	CRAFTING_JOB = "Crafting",
	RACIAL_JOB = "Racial"
}

@Injectable()
export class JobService {
	// TODO: Heavily consider doing away with the job collections (Races, Professions, and AdventuringJobs)
	// and migrating all of their functionality into here...

	// TODO: Determine if we wish to keep all three of these. One variable of type Job may be enough.
	public adventuringJobInProgress: AdventuringJob;
	public craftingJobInProgress: CraftingJob;
	public racialJobInProgress: RacialJob;

	constructor() {
		this.adventuringJobInProgress = BlankAdventuringJob.generateFullyPopulatedBlankAdventuringJob();
		this.craftingJobInProgress = BlankCraftingJob.generateFullyPopulatedBlankCraftingJob();
		this.racialJobInProgress = BlankRacialJob.generateFullyPopulatedBlankRacialJob();

		// These are here to force initialization of the underlying collections.
		// Once these classes' features have been migrated into this class these lines
		// will no longer be necessary.
		Races.getAllRaces();
		Professions.getAllCraftingJobs();
		AdventuringJobs.getAllAdventuringJobs();
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
}