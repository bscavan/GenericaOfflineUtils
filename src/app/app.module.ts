import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CharacterPageComponent } from './character-page/character-page.component';
import { AttributeBarComponent } from './character-page/attribute-bar/attribute-bar.component';


@NgModule({
  declarations: [
    AppComponent,
    CharacterPageComponent,
    AttributeBarComponent
  ],
  imports: [
	BrowserModule,
	FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
