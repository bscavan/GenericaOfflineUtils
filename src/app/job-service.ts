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
import { SkillService } from './skills/skill-service';
import { Observable, fromEvent } from 'rxjs';
import { Store } from '@ngxs/store';
import { delay } from 'rxjs/operators';
import { ActionUtil } from './action-util';
import { RacialJobUpdateAction, RacialJobDeleteAction } from './actions/racial-job-update-action';

@Injectable()
export class JobService {
	source$: Observable<Event>;

	// TODO: Heavily consider doing away with the job collections (Races, Professions, and AdventuringJobs)
	// and migrating all of their functionality into here...

	// TODO: Determine if we wish to keep all three of these. One variable of type Job may be enough.
	public adventuringJobInProgress: AdventuringJob;
	public craftingJobInProgress: CraftingJob;
	public racialJobInProgress: RacialJob;

	constructor(configService: ConfigService, private skillService: SkillService,
	private store: Store, private races: Races) {
		this.adventuringJobInProgress = BlankAdventuringJob.generateFullyPopulatedBlankAdventuringJob();
		this.craftingJobInProgress = BlankCraftingJob.generateFullyPopulatedBlankCraftingJob();
		this.racialJobInProgress = BlankRacialJob.generateFullyPopulatedBlankRacialJob();

		// These are here to force initialization of the underlying collections.
		// Once these classes' features have been migrated into this class these lines
		// will no longer be necessary.
		Professions.getAllCraftingJobs();
		AdventuringJobs.getAllAdventuringJobs();

		// TODO: Confirm this isn't giving us a 404 or anything before plugging it into the upload method...
		let foundJobsJson = configService.getJobsJson();
		this.uploadJobsIntoCollectionFromJSONArray(foundJobsJson);

		//this.initializeActionListener();
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
			this.races.addRacialJob(job);
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
			this.races.addRacialJob(newJob);
		}
	}

	public uploadJobsIntoCollectionFromJSONArray(jsonArray) {
		if(isNullOrUndefined(jsonArray)) {
			console.error("Cannot upload null or undefined array into Jobs collections.");
			return null;
		} else {
			let arrayAsJSON = jsonArray.json();

			if(isNullOrUndefined(arrayAsJSON)) {
				console.error("The value provided for importing characters was not parsable as json.");
				return null;
			}

			// TODO: Test this out.
			arrayAsJSON.forEach(jobElement => {
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
			this.races.deleteRacialJob(job);
			this.racialJobInProgress = BlankRacialJob.generateFullyPopulatedBlankRacialJob();
		}
	}

	public deserializeJobFromJSON(json): Job {
		if(isNullOrUndefined(json)) {
			// TODO: Fail. Loudly.
			console.error("Cannot deserialize null or undefined JSON into a Job.")
			return null;
		} else if(isNullOrUndefined(json.jobType)) {
			// TODO: Fail. Loudly.
			console.error("Cannot deserialize JSON that does not have a jobType attribute.")
			return null;
		} else {
			switch(json.jobType) {
				case JobTypes.ADVENTURING_JOB:
					let newAdventuringJobInProgress = BlankAdventuringJob.generateFullyPopulatedBlankAdventuringJob();
					newAdventuringJobInProgress.deserializeFromJSON(json);
					this.skillService.addSkillsfromJobIfMissing(newAdventuringJobInProgress);
					return newAdventuringJobInProgress;

				case JobTypes.CRAFTING_JOB:
					let newCraftingJobInProgress = BlankCraftingJob.generateFullyPopulatedBlankCraftingJob();
					newCraftingJobInProgress.deserializeFromJSON(json);
					this.skillService.addSkillsfromJobIfMissing(newCraftingJobInProgress);
					return newCraftingJobInProgress;
	
				case JobTypes.RACIAL_JOB:
					let newRacialJobInProgress = BlankRacialJob.generateFullyPopulatedBlankRacialJob();
					newRacialJobInProgress.deserializeFromJSON(json);
					this.skillService.addSkillsfromJobIfMissing(newRacialJobInProgress);
					return newRacialJobInProgress;
			}
		}
	}

	// This method is the counterpart to uploadJobsIntoCollectionFromJSONArray(jsonArray)
	public getAllJobsAsJsonArray(): {}[] {
		let allJobsArray = [];

		AdventuringJobs.getAllAdventuringJobs().forEach((currentJob) => {
			allJobsArray.push(currentJob.serializeToJSON());
		});

		this.races.getAllRaces().forEach((currentJob) => {
			allJobsArray.push(currentJob.serializeToJSON());
		});

		Professions.getAllCraftingJobs().forEach((currentJob) => {
			allJobsArray.push(currentJob.serializeToJSON());
		});

		return allJobsArray;
	}

	// // Only run this if the skill has changed.
	// private dispatchRacialJobUpdate(job: RacialJob){
	// 	this.store.dispatch(new RacialJobUpdateAction());
	// 	localStorage.setItem(ActionUtil.ACTION_KEY, RacialJobUpdateAction.type);
	// 	localStorage.setItem(RacialJobUpdateAction.type, job.uuid);
	// 	let jobAsJson = JSON.stringify(job.serializeToJSON());
	// 	localStorage.setItem(job.uuid, jobAsJson);
	// }

	// // Only run this if the skill has deleted.
	// private dispatchRacialJobDelete(uuid: string){
	// 	this.store.dispatch(new RacialJobDeleteAction());
	// 	localStorage.setItem(ActionUtil.ACTION_KEY, RacialJobDeleteAction.type);
	// 	localStorage.setItem(RacialJobDeleteAction.type, uuid);
	// 	localStorage.setItem(uuid, null);
	// }

	// private initializeActionListener() {
	// 	this.source$ = fromEvent(window, 'storage');
	// 	this.source$.pipe(delay(500)).subscribe(
	// 		ldata => {
	// 			let lastActionPerformed = localStorage.getItem(ActionUtil.ACTION_KEY);

	// 			if(lastActionPerformed) {
	// 				if(lastActionPerformed === RacialJobUpdateAction.type) {
	// 					let uuidOfUpdatedJob = localStorage.getItem(RacialJobUpdateAction.type);

	// 					if(uuidOfUpdatedJob) {
	// 						let jsonOfUpdatedJob = localStorage.getItem(uuidOfUpdatedJob);

	// 						if(jsonOfUpdatedJob) {
	// 							// TODO: Error handling on this method
	// 							let parsed = JSON.parse(jsonOfUpdatedJob);
								
	// 							let updatedJob = BlankRacialJob.generateFullyPopulatedBlankRacialJob();
	// 							updatedJob.deserializeFromJSON(parsed);
	// 							this.races.replaceRacialJobByUUID(updatedJob);
	// 							// TODO: add calls to the dispatch methods when Races gets changed.
	// 						}
	// 					}
	// 				} else if(lastActionPerformed === RacialJobDeleteAction.type) {
	// 					let uuidOfDeletedJob = localStorage.getItem(RacialJobDeleteAction.type);

	// 					if(uuidOfDeletedJob) {
	// 						this.races.deleteRacialJobByUUID(uuidOfDeletedJob);
	// 						// TODO: add calls to the dispatch methods when Races gets changed.
	// 					}
	// 				}
	// 				// TODO: update and delete cases for adventuring and crafting jobs...
	// 			}
	// 		}
	// 	);
	// }
}