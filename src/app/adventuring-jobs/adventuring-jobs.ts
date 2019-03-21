import { Duelist } from "./duelist";

export class AdventuringJobs {
	public readonly ALL_ADVENTURING_JOBS = this.compileRaces();

	compileRaces() {
		let allAdventuringJobs = [];
		allAdventuringJobs.push(Duelist.getDuelistJob());
		// TODO: Add more races to this list automatically...

		return allAdventuringJobs;
	}

	// Use this to iterate over all the adventuring job options offered in the front-end
	public getAllAdventuringJobs() {
		return this.ALL_ADVENTURING_JOBS;
	}
}