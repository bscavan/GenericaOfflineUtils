import { Peskie } from "./peskie";

export class Races {
	private static allRaces = null;

	private static compileRaces() {
		let allRaces = [];
		allRaces.push(Peskie.getPeskieRace());
		// TODO: Add more races to this list automatically...

		return allRaces;
	}

	// Use this to iterate over all the racial job options offered in the front-end
	public static getAllRaces() {
		if(this.allRaces == null) {
			this.allRaces = this.compileRaces();
		}

		return this.allRaces;
	}
}