import { Component } from '@angular/core';
import { Character } from './character/character';
import { Jaxby } from './character/jaxby';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CharacterService } from './character/character-service';

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

	constructor(private router: Router,
	private modalService: NgbModal,
	private characterService: CharacterService) {
	}

	/**
	 * Helper method called whenever the router outlet is activated.
	 * Used as a convenient place for recalculating values that may have
	 * changed on the previous page before displaying them on the new one.
	 */
	public changeOfRoutes() {
		/*
		 * Recalculates the characterFocus' stats. This is necessary because
		 * JobPage allows the user to modify the values associated with levels
		 * in jobs and CharacterPage uses them to display details about the
		 * characterFocus to the user.
		 */
		this.characterService.characterFocus.recalculateAttributes()
	}
}
