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

	/**
	 * The total number of points that can be invested in all attributes in
	 * each step of the point-buy during character generation.
	 */
	public readonly maxPointsTotal = 50;

	/*
	 * In the alpha rules, there are no percentage limits on the first set of
	 * attribute investments.
	 */
	public readonly maxInvestmentPerAttribute_first = this.maxPointsTotal;
	
	/*
	 * In the alpha rules, the second set of attribute investments imposes a
	 * cap of 10 points max per attribute.
	 */
	public readonly maxInvestmentPerAttribute_second = 10;

	/**
	 * The number of points the characterFocus still has available for investing
	 * into their attributes out of their first round of investments.
	 */
	public pointsAllocatable_first = this.maxPointsTotal;

	/**
	 * The number of points the characterFocus still has available for investing
	 * into their attributes out of their second round of investments.
	 */
	public pointsAllocatable_second = this.maxPointsTotal;

	/**
	 * Local collection of attribute investment data for characterFocus's first
	 * point-buy section of character generation. Each element corresponds to
	 * the Attribute element in orderedAttributes with the matching index.
	 */
	public firstSetPointBuyArray = [];

	/**
	 * Local collection of attribute investment data for characterFocus's second
	 * point-buy section of character generation. Each element corresponds to
	 * the Attribute element in orderedAttributes with the matching index.
	 */
	public secondSetPointBuyArray = [];

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
		this.characterFocus.recalculateAttributes();
	}

	/**
	 * Synchronizes the attribute values in firstSetPointBuyArray and
	 * characterFocus.firstSetPointBuyAttributes, respecting the limits of
	 * maxPoints and maxInvestmentPerAttribute_first.
	 */
	public enforceMaximumPointValues_first() {
		this.pointsAllocatable_first = this.maxPointsTotal;

		this.characterFocus.firstSetPointBuyAttributes.forEach((currentValue, currentKey) => {
			// First check if the individual attribute limit has been exceeded.
			if(currentValue > this.maxInvestmentPerAttribute_first) {
				// If it has, then this attribute will be set to the limit.
				this.characterFocus.firstSetPointBuyAttributes.set(currentKey, this.maxInvestmentPerAttribute_first);
				currentValue = this.maxInvestmentPerAttribute_first;
			}

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

	// FIXME: Refactor these nearly-duplicated methods to something reusable.

	/**
	 * Updates the value for the provided attribute and matching index in
	 * secondSetPointBuyArray and characterFocus.secondSetPointBuyAttributes.
	 * Then calls enforceMaximumPointValues_second.
	 *
	 * @param attribute 
	 * @param index 
	 */
	updateAllocatablePoints_second(attribute: Attributes, index: number) {
		let currentValue = this.secondSetPointBuyArray[index];
		this.characterFocus.secondSetPointBuyAttributes.set(attribute, currentValue);

		this.enforceMaximumPointValues_second();
		this.characterFocus.recalculateAttributes();
	}

	/**
	 * Synchronizes the attribute values in secondSetPointBuyArray and
	 * characterFocus.secondSetPointBuyAttributes, respecting the limits of
	 * maxPoints and maxInvestmentPerAttribute_second.
	 */
	public enforceMaximumPointValues_second() {
		this.pointsAllocatable_second = this.maxPointsTotal;

		this.characterFocus.secondSetPointBuyAttributes.forEach((currentValue, currentKey) => {
			// First check if the individual attribute limit has been exceeded.
			if(currentValue > this.maxInvestmentPerAttribute_second) {
				// If it has, then this attribute will be set to the limit.
				this.characterFocus.secondSetPointBuyAttributes.set(currentKey, this.maxInvestmentPerAttribute_second);
				currentValue = this.maxInvestmentPerAttribute_second;
			}

			this.pointsAllocatable_second = this.pointsAllocatable_second - currentValue;

			/*
			 * If subtracting the current attribute investment from the
			 * remaining points reduced the remaining points below zero, then
			 * re-increment that attribute by the difference.
			 */
			if(this.pointsAllocatable_second < 0) {
				let adjustedValue = this.characterFocus.secondSetPointBuyAttributes.get(currentKey)
					+ this.pointsAllocatable_second;
				this.characterFocus.secondSetPointBuyAttributes.set(currentKey, adjustedValue);

				this.pointsAllocatable_second = 0;
				// TODO: Add an early termination here that zeros out the remaining attributes.
			}

			let currentIndex = this.orderedAttributes.indexOf(currentKey);
			this.secondSetPointBuyArray[currentIndex] = this.characterFocus.secondSetPointBuyAttributes.get(currentKey);
		});
	}

	/**
	 * Initializes the arrays used for this component.
	 */
	public initializeArrays() {
		this.allAttributeSets.forEach((currentAttributeSet) => {
			this.orderedAttributes.push(currentAttributeSet.offensiveAttribute);
			this.orderedAttributes.push(currentAttributeSet.defensiveAttribute);
			// This arrays need an empty slot for each attribute in orderedAttributes.
			this.firstSetPointBuyArray.push(0);
			this.firstSetPointBuyArray.push(0);
			this.secondSetPointBuyArray.push(0);
			this.secondSetPointBuyArray.push(0);
		});
	}

	/**
	 * Returns the result of Math.min(left, right).
	 * Included so the aforementioned method can be called from this component's
	 * HTML.
	 *
	 * @param left Number to compare to right
	 * @param right Number to compare to left
	 */
	public minimum(left: number, right: number) {
		return Math.min(left, right);
	}
}
