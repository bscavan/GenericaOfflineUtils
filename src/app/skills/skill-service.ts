import { Injectable } from "@angular/core";
import { Skill } from "./skill";
import { ClassSkill } from "./class-skill";
import { GenericSkill } from "./generic-skill";

@Injectable()
export class SkillService {
	/**
	 * A Map of all skills assignable to Jobs and accessible to characters with
	 * levels in those jobs.
	 * The Keys of this map are the skills uuid values and the Values are the
	 * Skills themselves.
	 */
	static allClassSkills: Map<string, ClassSkill> = new Map<string, Skill>();

	/**
	 * A Map of all skills assignable directly to characters instead of being
	 * imparted by levels in jobs.
	 * The Keys of this map are the skills uuid values and the Values are the
	 * Skills themselves.
	 */
	static allGenericSkills: Map<string, GenericSkill> = new Map<string, Skill>();

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

	public static addClassSkill(newSkill: ClassSkill) {
		SkillService.allClassSkills.set(newSkill.uuid, newSkill);
	}

	/**
	 * Adds a new, unpopulated skill to allClassSkills.
	 */
	// FIXME: Handle the null values in this. Either initialize them to default
	// values or figure out how to handle this in the HTML without it breaking
	// anything over there.
	public static addBlankClassSkill() {
		let newSkill = new ClassSkill("", "", null, null, true);
		SkillService.allClassSkills.set(newSkill.uuid, newSkill);
	}

	/**
	 * Checks allClassSkills for an entry mapped to the name of the provided
	 * skill. If none exists then it is added and true is returned. If a class
	 * skill already exists with that name then it is not added and false is
	 * returned.
	 * @param newSkill 
	 */
	public static addClassSkillIfMissing(newSkill: ClassSkill): boolean {
		if(SkillService.allClassSkills.has(newSkill.uuid) == false) {
			SkillService.allClassSkills.set(newSkill.uuid, newSkill);
			return true;
		} else {
			return false;
		}
	}

	public static getClassSkill(uuid: string): ClassSkill {
		return SkillService.allClassSkills.get(uuid);
	}

	public static removeClassSkill(uuid: string): boolean {
		return SkillService.allClassSkills.delete(uuid);
	}

	public static addGenericSkill(newSkill: GenericSkill) {
		SkillService.allClassSkills.set(newSkill.uuid, newSkill);
	}

	/**
	 * Adds a new, unpopulated skill to allGenericSkills.
	 */
	// FIXME: Handle the null values in this. Either initialize them to default
	// values or figure out how to handle this in the HTML without it breaking
	// anything over there.
	public static addBlankGenericSkill() {
		let newSkill = new GenericSkill("", "", null, null, true);
		SkillService.allGenericSkills.set(newSkill.uuid, newSkill);
	}

	/**
	 * Checks allGenericSkills for an entry mapped to the name of the provide
	 * skill. If none exists then it is added and true is returned. If a
	 * generic skill already exists with that name then it is not added and
	 * false is returned.
	 * @param newSkill 
	 */
	public static addGenericSkillIfMissing(newSkill: GenericSkill): boolean {
		if(SkillService.allGenericSkills.has(newSkill.uuid) == false) {
			SkillService.allGenericSkills.set(newSkill.uuid, newSkill);
			return true;
		} else {
			return false;
		}
	}

	public static getGenericSkill(uuid: string): GenericSkill {
		return SkillService.allGenericSkills.get(uuid);
	}

	public static removeGenericSkill(uuid: string): boolean {
		return SkillService.allGenericSkills.delete(uuid);
	}

	// TODO: Add a means of retrieving skills by name. It isn't foolproof, but it's necessary.
	// TODO: Add a means of adding skills if they don't exist. One that isn't dependent on uuid,
	// but on its actual contents.
}