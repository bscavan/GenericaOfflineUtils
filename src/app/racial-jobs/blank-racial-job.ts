import { Attributes, Defenses, Pools, AttributeKeys } from "../attribute-keys";
import { RacialJob } from "./racial-job";

export class BlankRacialJob extends RacialJob {
	private static readonly blankRace = BlankRacialJob.generateBlankRacialJob();

	// FIXME: This produces a single instance of the "blank" job, that anyone can edit and change for everyone...
	// TODO: Remove this once Races has been converted over to using a Map. Then, retrieve the BlankRacialJob from there.
	// The generate methods will still be necessary, because we don't want to change the "standard"
	// blank job used in other places when doing things like deserializing a new job from JSON.
	public static getBlankRacialJob(): RacialJob {
		return this.blankRace;
	}

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

	public static generateFullyPopulatedBlankRacialJob(): RacialJob {
		let baseAttributes = new Set<{affectedAttribute: Attributes, baseValue: number}>();
		let attributesSet = new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>();

		// These are the points simply having any levels in this job brings to a defense
		let baseDefenses = new Set<{affectedDefense: Defenses, baseValue: number}>();
		let defensesSet = new Set<{affectedDefense: Defenses, pointsPerLevel: number}>();

		let basePools = new Set<{affectedPool: Pools, baseValue: number}>();

		AttributeKeys.getAttributeSets().forEach((currentAttributeSet) => {
			baseAttributes.add({affectedAttribute: currentAttributeSet.offensiveAttribute, baseValue: 0});
			baseAttributes.add({affectedAttribute: currentAttributeSet.defensiveAttribute, baseValue: 0});
			attributesSet.add({affectedAttribute: currentAttributeSet.offensiveAttribute, pointsPerLevel: 0});
			attributesSet.add({affectedAttribute: currentAttributeSet.defensiveAttribute, pointsPerLevel: 0});
			baseDefenses.add({affectedDefense: currentAttributeSet.defense, baseValue: 0});
			defensesSet.add({affectedDefense: currentAttributeSet.defense, pointsPerLevel: 0});
			basePools.add({affectedPool: currentAttributeSet.pool, baseValue: 0});
		});

		return new RacialJob("", baseAttributes, attributesSet,
			baseDefenses, defensesSet, basePools, 0, 0, 0, true);
	}
}