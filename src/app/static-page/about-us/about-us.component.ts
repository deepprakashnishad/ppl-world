import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

	selectedText: string="mission";

	ngOnInit(){

	}

	scrollToTopFunc(event) {
    var scrollElem= document.querySelector('#moveTop');
    console.log(scrollElem);
    scrollElem.scrollIntoView({ behavior: "smooth"});
  }
}