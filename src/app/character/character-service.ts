import { Injectable } from '@angular/core';
import { Character } from './character';
import { isNullOrUndefined } from 'util';
import { ConfigService } from '../config-service';
import { SkillService } from '../skills/skill-service';


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

	/**
	 * FIXME: This needs to be routinely sorted (alphabetically by name?)
	 * FIXME: Rather than allowing other classes and HTML to directly access this,
	 * they need to maintain their own, local copies that are hooked up to a
	 * subscription to an observable of this list. Whenever this list's content
	 * changes, they will need to re-pull and refresh what they are displaying.
	 */
	public allKnownCharacters: Character[] = [];

	constructor(configService: ConfigService, private skillService: SkillService) {
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
			this.skillService.addSkillsfromJobIfMissing(newCharacter.primaryRacialJob);

			// Iterate over each of the character's jobs and add all newly found skills to the SkillService
			newCharacter.supplementalRacialJobLevels.forEach((currentSupplementalJobLevelPair) => {
				this.skillService.addSkillsfromJobIfMissing(currentSupplementalJobLevelPair.job);
			})

			newCharacter.adventuringJobLevels.forEach((currentAdventuringJobLevelPair) => {
				this.skillService.addSkillsfromJobIfMissing(currentAdventuringJobLevelPair.job);
			})

			newCharacter.craftingJobLevels.forEach((currentSupplementalJobLevelPair) => {
				this.skillService.addSkillsfromJobIfMissing(currentSupplementalJobLevelPair.job);
			})

			// Iterate over each of the character's generic skills and add all newly found ones to the SkillService
			newCharacter.genericSkills.forEach((currentSkill) => {
				this.skillService.addGenericSkillIfMissing(currentSkill.skill);
			});

			this.sortAllKnownCharacters();
		}
	}

	public sortAllKnownCharacters() {
		this.allKnownCharacters.sort(alphabeticCharacterSort);
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
			let arrayAsJSON = jsonArray.json();

			if(isNullOrUndefined(arrayAsJSON)) {
				console.error("The value provided for importing characters was not parsable as json.");
				return null;
			}

			arrayAsJSON.forEach(characterElement => {
				this.addCharacterToCollectionFromJsonIfMissing(characterElement);
			});
		}
	}

	// Exports all of the characters in allKnownCharacters as a JSON array.
	// Excludes characterFocus if it has not been saved/uploaded into the collection.
	public getAllCharactersAsJSONArray(): {}[] {
		let allCharactersArray = [];

		this.allKnownCharacters.forEach((currentCharacter) => {
			allCharactersArray.push(currentCharacter.serializeToJSON());
		});

		return allCharactersArray;
	}
}
