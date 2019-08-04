import { Injectable } from "@angular/core";
import { Skill } from "./skill";

@Injectable()
export class SkillService {
	// Should this be a set, or a Map based on name?
	// Or perhaps based on uuid?
	// I'm pretty sure I really don't want duplicate skills.
	allSkills: Set<Skill> = new Set<Skill>();

	constructor() {
	}

	public addSkill(newSkill: Skill) {
		this.allSkills.add(newSkill);
	}
}