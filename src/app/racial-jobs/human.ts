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
		baseAttributes.add({affectedAttribute: Attributes.STRENGTH, baseValue: 25});
		baseAttributes.add({affectedAttribute: Attributes.CONSTITUTION, baseValue: 25});
		baseAttributes.add({affectedAttribute: Attributes.INTELLIGENCE, baseValue: 25});
		baseAttributes.add({affectedAttribute: Attributes.WISDOM, baseValue: 25});
		baseAttributes.add({affectedAttribute: Attributes.DEXTERITY, baseValue: 25});
		baseAttributes.add({affectedAttribute: Attributes.AGILITY, baseValue: 25});
		baseAttributes.add({affectedAttribute: Attributes.CHARISMA, baseValue: 25});
		baseAttributes.add({affectedAttribute: Attributes.WILL, baseValue: 25});
		baseAttributes.add({affectedAttribute: Attributes.PERCEPTION, baseValue: 25});
		baseAttributes.add({affectedAttribute: Attributes.LUCK, baseValue: 25});

		let attributesSet = new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>();
		attributesSet.add({affectedAttribute: Attributes.STRENGTH, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.CONSTITUTION, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.INTELLIGENCE, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.WISDOM, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.DEXTERITY, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.AGILITY, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.CHARISMA, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.WILL, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.PERCEPTION, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.LUCK, pointsPerLevel: 3});

		// These are the points simply having any levels in this job brings to a defense
		let baseDefenses = new Set<{affectedDefense: Defenses, baseValue: number}>();

		// These are the points each level of this job brings to a defense
		let defensesSet = new Set<{affectedDefense: Defenses, pointsPerLevel: number}>();
		defensesSet.add({affectedDefense: Defenses.ARMOR, pointsPerLevel: 1});
		defensesSet.add({affectedDefense: Defenses.COOL, pointsPerLevel: 3});
		defensesSet.add({affectedDefense: Defenses.ENDURANCE, pointsPerLevel: 3});
		defensesSet.add({affectedDefense: Defenses.MENTAL_FORTITUDE, pointsPerLevel: 3});

		let basePools = new Set<{affectedPool: Pools, baseValue: number}>();
		// Humans don't have any base pool values.

		return new RacialJob("Human", baseAttributes, attributesSet,
			baseDefenses, defensesSet, basePools, 0, 7, 3, true);
	}
}