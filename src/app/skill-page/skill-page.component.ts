import { Component, OnInit } from '@angular/core';
import { SkillService } from '../skills/skill-service';
import { Skill, Duration, Denomination } from '../skills/skill';

@Component({
	selector: 'app-skill-page',
	templateUrl: './skill-page.component.html',
	styleUrls: ['./skill-page.component.css']
})
export class SkillPageComponent implements OnInit {

	allSkillKeys = [];
	allDurations = Skill.getAllDurations();
	allQualifiers = Skill.getAllQualifiers();
	allDenominations = Skill.getAllDenominations();

	constructor() {
		this.getAllSkillKeys();
	}

	ngOnInit() {}

	public addNewSkill() {
		SkillService.addBlankClassSkill();
		this.getAllSkillKeys();
	}

	public getAllSkillKeys() {
		this.allSkillKeys = [];

		SkillService.allClassSkills.forEach((value: Skill, key: string) => {
			this.allSkillKeys.push(key);
		});
	}

	public getSkill(uuid: string) {
		return SkillService.allClassSkills.get(uuid);
	}

	public removeSkill(uuid: string) {
		if(confirm("You are about to delete a skill. There may be job that provide this skill and characters with progress in it. If so, this may break them. Are you sure you wish to do this?")) {
			let returnValue = SkillService.removeClassSkill(uuid);
			this.getAllSkillKeys();
			return returnValue;
		}
	}

	public addNewCost(uuid: string) {
		SkillService.getClassSkill(uuid).addEmptyCost();
	}

	public removeCost(uuid: string, index: number) {
		SkillService.getClassSkill(uuid).removeCost(index);
	}
}
