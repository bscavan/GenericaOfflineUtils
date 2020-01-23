import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPageComponent } from './job-page.component';
import { CharacterService } from '../character/character-service';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { JobService } from '../job-service';

describe('JobPageComponent', () => {
  let component: JobPageComponent;
  let fixture: ComponentFixture<JobPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobPageComponent ],
    providers: [
      //{ provide: APP_BASE_HREF, useValue: '/'},
      CharacterService,
      JobService
    ],
	  imports: [
      FormsModule,
      //AppRoutingModule,
	  ],
	  schemas: [
		  NO_ERRORS_SCHEMA
	  ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });
});
