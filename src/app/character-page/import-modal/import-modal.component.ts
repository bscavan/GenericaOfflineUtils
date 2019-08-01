import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JsonSerializable } from '../../json-serializable';
import { isNull, isNullOrUndefined } from 'util';

@Component({
	selector: 'app-import-modal',
	templateUrl: './import-modal.component.html',
	styleUrls: ['./import-modal.component.css']
})
export class ImportModalComponent implements OnInit {
	@Input() focus: JsonSerializable;
	@Input() label: String;
	// This is an optional method that can be passed in to execute whenever a
	// file has been imported.
	@Input() callback;

	constructor(private modalService: NgbModal) { }

	ngOnInit() {}

	importFile(event) {
		var file = event.target.files[0];

		if (!file) {
			return;
		}

		let reader = new FileReader();

		reader.onload = (event) => {
			// Parses the result of the FileReader as JSON.
			let characterFileAsJson = JSON.parse(reader.result.toString());
			// Deserializes the JSON into the Job the component is focusing on.
			this.focus.deserializeFromJSON(characterFileAsJson);
			// Attempts to executes the callback method associated with focus.
			this.executeCallback(this.focus);
		}

		reader.readAsText(file);
		// TODO: Find a way to close the modal after this.
	}

	open(content) {
		this.modalService.open(content).result.then((result) => { }, (reason) => { });
	}

	executeCallback(focus) {
		if(isNullOrUndefined(this.callback) == false) {
			this.callback(focus);
		}
	}
}
