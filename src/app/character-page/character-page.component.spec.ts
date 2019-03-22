import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterPageComponent } from './character-page.component';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Jaxby } from '../character/jaxby';

describe('CharacterPageComponent', () => {
	let component: CharacterPageComponent;
	let fixture: ComponentFixture<CharacterPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ CharacterPageComponent ],
			imports: [
				FormsModule,
			],
			schemas: [
				NO_ERRORS_SCHEMA
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CharacterPageComponent);
		component = fixture.componentInstance;
		component.characterFocus = new Jaxby();
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
