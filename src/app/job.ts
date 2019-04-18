import { Attributes, Defenses, Pools } from "./attribute-keys";
import { SerializationUtil } from "./serialization-util";

export class Job {
	//TODO: Add support for skills
	// TODO: Add support for tracking Job descriptions
	// TODO: Add support for tracking unlock requirements.
	name: string;
	affectedAttributes: Set<{affectedAttribute: Attributes, pointsPerLevel: number}>;
	// TODO: Migrate affectedDefenses and basePools into RacialJob.
	affectedDefenses: Set<{affectedDefense: Defenses, pointsPerLevel: number}>;
	basePools: Set<{affectedPool: Pools, baseValue: number}>;
	// skills go here?

	constructor(name: string,
	affectedAttributes: Set<{affectedAttribute: Attributes, pointsPerLevel: number}>,
	affectedDefenses: Set<{affectedDefense: Defenses, pointsPerLevel: number}>,
	basePools: Set<{affectedPool: Pools, baseValue: number}>) {
		this.name = name;
		this.affectedAttributes = affectedAttributes;
		this.affectedDefenses = affectedDefenses;
		this.basePools = basePools;
	}

	public serializeToJSON() {
		let json = {};
		json["name"] = this.name;
		json["affectedAttributes"] = SerializationUtil.serializeAttributesSet(this.affectedAttributes);
		json["affectedDefenses"] = SerializationUtil.serializeDefensesSet(this.affectedDefenses);
		json["basePools"] = SerializationUtil.serializePoolsSet(this.basePools);
		return json;
	}

	public deserializeFromJSON(json): Job {
		this.name = json.name;
		this.affectedAttributes = SerializationUtil.deserializeAttributesSet(json.affectedAttributes);
		this.affectedDefenses = SerializationUtil.deserializeDefensesSet(json.affectedDefenses);
		this.basePools = SerializationUtil.deserializePoolsSet(json.basePools);

		return this;
	}
}