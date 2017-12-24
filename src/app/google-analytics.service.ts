import { Injectable } from '@angular/core';

@Injectable()
export class GoogleAnalyticsService {

	private static gtag: any;

  constructor() {
  	if (!GoogleAnalyticsService.gtag || GoogleAnalyticsService.gtag == undefined || GoogleAnalyticsService.gtag == null) {
  		window['dataLayer'] = window['dataLayer'] || [];
	  	GoogleAnalyticsService.gtag = function() { window['dataLayer'].push(arguments); }
		  GoogleAnalyticsService.gtag('js', new Date());
		  GoogleAnalyticsService.gtag('config', 'UA-111559411-1', {
	      'page_title': 'Home',
	      'page_location': 'http://louay-morsi.me',
	      'page_path': 'Home'
	    })
  	}
  }

  sendPageView(pageName: string) {
  	GoogleAnalyticsService.gtag('event', 'page_view', {
      'page_title': pageName,
      'page_location': 'http://louay-morsi.me',
      'page_path': '/' + pageName
    });
  }

}
