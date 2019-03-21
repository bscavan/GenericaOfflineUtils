import { Peskie } from "./peskie";

export class Races {
	public readonly ALL_RACES = this.compileRaces();

	compileRaces() {
		let allRaces = [];
		allRaces.push(Peskie.getPeskieRace());
		// TODO: Add more races to this list automatically...

		return allRaces;
	}

	// Use this to iterate over all the racial job options offered in the front-end
	public getAllRaces() {
		return this.ALL_RACES;
	}
}