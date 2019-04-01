import { Duelist } from "./duelist";
import { Mercenary } from "./mercenary";
import { BlankAdventuringJob } from "./blank-adventuring-job";

export class AdventuringJobs {
	private static adventuringJobs = null;

	static compileRaces() {
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
			this.adventuringJobs = this.compileRaces();
		}
		
		return this.adventuringJobs;
	}
}