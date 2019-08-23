import { Component, OnInit } from '@angular/core';
import { SkillService } from '../skills/skill-service';

@Component({
	selector: 'app-skill-page',
	templateUrl: './skill-page.component.html',
	styleUrls: ['./skill-page.component.css']
})
export class SkillPageComponent implements OnInit {

	allSkillKeys;

	constructor(public skillService: SkillService) {
		this.getAllSkillKeys();
	}

	ngOnInit() {
	}

	/*

	Well crap.
	I just realized we're using a map to handle these skills, but I'm giving
	the user the ability to change their names, and the names are the keys.
	That's not going to work.

	Also, I don't have any support for the concept of a "blank skill" which I
	will need for defining new ones on this page.

	*/
	public addNewSkill() {
		this.skillService.addBlankSkill();
		this.getAllSkillKeys();
	}

	public getAllSkillKeys() {
		this.allSkillKeys = this.skillService.allSkills.keys();
	}

	public getSkill(uuid: string) {
		return this.skillService.allSkills.get(uuid);
	}
}
