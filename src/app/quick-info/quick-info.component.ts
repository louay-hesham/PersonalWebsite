import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quick-info',
  templateUrl: './quick-info.component.html',
  styleUrls: ['./quick-info.component.css']
})
export class QuickInfoComponent implements OnInit {

	public workExperienceVisible: boolean;
	public educationVisible: boolean;
	public awardsVisible: boolean;
	public projectsVisible: boolean;
	public skillsVisible: boolean;

	public visibility: boolean[] = [];

  constructor() {
  	this.workExperience = false;
  	this.educationVisible = false;
  	this.awardsVisible = false;
  	this.projectsVisible = false;
  	this.skillsVisible = false;
  	this.visibility.push(this.workExperienceVisible);
  	this.visibility.push(this.educationVisible);
  	this.visibility.push(this.awardsVisible);
  	this.visibility.push(this.projectsVisible);
  	this.visibility.push(this.skillsVisible);
  }

  ngOnInit() { }

  toggle(v) {
  	var i:number;
  	for (i = 0; i < 5; i++){
  		if (i != v)
  			this.visibility[i] = false;
  	}
  	this.visibility[v] = !this.visibility[v];
  }

  checkVisibility(v){
  	var visible: boolean = true
  	var i:number;
  	for (i = 0; i < 5; i++){
  		if (i != v)
  			visible = visible & !this.visibility[i];
			else 
				visible = visible & this.visibility[i];
  	}
  	return visible;
  }

}
