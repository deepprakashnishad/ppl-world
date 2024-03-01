import { MediaMatcher } from '@angular/cdk/layout';
import { Component, ViewChild, ElementRef, HostBinding ,
  ChangeDetectorRef, OnDestroy, OnInit, AfterViewInit, NgZone } from '@angular/core';
import {Router, RoutesRecognized, ActivationEnd} from '@angular/router';
import { Title } from '@angular/platform-browser';
import {
  transition,
  trigger,
  query,
  style,
  animate,
  group,
  animateChild
} from '@angular/animations';
import { AuthenticationService } from '../../authentication/authentication.service';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    trigger('routerTransition', [
      transition('* <=> *', [    
        query(':leave,:enter', style({ position: 'fixed', opacity: 1 }), { optional: true }),
          query(':leave', [
            style({ opacity:1 }),
            animate('0ms ease-in-out', style({ opacity:0 }))], { optional: true }),
          query(':enter', [
            style({ opacity:0 }),
            animate('0.2s ease-in-out', style({ opacity:1 }))
          ], { optional: true }),
        ])
    ])

  ] // register the animations
})
export class SidenavComponent implements OnDestroy, OnInit, AfterViewInit {

  mobileQuery: MediaQueryList;

  @HostBinding('class.is-open')
  isOpen = true;

  filteredRouteList = [];
  userPermissions = sessionStorage.getItem("permissions");

  private _mobileQueryListener: () => void;
  isLoggedIn: boolean;
  title = 'Shop Admin';
  routeList = [
    { path: '/admin', title: 'Dashboard', permissions: ['CREATE_PERMISSION'] },
    {path: '/admin/add-sale', title: 'Add Sale Entry', permissions:['CREATE_PERMISSION']},
    {path: '/admin/category', title: 'Category', permissions:['UPDATE_CATEGORY']},
    {path: '/admin/store', title: 'Stores', permissions:['CREATE_STORE']},
    {path: '/admin/permission', title: 'Permissions', permissions:['CREATE_PERMISSION']},
    { path: '/admin/role', title: 'Role', permissions:['CREATE_PERMISSION'] },
    {path: '/admin/user-report', title: "User Report", permissions:['CREATE_PERMISSION']},
    {path: '/person', title: 'Users', permissions:['CREATE_PERMISSION']},
    {path: '/admin/order', title: 'Orders', permissions:['CREATE_PERMISSION']},
    {path: '/admin/activity-log', title: 'Activity Logs', permissions:['CREATE_PERMISSION']},
  ];

	ngAfterViewInit() {}

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private zone: NgZone,
    private titleService: Title,
    media: MediaMatcher,
    private authenticationService: AuthenticationService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.router.events.subscribe((data) => {
        if (data instanceof RoutesRecognized) {
          this.title = data.state.root.firstChild.data.title;
          this.titleService.setTitle(this.title);
        }        
     });

    this.authenticationService.isLoggedIn.subscribe(value => {
      this.isLoggedIn = value;
    });
    this.filteredRouteList = this.routeList.filter(ele=>{
      for(var permission of ele.permissions){
        if(this.userPermissions.indexOf(permission)>-1){
          return ele;
        }
      }
      return false;
    });

    this.isOpen = this.mobileQuery.matches?false: true;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  public toggle() {
    this.isOpen = !this.isOpen;
  }

  logout() {
    this.isLoggedIn = false;
    this.authenticationService.logout()
  }

  login() {
    this.router.navigate(['/login']);
  }

  navigate(url){
    this.zone.run(()=>{
      this.router.navigate([url]);
    });
  }
}
