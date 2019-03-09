import { Job } from "./job";
import { Attributes } from "./attribute-keys";

export class RacialJob extends Job {

    // Adventuring jobs only affect attributes.
    constructor(name: string, affectedAttributes: Set<{affectedAttribute: Attributes, pointsPerLevel: number}>,) {
		super(name, affectedAttributes, new Set(), new Set());
		//FIXME: Racial jobs aren't like adventuring and crafting jobs! They don't always give the same number of points per level!
	}
	
	//TODO: Add support for skills
	//TODO: add requirements for unlocking jobs?
}