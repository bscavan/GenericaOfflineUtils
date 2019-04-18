import { Component } from '@angular/core';
import { Character } from './character/character';
import { Jaxby } from './character/jaxby';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

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
	private modalService: NgbModal) {
	}
}
