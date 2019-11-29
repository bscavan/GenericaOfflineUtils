import { Component, OnInit, Input } from '@angular/core';
import { Job } from '../../job';
import { Skill } from '../../skills/skill';

@Component({
  selector: 'app-job-page-skill-display',
  templateUrl: './job-page-skill-display.component.html',
  styleUrls: ['./job-page-skill-display.component.css']
})
export class JobPageSkillDisplayComponent implements OnInit {

  @Input() jobFocus: Job;
  @Input() editable;

  constructor() { }

  ngOnInit() {
  }

	public removeSkill(level: number, skillToRemove: Skill) {
		this.jobFocus.removeSkill(level, skillToRemove);
	}

}
