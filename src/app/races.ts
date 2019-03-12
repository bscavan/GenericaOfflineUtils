import { RacialJob } from "./racial-job";
import { Attributes, Defenses, AttributeKeys, Pools } from "./attribute-keys";

export class Races {
	// TODO: Push these methods into a Peskie subclass of the RaceJob class?
	// It would be pretty simple to make these abstract methods...
	public getPeskieRace(): RacialJob {
		let baseAttributes = new Set<{affectedAttribute: Attributes, baseValue: number}>();

		let attributesSet = new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>();
		attributesSet.add({affectedAttribute: Attributes.STRENGTH, pointsPerLevel: 1});
		attributesSet.add({affectedAttribute: Attributes.CONSTITUTION, pointsPerLevel: 1});
		attributesSet.add({affectedAttribute: Attributes.INTELLIGENCE, pointsPerLevel: 1});
		attributesSet.add({affectedAttribute: Attributes.WISDOM, pointsPerLevel: 1});
		attributesSet.add({affectedAttribute: Attributes.DEXTERITY, pointsPerLevel: 5});
		attributesSet.add({affectedAttribute: Attributes.AGILITY, pointsPerLevel: 5});
		attributesSet.add({affectedAttribute: Attributes.CHARISMA, pointsPerLevel: 5});
		attributesSet.add({affectedAttribute: Attributes.WILL, pointsPerLevel: 1});
		attributesSet.add({affectedAttribute: Attributes.PERCEPTION, pointsPerLevel: 1});
		attributesSet.add({affectedAttribute: Attributes.LUCK, pointsPerLevel: 1});

		// These are the points simply having any levels in this job brings to a defense
		let baseDefenses = new Set<{affectedDefense: Defenses, baseValue: number}>();
		baseDefenses.add({affectedDefense: Defenses.ENDURANCE, baseValue: 5});
		baseDefenses.add({affectedDefense: Defenses.COOL, baseValue: 10});
		baseDefenses.add({affectedDefense: Defenses.FATE, baseValue: 10});

		// These are the points each level of this job brings to a defense
		let defensesSet = new Set<{affectedDefense: Defenses, pointsPerLevel: number}>();
		defensesSet.add({affectedDefense: Defenses.COOL, pointsPerLevel: 5});
		defensesSet.add({affectedDefense: Defenses.FATE, pointsPerLevel: 5});

		// TODO: Handle base pools here...
		let basePools = new Set<{affectedPool: Pools, baseValue: number}>();
		// Peskies don't have any base defense values.

		let peskie = new RacialJob("Peskie", baseAttributes, attributesSet,
			baseDefenses, defensesSet, basePools);
		// TODO: Set up a helper method to calculate base attributes?
		// Well, in most cases it's either an average of two other races
		// (like beastkin and half-breeds), or it's "addition," but one of the
		// two is zero (like with toy golems)

		return peskie;
	}


	/* Saving this here as a template:
	 *
	public getPeskieRace(): RacialJob {
		let attributesSet = new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>();
		attributesSet.add({affectedAttribute: Attributes.STRENGTH, pointsPerLevel: 1});
		attributesSet.add({affectedAttribute: Attributes.CONSTITUTION, pointsPerLevel: 1});
		attributesSet.add({affectedAttribute: Attributes.INTELLIGENCE, pointsPerLevel: 1});
		attributesSet.add({affectedAttribute: Attributes.WISDOM, pointsPerLevel: 1});
		attributesSet.add({affectedAttribute: Attributes.DEXTERITY, pointsPerLevel: 1});
		attributesSet.add({affectedAttribute: Attributes.AGILITY, pointsPerLevel: 1});
		attributesSet.add({affectedAttribute: Attributes.CHARISMA, pointsPerLevel: 1});
		attributesSet.add({affectedAttribute: Attributes.WILL, pointsPerLevel: 1});
		attributesSet.add({affectedAttribute: Attributes.PERCEPTION, pointsPerLevel: 1});
		attributesSet.add({affectedAttribute: Attributes.LUCK, pointsPerLevel: 1});

		let defensesSet = new Set<{affectedDefense: Defenses, pointsPerLevel: number}>();
		defensesSet.add({affectedDefense: Defenses.ARMOR, pointsPerLevel: 1});
		defensesSet.add({affectedDefense: Defenses.MENTAL_FORTITUDE, pointsPerLevel: 1});
		defensesSet.add({affectedDefense: Defenses.ENDURANCE, pointsPerLevel: 1});
		defensesSet.add({affectedDefense: Defenses.COOL, pointsPerLevel: 1});
		defensesSet.add({affectedDefense: Defenses.FATE, pointsPerLevel: 1});


		let peskie = new RacialJob("Peskie", attributesSet);


		return peskie;
	}
	 *
	 * 
	 */
}