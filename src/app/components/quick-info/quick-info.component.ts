import { Component } from '@angular/core';
import { WorkExperienceComponent } from './work-experience/work-experience.component';
import { EducationComponent } from './education/education.component';
import { AwardsComponent } from './awards/awards.component';
import { ProjectsComponent } from './projects/projects.component';
import { SkillsComponent } from './skills/skills.component';

@Component({
  selector: 'app-quick-info',
  imports: [WorkExperienceComponent, EducationComponent, AwardsComponent, ProjectsComponent, SkillsComponent],
  templateUrl: './quick-info.component.html'
})
export class QuickInfoComponent {
  readonly buttons = ['Work Experience', 'Education', 'Achievements', 'Projects', 'Skills'];
  readonly icons = [
    'fa-solid fa-suitcase',
    'fa-solid fa-building-columns',
    'fa-solid fa-trophy',
    'fa-solid fa-code',
    'fa-brands fa-superpowers'
  ];
  selectedIndex = 0;

  itemClicked(i: number) {
    this.selectedIndex = this.selectedIndex === i ? -1 : i;
  }
}
