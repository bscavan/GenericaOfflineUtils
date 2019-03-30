import { Component, OnInit, Input } from '@angular/core';
import { Character } from '../../character/character';
import { Pools, Attributes } from '../../attribute-keys';

@Component({
	selector: 'app-attribute-bar',
	templateUrl: './attribute-bar.component.html',
	styleUrls: ['./attribute-bar.component.css']
})
export class AttributeBarComponent implements OnInit {

	@Input() characterFocus: Character;

	constructor() { }

	ngOnInit() {
	}

	public getHP(character: Character): number {
		return character.getPool(Pools.HEALTH_POINTS);
	}

	public getSanity(character: Character): number {
		return character.getPool(Pools.SANITY);
	}

	public getStamina(character: Character): number {
		return character.getPool(Pools.STAMINA);
	}

	public getMoxie(character: Character): number {
		return character.getPool(Pools.MOXIE);
	}

	public getFortune(character: Character): number {
		return character.getPool(Pools.FORTUNE);
	}

	public getStrength(character: Character): number {
		return character.getAttribute(Attributes.STRENGTH);
	}

	public getConstitution(character: Character): number {
		return character.getAttribute(Attributes.CONSTITUTION);
	}

	public getIntelligence(character: Character): number {
		return character.getAttribute(Attributes.INTELLIGENCE);
	}

	public getWisdom(character: Character): number {
		return character.getAttribute(Attributes.WISDOM);
	}

	public getDexterity(character: Character): number {
		return character.getAttribute(Attributes.DEXTERITY);
	}

	public getAgility(character: Character): number {
		return character.getAttribute(Attributes.AGILITY);
	}

	public getCharisma(character: Character): number {
		return character.getAttribute(Attributes.CHARISMA);
	}

	public getWill(character: Character): number {
		return character.getAttribute(Attributes.WILL);
	}

	public getLuck(character: Character): number {
		return character.getAttribute(Attributes.LUCK);
	}

	public getPerception(character: Character): number {
		return character.getAttribute(Attributes.PERCEPTION);
	}
}
