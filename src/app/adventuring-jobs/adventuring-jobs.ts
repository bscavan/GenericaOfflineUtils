import { BlankAdventuringJob } from "./blank-adventuring-job";
import { AdventuringJob } from "./adventuring-job";
import * as deepEqual from "deep-equal";
import { isNull } from "util";

export class AdventuringJobs {
	private static adventuringJobs: any[] = [];

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
			return prospectiveJob;
		} else {
			return jobToReturn;
		}
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