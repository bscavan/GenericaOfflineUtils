import { Peskie } from "./peskie";
import { Human } from "./human";
import { RacialJob } from "./racial-job";
import { Dwarf } from "./dwarf";
import { ToyGolem_Metal } from "./toy-golem_metal";
import { BlankRacialJob } from "./blank-racial-job";
import * as deepEqual from "deep-equal";
import { isNull } from "util";

export class Races {
	// TODO: Add support for races that have supplemental job slots, but only
	// allow specific races as options, ex: half-breeds only allow two-skill jobs,
	// and beastkin are humans with one beast job...
	private static allRaces: RacialJob[] = null;
	private static allSupplementalRaces: RacialJob[] = null;

	// TODO: Refactor this so that the underlying structure of the collection is a map?
	// TODO: Refactor this so that new jobs can be added via JSON (which gets deserialized)

	private static compileRaces(): RacialJob[] {
		let allRaces = [];
		allRaces.push(BlankRacialJob.getBlankRacialJob());
		allRaces.push(Peskie.getPeskieRace());
		allRaces.push(Human.getHumanRace());
		allRaces.push(Dwarf.getDwarfRace());
		allRaces.push(ToyGolem_Metal.getToyGolem_MetalRace());
		// TODO: Add more races to this list automatically...

		return allRaces;
	}

	private static compileSupplementalRaces() {
		let supplementalRaces = []

		this.getAllRaces().forEach((currentRace) => {
			if(currentRace.canBeSupplementalJob) {
				supplementalRaces.push(currentRace);
			}
		});

		return supplementalRaces;
	}

	// Use this to iterate over all the racial job options offered in the front-end
	public static getAllRaces(): RacialJob[] {
		if(this.allRaces == null) {
			this.allRaces = this.compileRaces();
		}

		return this.allRaces;
	}

	// Use this to iterate over all the supplemental racial job options offered in the front-end
	public static getAllSupplementalRaces(): RacialJob[] {
		if(this.allSupplementalRaces == null) {
			this.allSupplementalRaces = this.compileSupplementalRaces();
		}

		return this.allSupplementalRaces;
	}

	public static addJob(job: RacialJob) {
		this.allRaces.push(job);

		if(job.canBeSupplementalJob) {
			this.allSupplementalRaces.push(job);
		}
	}

	public static deserializeRacialJob(json): RacialJob {
		let prospectiveJob = BlankRacialJob.generateBlankRacialJob().deserializeFromJSON(json);
		let jobToReturn: RacialJob = null;

		this.allRaces.forEach((currentJob) => {
			if(deepEqual(currentJob, prospectiveJob)) {
				jobToReturn = currentJob;
				return;
			}
		});

		if(isNull(jobToReturn)) {
			this.allRaces.push(prospectiveJob);
			return prospectiveJob;
		} else {
			return jobToReturn;
		}
	}
}