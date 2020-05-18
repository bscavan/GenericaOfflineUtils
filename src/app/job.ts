import { Attributes, Defenses, Pools, AttributeKeys } from "./attribute-keys";
import { SerializationUtil } from "./serialization-util";
import { JsonSerializable } from "./json-serializable";
import { isNullOrUndefined } from "util";
import { v4 as uuid } from 'uuid';
import { Skill, SkillTypes } from "./skills/skill";
import { SkillService } from "./skills/skill-service";

export abstract class Job implements JsonSerializable {
	public static readonly LABEL = "job";

	// TODO: Add support for tracking unlock requirements.
	public uuid: string;
	name: string;
	jobType: string;
	affectedAttributes: Set<{affectedAttribute: Attributes, pointsPerLevel: number}>;
	// TODO: Migrate affectedDefenses and basePools into RacialJob.
	affectedDefenses: Set<{affectedDefense: Defenses, pointsPerLevel: number}>;
	basePools: Set<{affectedPool: Pools, baseValue: number}>;
	skills: Map<number, Set<Skill>>;

	constructor(name: string, jobType: string,
	affectedAttributes: Set<{affectedAttribute: Attributes, pointsPerLevel: number}>,
	affectedDefenses: Set<{affectedDefense: Defenses, pointsPerLevel: number}>,
	basePools: Set<{affectedPool: Pools, baseValue: number}>) {
		this.uuid = uuid();
		this.name = name;
		this.jobType = jobType;
		this.affectedAttributes = new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>()
		this.affectedDefenses = new Set<{affectedDefense: Defenses, pointsPerLevel: number}>();
		this.basePools = new Set<{affectedPool: Pools, baseValue: number}>();
		this.skills = new Map<number, Set<Skill>>();

		// FIXME: Clean up this code
		// Tally up the provided stats
		let foundAttributes = new Map<Attributes, number>();
		let foundDefenses = new Map<Defenses, number>();
		let foundPools = new Map<Pools, number>();

		affectedAttributes.forEach(item => {
			foundAttributes.set(item.affectedAttribute, item.pointsPerLevel);
		});

		affectedDefenses.forEach(item => {
			foundDefenses.set(item.affectedDefense, item.pointsPerLevel);
		});

		basePools.forEach(item => {
			foundPools.set(item.affectedPool, item.baseValue);
		});

		// Initialize every stat to the provided value or zero if none exists.
		AttributeKeys.getAttributeSets().forEach((currentAttributeSet) => {
			let currentOffensive = this.defaultIfUndefined(foundAttributes.get(currentAttributeSet.offensiveAttribute));
			this.affectedAttributes.add({affectedAttribute: currentAttributeSet.offensiveAttribute, pointsPerLevel: currentOffensive});

			// This is elsewhere called the "defensive" attribute, but that's really confusing when right next to "defense"
			let currentSecondary = this.defaultIfUndefined(foundAttributes.get(currentAttributeSet.defensiveAttribute));
			this.affectedAttributes.add({affectedAttribute: currentAttributeSet.defensiveAttribute, pointsPerLevel: currentSecondary});

			let currentDefense = this.defaultIfUndefined(foundDefenses.get(currentAttributeSet.defense));
			this.affectedDefenses.add({affectedDefense: currentAttributeSet.defense, pointsPerLevel: currentDefense});

			let currentPool = this.defaultIfUndefined(foundPools.get(currentAttributeSet.pool));
			this.basePools.add({affectedPool: currentAttributeSet.pool, baseValue: currentPool});
		});
	}

	/**
	 * Adds the provided skill to the list of skills this job provides at the
	 * specified level.
	 * NOTE: this method allows the same skill to be added at multiple levels.
	 *
	 * @param levelGained The job level at which this skill is accessible to a
	 * character.
	 * @param skillToAdd The skill to add to the list this job provides.
	 */
	public addSkill(levelGained: number, skillToAdd: Skill) {
		let skillsAtLevel = this.skills.get(levelGained);

		if(isNullOrUndefined(skillsAtLevel)) {
			skillsAtLevel = new Set<Skill>();
		}

		skillsAtLevel.add(skillToAdd);
		this.skills.set(levelGained, skillsAtLevel);
	}

	public removeSkill(level: number, skillToRemove: Skill) {
		let skillsAtLevel = this.skills.get(level);

		if(isNullOrUndefined(skillsAtLevel) || skillsAtLevel.size <= 0) {
			return false;
		}

		let returnValue = skillsAtLevel.delete(skillToRemove)

		if(skillsAtLevel.size == 0) {
			this.skills.delete(level);
		}

		return returnValue;
	}

	/**
	 * Returns the provided value if it is a defined number, otherwise zero.
	 * @param x The number to check for an undefined value.
	 */
	protected defaultIfUndefined(x: number): number {
		let returnValue = (isNullOrUndefined(x)) ? 0 : x;
		return returnValue;
	}

	public serializeToJSON() {
		let json = {};
		json["uuid"] = this.uuid;
		json["name"] = this.name;
		json["jobType"] = this.jobType;
		json["affectedAttributes"] = SerializationUtil.serializeAttributesSet(this.affectedAttributes);
		json["affectedDefenses"] = SerializationUtil.serializeDefensesSet(this.affectedDefenses);
		json["basePools"] = SerializationUtil.serializePoolsSet(this.basePools);
		json["skills"] = this.generateSkillSection();

		return json;
	}

	public deserializeFromJSON(json): Job {
		this.uuid = json.uuid;
		this.name = json.name;
		this.jobType = json.jobType;
		this.affectedAttributes = SerializationUtil.deserializeAttributesSet(json.affectedAttributes);
		this.affectedDefenses = SerializationUtil.deserializeDefensesSet(json.affectedDefenses);
		this.basePools = SerializationUtil.deserializePoolsSet(json.basePools);
		this.skills = this.deserializeSkillSection(json.skills);

		return this;
	}

	private generateSkillSection() {
		let skillsSection = {};

		this.skills.forEach((currentSkillGrouping, currentSkillLevel) => {
			let skillsAtCurrentLevel = [];

			currentSkillGrouping.forEach(currentSkill => {
				skillsAtCurrentLevel.push(currentSkill.serializeToJSON());
			});

			skillsSection["" + currentSkillLevel] = skillsAtCurrentLevel;
		});

		return skillsSection;
	}

	private deserializeSkillSection(skillsJson): Map<number, Set<Skill>> {
		let skillsMap = new Map<number, Set<Skill>>();

		for(let currentIndex in skillsJson) {
			let currentSkillSetJson = skillsJson[currentIndex];
			let currentSkillSet = new Set<Skill>();

			// Iterate over each of skill elements in the json and add them to the Set.
			for(let currentSkillIndex in currentSkillSetJson) {
				let deserializedSkill = Skill.deserializeNewSkillFromJSON(currentSkillSetJson[currentSkillIndex]);
				deserializedSkill.type = SkillTypes.CLASS_SKILL;
				currentSkillSet.add(deserializedSkill);
			}

			// TODO: Handle improper input.
			skillsMap.set(Number.parseInt(currentIndex), currentSkillSet);
		}

		return skillsMap;
	}

	public getLabel() {
		return Job.LABEL;
	}
}