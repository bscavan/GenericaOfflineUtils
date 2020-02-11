import { BlankCraftingJob } from "./blank-crafting-job";
import { CraftingJob } from "./crafting-job";
import * as deepEqual from "deep-equal";
import { isNull } from "util";

export class Professions {
	private static craftingJobs: CraftingJob[] = [];

	// Use this to iterate over all the crafting job options offered in the front-end
	public static getAllCraftingJobs(): CraftingJob[] {
		return this.craftingJobs;
	}

	public static deserializeCraftingJob(json): CraftingJob {
		let prospectiveJob = BlankCraftingJob.generateBlankCraftingJob().deserializeFromJSON(json);
		let jobToReturn: CraftingJob = null;

		this.craftingJobs.forEach((currentJob) => {
			if(deepEqual(currentJob, prospectiveJob)) {
				jobToReturn = currentJob;
				return;
			}
		});

		if(isNull(jobToReturn)) {
			this.craftingJobs.push(prospectiveJob);
			return prospectiveJob;
		} else {
			return jobToReturn;
		}
	}

	public static addCraftingJob(prospectiveJob: CraftingJob): CraftingJob {
		let jobToReturn: CraftingJob = null;

		this.craftingJobs.forEach((currentJob) => {
			if(deepEqual(currentJob, prospectiveJob)) {
				jobToReturn = currentJob;
				return;
			}
		});

		if(isNull(jobToReturn)) {
			this.craftingJobs.push(prospectiveJob);
			return prospectiveJob;
		} else {
			return jobToReturn;
		}
	}

	public static deleteCraftingJob(prospectiveJob: CraftingJob) {
		let index = this.craftingJobs.indexOf(prospectiveJob);
		let returnValue = null;

		if(index >= 0) {
			returnValue = this.craftingJobs.splice(index, 1);
		}

		return returnValue;
	}
}