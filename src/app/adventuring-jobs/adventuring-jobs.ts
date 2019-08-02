import { Duelist } from "./duelist";
import { Mercenary } from "./mercenary";
import { BlankAdventuringJob } from "./blank-adventuring-job";
import { AdventuringJob } from "./adventuring-job";
import * as deepEqual from "deep-equal";
import { isNull, isNullOrUndefined } from "util";

export class AdventuringJobs {
	private static adventuringJobs: any[] = null;

	private static compileAdventuringJobs() {
		let allAdventuringJobs = [];
		allAdventuringJobs.push(BlankAdventuringJob.getBlankAdventuringJob());
		allAdventuringJobs.push(Duelist.getDuelistJob());
		allAdventuringJobs.push(Mercenary.getMercenaryJob());
		// TODO: Add more races to this list automatically...

		return allAdventuringJobs;
	}

	// Use this to iterate over all the adventuring job options offered in the front-end
	public static getAllAdventuringJobs() {
		if(this.adventuringJobs == null) {
			this.adventuringJobs = this.compileAdventuringJobs();
		}

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