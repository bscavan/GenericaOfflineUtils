import { async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from '../app.component';
import { Peskie } from '../racial-jobs/peskie';
import { Duelist } from '../adventuring-jobs/duelist';
import { Tanner } from '../crafting-jobs/tanner';
import { Character } from './character';
import { Attributes, Pools } from '../attribute-keys';
import { RacialJob } from '../racial-jobs/racial-job';
import { CraftingJob } from '../crafting-jobs/crafting-job';
import { AdventuringJob } from '../adventuring-jobs/adventuring-job';

class TestCharacter extends Character {
	// TODO: Mock out these job classes for testing...
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

describe('Character', () => {
	let testCharacter: TestCharacter;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				AppComponent
			],
			imports: [
			],
			providers: [
			],
			schemas: [
				NO_ERRORS_SCHEMA
			]
		}).compileComponents();

		testCharacter = new TestCharacter();
	}));

	it(`should correctly retrieve base attribute values`, async(() => {
		expect(testCharacter.getBaseAttribute(Attributes.STR)).toEqual(10);
		expect(testCharacter.getBaseAttribute(Attributes.CON)).toEqual(20);

		expect(testCharacter.getBaseAttribute(Attributes.INT)).toEqual(25);
		expect(testCharacter.getBaseAttribute(Attributes.WIS)).toEqual(15);

		expect(testCharacter.getBaseAttribute(Attributes.DEX)).toEqual(40);
		expect(testCharacter.getBaseAttribute(Attributes.AGL)).toEqual(50);

		expect(testCharacter.getBaseAttribute(Attributes.CHA)).toEqual(30);
		expect(testCharacter.getBaseAttribute(Attributes.WILL)).toEqual(10);

		expect(testCharacter.getBaseAttribute(Attributes.PER)).toEqual(25);
		expect(testCharacter.getBaseAttribute(Attributes.LUCK)).toEqual(25);
	}));

	it(`should correctly calculate total attribute values`, async(() => {
		expect(testCharacter.getAttribute(Attributes.STR)).toEqual(14);
		expect(testCharacter.getAttribute(Attributes.CON)).toEqual(21);

		expect(testCharacter.getAttribute(Attributes.INT)).toEqual(26);
		expect(testCharacter.getAttribute(Attributes.WIS)).toEqual(16);

		expect(testCharacter.getAttribute(Attributes.DEX)).toEqual(49);
		expect(testCharacter.getAttribute(Attributes.AGL)).toEqual(59);

		expect(testCharacter.getAttribute(Attributes.CHA)).toEqual(35);
		expect(testCharacter.getAttribute(Attributes.WILL)).toEqual(11);

		expect(testCharacter.getAttribute(Attributes.PER)).toEqual(26);
		expect(testCharacter.getAttribute(Attributes.LUCK)).toEqual(26);
	}));

	// TODO: Test this out with a race that has base pool values...
	it(`should correctly retrieve base pool values`, async(() => {
		expect(testCharacter.getBasePool(Pools.HP)).toEqual(0);
		expect(testCharacter.getBasePool(Pools.SAN)).toEqual(0);
		expect(testCharacter.getBasePool(Pools.STA)).toEqual(0);
		expect(testCharacter.getBasePool(Pools.MOX)).toEqual(0);
		expect(testCharacter.getBasePool(Pools.FOR)).toEqual(0);
	}));

	it(`should correctly calculate total attributes`, async(() => {
		expect(testCharacter.getPool(Pools.HP)).toEqual(35);
		expect(testCharacter.getPool(Pools.SAN)).toEqual(42);
		expect(testCharacter.getPool(Pools.STA)).toEqual(108);
		expect(testCharacter.getPool(Pools.MOX)).toEqual(46);
		expect(testCharacter.getPool(Pools.FOR)).toEqual(52);
	}));

	/*
	 * TODO: Write the following tests:
	 	 * Adding adventuring jobs and confirming the stats rose accordingly
	 	 * removing adventuring jobs and confirming the stas fell accordingly
		 * Switching an existing adventuring job with a new one and confirming the stats are correct
		 * Changing race and confirming both the stats and the jobslot counts changed correctly
		 * Adding adventuring jobs, changing race on one with fewer job slots, and confirming the extra jobs dropped
		 * 
		 * similar tests for adding, removing, changing, etc. with crafting jobs...
	 */
});