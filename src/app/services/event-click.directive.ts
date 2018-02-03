import { Directive, Input, HostListener } from '@angular/core';
import { GoogleAnalyticsService } from './google-analytics.service';


@Directive({
  selector: '[eventClick]'
})
export class EventClickDirective {

	@Input('eventClick')
	public eventLabel: string;

  constructor(private _GAService: GoogleAnalyticsService) { }

  @HostListener('click')
  onClick() {
  	this._GAService.sendButtonClickEvent(this.eventLabel);
  }

}
