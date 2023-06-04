import { AfterViewInit, Component, HostListener, Inject, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import {Router, RoutesRecognized} from '@angular/router';
import {AuthenticationService} from '../authentication/authentication.service';
import { Title } from '@angular/platform-browser';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { environment } from '../../environments/environment';
import { StorageService } from '../storage.service';


@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.scss'],
	animations: [
		trigger('openClose', [
			state('open', style({
				display: "flex",
				opacity: 1,
        width:"100%"
			})),
			state('closed', style({
				display: "none",
				opacity: 0,
        width: "0%"
			})),
			transition('open => closed', [
				animate('200ms')
			]),
			transition('closed => open', [
				animate('200ms')
			]),
		])
	]
})
export class NavigationComponent implements OnInit, AfterViewInit {

	isLoggedIn: boolean  = false;
	isSidebarOpen: boolean = false;
	name: String;
	@ViewChild("navToolbar") navToolbar;
	isLeftBarOpen: boolean = false;

	private readonly SHRINK_TOP_SCROLL_POSITION = 5;
	shrinkToolbar = false;
  	elementPosition: any;

  	constructor(
		private authenticationService: AuthenticationService,
		private router: Router,
		private storageService: StorageService,
		private titleService: Title,
		private renderer: Renderer2,
		private ngZone: NgZone,
    ) {
    }

  ngAfterViewInit() {
  }

	ngOnInit() {
		this.router.events.subscribe((data) => {
	        if (data instanceof RoutesRecognized) {
	          var title = data.state.root.firstChild.data.title;
	          this.titleService.setTitle(title);
	        }
	    });

		this.authenticationService.isLoggedIn.subscribe(value => {
	      this.isLoggedIn = value;
	      if(value){
	      	this.name = this.authenticationService.getTokenOrOtherStoredData("name");
	      }
    });

    this.renderer.listen('window', 'click', (e: Event)=>{});	
	}

	@HostListener('document:scroll', []) scrollHandler(){
		console.log("I am scrolled");
    }

	@HostListener('window:scroll', []) windowScrollHandler(){
		console.log("I am scrolled");
    }

	toggleLoginStatus(isLoggedIn){
		if(isLoggedIn){
			this.isLoggedIn = false;
    		this.authenticationService.logout();
		}else{
			this.router.navigate(['/login']);
		}
	}

  toggleSidebar() {
    if (this.isLeftBarOpen) {
      this.toggleLeftDrawer();
    }
    this.isSidebarOpen = !this.isSidebarOpen;
    
	}

	openCategoryDrawer(){
	console.log("openCategoryDrawer function can be removed")	
  }

  toggleLeftDrawer() {
    if (this.isSidebarOpen) {
      this.toggleSidebar();
    }
    this.isLeftBarOpen = !this.isLeftBarOpen;
  }

  categorySelected(category) {
    this.toggleLeftDrawer();
  }

  navigateTo(url) {
    this.router.navigate([url]);
    this.isLeftBarOpen = false;
  }
}
