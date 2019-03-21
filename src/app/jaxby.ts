import { Character } from "./character";
import { Job } from "./job";
import { Attributes } from "./attribute-keys";
import { RacialJob } from "./racial-job";
import { Peskie } from "./racial-jobs/peskie";
import { Duelist } from "./adventuring-jobs/duelist";
import { Tanner } from "./crafting-jobs/tanner";

export class Jaxby extends Character{

	constructor() {
		let racialJobLevels = new Map();
		racialJobLevels.set(Peskie.getPeskieRace(), 1);

		let adventuringJobLevels = new Map();
		adventuringJobLevels.set(Duelist.getDuelistJob(), 1);

		let craftingJobLevels = new Map();
		craftingJobLevels.set(Tanner.getTannerJob(), 1);

		super("Jaxby NimbleFingers", "Master Assassin",
		racialJobLevels, adventuringJobLevels, craftingJobLevels);
	}
}