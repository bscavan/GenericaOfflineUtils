import { Peskie } from "./peskie";
import { Human } from "./human";
import { RacialJob } from "./racial-job";

export class Races {
	private static allRaces = null;

	private static compileRaces(): RacialJob[] {
		let allRaces = [];
		allRaces.push(Peskie.getPeskieRace());
		allRaces.push(Human.getHumanRace())
		// TODO: Add more races to this list automatically...

		return allRaces;
	}

	// Use this to iterate over all the racial job options offered in the front-end
	public static getAllRaces(): RacialJob[] {
		if(this.allRaces == null) {
			this.allRaces = this.compileRaces();
		}

		return this.allRaces;
	}
}