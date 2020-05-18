import { RacialJob } from "./racial-job";
import { BlankRacialJob } from "./blank-racial-job";
import * as deepEqual from "deep-equal";
import { isNull } from "util";
import { Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { RacialJobUpdateAction, RacialJobDeleteAction } from "../actions/racial-job-update-action";
import { ActionUtil } from "../action-util";
import { Observable, fromEvent } from "rxjs";
import { delay } from "rxjs/operators";

@Injectable()
export class Races {
	source$: Observable<Event>;
	// TODO: Consider migrating all of these featues into JobService...

	// TODO: Add support for races that have supplemental job slots, but only
	// allow specific races as options, ex: half-breeds only allow two-skill jobs,
	// and beastkin are humans with one beast job...

	/**
	 * FIXME: This needs to be routinely sorted (alphabetically by name?)
	 * FIXME: Rather than allowing other classes and HTML to directly access this,
	 * they need to maintain their own, local copies that are hooked up to a
	 * subscription to an observable of this list. Whenever this list's content
	 * changes, they will need to re-pull and refresh what they are displaying.
	 */
	private allRaces: RacialJob[] = [];

	/**
	 * FIXME: This needs to be routinely sorted (alphabetically by name?)
	 * FIXME: Rather than allowing other classes and HTML to directly access this,
	 * they need to maintain their own, local copies that are hooked up to a
	 * subscription to an observable of this list. Whenever this list's content
	 * changes, they will need to re-pull and refresh what they are displaying.
	 */
	private allSupplementalRaces: RacialJob[] = [];

	constructor(private store: Store) {
		this.initializeActionListener();
	}

	// TODO: Refactor this so that the underlying structure of the collection is a map?
	// TODO: Refactor this so that new jobs can be added via JSON (which gets deserialized)

	// Use this to iterate over all the racial job options offered in the front-end
	public getAllRaces(): RacialJob[] {
		return this.allRaces;
	}

	// Use this to iterate over all the supplemental racial job options offered in the front-end
	public getAllSupplementalRaces(): RacialJob[] {
		return this.allSupplementalRaces;
	}

	public addRacialJob(prospectiveJob: RacialJob): RacialJob {
		let jobToReturn: RacialJob = null;

		// First check to see if the job already exists.
		this.allRaces.forEach((currentJob) => {
			if(deepEqual(currentJob, prospectiveJob)) {
				jobToReturn = currentJob;
				return;
			}
		});

		// If the job does not exist in all races, add it.
		if(isNull(jobToReturn)) {
			this.allRaces.push(prospectiveJob);
			this.sortRacialJobs();
			this.dispatchRacialJobUpdate(prospectiveJob);

			// If the job can be suppliemental, add it there also.
			if(prospectiveJob.canBeSupplementalJob) {
				this.allSupplementalRaces.push(prospectiveJob);
				this.sortSupplementalRacialJobs();
			}

			return prospectiveJob;
		} else {
			return jobToReturn;
		}
	}

	public sortRacialJobs() {
		this.allRaces.sort(function(a,b){if(a.name.toLowerCase() > b.name.toLowerCase()) return 1; else return -1;});
	}

	public sortSupplementalRacialJobs() {
		this.allSupplementalRaces.sort(function(a,b){if(a.name.toLowerCase() > b.name.toLowerCase()) return 1; else return -1;});
	}

	public deserializeRacialJob(json): RacialJob {
		let prospectiveJob = BlankRacialJob.generateBlankRacialJob().deserializeFromJSON(json);

		return this.addRacialJob(prospectiveJob);
	}

	/**
	 * NOTE: This is only to be used by the method defined within initializeActionListener.
	 * It does not dispatch an update.
	 */
	private updateRacialJobByUUIDFromJson(uuid: string, updateJson) {
		let jobFound = null;

		this.allRaces.forEach((currentRacialJob, index: number) => {
			if(uuid === currentRacialJob.uuid) {
				this.allRaces[index].deserializeFromJSON(updateJson);
				jobFound = currentRacialJob;
				return;
			}
		});

		if(jobFound != null && jobFound.canBeSupplementalJob) {
			this.allSupplementalRaces.forEach((currentRacialJob, index: number) => {
				if(uuid === currentRacialJob.uuid) {
					this.allRaces[index].deserializeFromJSON(updateJson);
					return;
				}
			});
		}
	}

	/**
	 * NOTE: This is only to be used by the method defined within initializeActionListener.
	 * It does not dispatch an update.
	 */
	private replaceRacialJobByUUID(prospectiveJob: RacialJob) {
		this.allRaces.forEach((currentRacialJob, index: number) => {
			if(prospectiveJob.uuid === currentRacialJob.uuid) {
				this.allRaces[index] = prospectiveJob;
				return;
			}
		});

		if(prospectiveJob.canBeSupplementalJob) {
			this.allSupplementalRaces.forEach((currentRacialJob, index: number) => {
				if(prospectiveJob.uuid === currentRacialJob.uuid) {
					this.allRaces[index] = prospectiveJob;
					return;
				}
			});
		}
	}

	public deleteRacialJob(prospectiveJob: RacialJob) {
		let index = this.allRaces.indexOf(prospectiveJob);
		let returnValue = null;

		if(index >= 0) {
			returnValue = this.allRaces.splice(index, 1);
			this.dispatchRacialJobDelete(prospectiveJob.uuid);
		}

		if(prospectiveJob.canBeSupplementalJob) {
			let SupplementalIndex = this.allSupplementalRaces.indexOf(prospectiveJob);

			if(index >= 0) {
				returnValue = this.allSupplementalRaces.splice(SupplementalIndex, 1);
			}
		}

		return returnValue;
	}

	public deleteRacialJobByUUID(uuid: string) {
		let foundIndex = -1;
		let foundSupplementalIndex = -1;
		let canBeSupplementalJob = false;

		this.allRaces.forEach((currentRacialJob, index: number) => {
			if(currentRacialJob.uuid === uuid) {
				foundIndex = index;
				canBeSupplementalJob = currentRacialJob.canBeSupplementalJob;
				return;
			}
		});

		if(foundIndex >= 0) {
			this.allRaces.splice(foundIndex, 1);
			this.dispatchRacialJobDelete(uuid);
		}

		if(canBeSupplementalJob) {
			this.allSupplementalRaces.forEach((currentRacialJob, index: number) => {
				if(currentRacialJob.uuid === uuid) {
					foundSupplementalIndex = index;
					return;
				}
			});
	
			if(foundSupplementalIndex >= 0) {
				this.allRaces.splice(foundSupplementalIndex, 1);
			}
		}
	}

	// Only run this if the skill has changed.
	public dispatchRacialJobUpdate(job: RacialJob){
		this.store.dispatch(new RacialJobUpdateAction());
		localStorage.setItem(ActionUtil.ACTION_KEY, RacialJobUpdateAction.type);
		localStorage.setItem(RacialJobUpdateAction.type, job.uuid);
		let jobAsJson = JSON.stringify(job.serializeToJSON());
		localStorage.setItem(job.uuid, jobAsJson);
	}

	// Only run this if the skill has deleted.
	public dispatchRacialJobDelete(uuid: string){
		this.store.dispatch(new RacialJobDeleteAction());
		localStorage.setItem(ActionUtil.ACTION_KEY, RacialJobDeleteAction.type);
		localStorage.setItem(RacialJobDeleteAction.type, uuid);
		localStorage.setItem(uuid, null);
	}

	private initializeActionListener() {
		this.source$ = fromEvent(window, 'storage');
		this.source$.pipe(delay(500)).subscribe(
			ldata => {
				let lastActionPerformed = localStorage.getItem(ActionUtil.ACTION_KEY);

				if(lastActionPerformed) {
					if(lastActionPerformed === RacialJobUpdateAction.type) {
						let uuidOfUpdatedJob = localStorage.getItem(RacialJobUpdateAction.type);

						if(uuidOfUpdatedJob) {
							let jsonOfUpdatedJob = localStorage.getItem(uuidOfUpdatedJob);

							if(jsonOfUpdatedJob) {
								// TODO: Error handling on this method
								let parsed = JSON.parse(jsonOfUpdatedJob);
								this.updateRacialJobByUUIDFromJson(uuidOfUpdatedJob, parsed);
							}
						}
					} else if(lastActionPerformed === RacialJobDeleteAction.type) {
						let uuidOfDeletedJob = localStorage.getItem(RacialJobDeleteAction.type);

						if(uuidOfDeletedJob) {
							this.deleteRacialJobByUUID(uuidOfDeletedJob);
						}
					}
					// TODO: update and delete cases for adventuring and crafting jobs...
				}
			}
		);
	}
}