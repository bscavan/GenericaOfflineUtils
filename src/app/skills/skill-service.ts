import { Injectable } from "@angular/core";
import { Skill, SkillTypes } from "./skill";
import { ClassSkill } from "./class-skill";
import { GenericSkill } from "./generic-skill";
import { isNullOrUndefined } from "util";
import { ConfigService } from "../config-service";

@Injectable()
export class SkillService {
	/**
	 * FIXME: This needs to be routinely sorted (alphabetically by name?)
	 * FIXME: Rather than allowing other classes and HTML to directly access this,
	 * they need to maintain their own, local copies that are hooked up to a
	 * subscription to an observable of this list. Whenever this list's content
	 * changes, they will need to re-pull and refresh what they are displaying.
	 */
	/**
	 * A Map of all skills assignable to Jobs and accessible to characters with
	 * levels in those jobs.
	 * The Keys of this map are the skills uuid values and the Values are the
	 * Skills themselves.
	 */
	static allClassSkills: Map<string, ClassSkill> = new Map<string, Skill>();

	/**
	 * FIXME: This needs to be routinely sorted (alphabetically by name?)
	 * FIXME: Rather than allowing other classes and HTML to directly access this,
	 * they need to maintain their own, local copies that are hooked up to a
	 * subscription to an observable of this list. Whenever this list's content
	 * changes, they will need to re-pull and refresh what they are displaying.
	 */
	/**
	 * A Map of all skills assignable directly to characters instead of being
	 * imparted by levels in jobs.
	 * The Keys of this map are the skills uuid values and the Values are the
	 * Skills themselves.
	 */
	static allGenericSkills: Map<string, GenericSkill> = new Map<string, Skill>();

	constructor(configService: ConfigService) {
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

		// FIXME: This is a largely-static class, meaning the constructor is rarely called.
		// Migrate these method cals into a helper-method that gets called once before any
		// of the static methods can be called.

		// TODO: Confirm this isn't giving us a 404 or anything before plugging it into the upload method...
		let foundClassSkillsJson = configService.getClassSkillsJson();
		SkillService.addClassSkillsFromJsonArrayIfMissing(foundClassSkillsJson);

		// TODO: Confirm this isn't giving us a 404 or anything before plugging it into the upload method...
		let foundGenericSkillJson = configService.getGenericSkillsJson();
		SkillService.addGenericSkillsFromJsonArrayIfMissing(foundGenericSkillJson);
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

	public static addClassSkillFromJsonIfMissing(json): boolean {
		if(isNullOrUndefined(json)) {
			// TODO: Fail. Loudly.
			return null;
		} else {
			let newSkill = Skill.deserializeNewSkillFromJSON(json);
			newSkill.type = SkillTypes.CLASS_SKILL;
			SkillService.addClassSkillIfMissing(newSkill);
		}
	}

	public static addClassSkillsFromJsonArrayIfMissing(jsonArray) {
		if(isNullOrUndefined(jsonArray)) {
			console.error("The json provided for importing skills was null or undefined.");
			return null;
		} else {
			let arrayAsJSON = jsonArray.json();

			if(isNullOrUndefined(arrayAsJSON)) {
				console.error("The value provided for importing characters was not parsable as json.");
				return null;
			}

			arrayAsJSON.forEach(skillElementJson => {
				SkillService.addClassSkillFromJsonIfMissing(skillElementJson);
			});
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

	public static addGenericSkillFromJsonIfMissing(json): boolean {
		if(isNullOrUndefined(json)) {
			// TODO: Fail. Loudly.
			return null;
		} else {
			let newSkill = Skill.deserializeNewSkillFromJSON(json);
			newSkill.type = SkillTypes.GENERIC_SKILL;
			SkillService.addGenericSkillIfMissing(newSkill);
		}
	}

	public static addGenericSkillsFromJsonArrayIfMissing(jsonArray) {
		if(isNullOrUndefined(jsonArray)) {
			console.error("The json provided for importing skills was null or undefined.");
			return null;
		} else {
			let arrayAsJSON = jsonArray.json();

			if(isNullOrUndefined(arrayAsJSON)) {
				console.error("The value provided for importing characters was not parsable as json.");
				return null;
			}

			arrayAsJSON.forEach(skillElement => {
				SkillService.addGenericSkillFromJsonIfMissing(skillElement);
			});
		}
	}

	public static getGenericSkill(uuid: string): GenericSkill {
		return SkillService.allGenericSkills.get(uuid);
	}

	public static removeGenericSkill(uuid: string): boolean {
		return SkillService.allGenericSkills.delete(uuid);
	}

	public static addSkillsFromJsonArrayIfMissing(jsonArray) {
		if(isNullOrUndefined(jsonArray)) {
			console.error("The json provided for importing skills was null or undefined.");
			return null;
		} else {
			jsonArray.forEach(skillElement => {
				this.addSkillFromJsonIfMissing(skillElement);
			});
		}
	}

	public static addSkillFromJsonIfMissing(json): boolean {
		if(isNullOrUndefined(json)) {
			// TODO: Fail. Loudly.
			return null;
		} else {
			let newSkill = Skill.deserializeNewSkillFromJSON(json);

			if(newSkill.type === SkillTypes.CLASS_SKILL) {
				SkillService.addClassSkillIfMissing(newSkill);
			} else {
				// We are defaulting to generic skills...
				// TODO: Add a means of converting a generic skill to a class skill?
				SkillService.addGenericSkillIfMissing(newSkill);
			}
		}
	}

	// TODO: Add a means of retrieving skills by name. It isn't foolproof, but it's necessary.
	// TODO: Add a means of adding skills if they don't exist. One that isn't dependent on uuid,
	// but on its actual contents.

	// Exports all of the characters in allKnownCharacters as a JSON array.
	// Excludes characterFocus if it has not been saved/uploaded into the collection.
	public static getAllSkillsAsJSONArray(): {}[] {
		let allSkillsArray = [];

		SkillService.allClassSkills.forEach((currentSkill) => {
			allSkillsArray.push(currentSkill.serializeToJSON());
		});

		SkillService.allGenericSkills.forEach((currentSkill) => {
			allSkillsArray.push(currentSkill.serializeToJSON());
		});

		return allSkillsArray;
	}
}