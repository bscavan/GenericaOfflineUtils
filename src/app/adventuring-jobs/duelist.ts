
import { AdventuringJob } from "./adventuring-job";
import { Attributes, Pools } from "../attribute-keys";
import { Skill, Duration, Qualifier } from "../skills/skill";

export class Duelist extends AdventuringJob {
	private static duelistJob = null;

	public static getDuelistJob(): AdventuringJob {
		if(this.duelistJob == null) {
			this.duelistJob = this.generateDuelistJob();
		}

		return this.duelistJob;
	}

	// TODO: Refactor these into static methods?
	public static generateDuelistJob(): AdventuringJob {
		let attributesSet = new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>();
		attributesSet.add({affectedAttribute: Attributes.STR, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.DEX, pointsPerLevel: 3});
		attributesSet.add({affectedAttribute: Attributes.AGL, pointsPerLevel: 3});

		let duelist = new AdventuringJob("Duelist", attributesSet);

		return duelist;
	}
}