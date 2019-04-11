import { Component, OnInit, Input } from '@angular/core';
import { AttributeSet } from '../../attribute-set';
import { AttributeKeys, AttributeType, Attributes } from '../../attribute-keys';
import { Character } from '../../character/character';

@Component({
  selector: 'app-point-buy',
  templateUrl: './point-buy.component.html',
  styleUrls: ['./point-buy.component.css']
})
export class PointBuyComponent implements OnInit {
	public allAttributeSets: Map<AttributeType, AttributeSet>;

	public orderedAttributes: Attributes[] = [];
	public readonly maxPoints = 50;

	/**
	 * The number of points the characterFocus still has available for investing
	 * into their attributes out of their first round of investments.
	 */
	public pointsAllocatable_first = this.maxPoints;

	/**
	 * The number of points the characterFocus still has available for investing
	 * into their attributes out of their second round of investments.
	 */
	public pointsAllocatable_second = this.maxPoints;

	public firstSetPointBuyArray = [];

	@Input() characterFocus: Character;

	constructor() { }

	ngOnInit() {
		this.allAttributeSets = AttributeKeys.getAttributeSets();
		this.initializeArrays();
	}

	// TODO: make a local set of attributes we're tracking characterFocus.initialRandomAttributes and manage it here.

	/**
	 * Updates the value for the provided attribute and matching index in
	 * firstSetPointBuyArray and characterFocus.firstSetPointBuyAttributes.
	 * Then calls enforceMaximumPointValues_first.
	 *
	 * @param attribute 
	 * @param index 
	 */
	updateAllocatablePoints_first(attribute: Attributes, index: number) {
		let currentValue = this.firstSetPointBuyArray[index];
		this.characterFocus.firstSetPointBuyAttributes.set(attribute, currentValue);

		this.enforceMaximumPointValues_first();
	}

	/**
	 * Synchronizes the attribute values in firstSetPointBuyArray and
	 * characterFocus.firstSetPointBuyAttributes, respecting the limit of
	 * maxPoints.
	 */
	public enforceMaximumPointValues_first() {
		this.pointsAllocatable_first = this.maxPoints;

		this.characterFocus.firstSetPointBuyAttributes.forEach((currentValue, currentKey) => {
			this.pointsAllocatable_first = this.pointsAllocatable_first - currentValue;

			/*
			 * If subtracting the current attribute investment from the
			 * remaining points reduced the remaining points below zero, then
			 * re-increment that attribute by the difference.
			 */
			if(this.pointsAllocatable_first < 0) {
				let adjustedValue = this.characterFocus.firstSetPointBuyAttributes.get(currentKey)
					+ this.pointsAllocatable_first;
				this.characterFocus.firstSetPointBuyAttributes.set(currentKey, adjustedValue);

				this.pointsAllocatable_first = 0;
				// TODO: Add an early termination here that zeros out the remaining attributes.
			}

			let currentIndex = this.orderedAttributes.indexOf(currentKey);
			this.firstSetPointBuyArray[currentIndex] = this.characterFocus.firstSetPointBuyAttributes.get(currentKey);
		});
	}

	/**
	 * Initializes the arrays used for this component.
	 */
	public initializeArrays() {
		this.allAttributeSets.forEach((currentAttributeSet) => {
			this.orderedAttributes.push(currentAttributeSet.offensiveAttribute);
			this.orderedAttributes.push(currentAttributeSet.defensiveAttribute);
			// This array needs an empty slot for every attribute in orderedAttributes.
			this.firstSetPointBuyArray.push(0);
			this.firstSetPointBuyArray.push(0);
		});
	}
}