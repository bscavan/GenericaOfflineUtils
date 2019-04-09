import { Component, OnInit, Input } from '@angular/core';
import { AttributeSet } from '../../attribute-set';
import { AttributeKeys, AttributeType } from '../../attribute-keys';
import { Character } from '../../character/character';

@Component({
  selector: 'app-point-buy',
  templateUrl: './point-buy.component.html',
  styleUrls: ['./point-buy.component.css']
})
export class PointBuyComponent implements OnInit {
	public allAttributeSets: Map<AttributeType, AttributeSet>;
	public orderedAttributes = [];

	@Input() characterFocus: Character;

  constructor() { }

  ngOnInit() {
	  this.allAttributeSets = AttributeKeys.getAttributeSets();
	  this.temp();
  }

	public temp() {
		this.allAttributeSets.forEach((currentAttributeSet) => {
			this.orderedAttributes.push(currentAttributeSet);
		});
	}
}
