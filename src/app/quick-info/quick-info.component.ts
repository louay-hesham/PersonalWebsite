import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quick-info',
  templateUrl: './quick-info.component.html',
  styleUrls: ['./quick-info.component.css']
})
export class QuickInfoComponent implements OnInit {
  public buttons: string[];
	public visibility: boolean[];
  public selectedIndex: number;

  constructor() {
    this.buttons = ["Work Experience", "Education", "Awards & Achievments", "Projects", "Skills"];
    this.selectedIndex = -1;
  }

  ngOnInit() { }

  itemClicked(i) {
    if (this.selectedIndex == i)
      this.selectedIndex = -1;
    else 
      this.selectedIndex = i;
  }

  buttonClass(i) {
    if (this.selectedIndex == i)
      return 'btn btn-secondary col-md-2';
    else return 'btn btn-primary col-md-2';
  }
}
