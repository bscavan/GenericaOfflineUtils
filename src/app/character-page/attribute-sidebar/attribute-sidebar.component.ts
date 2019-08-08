
import { Component, OnInit, Input } from '@angular/core';
import { Character } from '../../character/character';
import { Pools, Attributes, Defenses } from '../../attribute-keys';

@Component({
  selector: 'app-attribute-sidebar',
  templateUrl: './attribute-sidebar.component.html',
  styleUrls: ['./attribute-sidebar.component.css']
})
export class AttributeSidebarComponent implements OnInit {
	@Input() characterFocus: Character;

	constructor() { }

	ngOnInit() {
	}

	public getHP(character: Character): number {
		return character.getPool(Pools.HP);
	}

	public getSanity(character: Character): number {
		return character.getPool(Pools.SAN);
	}

	public getStamina(character: Character): number {
		return character.getPool(Pools.STA);
	}

	public getMoxie(character: Character): number {
		return character.getPool(Pools.MOX);
	}

	public getFortune(character: Character): number {
		return character.getPool(Pools.FOR);
	}

	public getStrength(character: Character): number {
		return character.getAttribute(Attributes.STR);
	}

	public getConstitution(character: Character): number {
		return character.getAttribute(Attributes.CON);
	}

	public getIntelligence(character: Character): number {
		return character.getAttribute(Attributes.INT);
	}

	public getWisdom(character: Character): number {
		return character.getAttribute(Attributes.WIS);
	}

	public getDexterity(character: Character): number {
		return character.getAttribute(Attributes.DEX);
	}

	public getAgility(character: Character): number {
		return character.getAttribute(Attributes.AGL);
	}

	public getCharisma(character: Character): number {
		return character.getAttribute(Attributes.CHA);
	}

	public getWill(character: Character): number {
		return character.getAttribute(Attributes.WILL);
	}

	public getLuck(character: Character): number {
		return character.getAttribute(Attributes.LUCK);
	}

	public getPerception(character: Character): number {
		return character.getAttribute(Attributes.PER);
	}

	public getArmor(character: Character): number {
		return character.getDefense(Defenses.ARM);
	}

	public getMentalFortitude(character: Character): number {
		return character.getDefense(Defenses.MFORT);
	}

	public getEndurance(character: Character): number {
		return character.getDefense(Defenses.END);
	}

	public getCool(character: Character): number {
		return character.getDefense(Defenses.COOL);
	}

	public getFate(character: Character): number {
		return character.getDefense(Defenses.FATE);
	}
}
