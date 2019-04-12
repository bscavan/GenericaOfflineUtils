
import { AdventuringJob } from "./adventuring-job";
import { Attributes } from "../attribute-keys";

export class Mercenary extends AdventuringJob {
	private static mercenaryJob = null;

	public static getMercenaryJob(): AdventuringJob {
		if(this.mercenaryJob == null) {
			this.mercenaryJob = this.generateMercenaryJob();
		}

		return this.mercenaryJob;
	}

	// TODO: Refactor these into static methods?
	public static generateMercenaryJob(): AdventuringJob {
		let attributesSet = new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>();
		attributesSet.add({affectedAttribute: Attributes.STR, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.DEX, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.PER, pointsPerLevel: 3});

		let mercenary = new AdventuringJob("Mercenary", attributesSet);

		return mercenary;
	}
}