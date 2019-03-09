import { AttributeType, Defenses, Pools, Attributes } from "./attribute-keys";

export class AttributeSet
{
	type: AttributeType;
	offensiveAttribute: Attributes;
	defensiveAttribute: Attributes;
	defense: Defenses;
	pool: Pools;

	constructor(type:AttributeType, offensiveAttribute: Attributes,
	defensiveAttribute: Attributes, defense: Defenses, pool: Pools) {
		this.type = type;
		this.offensiveAttribute = offensiveAttribute;
		this.defensiveAttribute = defensiveAttribute;
		this.defense = defense;
		this.pool = pool;
	}
}
