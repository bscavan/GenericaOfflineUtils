import { Attributes } from "../attribute-keys";
import { CraftingJob } from "./crafting-job";

export class Tanner extends CraftingJob {
	private static tannerJob = null;

	public static getTannerJob(): CraftingJob {
		if(this.tannerJob == null) {
			this.tannerJob = this.generateTannerJob();
		}

		return this.tannerJob;
	}

	// TODO: Refactor these into static methods?
	public static generateTannerJob(): CraftingJob {
		let attributesSet = new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>();
		attributesSet.add({affectedAttribute: Attributes.DEX, pointsPerLevel: 1});
		attributesSet.add({affectedAttribute: Attributes.AGL, pointsPerLevel: 1});

		let tanner = new CraftingJob("Tanner", attributesSet);

		return tanner;
	}
}