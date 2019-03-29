import { Attributes } from "../attribute-keys";
import { CraftingJob } from "./crafting-job";

export class BlankCraftingJob extends CraftingJob {
	private static blankCraftingJob = null;

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
}