import { Injectable } from '@angular/core';
import { Character } from './character';
import { isNullOrUndefined } from 'util';
import { ConfigService } from '../config-service';


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

	constructor(configService: ConfigService) {
		this.characterFocus = Character.generateBlankCharacter();

		// TODO: Confirm this isn't giving us a 404 or anything before plugging it into the upload method...
		let foundCharacterJson = configService.getCharactersJson();
		this.importCharactersFromJSONArray(foundCharacterJson);
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

	public addCharacterToCollectionFromJsonIfMissing(newCharacterJson) {
		let newCharacter = Character.generateBlankCharacter();
		newCharacter.deserializeFromJSON(newCharacterJson);
		this.addCharacterToCollection(newCharacter);
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

	public importCharactersFromJSONArray(jsonArray) {
		if(isNullOrUndefined(jsonArray)) {
			console.error("The json provided for importing characters was null or undefined.");
			return null;
		} else {
			jsonArray.forEach(characterElement => {
				this.addCharacterToCollectionFromJsonIfMissing(characterElement);
			});
		}
	}

	public exportCharactersAsJSONArray() {
		// TODO: Export all of the characters in allKnownCharacters as a JSON array.
	}
}
