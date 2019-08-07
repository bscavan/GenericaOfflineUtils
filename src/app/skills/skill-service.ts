import { Injectable } from "@angular/core";
import { Skill } from "./skill";

@Injectable()
export class SkillService {
	allSkills: Map<string, Skill> = new Map<string, Skill>();

	constructor() {
	}

	public addSkill(newSkill: Skill) {
		this.allSkills.set(newSkill.name, newSkill);
	}

	/**
	 * Checks allSkills for an entry mapped to the name of the provided skill.
	 * If none exists then it is added and true is returned. If a skill already
	 * exists with that name then it is not added and false is returned.
	 * @param newSkill 
	 */
	public addSkillIfMissing(newSkill: Skill): boolean {
		if(this.allSkills.has(newSkill.name) == false) {
			this.allSkills.set(newSkill.name, newSkill);
			return true;
		} else {
			return false;
		}
	}

	public getSkill(name: string): Skill {
		return this.allSkills.get(name);
	}
}