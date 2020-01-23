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
import { Skill } from '../skills/skill';



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

	// Control for the ngIf on the PointBuy component.
	expandPointBuyOptions: boolean = false;

	// Control for the ngIf on the skills component.
	expandSkillsSection: boolean = false;

	// Control for the ngIf on the manual/testing controls.
	expandOptions:boolean = false;

	constructor(public characterService: CharacterService) {
	}

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

	public save() {
		let filename = "character_" + this.characterService.characterFocus.name + ".save";
		let characterJson = this.characterService.characterFocus.serializeToJSON();
		characterJson = JSON.stringify(characterJson);
		let characterJsonArray = [];
		characterJsonArray.push(characterJson);

		let blob = new Blob(characterJsonArray, {type: 'text/plain' });
		FileSaver.saveAs(blob, filename);
	}

	getSkillLevel(characterFocus: Character, uuid: string) {
		return characterFocus.classSkills.get(uuid);
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
		}
		
		// Determine which job(s) the character got this skill from.
		// The limit is set to the (highest job level*5), with a 5 level increase
		// for each additional job
		let jobsProvidingSkill: Job[] = [];
		let highestJobFound: Job = null;
		let highestJobLevelFound = 0;

		// TODO: Determine if we should terminate searching early if any of the found jobs is at the level-limit (currently level 25...)
		// TODO: Only call this method after a character's levels in a job have changed...
		this.findJobsBySkill(foundSkill, characterFocus.adventuringJobLevels, jobsProvidingSkill, highestJobFound, highestJobLevelFound);
		this.findJobsBySkill(foundSkill, characterFocus.craftingJobLevels, jobsProvidingSkill, highestJobFound, highestJobLevelFound);
		this.findJobsBySkill(foundSkill, characterFocus.supplementalRacialJobLevels, jobsProvidingSkill, highestJobFound, highestJobLevelFound);
		this.classSkillSearchHelper(foundSkill, characterFocus.primaryRacialJob, characterFocus.primaryRacialJobLevel,
			jobsProvidingSkill, highestJobFound, highestJobLevelFound);

		let actualSkillLevelLimit = (highestJobLevelFound * 5) + (jobsProvidingSkill.length * 5);
		// TODO: Add a set of skill-level buffs to the character?
		// Should that be handled at a different time?

		if(newValue > actualSkillLevelLimit) {
			console.error("Cannot set the level of a class skill to a value greater than five times the highest level a character has in any job granting the skill plus five for each additional job granting that skill");
			characterFocus.classSkills.set(uuid, actualSkillLevelLimit);
			return;
		}

		characterFocus.classSkills.set(uuid, newValue);
	}

	// TODO: Only call this method after a character's levels in a job have changed...
	private findJobsBySkill(skillToFind: Skill, jobCollection: [{job: Job; level: number;}],
	jobsProvidingSkill: Job[], highestJobFound: Job, highestJobLevelFound: number) {
		jobCollection.forEach((value, charactersLevelInThisJob) => {
			let currentJob = value.job;
			this.classSkillSearchHelper(skillToFind, currentJob, charactersLevelInThisJob,
				jobsProvidingSkill, highestJobFound, highestJobLevelFound);
		});
	}

	private classSkillSearchHelper(skillToFind: Skill, currentJob: Job, charactersLevelInThisJob: number,
	jobsProvidingSkill: Job[], highestJobFound: Job, highestJobLevelFound: number) {
		currentJob.skills.forEach((skillsLearnedAtThisLevel: Set<Skill>, levelTheseSkillAreLearned) => {
			if(charactersLevelInThisJob >= levelTheseSkillAreLearned) {
				/*
				 * The character has reached the level necessary to learn
				 * these skills.
				 */
				if(skillsLearnedAtThisLevel.has(skillToFind)) {
					// prevent duplicates
					if(jobsProvidingSkill.includes(currentJob) == false) {
						jobsProvidingSkill.push(currentJob);
					}

					if(charactersLevelInThisJob > highestJobLevelFound) {
						highestJobLevelFound = charactersLevelInThisJob;
						highestJobFound = currentJob;
					}
				}
			}
		})
	}

	updateGenericSkillLevel(characterFocus: Character, uuid: string, event) {
		let newValue = event.target.value;

		if(newValue < 0) {
			console.error("Cannot set a skill level to less than zero.")
			// Revert the value of the input to it's previous state.
			event.target.value = characterFocus.genericSkills.get(uuid);
			return;
		}

		// Get the actual skill object for this from the skill service and find out if it is level-less
		let foundSkill = SkillService.allClassSkills.get(uuid);

		if(isNull(foundSkill)) {
			console.error("Cannot set levels in a skill that does not exist.");
			// TODO: Determine if this uuid should be removed now...
			return;
		}

		// Level-less generic skills can exist, but they are rare and are only awarded for exceptional achievements.
		// They usually have a limited number of uses per day or are passive constants.
		if(foundSkill.doesLevel == false) {
			console.error("Cannot set the level of a level-less skill.");
			characterFocus.genericSkills.set(uuid, 0);
		}

		// The limit for general skill levels is ten times a character's highest level in any job
		let actualSkillLevelLimit = this.findHighestLevelJob(characterFocus) * 10;

		if(newValue > actualSkillLevelLimit) {
			console.error("Cannot set the level of a generic skill to a value greater than ten times the highest level a character has in any job.");
			characterFocus.genericSkills.set(uuid, actualSkillLevelLimit);
			return;
		}

		characterFocus.genericSkills.set(uuid, newValue);
	}

	private findHighestLevelJob(characterFocus: Character) {
		// TODO: Determine if we should terminate early if the level-limit is ever found...
		let highestJobLevelFound: number = characterFocus.primaryRacialJobLevel;

		characterFocus.adventuringJobLevels.forEach((value, level) => {
			if(level > highestJobLevelFound) {
				highestJobLevelFound = level;
			}
		});

		characterFocus.craftingJobLevels.forEach((value, level) => {
			if(level > highestJobLevelFound) {
				highestJobLevelFound = level;
			}
		});

		characterFocus.supplementalRacialJobLevels.forEach((value, level) => {
			if(level > highestJobLevelFound) {
				highestJobLevelFound = level;
			}
		});

		return highestJobLevelFound;
	}
}
