import { Attributes, Defenses, Pools } from "../attribute-keys";
import { RacialJob } from "./racial-job";

export class BlankRacialJob extends RacialJob {
	private static readonly blankRace = BlankRacialJob.generateBlankRacialJob();

	// FIXME: This produces a single instance of the "blank" job, that anyone can edit and change for everyone...
	// TODO: Remove this once Races has been converted over to using a Map. Then, retrieve the BlankRacialJob from there.
	public static getBlankRacialJob(): RacialJob {
		return this.blankRace;
	}

	// TODO: Refactor these into static helper-methods?
	public static generateBlankRacialJob(): RacialJob {
		let baseAttributes = new Set<{affectedAttribute: Attributes, baseValue: number}>();

		let attributesSet = new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>();

		// These are the points simply having any levels in this job brings to a defense
		let baseDefenses = new Set<{affectedDefense: Defenses, baseValue: number}>();

		// These are the points each level of this job brings to a defense
		let defensesSet = new Set<{affectedDefense: Defenses, pointsPerLevel: number}>();

		let basePools = new Set<{affectedPool: Pools, baseValue: number}>();
		// Blanks don't have any base pool values.

		return new RacialJob("", baseAttributes, attributesSet,
			baseDefenses, defensesSet, basePools, 0, 0, 0, true);
	}
}