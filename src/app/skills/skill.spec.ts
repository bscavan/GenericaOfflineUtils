import { async, TestBed } from '@angular/core/testing';
import { Skill, Currency, Qualifier, Duration } from './skill';
import { AppComponent } from '../app.component';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';

describe('Skill', () => {
	let testSkill: Skill;

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

		let costs = [{
			costAmount: 1,
			costDenomination: Currency.GOLD_PIECES
		}];

		let duration= {
			amount: 1,
			timeDenomination: Duration.PASSIVE_CONSTANT,
			qualifier: Qualifier.NONE
		}

		testSkill = new Skill("Weapon Mastery", "mastery of a weapon", costs, duration);
	}));

	it(`should correctly serialize and deserialize skill `, async(() => {
		let skillJson = testSkill.serializeToJSON();
		skillJson = JSON.stringify(skillJson);

		let jobFileAsJson = JSON.parse(skillJson.toString());

		let otherSkill = new Skill(null, null, null, null);
		otherSkill.deserializeFromJSON(jobFileAsJson);
	}));
});