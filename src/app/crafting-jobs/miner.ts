import { Attributes } from "../attribute-keys";
import { CraftingJob } from "./crafting-job";

export class Miner extends CraftingJob {
	private static minerJob = null;

	public static getMinerJob(): CraftingJob {
		if(this.minerJob == null) {
			this.minerJob = this.generateMinerJob();
		}

		return this.minerJob;
	}

	// TODO: Refactor these into static methods?
	public static generateMinerJob(): CraftingJob {
		let attributesSet = new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>();
		attributesSet.add({affectedAttribute: Attributes.DEXTERITY, pointsPerLevel: 1});
		attributesSet.add({affectedAttribute: Attributes.STRENGTH, pointsPerLevel: 1});

		let miner = new CraftingJob("Miner", attributesSet);

		return miner;
	}
}