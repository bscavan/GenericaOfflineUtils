import { AdventuringJob } from "./adventuring-job";
import { Attributes } from "../attribute-keys";

export class BlankAdventuringJob extends AdventuringJob {
	private static blankAdventuringJob = null;

	// FIXME: This produces a single instance of the "blank" job, that anyone can edit and change for everyone...
	public static getBlankAdventuringJob(): AdventuringJob {
		if(this.blankAdventuringJob == null) {
			this.blankAdventuringJob = this.generateBlankAdventuringJob();
		}

		return this.blankAdventuringJob;
	}

	// TODO: Refactor these into static methods?
	public static generateBlankAdventuringJob(): AdventuringJob {
		let attributesSet = new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>();

		let blankAdventuring = new AdventuringJob("", attributesSet);

		return blankAdventuring;
	}
}