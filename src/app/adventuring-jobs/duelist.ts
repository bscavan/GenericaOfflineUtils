
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

		// Some basic skills:
		let challenge = new Skill("Challenge", "Calls out a target to fight you", null, null);
		challenge.addCost(5, Pools.MOX);
		challenge.setDuration(5, Duration.MINUTE, Qualifier.NONE);

		duelist.addSkill(1, challenge);

		let parry = new Skill("Parry", "While you have your specialized weapon drawn", null, null);
		//parry.addCost(5, Pools.MOX);
		parry.setDuration(1, Duration.PASSIVE_CONSTANT, Qualifier.NONE);

		duelist.addSkill(5, parry);

		let swinger = new Skill("Swinger", " this skill adds its level to agility rolls when you're attempting to swing from ropes and" +
		"chandeliers and other feats of swashbucklery derring-do", null, null);
		swinger.addCost(10, Pools.STA);
		swinger.setDuration(1, Duration.MINUTE, Qualifier.PER_SKILL_LEVEL);

		duelist.addSkill(5, swinger);

		return duelist;
	}
}