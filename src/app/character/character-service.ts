import { Injectable } from '@angular/core';
import { Character } from './character';
import { isNullOrUndefined } from 'util';


function alphabeticCharacterSort(left: Character, right: Character): 1 | -1 {
	if(isNullOrUndefined(left)) {
		if(isNullOrUndefined(right)) {
			return 1;
		} else {
			return -1;
		}
	} else if(isNullOrUndefined(right)) {
		return 1;
	} else {
		return left.name.toLowerCase() > right.name.toLowerCase() ? 1 : -1;
	}
}

@Injectable()
export class CharacterService {
	public characterFocus: Character;
	public allKnownCharacters: Character[] = [];

	constructor() {
		this.characterFocus = Character.generateBlankCharacter();
	}

	// Note, this doesn't remove the character from the collection.
	public resetCharacterFocus() {
		// TODO: Add a warning to this? Maybe a confirm block?
		this.characterFocus = Character.generateBlankCharacter();
	}

	public addCharacterFocusToCollection() {
		this.addCharacterToCollection(this.characterFocus);
	}

	public addCharacterToCollection(newCharacter: Character) {
		if(this.allKnownCharacters.indexOf(newCharacter) < 0) {
			this.allKnownCharacters.push(newCharacter);
			this.allKnownCharacters.sort(alphabeticCharacterSort)
		}
	}

	public deleteCharacterFromCollection(newCharacter: Character) {
		let indexFound = this.allKnownCharacters.indexOf(newCharacter);

		if(indexFound >= 0) {
			this.allKnownCharacters.splice(indexFound, 1);
		}
	}

	public deleteCharacterAtIndex(index: number) {
		if(index > 0 && this.allKnownCharacters.length > index) {
			this.allKnownCharacters.splice(index, 1);
		}
	}

	// TODO: Decide if this should require confirmation before it deletes an unsaved character...
	public selectCharacterAtIndex(index: number) {
		if(index >= 0 && this.allKnownCharacters.length > index) {
			this.characterFocus = this.allKnownCharacters[index];
		}
	}
}