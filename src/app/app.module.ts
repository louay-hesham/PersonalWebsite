import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppComponent } from './components/app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { QuickInfoComponent } from './components/quick-info/quick-info.component';
  import { WorkExperienceComponent } from './components/quick-info/work-experience/work-experience.component';
  import { EducationComponent } from './components/quick-info/education/education.component';
  import { AwardsComponent } from './components/quick-info/awards/awards.component';
  import { SkillsComponent } from './components/quick-info/skills/skills.component';
  import { ProjectsComponent } from './components/quick-info/projects/projects.component';
import { FooterComponent } from './components/footer/footer.component';

import { GoogleAnalyticsService } from './services/google-analytics.service';
import { PageviewDirective } from './directives/pageview.directive';
import { EventClickDirective } from './directives/event-click.directive';

@NgModule({
  declarations: [
    AppComponent,
    WorkExperienceComponent,
    QuickInfoComponent,
    EducationComponent,
    FooterComponent,
    AwardsComponent,
    SkillsComponent,
    ProjectsComponent,
    PageviewDirective,
    EventClickDirective,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule
  ],
  providers: [GoogleAnalyticsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
