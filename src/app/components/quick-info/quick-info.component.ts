import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quick-info',
  templateUrl: './quick-info.component.html',
  styleUrls: ['./quick-info.component.css']
})
export class QuickInfoComponent implements OnInit {
  public buttons: string[];
  public selectedIndex: number;

  constructor() {
    this.buttons = ["Work Experience", "Education", "Achievments", "Projects", "Skills"];
    this.selectedIndex = 0;
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

  buttonIcon(i) {
    switch(i) {
      case 0:{
        return "fa fa-suitcase"
      }
      case 1:{
         return "fa fa-university" 
      } 
      case 2:{
        return "fa fa-trophy"
      } 
      case 3:{
        return "fa fa-code"
      } 
      case 4:{
        return "fa fa-superpowers"
      }       
    }
  }
}
