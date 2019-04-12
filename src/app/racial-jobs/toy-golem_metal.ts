import { Attributes, Defenses, Pools } from "../attribute-keys";
import { RacialJob } from "./racial-job";

export class ToyGolem_Metal extends RacialJob {
	private static toyGolem_MetalRace = null;

	public static getToyGolem_MetalRace(): RacialJob {
		if(this.toyGolem_MetalRace == null) {
			this.toyGolem_MetalRace = this.generateToyGolem_MetalRace();
		}

		return this.toyGolem_MetalRace;
	}

	// TODO: Refactor these into static helper-methods?
	private static generateToyGolem_MetalRace(): RacialJob {
		let baseAttributes = new Set<{affectedAttribute: Attributes, baseValue: number}>();

		let attributesSet = new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>();
		attributesSet.add({affectedAttribute: Attributes.STR, pointsPerLevel: 2});
		attributesSet.add({affectedAttribute: Attributes.CON, pointsPerLevel: 2});
		attributesSet.add({affectedAttribute: Attributes.INT, pointsPerLevel: 2});
		attributesSet.add({affectedAttribute: Attributes.WIS, pointsPerLevel: 2});
		attributesSet.add({affectedAttribute: Attributes.DEX, pointsPerLevel: 2});
		attributesSet.add({affectedAttribute: Attributes.AGL, pointsPerLevel: 2});
		attributesSet.add({affectedAttribute: Attributes.CHA, pointsPerLevel: 2});
		attributesSet.add({affectedAttribute: Attributes.WILL, pointsPerLevel: 2});
		attributesSet.add({affectedAttribute: Attributes.PER, pointsPerLevel: 2});
		attributesSet.add({affectedAttribute: Attributes.LUCK, pointsPerLevel: 2});

		// These are the points simply having any levels in this job brings to a defense
		let baseDefenses = new Set<{affectedDefense: Defenses, baseValue: number}>();
		baseDefenses.add({affectedDefense: Defenses.ARM, baseValue: 20});
		baseDefenses.add({affectedDefense: Defenses.END, baseValue: 10});
		baseDefenses.add({affectedDefense: Defenses.COOL, baseValue: 20});

		// These are the points each level of this job brings to a defense
		let defensesSet = new Set<{affectedDefense: Defenses, pointsPerLevel: number}>();

		let basePools = new Set<{affectedPool: Pools, baseValue: number}>();
		basePools.add({affectedPool: Pools.HP, baseValue: 30});

		return new RacialJob("ToyGolem_Metal", baseAttributes, attributesSet,
			baseDefenses, defensesSet, basePools, 1, 6, 3, false);
	}
}