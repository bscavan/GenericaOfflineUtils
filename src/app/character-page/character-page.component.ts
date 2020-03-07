import { Component, OnInit } from '@angular/core';
import { Races } from '../racial-jobs/races';
import { AdventuringJobs } from '../adventuring-jobs/adventuring-jobs';
import { Professions } from '../crafting-jobs/professions';
import { RacialJob } from '../racial-jobs/racial-job';
import * as FileSaver from 'file-saver';
import { CharacterService } from '../character/character-service';
import { Character } from '../character/character';
import { SkillService } from '../skills/skill-service';
import { isNull } from 'util';
import { Job } from '../job';
import { Skill, Qualifier, SpecialCost } from '../skills/skill';
import { GenericSkill } from '../skills/generic-skill';
import { JobsFoundItem } from './jobs-found-item';
import { ConfigService } from '../config-service';

@Component({
  selector: 'app-character-page',
  templateUrl: './character-page.component.html',
  styleUrls: ['./character-page.component.css']
})
export class CharacterPageComponent implements OnInit {
	public readonly LABEL = Character.LABEL;

	// This is a limitation on the rules we have, not the software itself.
	public readonly MAX_LEVEL = 25;
	allRacialJobs: RacialJob[] = Races.getAllRaces();
	allSupplementalRacialJobs: RacialJob[] = Races.getAllSupplementalRaces();
	allAdventuringJobs = AdventuringJobs.getAllAdventuringJobs();
	allCraftingJobs = Professions.getAllCraftingJobs();
	expanded: boolean = true;

	// control for the ngIf that displays the dropdown of generic skills to add.
	showGenericSkillDropdown: boolean = false;

	genericSkillToAdd: GenericSkill = null;
	genericSkillToAddUUID: string = null;

	// Control for the ngIf on the PointBuy component.
	expandPointBuyOptions: boolean = false;

	// Control for the ngIf on the skills component.
	expandSkillsSection: boolean = false;

	// Control for the ngIf on the character-loading options
	public showLoadDropdown: boolean = false;

	// Control for the ngIf on the manual/testing controls.
	expandOptions:boolean = false;

	/*
	 * NOTICE: This import of SkillService is absolutely necessary. Without it 
	 * the SkillService will not be initialized and it will never load the
	 * skill json file(s) from the assets directory on startup...
	 * @param skillService 
	*/
	constructor(public characterService: CharacterService, skillService: SkillService, configService: ConfigService) {}

	ngOnInit() { }

	createRange(number){
		var items: number[] = [];
		for(var i = 1; i <= number; i++){
			items.push(i);
		}
		return items;
	}

	/*
	// Manual testing code for seriailization.
	public serialize() {
		/*
		// TODO: Put these into a unit-test.
		let moddedPeskieRace = Peskie.getPeskieRace();
		moddedPeskieRace.basePools.add({affectedPool: Pools.HP, baseValue: 7});
		let serializedPeskieJob = moddedPeskieRace.serializeToJSON();
		console.log(serializedPeskieJob);

		let pesudoPeskieJob: RacialJob = BlankRacialJob.getBlankRacialJob();
		pesudoPeskieJob.deserializeFromJSON(serializedPeskieJob);
		*
		let allRaces = Races.getAllRaces();
		let serializedJaxby = this.characterFocus.serializeToJSON();

		console.log(serializedJaxby);

		this.characterFocus.deserializeFromJSON(serializedJaxby);

		let job = this.characterFocus.primaryRacialJob;
		let jobJson = job.serializeToJSON();

		Races.deserializeRacialJob(jobJson);

		let secondLength = Races.getAllRaces().length;
	}
	*/

	public saveAllCharacters() {
		let jobJson = JSON.stringify(this.characterService.getAllCharactersAsJSONArray());
		let jobJsonArray = [];
		jobJsonArray.push(jobJson);

		let blob = new Blob(jobJsonArray, {type: 'text/plain' });
		FileSaver.saveAs(blob, "allCharactersSave" + ".json");
	}

	public save() {
		let filename = "character_" + this.characterService.characterFocus.name + ".save";
		let characterJson = this.characterService.characterFocus.serializeToJSON();
		characterJson = JSON.stringify(characterJson);
		let characterJsonArray = [];
		characterJsonArray.push(characterJson);

		let blob = new Blob(characterJsonArray, {type: 'text/plain' });
		FileSaver.saveAs(blob, filename);
	}

	selectCharacterFromService(index) {
		this.characterService.selectCharacterAtIndex(index);
		this.showLoadDropdown = false;
	}

	getClassSkillLevel(characterFocus: Character, uuid: string) {
		return characterFocus.classSkills.get(uuid);
	}

	getGenericSkillLevel(characterFocus: Character, uuid: string) {
		return characterFocus.getGenericSkillLevel(uuid);
	}

	updateClassSkillLevel(characterFocus: Character, uuid: string, event) {
		let newValue = event.target.value;

		if(newValue < 0) {
			console.error("Cannot set a skill level to less than zero.")
			// Revert the value of the input to it's previous state.
			event.target.value = characterFocus.classSkills.get(uuid);
			return;
		}

		// Get the actual skill object for this from the skill service and find out if it is level-less
		let foundSkill = SkillService.allClassSkills.get(uuid);

		if(isNull(foundSkill)) {
			console.error("Cannot set levels in a skill that does not exist.");
			// TODO: Determine if this uuid should be removed now...
			return;
		}

		if(foundSkill.doesLevel == false) {
			console.error("Cannot set the level of a level-less skill.");
			characterFocus.classSkills.set(uuid, 0);
			event.target.value = 0;
		}
		
		// Determine which job(s) the character got this skill from.
		// The limit is set to the (highest job level*5), with a 5 level increase
		// for each additional job
		let jobsFoundItem: JobsFoundItem = new JobsFoundItem();


		// TODO: Determine if we should terminate searching early if any of the found jobs is at the level-limit (currently level 25...)
		// TODO: Only call this method after a character's levels in a job have changed...
		jobsFoundItem = this.findJobsBySkill(foundSkill, characterFocus.adventuringJobLevels, jobsFoundItem);
		jobsFoundItem = this.findJobsBySkill(foundSkill, characterFocus.craftingJobLevels, jobsFoundItem);
		jobsFoundItem = this.findJobsBySkill(foundSkill, characterFocus.supplementalRacialJobLevels, jobsFoundItem);
		jobsFoundItem = this.classSkillSearchHelper(foundSkill, characterFocus.primaryRacialJob, characterFocus.primaryRacialJobLevel,
			jobsFoundItem);

		// A count of how many jobs grant this skill beyond the first.
		let numberOfSkillDuplicates = 0;

		if(jobsFoundItem.jobsProvidingSkill.length > 0 ) {
			numberOfSkillDuplicates = jobsFoundItem.jobsProvidingSkill.length - 1;
		}

		let actualSkillLevelLimit = (jobsFoundItem.highestJobLevelFound * 5) + (numberOfSkillDuplicates * 5);
		// TODO: Add a set of skill-level buffs to the character?
		// Should that be handled at a different time?

		if(newValue > actualSkillLevelLimit) {
			console.error("Cannot set the level of a class skill to a value greater than five times the highest level a character has in any job granting the skill plus five for each additional job granting that skill");
			characterFocus.classSkills.set(uuid, actualSkillLevelLimit);
			event.target.value = actualSkillLevelLimit;
			return;
		}

		characterFocus.classSkills.set(uuid, newValue);
	}

	// TODO: Only call this method after a character's levels in a job have changed...
	// TODO: Enforce updates to the skill limits whenever this is called.
	private findJobsBySkill(skillToFind: Skill, jobCollection: [{job: Job; level: number;}],
	jobsFoundItem: JobsFoundItem): JobsFoundItem {
		let jobsFoundItem2 = jobsFoundItem;
		jobCollection.forEach((value) => {
			let currentJob = value.job;
			let charactersLevelInThisJob = value.level;

			if(charactersLevelInThisJob > 0) {
				jobsFoundItem2 = this.classSkillSearchHelper(skillToFind, currentJob, charactersLevelInThisJob,
					jobsFoundItem);
			}
		});

		return jobsFoundItem2;
	}

	private classSkillSearchHelper(skillToFind: Skill, currentJob: Job, charactersLevelInThisJob: number,
		jobsFoundItem: JobsFoundItem): JobsFoundItem {
		let jobsFoundItem2 = jobsFoundItem;

		currentJob.skills.forEach((skillsLearnedAtThisLevel: Set<Skill>, levelTheseSkillAreLearned) => {
			if(charactersLevelInThisJob >= levelTheseSkillAreLearned) {
				/*
				 * The character has reached the level necessary to learn
				 * these skills.
				 */
				if(skillsLearnedAtThisLevel.has(skillToFind)) {
					// prevent duplicates
					if(jobsFoundItem2.jobsProvidingSkill.includes(currentJob) == false) {
						jobsFoundItem2.jobsProvidingSkill.push(currentJob);
					}

					if(charactersLevelInThisJob > jobsFoundItem2.highestJobLevelFound) {
						jobsFoundItem2.highestJobLevelFound = charactersLevelInThisJob;
						jobsFoundItem2.highestJobFound = currentJob;
					}
				}
			}
		})

		return jobsFoundItem2;
	}

	updateGenericSkillLevel(characterFocus: Character, uuid: string, event) {
		let newValue = event.target.value;

		if(newValue < 0) {
			console.error("Cannot set a skill level to less than zero.")
			// Revert the value of the input to it's previous state.
			event.target.value = characterFocus.getGenericSkillLevel(uuid);
			return;
		}

		// Get the actual skill object for this from the skill service and find out if it is level-less
		let foundSkill = SkillService.allGenericSkills.get(uuid);

		if(isNull(foundSkill)) {
			console.error("Cannot set levels in a skill that does not exist.");
			// TODO: Determine if this uuid should be removed now...
			// Revert the value of the input to it's previous state.
			event.target.value = characterFocus.getGenericSkillLevel(uuid);
			return;
		}

		// Level-less generic skills can exist, but they are rare and are only awarded for exceptional achievements.
		// They usually have a limited number of uses per day or are passive constants.
		if(foundSkill.doesLevel == false) {
			console.error("Cannot set the level of a level-less skill.");
			// Set the value to 0.
			event.target.value = 0;
			characterFocus.setGenericSkillLevel(uuid, 0);
		}

		// The limit for general skill levels is ten times a character's highest level in any job
		let actualSkillLevelLimit = this.findHighestLevelJob(characterFocus) * 10;

		if(newValue > actualSkillLevelLimit) {
			console.error("Cannot set the level of a generic skill to a value greater than ten times the highest level a character has in any job.");

			// Set the selector's value to the limit.
			event.target.value = actualSkillLevelLimit;
			characterFocus.setGenericSkillLevel(uuid, actualSkillLevelLimit);
			return;
		}

		characterFocus.setGenericSkillLevel(uuid, newValue);
	}

	private findHighestLevelJob(characterFocus: Character) {
		// TODO: Determine if we should terminate early if the level-limit is ever found...
		let highestJobLevelFound: number = characterFocus.primaryRacialJobLevel;

		characterFocus.adventuringJobLevels.forEach((value) => {
			if(value.level > highestJobLevelFound) {
				highestJobLevelFound = value.level;
			}
		});

		characterFocus.craftingJobLevels.forEach((value) => {
			if(value.level > highestJobLevelFound) {
				highestJobLevelFound = value.level;
			}
		});

		characterFocus.supplementalRacialJobLevels.forEach((value) => {
			if(value.level > highestJobLevelFound) {
				highestJobLevelFound = value.level;
			}
		});

		return highestJobLevelFound;
	}

	public getGenericSkill(uuid: string): Skill {
		return SkillService.getGenericSkill(uuid);
	}

	public getAllGenericSkills(): Map<string, GenericSkill> {
		return SkillService.allGenericSkills;
	}

	public getAllGenericSkillKeys() {
		return SkillService.allGenericSkills.keys();
	}

	public addGenericSkillToCharacter() {
		if(this.genericSkillToAddUUID == null) {
			console.log("No skill specified to add.")
			return;
		}

		// If the character does not already have ranks in this skill...
		if(this.characterService.characterFocus.hasGenericSkill(this.genericSkillToAddUUID) == false) {
			let genericSkill = SkillService.getGenericSkill(this.genericSkillToAddUUID);
			this.characterService.characterFocus.addGenericSkillItem(this.genericSkillToAddUUID, genericSkill);
		}

		this.showGenericSkillDropdown = false;
		this.genericSkillToAdd = null;
		this.genericSkillToAddUUID = null;
	}

	public removeGenericSkillFromCharacter(skillToRemove: GenericSkill) {
		if(this.characterService.characterFocus.deleteGenericSkill(skillToRemove.uuid) == false) {
			console.error("Cannot delete skill with uuid: [" + skillToRemove.uuid
				+ "] because the character does not know it.");
		}
	}

	public showSkillDuration(otherSkill: Skill) {
		if(otherSkill.duration.qualifier === Qualifier.NONE) {
			return false;
		} else {
			return true;
		}
	}

	public showCost(cost) {
		if(cost.costDenomination === SpecialCost.NONE) {
			return false;
		} else {
			return true;
		}
	}
}
