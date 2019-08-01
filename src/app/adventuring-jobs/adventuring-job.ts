import { Job } from "../job";
import { Attributes } from "../attribute-keys";
import { JobTypes } from "../shared-constants";

export class AdventuringJob extends Job {

    // Adventuring jobs only affect attributes.
	constructor(name: string, affectedAttributes: Set<{affectedAttribute: Attributes,
	pointsPerLevel: number}>,) {
        super(name, JobTypes.ADVENTURING_JOB, affectedAttributes, new Set(), new Set());
	}
	
	//TODO: Add support for skills
	//TODO: add requirements for unlocking jobs?
}