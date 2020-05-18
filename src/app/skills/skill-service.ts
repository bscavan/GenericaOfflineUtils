import { Injectable } from "@angular/core";
import { Skill, SkillTypes } from "./skill";
import { ClassSkill } from "./class-skill";
import { GenericSkill } from "./generic-skill";
import { isNullOrUndefined } from "util";
import { ConfigService } from "../config-service";
import { Store } from "@ngxs/store";
import { Observable, fromEvent } from "rxjs";
import { ActionUtil } from "../action-util";
import { delay } from "rxjs/operators";
import { ClassSkillUpdateAction, ClassSkillDeleteAction } from "../actions/class-skill-update-action";
import { GenericSkillUpdateAction, GenericSkillDeleteAction } from "../actions/generic-skill-update-action";
import { Job } from "../job";

@Injectable()
export class SkillService {
	source$: Observable<Event>;

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
	allClassSkills: Map<string, ClassSkill> = new Map<string, Skill>();

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
	allGenericSkills: Map<string, GenericSkill> = new Map<string, Skill>();

	constructor(configService: ConfigService, private store: Store) {
		// FIXME: This is a largely-static class, meaning the constructor is rarely called.
		// Migrate these method cals into a helper-method that gets called once before any
		// of the static methods can be called.

		// TODO: Confirm this isn't giving us a 404 or anything before plugging it into the upload method...
		let foundClassSkillsJson = configService.getClassSkillsJson();
		this.addClassSkillsFromJsonArrayIfMissing(foundClassSkillsJson);

		// TODO: Confirm this isn't giving us a 404 or anything before plugging it into the upload method...
		let foundGenericSkillJson = configService.getGenericSkillsJson();
		this.addGenericSkillsFromJsonArrayIfMissing(foundGenericSkillJson);

		this.initializeActionListener();
	}

	public addSkillsfromJobIfMissing(job: Job){
		job.skills.forEach((currentSkillSet: Set<Skill>, currentLevel: number) => {
			currentSkillSet.forEach((currentSkill: Skill) => {
				this.addClassSkillIfMissing(currentSkill);
			})
		});
	}

	// To be used whenever another class or html alters the skill.
	// Propigates changes in skills to the LocalStorage.
	public syncClassSkill(uuid: string) {
		let skill = this.getClassSkill(uuid);

		if(isNullOrUndefined(skill) == false) {
			this.dispatchClassSkillUpdate(skill);
		}
	}

	public setClassSkill(newSkill: ClassSkill) {
		this.allClassSkills.set(newSkill.uuid, newSkill);
		this.dispatchClassSkillUpdate(newSkill);
	}

	public addClassSkill(newSkill: ClassSkill) {
		this.setClassSkill(newSkill);
	}

	/**
	 * Adds a new, unpopulated skill to allClassSkills.
	 */
	// FIXME: Handle the null values in this. Either initialize them to default
	// values or figure out how to handle this in the HTML without it breaking
	// anything over there.
	public addBlankClassSkill() {
		let newSkill = new ClassSkill("", "", null, null, true);
		this.setClassSkill(newSkill);
	}

	/**
	 * Checks allClassSkills for an entry mapped to the name of the provided
	 * skill. If none exists then it is added and true is returned. If a class
	 * skill already exists with that name then it is not added and false is
	 * returned.
	 * @param newSkill 
	 */
	public addClassSkillIfMissing(newSkill: ClassSkill): boolean {
		if(this.allClassSkills.has(newSkill.uuid) == false) {
			this.setClassSkill(newSkill);
			return true;
		} else {
			return false;
		}
	}

	public addClassSkillFromJsonIfMissing(json): boolean {
		if(isNullOrUndefined(json)) {
			// TODO: Fail. Loudly.
			return null;
		} else {
			let newSkill = Skill.deserializeNewSkillFromJSON(json);
			newSkill.type = SkillTypes.CLASS_SKILL;
			this.addClassSkillIfMissing(newSkill);
		}
	}

	public addClassSkillsFromJsonArrayIfMissing(jsonArray) {
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
				this.addClassSkillFromJsonIfMissing(skillElementJson);
			});
		}
	}

	public getClassSkill(uuid: string): ClassSkill {
		return this.allClassSkills.get(uuid);
	}

	public removeClassSkill(uuid: string): boolean {
		let returnValue = this.allClassSkills.delete(uuid);
		this.dispatchClassSkillDelete(uuid);
		return returnValue;
	}

	public addNewCostToClassSkill(uuid: string) {
		let skill = this.getClassSkill(uuid);

		if(isNullOrUndefined(skill) == false) {
			skill.addEmptyCost();
			this.dispatchClassSkillUpdate(skill);
		}
	}

	public removeCostFromClassSkill(uuid: string, index: number) {
		let skill = this.getClassSkill(uuid);

		if(isNullOrUndefined(skill) == false) {
			skill.removeCost(index);
			this.dispatchClassSkillUpdate(skill);
		}
	}

	public syncGenericSkill(uuid: string) {
		let skill = this.getGenericSkill(uuid);

		if(isNullOrUndefined(skill) == false) {
			this.dispatchGenericSkillUpdate(skill);
		}
	}

	public setGenericSkill(newSkill: GenericSkill) {
		this.allGenericSkills.set(newSkill.uuid, newSkill);
		this.dispatchGenericSkillUpdate(newSkill);
	}

	public addGenericSkill(newSkill: GenericSkill) {
		this.setGenericSkill(newSkill);
	}

	/**
	 * Adds a new, unpopulated skill to allGenericSkills.
	 */
	// FIXME: Handle the null values in this. Either initialize them to default
	// values or figure out how to handle this in the HTML without it breaking
	// anything over there.
	public addBlankGenericSkill() {
		let newSkill = new GenericSkill("", "", null, null, true);
		this.setGenericSkill(newSkill);
	}

	/**
	 * Checks allGenericSkills for an entry mapped to the name of the provide
	 * skill. If none exists then it is added and true is returned. If a
	 * generic skill already exists with that name then it is not added and
	 * false is returned.
	 * @param newSkill 
	 */
	public addGenericSkillIfMissing(newSkill: GenericSkill): boolean {
		if(this.allGenericSkills.has(newSkill.uuid) == false) {
			this.setGenericSkill(newSkill);
			return true;
		} else {
			return false;
		}
	}

	public addGenericSkillFromJsonIfMissing(json): boolean {
		if(isNullOrUndefined(json)) {
			// TODO: Fail. Loudly.
			return null;
		} else {
			let newSkill = Skill.deserializeNewSkillFromJSON(json);
			newSkill.type = SkillTypes.GENERIC_SKILL;
			this.addGenericSkillIfMissing(newSkill);
		}
	}

	public addGenericSkillsFromJsonArrayIfMissing(jsonArray) {
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
				this.addGenericSkillFromJsonIfMissing(skillElement);
			});
		}
	}

	public getGenericSkill(uuid: string): GenericSkill {
		return this.allGenericSkills.get(uuid);
	}

	public removeGenericSkill(uuid: string): boolean {
		let returnValue = this.allGenericSkills.delete(uuid);
		this.dispatchGenericSkillDelete(uuid);
		return returnValue;
	}

	public addNewCostToGenericSkill(uuid: string) {
		let skill = this.getGenericSkill(uuid);

		if(isNullOrUndefined(skill) == false) {
			skill.addEmptyCost();
			this.dispatchGenericSkillUpdate(skill);
		}
	}

	public removeCostFromGenericSkill(uuid: string, index: number) {
		let skill = this.getGenericSkill(uuid);

		if(isNullOrUndefined(skill) == false) {
			skill.removeCost(index);
			this.dispatchGenericSkillUpdate(skill);
		}
	}

	public addSkillsFromJsonArrayIfMissing(jsonArray) {
		if(isNullOrUndefined(jsonArray)) {
			console.error("The json provided for importing skills was null or undefined.");
			return null;
		} else {
			jsonArray.forEach(skillElement => {
				this.addSkillFromJsonIfMissing(skillElement);
			});
		}
	}

	public addSkillFromJsonIfMissing(json): boolean {
		if(isNullOrUndefined(json)) {
			// TODO: Fail. Loudly.
			return null;
		} else {
			let newSkill = Skill.deserializeNewSkillFromJSON(json);

			if(newSkill.type === SkillTypes.CLASS_SKILL) {
				this.addClassSkillIfMissing(newSkill);
			} else {
				// We are defaulting to generic skills...
				// TODO: Add a means of converting a generic skill to a class skill?
				this.addGenericSkillIfMissing(newSkill);
			}
		}
	}

	// TODO: Add a means of retrieving skills by name. It isn't foolproof, but it's necessary.
	// TODO: Add a means of adding skills if they don't exist. One that isn't dependent on uuid,
	// but on its actual contents.

	// Exports all of the characters in allKnownCharacters as a JSON array.
	// Excludes characterFocus if it has not been saved/uploaded into the collection.
	public getAllSkillsAsJSONArray(): {}[] {
		let allSkillsArray = [];

		this.allClassSkills.forEach((currentSkill) => {
			allSkillsArray.push(currentSkill.serializeToJSON());
		});

		this.allGenericSkills.forEach((currentSkill) => {
			allSkillsArray.push(currentSkill.serializeToJSON());
		});

		return allSkillsArray;
	}

	// Only run this if the skill has changed.
	private dispatchClassSkillUpdate(skill: ClassSkill){
		this.store.dispatch(new ClassSkillUpdateAction());
		localStorage.setItem(ActionUtil.ACTION_KEY, ClassSkillUpdateAction.type);
		localStorage.setItem(ClassSkillUpdateAction.type, skill.uuid);
		let skillAsJson = JSON.stringify(skill.serializeToJSON());
		localStorage.setItem(skill.uuid, skillAsJson);
	}

	// Only run this if the skill has been deleted.
	private dispatchClassSkillDelete(uuid: string){
		this.store.dispatch(new ClassSkillDeleteAction());
		localStorage.setItem(ActionUtil.ACTION_KEY, ClassSkillDeleteAction.type);
		localStorage.setItem(ClassSkillDeleteAction.type, uuid);
		localStorage.setItem(uuid, null);
	}

	// Only run this if the skill has changed.
	private dispatchGenericSkillUpdate(skill: GenericSkill){
		this.store.dispatch(new GenericSkillUpdateAction());
		localStorage.setItem(ActionUtil.ACTION_KEY, GenericSkillUpdateAction.type);
		localStorage.setItem(GenericSkillUpdateAction.type, skill.uuid);
		let skillAsJson = JSON.stringify(skill.serializeToJSON());
		localStorage.setItem(skill.uuid, skillAsJson);
	}

	// Only run this if the skill has deleted.
	private dispatchGenericSkillDelete(uuid: string){
		this.store.dispatch(new GenericSkillDeleteAction());
		localStorage.setItem(ActionUtil.ACTION_KEY, GenericSkillDeleteAction.type);
		localStorage.setItem(GenericSkillDeleteAction.type, uuid);
		localStorage.setItem(uuid, null);
	}

	private initializeActionListener() {
		this.source$ = fromEvent(window, 'storage');
		this.source$.pipe(delay(500)).subscribe(
			ldata => {
				let lastActionPerformed = localStorage.getItem(ActionUtil.ACTION_KEY);

				
								/**
When we get an update in races, we need to check the current job in progress. If that job is the currently selected one, we need to reload it?
	At least signal to the user that it has changes that haven't been loaded?
	Also, when the racial job updates, the character-page decides that it has an out-of-date version of the job (and rightly so, since we _REPLACED_ it rather than altering it) so it doesn't appear in the dropdown.
		Therefore, the solution is to _NOT_ replace it. We need to iterate over every value in the job and change the old job to match the new one without replacing it. That will preserve the references to it.
								 */
				if(lastActionPerformed) {
					if(lastActionPerformed === ClassSkillUpdateAction.type) {
						let uuidOfUpdatedSkill = localStorage.getItem(ClassSkillUpdateAction.type);

						if(uuidOfUpdatedSkill) {
							let jsonOfUpdatedSkill = localStorage.getItem(uuidOfUpdatedSkill);

							if(jsonOfUpdatedSkill) {
								// TODO: Error handling on this method
								let parsed = JSON.parse(jsonOfUpdatedSkill);
								
								// let updatedSkill: ClassSkill = ClassSkill.deserializeNewSkillFromJSON(parsed);
								// this.allClassSkills.set(uuidOfUpdatedSkill, updatedSkill);

								// TODO: What do I do if this doesn't exist?
								this.allClassSkills.get(uuidOfUpdatedSkill).deserializeFromJSON(parsed);
							}
						}
					} else if(lastActionPerformed === ClassSkillDeleteAction.type) {
						let uuidOfUpdatedSkill = localStorage.getItem(ClassSkillDeleteAction.type);

						if(uuidOfUpdatedSkill) {
							this.allClassSkills.delete(uuidOfUpdatedSkill);
						}
					} else if(lastActionPerformed === GenericSkillUpdateAction.type) {
						let uuidOfUpdatedSkill = localStorage.getItem(GenericSkillUpdateAction.type);

						if(uuidOfUpdatedSkill) {
							let jsonOfUpdatedSkill = localStorage.getItem(uuidOfUpdatedSkill);

							if(jsonOfUpdatedSkill) {
								// TODO: Error handling on this method
								let parsed = JSON.parse(jsonOfUpdatedSkill);
								// let updatedSkill: GenericSkill = GenericSkill.deserializeNewSkillFromJSON(parsed);
								// this.allGenericSkills.set(uuidOfUpdatedSkill, updatedSkill);
								this.allGenericSkills.get(uuidOfUpdatedSkill).deserializeFromJSON(parsed);
							}
						}
					} else if(lastActionPerformed === GenericSkillDeleteAction.type) {
						let uuidOfUpdatedSkill = localStorage.getItem(GenericSkillDeleteAction.type);

						if(uuidOfUpdatedSkill) {
							this.allGenericSkills.delete(uuidOfUpdatedSkill);
						}
					}
				}
			}
		);
	}
}