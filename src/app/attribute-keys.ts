import { AttributeSet } from "./attribute-set";

export enum Attributes {
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
}

export enum Pools {
    HEALTH_POINTS = "HP",
    SANITY = "SAN",
    STAMINA = "STA",
    MOXIE = "MOX",
    FORTUNE = "FOR"
}

export enum Defenses {
    ARMOR = "ARM",
    MENTAL_FORTITUDE = "MF",
    ENDURANCE = "END",
    COOL = "COOL",
    FATE = "FATE"
}

export enum AttributeType {
	PHYSICAL = "Physical",
	MENTAL = "Mental",
	GUMPTION = "Gumption",
	SOCIAL = "Social",
	EXISTENTIAL = "Existential"
}

export class AttributeKeys
{
	private static attributeSets: Map<AttributeType, AttributeSet> = null;

	public static getAttributeSets() {
		if(this.attributeSets != null) {
			return this.attributeSets;
		}

		this.attributeSets = new Map<AttributeType, AttributeSet>();

		this.attributeSets.set(AttributeType.PHYSICAL, new AttributeSet(AttributeType.PHYSICAL, Attributes.STRENGTH,
			Attributes.CONSTITUTION, Defenses.ARMOR, Pools.HEALTH_POINTS));
		this.attributeSets.set(AttributeType.MENTAL, new AttributeSet(AttributeType.MENTAL, Attributes.INTELLIGENCE,
			Attributes.WISDOM, Defenses.MENTAL_FORTITUDE, Pools.SANITY));
		this.attributeSets.set(AttributeType.GUMPTION, new AttributeSet(AttributeType.GUMPTION, Attributes.DEXTERITY,
			Attributes.AGILITY, Defenses.ENDURANCE, Pools.STAMINA));
		this.attributeSets.set(AttributeType.SOCIAL, new AttributeSet(AttributeType.SOCIAL, Attributes.CHARISMA,
			Attributes.WILL, Defenses.COOL, Pools.MOXIE));
		this.attributeSets.set(AttributeType.EXISTENTIAL, new AttributeSet(AttributeType.EXISTENTIAL, Attributes.PERCEPTION,
			Attributes.LUCK, Defenses.FATE, Pools.FORTUNE));

		return this.attributeSets;
	}
}