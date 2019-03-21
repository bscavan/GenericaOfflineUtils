import { Attributes } from "../attribute-keys";
import { CraftingJob } from "./crafting-job";

export class Tanner extends CraftingJob {
	// TODO: Refactor these into static methods?
	public static getTannerJob(): CraftingJob {
		let attributesSet = new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>();
		attributesSet.add({affectedAttribute: Attributes.DEXTERITY, pointsPerLevel: 1});
		attributesSet.add({affectedAttribute: Attributes.AGILITY, pointsPerLevel: 1});

		let tanner = new CraftingJob("Tanner", attributesSet);

		return tanner;
	}
}