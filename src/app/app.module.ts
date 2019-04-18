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


@NgModule({
  declarations: [
    AppComponent,
    CharacterPageComponent,
	AttributeBarComponent,
	AttributeSidebarComponent,
	PointBuyComponent,
	ImportModalComponent,
	JobPageComponent
  ],
  imports: [
	NgbModule.forRoot(),
	BrowserModule,
	FormsModule,
	AppRoutingModule
  ],
  providers: [
	{provide: APP_BASE_HREF, useValue: '/'}
],
  bootstrap: [AppComponent]
})
export class AppModule { }
