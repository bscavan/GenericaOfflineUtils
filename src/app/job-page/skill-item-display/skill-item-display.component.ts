import { Component, OnInit, Input } from '@angular/core';
import { Skill } from '../../skills/skill';
import { Job } from '../../job';

@Component({
  selector: 'app-skill-item-display',
  templateUrl: './skill-item-display.component.html',
  styleUrls: ['./skill-item-display.component.css']
})
export class SkillItemDisplayComponent implements OnInit {

  @Input() currentJob: Job;
  @Input() currentLevel: number;
  @Input() currentSkill: Skill;
  @Input() editable;

  // Use these to control whether or not the full component worth of information should be shown...
  // @Input() expandByDefault;
  // @Input() expandable;

  constructor() { }

  ngOnInit() {
  }

	public removeSkill(level: number, skillToRemove: Skill) {
		this.currentJob.removeSkill(level, skillToRemove);
	}

}
