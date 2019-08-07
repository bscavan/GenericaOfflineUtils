import { Component, OnInit } from '@angular/core';
import { Races } from '../racial-jobs/races';
import { AdventuringJobs } from '../adventuring-jobs/adventuring-jobs';
import { Professions } from '../crafting-jobs/professions';
import { RacialJob } from '../racial-jobs/racial-job';
import * as FileSaver from 'file-saver';
import { CharacterService } from '../character/character-service';
import { Character } from '../character/character';



@Component({
  selector: 'app-character-page',
  templateUrl: './character-page.component.html',
  styleUrls: ['./character-page.component.css']
})
export class CharacterPageComponent implements OnInit {
	public readonly LABEL = Character.LABEL;

	// This is a limitation on the rules we have, not the software itself.
	public readonly MAX_LEVEL = 25;
	allRacialJobs: RacialJob[] = Races.getAllRaces();
	allSupplementalRacialJobs: RacialJob[] = Races.getAllSupplementalRaces();
	allAdventuringJobs = AdventuringJobs.getAllAdventuringJobs();
	allCraftingJobs = Professions.getAllCraftingJobs();
	expanded: boolean = true;

	// Control for the ngIf on the PointBuy component.
	expandPointBuyOptions: boolean = false;

	// Control for the ngIf on the manual/testing controls.
	expandOptions:boolean = false;

	constructor(public characterService: CharacterService) {
	}

	ngOnInit() { }

	createRange(number){
		var items: number[] = [];
		for(var i = 1; i <= number; i++){
			items.push(i);
		}
		return items;
	}

	/*
	// Manual testing code for seriailization.
	public serialize() {
		/*
		// TODO: Put these into a unit-test.
		let moddedPeskieRace = Peskie.getPeskieRace();
		moddedPeskieRace.basePools.add({affectedPool: Pools.HP, baseValue: 7});
		let serializedPeskieJob = moddedPeskieRace.serializeToJSON();
		console.log(serializedPeskieJob);

		let pesudoPeskieJob: RacialJob = BlankRacialJob.getBlankRacialJob();
		pesudoPeskieJob.deserializeFromJSON(serializedPeskieJob);
		*
		let allRaces = Races.getAllRaces();
		let serializedJaxby = this.characterFocus.serializeToJSON();

		console.log(serializedJaxby);

		this.characterFocus.deserializeFromJSON(serializedJaxby);

		let job = this.characterFocus.primaryRacialJob;
		let jobJson = job.serializeToJSON();

		Races.deserializeRacialJob(jobJson);

		let secondLength = Races.getAllRaces().length;
	}
	*/

	public save() {
		let filename = "character_" + this.characterService.characterFocus.name + ".save";
		let characterJson = this.characterService.characterFocus.serializeToJSON();
		characterJson = JSON.stringify(characterJson);
		let characterJsonArray = [];
		characterJsonArray.push(characterJson);

		let blob = new Blob(characterJsonArray, {type: 'text/plain' });
		FileSaver.saveAs(blob, filename);
	}
}
