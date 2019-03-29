import { AdventuringJob } from "./adventuring-job";
import { Attributes } from "../attribute-keys";

export class BlankAdventuringJob extends AdventuringJob {
	private static blankAdventuringJob = null;

	public static getBlankAdventuringJob(): AdventuringJob {
		if(this.blankAdventuringJob == null) {
			this.blankAdventuringJob = this.generateBlankAdventuringJob();
		}

		return this.blankAdventuringJob;
	}

	// TODO: Refactor these into static methods?
	public static generateBlankAdventuringJob(): AdventuringJob {
		let attributesSet = new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>();
		attributesSet.add({affectedAttribute: Attributes.STRENGTH, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.DEXTERITY, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.AGILITY, pointsPerLevel: 3});

		let blankAdventuring = new AdventuringJob("", attributesSet);

		return blankAdventuring;
	}
}