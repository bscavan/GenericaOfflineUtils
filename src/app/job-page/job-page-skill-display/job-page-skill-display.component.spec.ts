import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPageSkillDisplayComponent } from './job-page-skill-display.component';

describe('JobPageSkillDisplayComponent', () => {
  let component: JobPageSkillDisplayComponent;
  let fixture: ComponentFixture<JobPageSkillDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobPageSkillDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobPageSkillDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
