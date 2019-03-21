import { Component } from '@angular/core';
import { Character } from './character/character';
import { Jaxby } from './character/jaxby';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  public firstCharacter: Character;

  ngOnInit() {
	  this.firstCharacter = new Jaxby();
  }
}
