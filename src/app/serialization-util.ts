import { Attributes, Defenses, Pools } from "./attribute-keys";

export class SerializationUtil {
	/**
	 * Serializes the provided Map to a JSON object. The provided map must use
	 * enum values as the keys, and these enums must be string compatable.
	 * i.e.: if the enum Attributes has a STRENGTH value, then STRENGTH must
	 * convert to and must be assignable from "STRENGTH"
	 * If this is not true then the deserialize methods will not work.
	 *
	 * @param toSerialize A map whose key MUST be an enum.
	 */
	public static serializeMap(toSerialize) {
		let serializedObject = {};

		toSerialize.forEach((currentValue, currentKey) => {
			serializedObject[currentKey.toString()] = currentValue;
		});

		return serializedObject;
	}

	public static deserializeAttributesMap(toDeserialize) {
		let deserializedAttributesMap = new Map<Attributes, number>();
		function convertStringToAttribute(key) {
			return Attributes[key];
		}

		return this.deserializeMap(toDeserialize, deserializedAttributesMap, convertStringToAttribute);
	}

	public static deserializePoolsMap(toDeserialize) {
		let deserializedPoolsMap = new Map<Pools, number>();
		function convertStringToPool(key) {
			return Pools[key];
		}

		return this.deserializeMap(toDeserialize, deserializedPoolsMap, convertStringToPool);
	}

	public static deserializeDefensesMap(toDeserialize) {
		let deserializedDefensesMap = new Map<Defenses, number>();
		function convertStringToDefense(key) {
			return Defenses[key];
		}

		return this.deserializeMap(toDeserialize, deserializedDefensesMap, convertStringToDefense);
	}

	public static deserializeMap(toDeserialize, targetMap, convertFunction) {
		for(let key in toDeserialize) {
			let currentKey = convertFunction(key);
			targetMap.set(currentKey, toDeserialize[key]);
		}

		return targetMap;
	}

	// Set<{affectedAttribute: Attributes, pointsPerLevel: number}>
	public static serializeAttributesSet(toSerialize: Set<{affectedAttribute: Attributes, pointsPerLevel: number}>) {
		let json = {};

		toSerialize.forEach(currentElement => {
			json[currentElement.affectedAttribute.toString()] = currentElement.pointsPerLevel;
		});

		return json;
	}

	public static deserializeAttributesSet(toDeserialize): Set<{affectedAttribute: Attributes, pointsPerLevel: number}> {
		let affectedAttributes = new Set<{affectedAttribute: Attributes, pointsPerLevel: number}>();

		for(let key in toDeserialize) {
			let currentKey = Attributes[key];
			affectedAttributes.add({affectedAttribute: currentKey, pointsPerLevel: toDeserialize[key]});
		}

		return affectedAttributes;
	}

	// Set<{affectedAttribute: Attributes, baseValue: number}>
	public static serializeBaseAttributesSet(toSerialize: Set<{affectedAttribute: Attributes, baseValue: number}>) {
		let json = {};

		toSerialize.forEach(currentElement => {
			json[currentElement.affectedAttribute.toString()] = currentElement.baseValue;
		});

		return json;
	}

	public static deserializeBaseAttributesSet(toDeserialize): Set<{affectedAttribute: Attributes, baseValue: number}> {
		let affectedAttributes = new Set<{affectedAttribute: Attributes, baseValue: number}>();

		for(let key in toDeserialize) {
			let currentKey = Attributes[key];
			affectedAttributes.add({affectedAttribute: currentKey, baseValue: toDeserialize[key]});
		}

		return affectedAttributes;
	}

	// affectedDefenses: Set<{affectedDefense: Defenses, pointsPerLevel: number}>,
	public static serializeDefensesSet(toSerialize: Set<{affectedDefense: Defenses, pointsPerLevel: number}>) {
		let json = {};

		toSerialize.forEach(currentElement => {
			json[currentElement.affectedDefense.toString()] = currentElement.pointsPerLevel;
		});

		return json;
	}

	public static deserializeDefensesSet(toDeserialize): Set<{affectedDefense: Defenses, pointsPerLevel: number}> {
		let affectedDefenses = new Set<{affectedDefense: Defenses, pointsPerLevel: number}>();

		for(let key in toDeserialize) {
			let currentKey = Defenses[key];
			affectedDefenses.add({affectedDefense: currentKey, pointsPerLevel: toDeserialize[key]});
		}

		return affectedDefenses;
	}

	// affectedDefenses: Set<{affectedDefense: Defenses, baseValue: number}>,
	public static serializeBaseDefensesSet(toSerialize: Set<{affectedDefense: Defenses, baseValue: number}>) {
		let json = {};

		toSerialize.forEach(currentElement => {
			json[currentElement.affectedDefense.toString()] = currentElement.baseValue;
		});

		return json;
	}

	public static deserializeBaseDefensesSet(toDeserialize): Set<{affectedDefense: Defenses, baseValue: number}> {
		let affectedDefenses = new Set<{affectedDefense: Defenses, baseValue: number}>();

		for(let key in toDeserialize) {
			let currentKey = Defenses[key];
			affectedDefenses.add({affectedDefense: currentKey, baseValue: toDeserialize[key]});
		}

		return affectedDefenses;
	}

	// basePools: Set<{affectedPool: Pools, baseValue: number}>
	public static serializePoolsSet(toSerialize: Set<{affectedPool: Pools, baseValue: number}>) {
		let json = {};

		toSerialize.forEach(currentElement => {
			json[currentElement.affectedPool.toString()] = currentElement.baseValue;
		});

		return json;
	}

	public static deserializePoolsSet(toDeserialize): Set<{affectedPool: Pools, baseValue: number}> {
		let affectedPools = new Set<{affectedPool: Pools, baseValue: number}>();

		for(let key in toDeserialize) {
			let currentKey = Pools[key];
			affectedPools.add({affectedPool: currentKey, baseValue: toDeserialize[key]});
		}

		return affectedPools;
	}
}