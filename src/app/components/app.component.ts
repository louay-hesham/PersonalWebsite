import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { QuickInfoComponent } from './quick-info/quick-info.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, QuickInfoComponent, FooterComponent],
  templateUrl: './app.component.html'
})
export class AppComponent { }
