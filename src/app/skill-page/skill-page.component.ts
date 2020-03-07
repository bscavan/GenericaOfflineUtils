import { Component, OnInit } from '@angular/core';
import { SkillService } from '../skills/skill-service';
import { Skill, Duration, Denomination } from '../skills/skill';
import FileSaver = require('file-saver');
import { SkillListItem } from './SkillListItem';

@Component({
	selector: 'app-skill-page',
	templateUrl: './skill-page.component.html',
	styleUrls: ['./skill-page.component.css']
})
export class SkillPageComponent implements OnInit {
	public readonly LABEL = Skill.LABEL;

	allClassSkills: SkillListItem[] = [];
	allGenericSkills: SkillListItem[] = [];
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
		this.refreshAllClassSkills();
		this.refreshAllGenericSkills();
	}

	sortClassSkills() {
		this.allClassSkills.sort(this.sortSkillItems);
	}

	sortGenericSkills() {
		this.allGenericSkills.sort(this.sortSkillItems);
	}

	sortSkillItems (left: SkillListItem, right: SkillListItem) {
		if(left.name.toLowerCase() > right.name.toLowerCase()) return 1; else return -1;
	}

	public skillImportCallback(focus: SkillPageComponent) {
		focus.refreshAllClassSkills();
		focus.refreshAllGenericSkills();
	}

	ngOnInit() {}

	public saveClassSkill(uuid: string) {
		let currentSkill = SkillService.allClassSkills.get(uuid);
		this.saveSkill(currentSkill);
	}

	public saveGenericSkill(uuid: string) {
		let currentSkill = SkillService.allGenericSkills.get(uuid);
		this.saveSkill(currentSkill);
	}

	public saveAllSkills() {
		let jobJson = JSON.stringify(SkillService.getAllSkillsAsJSONArray());
		let jobJsonArray = [];
		jobJsonArray.push(jobJson);

		let blob = new Blob(jobJsonArray, {type: 'text/plain' });
		FileSaver.saveAs(blob, "allSkillsSave" + ".json");
	}

	public saveSkill(skillToSave: Skill) {
		let skillJson = skillToSave.serializeToJSON();
		skillJson = JSON.stringify(skillJson);

		let skillJsonArray = [];
		skillJsonArray.push(skillJson);

		let blob = new Blob(skillJsonArray, {type: 'text/plain' });
		FileSaver.saveAs(blob, skillToSave.name + ".json");
	}

	public addNewClassSkill() {
		SkillService.addBlankClassSkill();
		this.refreshAllClassSkills();
	}

	public refreshAllClassSkills() {
		this.allClassSkills = [];

		SkillService.allClassSkills.forEach((value: Skill, key: string) => {
			this.allClassSkills.push(new SkillListItem(value.uuid, value.name));
		});

		this.sortClassSkills();
	}

	public getClassSkill(uuid: string) {
		return SkillService.allClassSkills.get(uuid);
	}

	public removeClassSkill(uuid: string) {
		if(confirm("You are about to delete a class skill. There may be job that provide this skill and characters with progress in it. If so, this may break them. Are you sure you wish to do this?")) {
			let returnValue = SkillService.removeClassSkill(uuid);
			this.refreshAllClassSkills();
			return returnValue;
		}
	}

	public addNewCostToClassSkill(uuid: string) {
		SkillService.getClassSkill(uuid).addEmptyCost();
	}

	public removeCostFromClassSkill(uuid: string, index: number) {
		SkillService.getClassSkill(uuid).removeCost(index);
	}

	// TODO: Make an observable that this will respond to. Whenever the original list updates, all references to it need to also update.
	public addNewGenericSkill() {
		SkillService.addBlankGenericSkill();
		this.refreshAllGenericSkills();
	}

	public refreshAllGenericSkills() {
		this.allGenericSkills = [];

		SkillService.allGenericSkills.forEach((value: Skill, key: string) => {
			this.allGenericSkills.push(new SkillListItem(value.uuid, value.name));
		});

		this.sortGenericSkills();
	}

	public getGenericSkill(uuid: string) {
		return SkillService.allGenericSkills.get(uuid);
	}

	public removeGenericSkill(uuid: string) {
		if(confirm("You are about to delete a general skill. There may be characters with progress in it. If so, this may break them. Are you sure you wish to do this?")) {
			let returnValue = SkillService.removeGenericSkill(uuid);
			this.refreshAllGenericSkills();
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
