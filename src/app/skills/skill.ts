import { Pools } from '../attribute-keys'
import { uuidv4 } from 'uuid'
import { JsonSerializable } from '../json-serializable';
import * as FileSaver from 'file-saver';

/*
 * TODO: Don't forget to provide a means of working in the Bard's borrow skills.
 * Since skills are stored separate from Jobs, this should be possible.
 */

export enum Duration {
	INSTANT = "INSTANT",
	TURN = "TURN",
	ATTACK = "ATTACK",
	ACTION = "ACTION",
	MOVE = "MOVE",
	MINUTE = "MINUTE",
	HOUR = "HOUR",
	DAY = "DAY",
	WEEK = "WEEK",
	MONTH = "MONTH",
	YEAR = "YEAR",
	CONCENTRATION = "CONCENTRATION",
	UNTIL_CHANGED = "UNTIL CHANGED", // Songs, Stances, Poses, etc.
	PASSIVE_CONSTANT = "PASSIVE CONSTANT",
	PERMENANT = "PERMENANT",
	CHASE_STAGE = "CHASE_STAGE"
	// Because of Assassin's "Getaway/Pursuit"
}

export enum Qualifier {
	NONE = "NONE",
	PER_SKILL_LEVEL = "PER SKILL LEVEL",
	PER_JOB_LEVEL = "PER JOB LEVEL"
}

export enum Currency {
	NOT_APPLICABLE = "n/a",
	COPPER_PIECES = "cp",
	SILVER_PIECES = "sp",
	GOLD_PIECES = "gp"
}

/*
Consider this:

Focus Will
Cost: 50 San/minute
Duration: Until concentration is broken.

	// This is a skill with a cost that needs a qualifier.
	// However, it's a time-based qualifier. So we can't just use regular
	// qualifiers, otherwise we could end up with the duration
	// "1 MINUTE (per) MINUTE"
*/
export enum SpecialCost {
	REAGENT_RED = "RED REAGENT",
	REAGENT_ORANGE = "ORANGE REAGENT",
	REAGENT_YELLOW = "YELLOW REAGENT",
	REAGENT_BLUE = "BLUE REAGENT",
	REAGENT_GREEN = "GREEN REAGENT",
	REAGENT_INDIGO = "INDIGO REAGENT",
	REAGENT_VIOLET = "VIOLET REAGENT",
	CRYSTAL_LEVEL_1 = "LEVEL ONE CRYSTAL",
	CRYSTAL_LEVEL_2 = "LEVEL TWO CRYSTAL",
	CRYSTAL_LEVEL_3 = "LEVEL THREE CRYSTAL",
	CRYSTAL_LEVEL_4 = "LEVEL FOUR CRYSTAL",
	CRYSTAL_LEVEL_5 = "LEVEL FIVE CRYSTAL",
	CRYSTAL_LEVEL_6 = "LEVEL SIX CRYSTAL",
	CRYSTAL_LEVEL_7 = "LEVEL SEVEN CRYSTAL",
	CRYSTAL_LEVEL_8 = "LEVEL EIGHT CRYSTAL",
	CRYSTAL_LEVEL_9 = "LEVEL NINE CRYSTAL",
	CRYSTAL_LEVEL_10 = "LEVEL TEN CRYSTAL",
	RESEARCH = "RESEARCH",
	NONE = "NONE"
}

export type Denomination = Pools | Currency | SpecialCost;

export class Skill implements JsonSerializable {
	public static readonly LABEL = "skill";

	public uuid: string;
	public name: string;
	public description: string;

	/*
	* NOTE: Some abilities, such as the Animator's "Animus" skill have a scaling
	* cost. For these, the base cost is listed in the costAmount and the
	* description will contain more details.
	*/
	public costs: {costAmount: number, costDenomination: Denomination}[];

	/*
	 * Duration is measured in combinations such as 1 ATTACK PER_SKIL_LEVEL,
	 * or 10 MINUTE PER_JOB_LEVEL.
	 * Other durations, like INSTANT, PASSIVE_CONSTANT and PERMENANT don't need
	 * amounts or qualifiers, so we'll end up with things like:
	 * "1 INSTANT NONE" or "1 CONCENTRATION NONE"
	 */
	public duration: {amount: number, timeDenomination: Duration, qualifier: Qualifier}[];

	public constructor(name: string, description: string,
	costs: {costAmount: number, costDenomination: Denomination}[],
	duration: {amount: number, timeDenomination: Duration, qualifier: Qualifier}[]) {
		// Generates a random UUID for a new skill.
		//this.uuid = uuidv4();
		// FIXME: Randomly generate this value.
		this.uuid = "-1";
		this.name = name;
		this.description = description;
		this.costs = costs;
		this.duration = duration;
	}

	public serializeToJSON() {
		let json = {};
		json["uuid"] = this.uuid;
		json["name"] = this.name;
		json["description"] = this.description;
		json["costs"] = this.costs;
		json["duration"] = this.duration;
		return json;
	}

	public deserializeFromJSON(json): Skill {
		this.uuid = json.uuid;
		this.name = json.name;
		this.description = json.description;
		this.costs = json.costs;
		this.duration = json.duration;
		return this;
	}

	public getLabel() {
		return Skill.LABEL;
	}

	public save() {
		let skillJson = this.serializeToJSON();
		skillJson = JSON.stringify(skillJson);
		let jobJsonArray = [];
		jobJsonArray.push(skillJson);

		let blob = new Blob(jobJsonArray, {type: 'text/plain' });
		FileSaver.saveAs(blob, this.name + ".json");
	}
}