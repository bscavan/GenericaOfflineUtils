import { Attributes, Defenses, Pools, AttributeKeys } from "./attribute-keys";
import { SerializationUtil } from "./serialization-util";
import { JsonSerializable } from "./json-serializable";
import { isNullOrUndefined } from "util";

export class Job implements JsonSerializable {
	//TODO: Add support for skills
	// TODO: Add support for tracking Job descriptions
	// TODO: Add support for tracking unlock requirements.
	name: string;
	jobType: string;
	affectedAttributes: Set<{affectedAttribute: Attributes, pointsPerLevel: number}>;
	// TODO: Migrate affectedDefenses and basePools into RacialJob.
	affectedDefenses: Set<{affectedDefense: Defenses, pointsPerLevel: number}>;
	basePools: Set<{affectedPool: Pools, baseValue: number}>;
	// skills go here?

	constructor(name: string, jobType: string,
	affectedAttributes: Set<{affectedAttribute: Attributes, pointsPerLevel: number}>,
	affectedDefenses: Set<{affectedDefense: Defenses, pointsPerLevel: number}>,
	basePools: Set<{affectedPool: Pools, baseValue: number}>) {
		this.name = name;
		this.jobType = jobType;
		this.affectedAttributes = new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>()
		this.affectedDefenses = new Set<{affectedDefense: Defenses, pointsPerLevel: number}>();
		this.basePools = new Set<{affectedPool: Pools, baseValue: number}>();

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

			let currentDefensive = this.defaultIfUndefined(foundAttributes.get(currentAttributeSet.defensiveAttribute));
			this.affectedAttributes.add({affectedAttribute: currentAttributeSet.defensiveAttribute, pointsPerLevel: currentDefensive});

			let currentDefense = this.defaultIfUndefined(foundDefenses.get(currentAttributeSet.defense));
			this.affectedDefenses.add({affectedDefense: currentAttributeSet.defense, pointsPerLevel: currentDefense});

			let currentPool = this.defaultIfUndefined(foundPools.get(currentAttributeSet.pool));
			this.basePools.add({affectedPool: currentAttributeSet.pool, baseValue: currentPool});
		});
	}

	/**
	 * Returns the provided value if it is a defined number, otherwise zero.
	 * @param x The number to check for an undefined value.
	 */
	private defaultIfUndefined(x: number): number {
		let returnValue = (isNullOrUndefined(x)) ? 0 : x;
		return returnValue;
	}

	public serializeToJSON() {
		let json = {};
		json["name"] = this.name;
		json["jobType"] = this.jobType;
		json["affectedAttributes"] = SerializationUtil.serializeAttributesSet(this.affectedAttributes);
		json["affectedDefenses"] = SerializationUtil.serializeDefensesSet(this.affectedDefenses);
		json["basePools"] = SerializationUtil.serializePoolsSet(this.basePools);
		return json;
	}

	public deserializeFromJSON(json): Job {
		this.name = json.name;
		this.jobType = json.jobType;
		this.affectedAttributes = SerializationUtil.deserializeAttributesSet(json.affectedAttributes);
		this.affectedDefenses = SerializationUtil.deserializeDefensesSet(json.affectedDefenses);
		this.basePools = SerializationUtil.deserializePoolsSet(json.basePools);

		return this;
	}
}