import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeSidebarComponent } from './attribute-sidebar.component';

describe('AttributeSidebarComponentComponent', () => {
  let component: AttributeSidebarComponent;
  let fixture: ComponentFixture<AttributeSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
