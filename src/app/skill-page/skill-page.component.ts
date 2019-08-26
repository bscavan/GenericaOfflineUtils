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
}
