import { Injectable } from "@angular/core";
import { Skill } from "./skill";

@Injectable()
export class SkillService {
	/**
	 * A Map of all skills assignable to Jobs and accessible to characters with
	 * levels in those jobs.
	 * The Keys of this map are the skills uuid values and the Values are the
	 * Skills themselves.
	 */
	static allSkills: Map<string, Skill> = new Map<string, Skill>();

	// TODO: Add a collection for holding the general skills!

	constructor() {
		/*
		// TODO: Remove these skills once we're done testing.
		// TODO: Make sure the skills in jobs get added when the jobs are created.
		let challenge = new Skill("Challenge", "Calls out a target to fight you", null, null);
		challenge.addCost(5, Pools.MOX);
		challenge.setDuration(5, Duration.MINUTE, Qualifier.NONE);
		this.addSkill(challenge);

		let parry = new Skill("Parry", "While you have your specialized weapon drawn", null, null);
		//parry.addCost(5, Pools.MOX);
		parry.setDuration(1, Duration.PASSIVE_CONSTANT, Qualifier.NONE);
		this.addSkill(parry);

		let swinger = new Skill("Swinger", " this skill adds its level to agility rolls when you're attempting to swing from ropes and" +
		"chandeliers and other feats of swashbucklery derring-do", null, null);
		swinger.addCost(10, Pools.STA);
		swinger.setDuration(1, Duration.MINUTE, Qualifier.PER_SKILL_LEVEL);
		this.addSkill(swinger);
		*/
	}

	public static addSkill(newSkill: Skill) {
		SkillService.allSkills.set(newSkill.uuid, newSkill);
	}

	/**
	 * Adds a new, unpopulated skill to the collection.
	 */
	// FIXME: Handle the null values in this. Either initialize them to default
	// values or figure out how to handle this in the HTML without it breaking
	// anything over there.
	public static addBlankSkill() {
		let newSkill = new Skill("", "", null, null);
		SkillService.allSkills.set(newSkill.uuid, newSkill);
	}

	/**
	 * Checks allSkills for an entry mapped to the name of the provided skill.
	 * If none exists then it is added and true is returned. If a skill already
	 * exists with that name then it is not added and false is returned.
	 * @param newSkill 
	 */
	public static addSkillIfMissing(newSkill: Skill): boolean {
		if(SkillService.allSkills.has(newSkill.uuid) == false) {
			SkillService.allSkills.set(newSkill.uuid, newSkill);
			return true;
		} else {
			return false;
		}
	}

	public static getSkill(uuid: string): Skill {
		return SkillService.allSkills.get(uuid);
	}

	public static removeSkill(uuid: string): boolean {
		return SkillService.allSkills.delete(uuid);
	}

	// TODO: Add a means of retrieving skills by name. It isn't foolproof, but it's necessary.
	// TODO: Add a means of adding skills if they don't exist. One that isn't dependent on uuid,
	// but on its actual contents.
}