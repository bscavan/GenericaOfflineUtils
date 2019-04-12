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
	 * Local collection of the 2d10 points a character receives in each
	 * attribute during character creation.
	 */
	public randomAttributes = [];

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
		this.loadFirstPointBuyAttributesSectionFromCharacter();
		this.loadSecondPointBuyAttributesSectionFromCharacter();
		this.loadRandomAttributesSectionFromCharacter();
	}

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

	/*
	 * TODO: Consider
	 * A) allowing players to manually enter these values, or
	 * B) rolling all 10 of them, and letting players manually assign them
	 * via drag-and-drop.
	 */
	/**
	 * Sets each element in randomAttributes to a random number equal to the
	 * result of two ten-sided dice rolls (aka: 2d10).
	 */
	public reroll() {
		for(let index = 0; index < this.randomAttributes.length; index++) {
			this.randomAttributes[index] = this.oneToTen() + this.oneToTen();
		}

		this.propagateRerollToCharacter();
	}

	/**
	 * Overwrites the values in characterFocus.initialRandomAttributes with the
	 * new values in randomAttributes, and then updates the total attributes on
	 * characterFocus by calling characterFocus.recalculateAttributes().
	 */
	public propagateRerollToCharacter() {
		this.characterFocus.initialRandomAttributes.forEach((currentValue, currentKey) => {
			let currentIndex = this.orderedAttributes.indexOf(currentKey);
			this.characterFocus.initialRandomAttributes.set(currentKey, this.randomAttributes[currentIndex]);
		});

		this.characterFocus.recalculateAttributes();
	}

	/**
	 * Returns a random number between 1 and 10.
	 */
	private oneToTen(): number {
		return Math.floor(Math.random() * 10) + 1;
	}

	/**
	 * Initializes the arrays used for this component.
	 */
	public initializeArrays() {
		this.allAttributeSets.forEach((currentAttributeSet) => {
			this.orderedAttributes.push(currentAttributeSet.offensiveAttribute);
			this.orderedAttributes.push(currentAttributeSet.defensiveAttribute);
			// These arrays require empty slots for each attribute in orderedAttributes.
			this.firstSetPointBuyArray.push(0);
			this.firstSetPointBuyArray.push(0);
			this.secondSetPointBuyArray.push(0);
			this.secondSetPointBuyArray.push(0);
			this.randomAttributes.push(0);
			this.randomAttributes.push(0);
		});
	}

	/*
	 * Note: These loading methods require that every attribute represented in
	 * characterFocus.initialRandomAttributes is present in this.orderedAttributes
	 * and that the indices they occur at correspond to the correct slots in
	 * firstSetPointBuyAttributes, secondSetPointBuyAttributes, and
	 * randomAttributes.
	 */
	public loadFirstPointBuyAttributesSectionFromCharacter() {
		this.characterFocus.firstSetPointBuyAttributes.forEach((currentValue, currentKey) => {
			let currentIndex = this.orderedAttributes.indexOf(currentKey);
			this.firstSetPointBuyArray[currentIndex] = currentValue;
		});
	}

	public loadSecondPointBuyAttributesSectionFromCharacter() {
		this.characterFocus.secondSetPointBuyAttributes.forEach((currentValue, currentKey) => {
			let currentIndex = this.orderedAttributes.indexOf(currentKey);
			this.secondSetPointBuyArray[currentIndex] = currentValue;
		});
	}

	public loadRandomAttributesSectionFromCharacter() {
		this.characterFocus.initialRandomAttributes.forEach((currentValue, currentKey) => {
			let currentIndex = this.orderedAttributes.indexOf(currentKey);
			this.randomAttributes[currentIndex] = currentValue;
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
