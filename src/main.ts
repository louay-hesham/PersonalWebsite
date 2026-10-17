import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/components/app.component';

bootstrapApplication(AppComponent)
  .catch(err => console.error(err));
