import { AdventuringJob } from "./adventuring-job";
import { Attributes, AttributeKeys, Defenses, Pools } from "../attribute-keys";

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

	// TODO: Carefully consider what the implications of having both versions of the 
	// generate method are.
	// This could very easily lead to mulitple versions of each job hanging around...
	public static generateFullyPopulatedBlankAdventuringJob(): AdventuringJob {
		let attributesSet = new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>();
		let defensesSet = new Set<{affectedDefense: Defenses, pointsPerLevel: number}>();
		let basePools = new Set<{affectedPool: Pools, baseValue: number}>();

		AttributeKeys.getAttributeSets().forEach((currentAttributeSet) => {
			attributesSet.add({affectedAttribute: currentAttributeSet.offensiveAttribute, pointsPerLevel: 0});
			attributesSet.add({affectedAttribute: currentAttributeSet.defensiveAttribute, pointsPerLevel: 0});
			defensesSet.add({affectedDefense: currentAttributeSet.defense, pointsPerLevel: 0});
			basePools.add({affectedPool: currentAttributeSet.pool, baseValue: 0});
		});

		let blankAdventuring = new AdventuringJob("", attributesSet);

		blankAdventuring.affectedDefenses = defensesSet;
		blankAdventuring.basePools = basePools;

		return blankAdventuring;
	}
}