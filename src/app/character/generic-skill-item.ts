import { GenericSkill } from "../skills/generic-skill";

export class GenericSkillItem {
	level: number;
	skill: GenericSkill;

	constructor(level: number, skill: GenericSkill) {
		this.level = level;
		this.skill = skill;
	}

	public serializeToJSON() {
		let json = {};

		json["level"] = this.level;
		json["skill"] = this.skill.serializeToJSON();

		return json;
	}

	public static deserializeFromJson(json) {
		let level = json.level;
		let skill = GenericSkill.deserializeNewSkillFromJSON(json.skill);

		return new GenericSkillItem(level, skill);
	}
}