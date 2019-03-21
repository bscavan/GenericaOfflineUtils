import { Component, OnInit, Input } from '@angular/core';
import { AttributeType, Attributes, Defenses, Pools, AttributeKeys } from '../attribute-keys';
import { Attribute } from '@angular/compiler';
import { AttributeSet } from '../attribute-set';
import { Jaxby } from '../character/jaxby';
import { Character } from '../character/character';


@Component({
  selector: 'app-character-page',
  templateUrl: './character-page.component.html',
  styleUrls: ['./character-page.component.css']
})
export class CharacterPageComponent implements OnInit {

	@Input() characterFocus: Character;
	expanded: boolean = true;

	constructor() {
	}

	ngOnInit() {
	}

}
