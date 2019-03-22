import { Component, OnInit, Input } from '@angular/core';
import { Character } from '../../character/character';
import { Pools } from '../../attribute-keys';

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
}
