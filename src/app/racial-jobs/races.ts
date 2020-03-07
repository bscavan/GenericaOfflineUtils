import { RacialJob } from "./racial-job";
import { BlankRacialJob } from "./blank-racial-job";
import * as deepEqual from "deep-equal";
import { isNull } from "util";

export class Races {
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
	private static allRaces: RacialJob[] = [];

	/**
	 * FIXME: This needs to be routinely sorted (alphabetically by name?)
	 * FIXME: Rather than allowing other classes and HTML to directly access this,
	 * they need to maintain their own, local copies that are hooked up to a
	 * subscription to an observable of this list. Whenever this list's content
	 * changes, they will need to re-pull and refresh what they are displaying.
	 */
	private static allSupplementalRaces: RacialJob[] = [];

	// TODO: Refactor this so that the underlying structure of the collection is a map?
	// TODO: Refactor this so that new jobs can be added via JSON (which gets deserialized)

	// Use this to iterate over all the racial job options offered in the front-end
	public static getAllRaces(): RacialJob[] {
		return this.allRaces;
	}

	// Use this to iterate over all the supplemental racial job options offered in the front-end
	public static getAllSupplementalRaces(): RacialJob[] {
		return this.allSupplementalRaces;
	}

	public static addRacialJob(prospectiveJob: RacialJob): RacialJob {
		let jobToReturn: RacialJob = null;

		this.allRaces.forEach((currentJob) => {
			if(deepEqual(currentJob, prospectiveJob)) {
				jobToReturn = currentJob;
				return;
			}
		});

		if(isNull(jobToReturn)) {
			this.allRaces.push(prospectiveJob);

			if(prospectiveJob.canBeSupplementalJob) {
				this.allSupplementalRaces.push(prospectiveJob);
			}

			return prospectiveJob;
		} else {
			return jobToReturn;
		}
	}

	public static deserializeRacialJob(json): RacialJob {
		let prospectiveJob = BlankRacialJob.generateBlankRacialJob().deserializeFromJSON(json);
		let jobToReturn: RacialJob = null;

		this.allRaces.forEach((currentJob) => {
			if(deepEqual(currentJob, prospectiveJob)) {
				jobToReturn = currentJob;
				return;
			}
		});

		if(isNull(jobToReturn)) {
			this.allRaces.push(prospectiveJob);
			return prospectiveJob;
		} else {
			return jobToReturn;
		}
	}

	public static deleteRacialJob(prospectiveJob: RacialJob) {
		let index = this.allRaces.indexOf(prospectiveJob);
		let returnValue = null;

		if(index >= 0) {
			returnValue = this.allRaces.splice(index, 1);
		}

		return returnValue;
	}
}