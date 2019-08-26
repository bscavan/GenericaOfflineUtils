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
		SkillService.addBlankSkill();
		this.getAllSkillKeys();
	}

	public getAllSkillKeys() {
		this.allSkillKeys = [];

		SkillService.allSkills.forEach((value: Skill, key: string) => {
			this.allSkillKeys.push(key);
		});
	}

	public getSkill(uuid: string) {
		return SkillService.allSkills.get(uuid);
	}

	public removeSkill(uuid: string) {
		if(confirm("You are about to delete a skill. There may be job that provide this skill and characters with progress in it. If so, this may break them. Are you sure you wish to do this?")) {
			let returnValue = SkillService.removeSkill(uuid);
			this.getAllSkillKeys();
			return returnValue;
		}
	}

	public addNewCost(uuid: string) {
		SkillService.getSkill(uuid).addEmptyCost();
	}

	public removeCost(uuid: string, index: number) {
		SkillService.getSkill(uuid).removeCost(index);
	}
}
