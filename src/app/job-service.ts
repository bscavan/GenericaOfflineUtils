import { Injectable } from '@angular/core';
import { Job } from './job';
import { AdventuringJob } from './adventuring-jobs/adventuring-job';
import { CraftingJob } from './crafting-jobs/crafting-job';
import { RacialJob } from './racial-jobs/racial-job';
import { BlankAdventuringJob } from './adventuring-jobs/blank-adventuring-job';
import { BlankCraftingJob } from './crafting-jobs/blank-crafting-job';
import { BlankRacialJob } from './racial-jobs/blank-racial-job';

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
		// FIXME: Convert this to generateFullyPopulatedBlankRacialJob(), once that method has been written.
		this.racialJobInProgress = BlankRacialJob.generateBlankRacialJob();
	}
}