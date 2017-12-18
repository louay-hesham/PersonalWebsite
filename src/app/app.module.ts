import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { AppComponent } from './app.component';
import { WorkExperienceComponent } from './work-experience/work-experience.component';
import { QuickInfoComponent } from './quick-info/quick-info.component';
import { EducationComponent } from './education/education.component';


@NgModule({
  declarations: [
    AppComponent,
    WorkExperienceComponent,
    QuickInfoComponent,
    EducationComponent
  ],
  imports: [
    BrowserModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
