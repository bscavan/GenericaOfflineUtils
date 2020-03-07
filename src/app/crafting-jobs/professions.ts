import { BlankCraftingJob } from "./blank-crafting-job";
import { CraftingJob } from "./crafting-job";
import * as deepEqual from "deep-equal";
import { isNull } from "util";

export class Professions {
	/**
	 * FIXME: Rather than allowing other classes and HTML to directly access this,
	 * they need to maintain their own, local copies that are hooked up to a
	 * subscription to an observable of this list. Whenever this list's content
	 * changes, they will need to re-pull and refresh what they are displaying.
	 */
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

	public static sortCraftingJobs() {
		this.craftingJobs.sort(function(a,b){if(a.name.toLowerCase() > b.name.toLowerCase()) return 1; else return -1;})
	}

	public static addCraftingJob(prospectiveJob: CraftingJob): CraftingJob {
		let jobToReturn: CraftingJob = null;

		this.craftingJobs.forEach((currentJob) => {
			if(deepEqual(currentJob, prospectiveJob)) {
				jobToReturn = currentJob;
				this.sortCraftingJobs();
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
