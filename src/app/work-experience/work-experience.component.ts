import { Component, OnInit } from '@angular/core';

import { GoogleAnalyticsService } from '../google-analytics.service';

@Component({
  selector: 'app-work-experience',
  templateUrl: './work-experience.component.html',
  styleUrls: ['./work-experience.component.css']
})
export class WorkExperienceComponent implements OnInit {

  constructor(private _GAService: GoogleAnalyticsService) { }

  ngOnInit() {
  	this._GAService.sendPageView("Work Experience");
  }

}
