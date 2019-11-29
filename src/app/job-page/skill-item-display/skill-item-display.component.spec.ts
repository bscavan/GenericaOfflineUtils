import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillItemDisplayComponent } from './skill-item-display.component';

describe('SkillItemDisplayComponent', () => {
  let component: SkillItemDisplayComponent;
  let fixture: ComponentFixture<SkillItemDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillItemDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillItemDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
