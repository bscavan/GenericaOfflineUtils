import { Component, OnInit } from '@angular/core';
import { SkillService } from '../skills/skill-service';
import { Skill } from '../skills/skill';
import * as FileSaver from 'file-saver';
import { SkillListItem } from './SkillListItem';
import { ClassSkill } from '../skills/class-skill';
import { GenericSkill } from '../skills/generic-skill';

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
	 * NOTICE: This import of skillService is absolutely necessary. Without it 
	 * the skillService will not be initialized and it will never load the
	 * skill json file(s) from the assets directory on startup...
	 * @param skillService 
	 */
	constructor(private skillService: SkillService) {
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
		let currentSkill = this.skillService.allClassSkills.get(uuid);
		this.saveSkill(currentSkill);
	}

	public saveGenericSkill(uuid: string) {
		let currentSkill = this.skillService.allGenericSkills.get(uuid);
		this.saveSkill(currentSkill);
	}

	public saveAllSkills() {
		let jobJson = JSON.stringify(this.skillService.getAllSkillsAsJSONArray());
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
		this.skillService.addBlankClassSkill();
		this.refreshAllClassSkills();
	}

	public refreshAllClassSkills() {
		this.allClassSkills = [];

		this.skillService.allClassSkills.forEach((value: Skill, key: string) => {
			this.allClassSkills.push(new SkillListItem(value.uuid, value.name));
		});

		this.sortClassSkills();
	}

	public getClassSkill(uuid: string) {
		return this.skillService.allClassSkills.get(uuid);
	}

	public updateClassSkillInService(currentSkillItem: SkillListItem, skill: ClassSkill) {
		currentSkillItem.name = skill.name;
		currentSkillItem.uuid = skill.uuid;
		this.skillService.setClassSkill(skill);
	}

	public removeClassSkill(uuid: string) {
		if(confirm("You are about to delete a class skill. There may be job that provide this skill and characters with progress in it. If so, this may break them. Are you sure you wish to do this?")) {
			let returnValue = this.skillService.removeClassSkill(uuid);
			this.refreshAllClassSkills();
			return returnValue;
		}
	}

	public addNewCostToClassSkill(uuid: string) {
		this.skillService.addNewCostToClassSkill(uuid)
	}

	public removeCostFromClassSkill(uuid: string, index: number) {
		this.skillService.removeCostFromClassSkill(uuid, index);
	}

	// TODO: Make an observable that this will respond to. Whenever the original list updates, all references to it need to also update.
	public addNewGenericSkill() {
		this.skillService.addBlankGenericSkill();
		this.refreshAllGenericSkills();
	}

	public refreshAllGenericSkills() {
		this.allGenericSkills = [];

		this.skillService.allGenericSkills.forEach((value: Skill, key: string) => {
			this.allGenericSkills.push(new SkillListItem(value.uuid, value.name));
		});

		this.sortGenericSkills();
	}

	public getGenericSkill(uuid: string) {
		return this.skillService.allGenericSkills.get(uuid);
	}

	public updateGenericSkillInService(skill: GenericSkill) {
		this.skillService.setGenericSkill(skill);
	}

	public removeGenericSkill(uuid: string) {
		if(confirm("You are about to delete a general skill. There may be characters with progress in it. If so, this may break them. Are you sure you wish to do this?")) {
			let returnValue = this.skillService.removeGenericSkill(uuid);
			this.refreshAllGenericSkills();
			return returnValue;
		}
	}

	public addNewCostToGenericSkill(uuid: string) {
		this.skillService.addNewCostToGenericSkill(uuid);
	}

	public removeCostFromGenericSkill(uuid: string, index: number) {
		this.skillService.removeCostFromGenericSkill(uuid, index);
	}
}
