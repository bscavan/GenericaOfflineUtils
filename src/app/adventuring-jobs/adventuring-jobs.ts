import { Duelist } from "./duelist";

export class AdventuringJobs {
	private static adventuringJobs = null;

	static compileRaces() {
		let allAdventuringJobs = [];
		allAdventuringJobs.push(Duelist.getDuelistJob());
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