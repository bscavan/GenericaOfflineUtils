import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillPageComponent } from './skill-page.component';

describe('SkillPageComponent', () => {
  let component: SkillPageComponent;
  let fixture: ComponentFixture<SkillPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
