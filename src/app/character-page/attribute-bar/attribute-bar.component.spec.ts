import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeBarComponent } from './attribute-bar.component';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { Jaxby } from '../../character/jaxby';

describe('AttributeBarComponent', () => {
	let component: AttributeBarComponent;
	let fixture: ComponentFixture<AttributeBarComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
		declarations: [ AttributeBarComponent ],
		imports: [
		],
		schemas: [
			NO_ERRORS_SCHEMA
		]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AttributeBarComponent);
		component = fixture.componentInstance;
		component.characterFocus = new Jaxby();
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
