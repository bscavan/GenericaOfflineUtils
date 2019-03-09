import { Component, OnInit } from '@angular/core';
import { AttributeType, Attributes, Defenses, Pools, AttributeKeys } from '../attribute-keys';
import { Attribute } from '@angular/compiler';
import { AttributeSet } from '../attribute-set';


@Component({
  selector: 'app-character-page',
  templateUrl: './character-page.component.html',
  styleUrls: ['./character-page.component.css']
})
export class CharacterPageComponent implements OnInit {

	expanded: boolean = true;

	constructor() {
	}

	ngOnInit() {
	}

}
