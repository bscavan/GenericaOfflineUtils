import { Tanner } from "./tanner";

export class Professions {
	public readonly ALL_CRAFTING_JOBS = this.compileRaces();

	compileRaces() {
		let allCraftingJobs = [];
		allCraftingJobs.push(Tanner.getTannerJob());
		// TODO: Add more crafting jobs to this list automatically...

		return allCraftingJobs;
	}

	// Use this to iterate over all the crafting job options offered in the front-end
	public getAllCraftingJobs() {
		return this.ALL_CRAFTING_JOBS;
	}
}