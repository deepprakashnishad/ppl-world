import { AfterViewInit, Component, HostListener, Inject, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import {Router, RoutesRecognized} from '@angular/router';
import {AuthenticationService} from '../authentication/authentication.service';
import { Title } from '@angular/platform-browser';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { environment } from '../../environments/environment';
import { StorageService } from '../storage.service';
import { PwaService } from './../pwa.service';
import { GeneralService } from './../general.service';
import {TranslateService} from '@ngx-translate/core';


@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.scss'],
	animations: [
		trigger('openClose', [
			state('open', style({
				width: '100%',
				padding: "5%",
        opacity: 1,
        display: "block"
			})),
			state('closed', style({
				width: '0px',
				padding: "0%",
        opacity: 0.4,
        display: "none"
			})),
			transition('open => closed', [
				animate('200ms')
			]),
			transition('closed => open', [
				animate('200ms')
			]),
		]),

		trigger('toggleMenu', [
			transition(':enter', [
        style({transform: 'translateX(100%)', opacity: 0}),
        animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translateX(0)', opacity: 1}),
        animate('500ms', style({transform: 'translateX(100%)', opacity: 0}))
      ])
		])
	]
})
export class NavigationComponent implements OnInit, AfterViewInit {

	isLoggedIn: boolean  = false;
	isSidebarOpen: boolean = false;
	name: String;
	mTranslate: TranslateService;
	@ViewChild("navToolbar") navToolbar;
	isLeftBarOpen: boolean = false;

	private readonly SHRINK_TOP_SCROLL_POSITION = 5;
	shrinkToolbar = false;
	elementPosition: any;
	pwa: PwaService;

	selectedLanguage: any;

	langs = environment.langs;

	displayReportMenu: boolean = false;
	displayServicesMenu: boolean = false;

	constructor(
	private authenticationService: AuthenticationService,
	private router: Router,
	private pwaService: PwaService,
	private storageService: StorageService,
	private generalService: GeneralService,
	private translate: TranslateService,
	private titleService: Title,
	private renderer: Renderer2,
	private ngZone: NgZone,
  ) {
  	this.pwa = this.pwaService;
  	this.mTranslate = translate;
  	var langCodes = [];
  	for(var i=0;i<this.langs.length;i++){
  		langCodes.push(this.langs[i].mValue);
  	}
  	translate.addLangs(langCodes);

  	var selectedLang = this.authenticationService.getTokenOrOtherStoredData("selectedLang");
  	if(selectedLang){
  		this.selectedLanguage = JSON.parse(selectedLang).mValue;
  		translate.setDefaultLang(this.selectedLanguage);	
  	}else{
  		this.selectedLanguage = this.langs[0].mValue;
  		translate.setDefaultLang(this.selectedLanguage);	
  	}
  	
  	console.log(this.selectedLanguage);
  	// const browserLang = translate.getBrowserLang();
  	// translate.use(browserLang.match(/en|hi/) ? browserLang:'en');
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
		this.isLeftBarOpen = false;
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
  	this.isLeftBarOpen = false;
    this.router.navigate([url]);
  }

  installPwa(): void {
  	this.isLeftBarOpen = false;
    this.pwaService.promptEvent.prompt();
  }

  updateLanguage(e){
  	var lang = e.value;
  	this.generalService.updateLanguage(lang);
  	var mLang = this.langs.find(ele=>ele.mValue===lang);
  	this.authenticationService.storeValue("selectedLang", JSON.stringify(mLang), "LOCAL_STORAGE");
  	this.mTranslate.use(lang)
  }
}
