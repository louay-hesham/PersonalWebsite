import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { AppComponent } from './app.component';
import { WorkExperienceComponent } from './work-experience/work-experience.component';
import { QuickInfoComponent } from './quick-info/quick-info.component';
import { EducationComponent } from './education/education.component';
import { FooterComponent } from './footer/footer.component';
import { AwardsComponent } from './awards/awards.component';
import { SkillsComponent } from './skills/skills.component';
import { ProjectsComponent } from './projects/projects.component';

import { GoogleAnalyticsService } from './google-analytics.service';
import { PageviewDirective } from './pageview.directive';
import { EventClickDirective } from './event-click.directive';
import { NavbarComponent } from './navbar/navbar.component';

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
