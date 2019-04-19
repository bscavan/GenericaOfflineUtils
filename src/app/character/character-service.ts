import { Injectable } from '@angular/core';
import { Character } from './character';

@Injectable()
export class CharacterService {
	public characterFocus: Character;

	constructor() {
		this.characterFocus = Character.generateBlankCharacter();
	}
}