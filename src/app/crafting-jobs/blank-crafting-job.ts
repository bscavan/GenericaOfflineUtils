import { Attributes, Defenses, Pools, AttributeKeys } from "../attribute-keys";
import { CraftingJob } from "./crafting-job";

export class BlankCraftingJob extends CraftingJob {
	private static blankCraftingJob = null;

		// FIXME: This produces a single instance of the "blank" job, that anyone can edit and change for everyone...
	public static getBlankCraftingJob(): CraftingJob {
		if(this.blankCraftingJob == null) {
			this.blankCraftingJob = this.generateBlankCraftingJob();
		}

		return this.blankCraftingJob;
	}

	// TODO: Refactor these into static methods?
	public static generateBlankCraftingJob(): CraftingJob {
		let attributesSet = new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>();

		let blankCraftingJob = new CraftingJob("", attributesSet);

		return blankCraftingJob;
	}

	// TODO: Carefully consider what the implications of having both versions of the 
	// generate method are.
	// This could very easily lead to mulitple versions of each job hanging around...
	public static generateFullyPopulatedBlankCraftingJob(): CraftingJob {
		let attributesSet = new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>();
		let defensesSet = new Set<{affectedDefense: Defenses, pointsPerLevel: number}>();
		let basePools = new Set<{affectedPool: Pools, baseValue: number}>();

		AttributeKeys.getAttributeSets().forEach((currentAttributeSet) => {
			attributesSet.add({affectedAttribute: currentAttributeSet.offensiveAttribute, pointsPerLevel: 0});
			attributesSet.add({affectedAttribute: currentAttributeSet.defensiveAttribute, pointsPerLevel: 0});
			defensesSet.add({affectedDefense: currentAttributeSet.defense, pointsPerLevel: 0});
			basePools.add({affectedPool: currentAttributeSet.pool, baseValue: 0});
		});

		let blankCrafting = new CraftingJob("", attributesSet);

		blankCrafting.affectedDefenses = defensesSet;
		blankCrafting.basePools = basePools;

		return blankCrafting;
	}
}