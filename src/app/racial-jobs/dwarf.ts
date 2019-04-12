import { Attributes, Defenses, Pools } from "../attribute-keys";
import { RacialJob } from "./racial-job";

export class Dwarf extends RacialJob {
	private static dwarfRace = null;

	public static getDwarfRace(): RacialJob {
		if(this.dwarfRace == null) {
			this.dwarfRace = this.generateDwarfRace();
		}

		return this.dwarfRace;
	}

	// TODO: Refactor these into static helper-methods?
	private static generateDwarfRace(): RacialJob {
		let baseAttributes = new Set<{affectedAttribute: Attributes, baseValue: number}>();
		baseAttributes.add({affectedAttribute: Attributes.STR, baseValue: 35});
		baseAttributes.add({affectedAttribute: Attributes.CON, baseValue: 35});
		baseAttributes.add({affectedAttribute: Attributes.INT, baseValue: 15});
		baseAttributes.add({affectedAttribute: Attributes.WIS, baseValue: 35});
		baseAttributes.add({affectedAttribute: Attributes.DEX, baseValue: 25});
		baseAttributes.add({affectedAttribute: Attributes.AGL, baseValue: 15});
		baseAttributes.add({affectedAttribute: Attributes.CHA, baseValue: 15});
		baseAttributes.add({affectedAttribute: Attributes.WILL, baseValue: 35});
		baseAttributes.add({affectedAttribute: Attributes.PER, baseValue: 15});
		baseAttributes.add({affectedAttribute: Attributes.LUCK, baseValue: 25});

		let attributesSet = new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>();
		attributesSet.add({affectedAttribute: Attributes.STR, pointsPerLevel: 4});
		attributesSet.add({affectedAttribute: Attributes.CON, pointsPerLevel: 4});
		attributesSet.add({affectedAttribute: Attributes.INT, pointsPerLevel: 2});
		attributesSet.add({affectedAttribute: Attributes.WIS, pointsPerLevel: 4});
		attributesSet.add({affectedAttribute: Attributes.DEX, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.AGL, pointsPerLevel: 2});
		attributesSet.add({affectedAttribute: Attributes.CHA, pointsPerLevel: 2});
		attributesSet.add({affectedAttribute: Attributes.WILL, pointsPerLevel: 4});
		attributesSet.add({affectedAttribute: Attributes.PER, pointsPerLevel: 2});
		attributesSet.add({affectedAttribute: Attributes.LUCK, pointsPerLevel: 3});

		// These are the points simply having any levels in this job brings to a defense
		let baseDefenses = new Set<{affectedDefense: Defenses, baseValue: number}>();

		// These are the points each level of this job brings to a defense
		let defensesSet = new Set<{affectedDefense: Defenses, pointsPerLevel: number}>();
		defensesSet.add({affectedDefense: Defenses.ARM, pointsPerLevel: 3});
		defensesSet.add({affectedDefense: Defenses.COOL, pointsPerLevel: 2});
		defensesSet.add({affectedDefense: Defenses.END, pointsPerLevel: 3});
		defensesSet.add({affectedDefense: Defenses.MFORT, pointsPerLevel: 2});

		let basePools = new Set<{affectedPool: Pools, baseValue: number}>();
		// Dwarves don't have any base pool values.

		return new RacialJob("Dwarf", baseAttributes, attributesSet,
			baseDefenses, defensesSet, basePools, 0, 5, 5, true);
	}
}