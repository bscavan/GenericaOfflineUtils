import { Character } from "./character";
import { RacialJob } from "../racial-jobs/racial-job";
import { Peskie } from "../racial-jobs/peskie";
import { Duelist } from "../adventuring-jobs/duelist";
import { Tanner } from "../crafting-jobs/tanner";
import { AdventuringJob } from "../adventuring-jobs/adventuring-job";
import { CraftingJob } from "../crafting-jobs/crafting-job";

export class Jaxby extends Character{

	constructor() {
		let primaryRacialJob = Peskie.getPeskieRace();

		// FIXME: As soon as you figure out how to declare an empty, typed
		// array, remove this wasteful approach...
		let supplementalRacialJobsArray: [{ job: RacialJob; level: number; }] = [{job: null, level: null}];
		supplementalRacialJobsArray.pop();

		let adventuringJobLevels: [{job: AdventuringJob, level: number}] = [Character.makeAdventuringJobObject(Duelist.getDuelistJob(), 1)];

		let craftingJobLevels: [{job: CraftingJob, level: number}] = [Character.makeCraftingJobObject(Tanner.getTannerJob(), 1)];

		super("Jaxby NimbleFingers", "Master Assassin",
			primaryRacialJob, 1, supplementalRacialJobsArray,
			adventuringJobLevels, craftingJobLevels, 0, 0);
	}
}
