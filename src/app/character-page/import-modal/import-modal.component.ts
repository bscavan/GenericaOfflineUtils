import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JsonSerializable } from '../../json-serializable';
import { isNullOrUndefined } from 'util';
import { JobService } from '../../job-service';
import { Character } from '../../character/character';
import { Job } from '../../job';
import { Skill } from '../../skills/skill';
import { SkillService } from '../../skills/skill-service';
import { CharacterService } from '../../character/character-service';

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
	//FIXME: Change this from a String to one of several known options.
	@Input() importType: String;

	constructor(private modalService: NgbModal, private jobService: JobService,
	private characterService: CharacterService) { }

	ngOnInit() {}

	importFile(event) {
		let allFiles = event.target.files;

		if(isNullOrUndefined(allFiles)) {
			// TODO: Gracefully exit here.
			return;
		}

		for(let index = 0; index < allFiles.length; index++) {
			let currentFile = allFiles[index];

			if (!currentFile) {
				return;
			}
	
			let reader = new FileReader();
	
			reader.onload = (event) => {
				// Parses the result of the FileReader as JSON.
				let jobFileAsJson = JSON.parse(reader.result.toString());

				switch(this.importType) {
					case Character.LABEL:
						if(Array.isArray(jobFileAsJson)) {
							this.characterService.importCharactersFromJSONArray(jobFileAsJson);
						} else {
							this.focus.deserializeFromJSON(jobFileAsJson);
							this.characterService.addCharacterToCollectionFromJsonIfMissing(jobFileAsJson);
						}
						break;

					case Job.LABEL:
						if(Array.isArray(jobFileAsJson)) {
							this.jobService.uploadJobsIntoCollectionFromJSONArray(jobFileAsJson);
						} else {
							this.jobService.uploadJobIntoCollectionFromJSON(jobFileAsJson);
						}
						break;

					case Skill.LABEL:
						if(Array.isArray(jobFileAsJson)) {
							SkillService.addSkillsFromJsonArrayIfMissing(jobFileAsJson);
						} else {
							SkillService.addSkillFromJsonIfMissing(jobFileAsJson);
						}
						break;
				}

				// Deserializes the JSON into the Job the component is focusing on.
				// this.focus.deserializeFromJSON(jobFileAsJson);
				// Attempts to executes the callback method associated with focus.
				this.executeCallback(this.focus);
			}
	
			reader.readAsText(currentFile);
			// TODO: Find a way to close the modal after this.
		}
	}

	readerInJobFile(reader: FileReader) {
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
