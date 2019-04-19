import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JsonSerializable } from '../../json-serializable';

@Component({
	selector: 'app-import-modal',
	templateUrl: './import-modal.component.html',
	styleUrls: ['./import-modal.component.css']
})
export class ImportModalComponent implements OnInit {
	@Input() focus: JsonSerializable;
	@Input() label: String;

	constructor(private modalService: NgbModal) { }

	ngOnInit() {}

	importCharacterFile(event) {
		var file = event.target.files[0];

		if (!file) {
			return;
		}

		let reader = new FileReader();

		reader.onload = (event) => {
			let characterFileAsJson = JSON.parse(reader.result.toString());
			this.focus.deserializeFromJSON(characterFileAsJson);
		}

		reader.readAsText(file);
		// TODO: Find a way to close the modal after this.
	}

	open(content) {
		this.modalService.open(content).result.then((result) => { }, (reason) => { });
	}
}
