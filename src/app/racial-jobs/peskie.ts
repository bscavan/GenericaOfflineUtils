import { Attributes, Defenses, Pools } from "../attribute-keys";
import { RacialJob } from "./racial-job";

export class Peskie extends RacialJob {
	private static peskieRace = null;

	public static getPeskieRace(): RacialJob {
		if(this.peskieRace == null) {
			this.peskieRace = this.generatePeskieRace();
		}

		return this.peskieRace;
	}

	// TODO: Refactor these into static methods?
	private static generatePeskieRace(): RacialJob {
		let baseAttributes = new Set<{affectedAttribute: Attributes, baseValue: number}>();
		baseAttributes.add({affectedAttribute: Attributes.STR, baseValue: 10});
		baseAttributes.add({affectedAttribute: Attributes.CON, baseValue: 20});
		baseAttributes.add({affectedAttribute: Attributes.INT, baseValue: 25});
		baseAttributes.add({affectedAttribute: Attributes.WIS, baseValue: 15});
		baseAttributes.add({affectedAttribute: Attributes.DEX, baseValue: 40});
		baseAttributes.add({affectedAttribute: Attributes.AGL, baseValue: 50});
		baseAttributes.add({affectedAttribute: Attributes.CHA, baseValue: 30});
		baseAttributes.add({affectedAttribute: Attributes.WILL, baseValue: 10});
		baseAttributes.add({affectedAttribute: Attributes.PER, baseValue: 25});
		baseAttributes.add({affectedAttribute: Attributes.LUCK, baseValue: 25});

		let attributesSet = new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>();
		attributesSet.add({affectedAttribute: Attributes.STR, pointsPerLevel: 1});
		attributesSet.add({affectedAttribute: Attributes.CON, pointsPerLevel: 1});
		attributesSet.add({affectedAttribute: Attributes.INT, pointsPerLevel: 1});
		attributesSet.add({affectedAttribute: Attributes.WIS, pointsPerLevel: 1});
		attributesSet.add({affectedAttribute: Attributes.DEX, pointsPerLevel: 5});
		attributesSet.add({affectedAttribute: Attributes.AGL, pointsPerLevel: 5});
		attributesSet.add({affectedAttribute: Attributes.CHA, pointsPerLevel: 5});
		attributesSet.add({affectedAttribute: Attributes.WILL, pointsPerLevel: 1});
		attributesSet.add({affectedAttribute: Attributes.PER, pointsPerLevel: 1});
		attributesSet.add({affectedAttribute: Attributes.LUCK, pointsPerLevel: 1});

		// These are the points simply having any levels in this job brings to a defense
		let baseDefenses = new Set<{affectedDefense: Defenses, baseValue: number}>();
		baseDefenses.add({affectedDefense: Defenses.END, baseValue: 5});
		baseDefenses.add({affectedDefense: Defenses.COOL, baseValue: 10});
		baseDefenses.add({affectedDefense: Defenses.FATE, baseValue: 10});

		// These are the points each level of this job brings to a defense
		let defensesSet = new Set<{affectedDefense: Defenses, pointsPerLevel: number}>();
		defensesSet.add({affectedDefense: Defenses.COOL, pointsPerLevel: 5});
		defensesSet.add({affectedDefense: Defenses.FATE, pointsPerLevel: 5});

		let basePools = new Set<{affectedPool: Pools, baseValue: number}>();
		// Peskies don't have any base pool values.

		let peskie = new RacialJob("Peskie", baseAttributes, attributesSet,
			baseDefenses, defensesSet, basePools, 0, 4, 2, false);
		// TODO: Set up a helper method to calculate base attributes?
		// Well, in most cases it's either an average of two other races
		// (like beastkin and half-breeds), or it's "addition," but one of the
		// two is zero (like with toy golems)

		// Remember that you're going to automate this in the future.
		// The GM is going to be able to import CSVs (from Excel)/JSON (manually made?),
		// or manually enter the values through a GUI

		return peskie;
	}
}