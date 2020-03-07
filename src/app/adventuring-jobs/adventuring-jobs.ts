import { BlankAdventuringJob } from "./blank-adventuring-job";
import { AdventuringJob } from "./adventuring-job";
import * as deepEqual from "deep-equal";
import { isNull } from "util";

export class AdventuringJobs {
	/**
	 * FIXME: Rather than allowing other classes and HTML to directly access this,
	 * they need to maintain their own, local copies that are hooked up to a
	 * subscription to an observable of this list. Whenever this list's content
	 * changes, they will need to re-pull and refresh what they are displaying.
	 */
	private static adventuringJobs: AdventuringJob[] = [];

	// Use this to iterate over all the adventuring job options offered in the front-end
	public static getAllAdventuringJobs() {
		return this.adventuringJobs;
	}

	// TODO: Test this manually.
	public static deserializeAdventuringJob(json): AdventuringJob {
		let prospectiveJob = BlankAdventuringJob.generateBlankAdventuringJob().deserializeFromJSON(json);

		return this.addAdventuringJob(prospectiveJob);
	}

	public static addAdventuringJob(prospectiveJob: AdventuringJob): AdventuringJob {
		let jobToReturn: AdventuringJob = null;

		this.adventuringJobs.forEach((currentJob) => {
			if(deepEqual(currentJob, prospectiveJob)) {
				jobToReturn = currentJob;
				return;
			}
		});

		if(isNull(jobToReturn)) {
			this.adventuringJobs.push(prospectiveJob);
			this.sortAdventuringJobs();
			return prospectiveJob;
		} else {
			return jobToReturn;
		}
	}

	public static sortAdventuringJobs() {
		this.adventuringJobs.sort(function(a,b){if(a.name.toLowerCase() > b.name.toLowerCase()) return 1; else return -1;})
	}

	public static deleteAdventuringJob(prospectiveJob: AdventuringJob) {
		let index = this.adventuringJobs.indexOf(prospectiveJob);
		let returnValue = null;

		if(index >= 0) {
			returnValue = this.adventuringJobs.splice(index, 1);
		}

		return returnValue;
	}
}
