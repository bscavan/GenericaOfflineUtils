import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CharacterPageComponent } from './character-page/character-page.component';
import { AttributeBarComponent } from './character-page/attribute-bar/attribute-bar.component';
import { AttributeSidebarComponent } from './character-page/attribute-sidebar/attribute-sidebar.component';
import { PointBuyComponent } from './character-page/point-buy/point-buy.component';
import { ImportModalComponent } from './character-page/import-modal/import-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JobPageComponent } from './job-page/job-page.component';
import { AppRoutingModule } from './app-routing-module';
import { APP_BASE_HREF } from '@angular/common';
import { CharacterService } from './character/character-service';
import { JobService } from './job-service';
import { SkillPageComponent } from './skill-page/skill-page.component';
import { SkillService } from './skills/skill-service';
import { SkillItemDisplayComponent } from './job-page/skill-item-display/skill-item-display.component';
import { ConfigService, ConfigModule } from './config-service';
import { ConnectionBackend, HttpModule } from '@angular/http';


@NgModule({
  declarations: [
    AppComponent,
    CharacterPageComponent,
	AttributeBarComponent,
	AttributeSidebarComponent,
	PointBuyComponent,
	ImportModalComponent,
	JobPageComponent,
	SkillPageComponent,
	SkillItemDisplayComponent
  ],
  imports: [
	NgbModule.forRoot(),
	BrowserModule,
	FormsModule,
	AppRoutingModule,
	HttpModule,
  ],
  providers: [
	{provide: APP_BASE_HREF, useValue: '/'},
	CharacterService,
	JobService,
	SkillService,
	ConfigService,
	ConfigModule.init()
],
  bootstrap: [AppComponent]
})
export class AppModule { }
