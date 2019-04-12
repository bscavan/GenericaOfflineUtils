import { AttributeSet } from "./attribute-set";

export enum Attributes {
	/*
	STRENGTH = "STR",
	CONSTITUTION = "CON",
	INTELLIGENCE = "INT",
	WISDOM = "WIS",
	DEXTERITY = "DEX",
	AGILITY = "AGL",
	CHARISMA = "CHA",
	WILL = "WILL",
	PERCEPTION = "PER",
	LUCK = "LUCK",
	 */
	STR = "STR",
	CON = "CON",
	INT = "INT",
	WIS = "WIS",
	DEX = "DEX",
	AGL = "AGL",
	CHA = "CHA",
	WILL = "WILL",
	PER = "PER",
	LUCK = "LUCK",
}

export enum Pools {
	/*
	HEALTH_POINTS = "HP",
	SANITY = "SAN",
	STAMINA = "STA",
	MOXIE = "MOX",
	FORTUNE = "FOR"
	 */
	HP = "HP",
	SAN = "SAN",
	STA = "STA",
	MOX = "MOX",
	FOR = "FOR"
}

export enum Defenses {
	/*
	ARMOR = "ARM",
	MENTAL_FORTITUDE = "MF",
	ENDURANCE = "END",
	COOL = "COOL",
	FATE = "FATE"
	 */
	ARM = "ARM",
	MFORT = "MFORT",
	END = "END",
	COOL = "COOL",
	FATE = "FATE"
}

export enum AttributeType {
	PHYSICAL = "PHYSICAL",
	MENTAL = "MENTAL",
	GUMPTION = "GUMPTION",
	SOCIAL = "SOCIAL",
	EXISTENTIAL = "EXISTENTIAL"
}

export class AttributeKeys
{
	private static attributeSets: Map<AttributeType, AttributeSet> = null;

	public static getAttributeSets() {
		if(this.attributeSets != null) {
			return this.attributeSets;
		}

		this.attributeSets = new Map<AttributeType, AttributeSet>();

		this.attributeSets.set(AttributeType.PHYSICAL, new AttributeSet(AttributeType.PHYSICAL, Attributes.STR,
			Attributes.CON, Defenses.ARM, Pools.HP));
		this.attributeSets.set(AttributeType.MENTAL, new AttributeSet(AttributeType.MENTAL, Attributes.INT,
			Attributes.WIS, Defenses.MFORT, Pools.SAN));
		this.attributeSets.set(AttributeType.GUMPTION, new AttributeSet(AttributeType.GUMPTION, Attributes.DEX,
			Attributes.AGL, Defenses.END, Pools.STA));
		this.attributeSets.set(AttributeType.SOCIAL, new AttributeSet(AttributeType.SOCIAL, Attributes.CHA,
			Attributes.WILL, Defenses.COOL, Pools.MOX));
		this.attributeSets.set(AttributeType.EXISTENTIAL, new AttributeSet(AttributeType.EXISTENTIAL, Attributes.PER,
			Attributes.LUCK, Defenses.FATE, Pools.FOR));

		return this.attributeSets;
	}
}