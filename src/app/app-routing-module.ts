import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharacterPageComponent } from './character-page/character-page.component';
import { JobPageComponent } from './job-page/job-page.component';
import { SkillPageComponent } from './skill-page/skill-page.component';

const CHARACTER_PAGE_ROUTE = "characterPage";
const JOB_PAGE_ROUTE = "jobPage";
const SKILL_PAGE_ROUTE = "skillPage";

const routes: Routes =
[
    {
        path: CHARACTER_PAGE_ROUTE, component: CharacterPageComponent,
    },
	{
		path: JOB_PAGE_ROUTE, component: JobPageComponent,
	},
	{
		path: SKILL_PAGE_ROUTE, component: SkillPageComponent,
	},
    {
        path: '**', component: CharacterPageComponent
    }
];

@NgModule(
  {
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
  })
export class AppRoutingModule { }
