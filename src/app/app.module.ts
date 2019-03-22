import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


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
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
