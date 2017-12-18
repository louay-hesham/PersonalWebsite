import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { WorkExperienceComponent } from './work-experience/work-experience.component';
import { QuickInfoComponent } from './quick-info/quick-info.component';


@NgModule({
  declarations: [
    AppComponent,
    WorkExperienceComponent,
    QuickInfoComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
