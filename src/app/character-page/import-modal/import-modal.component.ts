import { Component, OnInit, Input } from '@angular/core';
import { Character } from '../../character/character';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-import-modal',
	templateUrl: './import-modal.component.html',
	styleUrls: ['./import-modal.component.css']
})
export class ImportModalComponent implements OnInit {
	@Input() characterFocus: Character;

	//FIXME: Figure out why the modal keeps opening up at the bottom of the page!
	constructor(private modalService: NgbModal) { }

	ngOnInit() {}

	importFile(event) {
		var file = event.target.files[0];

		if (!file) {
			return;
		}

		let reader = new FileReader();

		reader.onload = (event) => {
			let characterFileAsJson = JSON.parse(reader.result.toString());
			this.characterFocus.deserializeFromJSON(characterFileAsJson);
		}

		reader.readAsText(file);
		// TODO: Find a way to close the modal after this.
	}

	open(content) {
		this.modalService.open(content).result.then((result) => { }, (reason) => { });
	}
}
