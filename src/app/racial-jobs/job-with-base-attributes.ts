import { Attributes, Defenses } from "../attribute-keys";

export const TYPE = 'JobWithBaseAttributes';

export interface JobWithBaseAttributes {
	type: string;
	// This is currently only around for allowing more generalized code in job-page-component

	getBaseAttributes();

	setBaseAttributes(baseAttributes: Set<{affectedAttribute: Attributes, baseValue: number}>);

	addBaseAttributes(newBaseAttribute: {affectedAttribute: Attributes, baseValue: number});

	getBaseDefenses();

	setBaseDefenses(baseDefenses: Set<{affectedDefense: Defenses, baseValue: number}>);

	addBaseDefenses(newBaseDefense: {affectedDefense: Defenses, baseValue: number});
}

export function isJobWithBaseAttributes(input: Object) {
	if((input as any).type === TYPE) {
		return true;
	} else {
		return false;
	}
}