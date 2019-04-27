import { Tanner } from "./tanner";
import { Miner } from "./miner";
import { BlankCraftingJob } from "./blank-crafting-job";
import { CraftingJob } from "./crafting-job";
import * as deepEqual from "deep-equal";
import { isNull } from "util";

export class Professions {
	private static craftingJobs: CraftingJob[] = null;

	private static compileCraftingJobs(): CraftingJob[] {
		let allCraftingJobs = [];
		allCraftingJobs.push(BlankCraftingJob.getBlankCraftingJob());
		allCraftingJobs.push(Tanner.getTannerJob());
		allCraftingJobs.push(Miner.getMinerJob());
		// TODO: Add more crafting jobs to this list automatically...

		return allCraftingJobs;
	}

	// Use this to iterate over all the crafting job options offered in the front-end
	public static getAllCraftingJobs(): CraftingJob[] {
		if(this.craftingJobs == null) {
			this.craftingJobs = this.compileCraftingJobs();
		}

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
}