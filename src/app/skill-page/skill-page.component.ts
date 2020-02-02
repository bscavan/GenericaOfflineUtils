import { Component, OnInit } from '@angular/core';
import { SkillService } from '../skills/skill-service';
import { Skill, Duration, Denomination } from '../skills/skill';

@Component({
	selector: 'app-skill-page',
	templateUrl: './skill-page.component.html',
	styleUrls: ['./skill-page.component.css']
})
export class SkillPageComponent implements OnInit {

	allClassSkillKeys = [];
	allGenericSkillKeys = [];
	allDurations = Skill.getAllDurations();
	allQualifiers = Skill.getAllQualifiers();
	allDenominations = Skill.getAllDenominations();

	/**
	 * Constructor for service that handles class and generic skills.
	 * NOTICE: This import of SkillService is absolutely necessary. Without it 
	 * the SkillService will not be initialized and it will never load the
	 * skill json file(s) from the assets directory on startup...
	 * @param skillService 
	 */
	constructor(skillService: SkillService) {
		this.getAllClassSkillKeys();
	}

	ngOnInit() {}

	public addNewClassSkill() {
		SkillService.addBlankClassSkill();
		this.getAllClassSkillKeys();
	}

	public getAllClassSkillKeys() {
		this.allClassSkillKeys = [];

		SkillService.allClassSkills.forEach((value: Skill, key: string) => {
			this.allClassSkillKeys.push(key);
		});
	}

	public getClassSkill(uuid: string) {
		return SkillService.allClassSkills.get(uuid);
	}

	public removeClassSkill(uuid: string) {
		if(confirm("You are about to delete a class skill. There may be job that provide this skill and characters with progress in it. If so, this may break them. Are you sure you wish to do this?")) {
			let returnValue = SkillService.removeClassSkill(uuid);
			this.getAllClassSkillKeys();
			return returnValue;
		}
	}

	public addNewCostToClassSkill(uuid: string) {
		SkillService.getClassSkill(uuid).addEmptyCost();
	}

	public removeCostFromClassSkill(uuid: string, index: number) {
		SkillService.getClassSkill(uuid).removeCost(index);
	}
	
	public addNewGenericSkill() {
		SkillService.addBlankGenericSkill();
		this.getAllGenericSkillKeys();
	}

	public getAllGenericSkillKeys() {
		this.allGenericSkillKeys = [];

		SkillService.allGenericSkills.forEach((value: Skill, key: string) => {
			this.allGenericSkillKeys.push(key);
		});
	}

	public getGenericSkill(uuid: string) {
		return SkillService.allGenericSkills.get(uuid);
	}

	public removeGenericSkill(uuid: string) {
		if(confirm("You are about to delete a general skill. There may be characters with progress in it. If so, this may break them. Are you sure you wish to do this?")) {
			let returnValue = SkillService.removeGenericSkill(uuid);
			this.getAllGenericSkillKeys();
			return returnValue;
		}
	}

	public addNewCostToGenericSkill(uuid: string) {
		SkillService.getGenericSkill(uuid).addEmptyCost();
	}

	public removeCostFromGenericSkill(uuid: string, index: number) {
		SkillService.getGenericSkill(uuid).removeCost(index);
	}
}
