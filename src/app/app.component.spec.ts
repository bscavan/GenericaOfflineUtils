import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CharacterPageComponent } from './character-page/character-page.component';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { AppRoutingModule } from './app-routing-module';
import { JobService } from './job-service';
import { CharacterService } from './character/character-service';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
      AppComponent,
      CharacterPageComponent
    ],
    providers: [
      { provide: APP_BASE_HREF, useValue: '/'},
      JobService,
      CharacterService
    ],
	  imports: [
      FormsModule,
      AppRoutingModule,
	  ],
	  schemas: [
		  NO_ERRORS_SCHEMA
	  ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  /*
  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!');
  }));
  */
});
