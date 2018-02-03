import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { QuickInfoComponent } from './quick-info/quick-info.component';
  import { WorkExperienceComponent } from './work-experience/work-experience.component';
  import { EducationComponent } from './education/education.component';
  import { AwardsComponent } from './awards/awards.component';
  import { SkillsComponent } from './skills/skills.component';
  import { ProjectsComponent } from './projects/projects.component';
import { FooterComponent } from './footer/footer.component';

import { GoogleAnalyticsService } from './services/google-analytics.service';
import { PageviewDirective } from './services/pageview.directive';
import { EventClickDirective } from './services/event-click.directive';

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
