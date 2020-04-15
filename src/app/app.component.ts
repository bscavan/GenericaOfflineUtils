import { Component } from '@angular/core';
import { Character } from './character/character';
import { Jaxby } from './character/jaxby';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CharacterService } from './character/character-service';
// import { Store } from '@ngxs/store';
import { MessageAction } from './actions/message-action'
import { delay} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { fromEvent } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'app';
	public firstCharacter: Character;
	source$: Observable<Event>;

	// TODO: Export this as a constant.
	readonly ACTION_KEY = "ACTION_NAME";

	ngOnInit() {
		this.firstCharacter = new Jaxby();
	}

	constructor(private router: Router,
	private modalService: NgbModal,
	private characterService: CharacterService,
	//private store: Store
	) {
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

	dispatcher(message: string){
		// if(actionName === STATUS.login){
		// 	this.status = STATUS.logout;
		// 	this.store.dispatch(new Login());
		// } else {
		// 	this.status = STATUS.login;
		// 	this.store.dispatch(new Logout());
		// }
		// this.store.dispatch(new MessageAction());
		// localStorage.setItem(this.ACTION_KEY, MessageAction.type);
		// localStorage.setItem(MessageAction.type, message);
	}


		init(){
			this.source$ = fromEvent(window, 'storage');
			this.source$.pipe(delay(500)).subscribe(
				ldata => {
					let lastActionPerformed = localStorage.getItem(this.ACTION_KEY);

					if(lastActionPerformed){
						// if(lastActionPerformed === STATUS.login){
						// 	this.store.dispatch(new Logout());
						// 	this.status = STATUS.logout;
						// } else {
						// 	this.store.dispatch(new Login());
						// 	this.status = STATUS.login;
						// }
						if(lastActionPerformed === MessageAction.type) {
							let lastMessageSent = localStorage.getItem(MessageAction.type);

							if(lastMessageSent) {
								console.log("Received message: [" + lastMessageSent + "];");
							}
						}
					} else {
						console.log("Nothing added yet");
					}
				}
			);
		}
}
