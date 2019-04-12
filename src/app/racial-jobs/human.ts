import { Attributes, Defenses, Pools } from "../attribute-keys";
import { RacialJob } from "./racial-job";

export class Human extends RacialJob {
	private static humanRace = null;

	public static getHumanRace(): RacialJob {
		if(this.humanRace == null) {
			this.humanRace = this.generateHumanRace();
		}

		return this.humanRace;
	}

	// TODO: Refactor these into static helper-methods?
	private static generateHumanRace(): RacialJob {
		let baseAttributes = new Set<{affectedAttribute: Attributes, baseValue: number}>();
		baseAttributes.add({affectedAttribute: Attributes.STR, baseValue: 25});
		baseAttributes.add({affectedAttribute: Attributes.CON, baseValue: 25});
		baseAttributes.add({affectedAttribute: Attributes.INT, baseValue: 25});
		baseAttributes.add({affectedAttribute: Attributes.WIS, baseValue: 25});
		baseAttributes.add({affectedAttribute: Attributes.DEX, baseValue: 25});
		baseAttributes.add({affectedAttribute: Attributes.AGL, baseValue: 25});
		baseAttributes.add({affectedAttribute: Attributes.CHA, baseValue: 25});
		baseAttributes.add({affectedAttribute: Attributes.WILL, baseValue: 25});
		baseAttributes.add({affectedAttribute: Attributes.PER, baseValue: 25});
		baseAttributes.add({affectedAttribute: Attributes.LUCK, baseValue: 25});

		let attributesSet = new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>();
		attributesSet.add({affectedAttribute: Attributes.STR, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.CON, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.INT, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.WIS, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.DEX, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.AGL, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.CHA, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.WILL, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.PER, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.LUCK, pointsPerLevel: 3});

		// These are the points simply having any levels in this job brings to a defense
		let baseDefenses = new Set<{affectedDefense: Defenses, baseValue: number}>();

		// These are the points each level of this job brings to a defense
		let defensesSet = new Set<{affectedDefense: Defenses, pointsPerLevel: number}>();
		defensesSet.add({affectedDefense: Defenses.ARM, pointsPerLevel: 1});
		defensesSet.add({affectedDefense: Defenses.COOL, pointsPerLevel: 3});
		defensesSet.add({affectedDefense: Defenses.END, pointsPerLevel: 3});
		defensesSet.add({affectedDefense: Defenses.MFORT, pointsPerLevel: 3});

		let basePools = new Set<{affectedPool: Pools, baseValue: number}>();
		// Humans don't have any base pool values.

		return new RacialJob("Human", baseAttributes, attributesSet,
			baseDefenses, defensesSet, basePools, 0, 7, 3, true);
	}
}