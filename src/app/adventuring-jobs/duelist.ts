
import { AdventuringJob } from "./adventuring-job";
import { Attributes } from "../attribute-keys";

export class Duelist extends AdventuringJob {
	// TODO: Refactor these into static methods?
	public static getDuelistJob(): AdventuringJob {
		let attributesSet = new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>();
		attributesSet.add({affectedAttribute: Attributes.STRENGTH, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.DEXTERITY, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.AGILITY, pointsPerLevel: 3});

		let duelist = new AdventuringJob("Duelist", attributesSet);

		return duelist;
	}
}