import { Component, OnInit, Input } from '@angular/core';
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
