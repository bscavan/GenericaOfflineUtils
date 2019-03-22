import { Tanner } from "./tanner";

export class Professions {
	private static craftingJobs = null;

	static compileRaces() {
		let allCraftingJobs = [];
		allCraftingJobs.push(Tanner.getTannerJob());
		// TODO: Add more crafting jobs to this list automatically...

		return allCraftingJobs;
	}

	// Use this to iterate over all the crafting job options offered in the front-end
	public static getAllCraftingJobs() {
		if(this.craftingJobs == null) {
			this.craftingJobs = this.compileRaces();
		}

		return this.craftingJobs;
	}
}