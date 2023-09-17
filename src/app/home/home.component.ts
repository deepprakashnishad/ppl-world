import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Slide } from "../shared/carousel/carousel.interface";
import { AnimationType } from "../shared/carousel/carousel.animations";
import { CarouselComponent } from "../shared/carousel/carousel.component";
import {TranslateService} from '@ngx-translate/core';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild(CarouselComponent) carousel: CarouselComponent;

  animationType = AnimationType.Scale;

  animationTypes = [
    {
      name: "Scale",
      value: AnimationType.Scale
    },
    {
      name: "Fade",
      value: AnimationType.Fade
    },
    {
      name: "Flip",
      value: AnimationType.Flip
    },
    {
      name: "Jack In The Box",
      value: AnimationType.JackInTheBox
    }
  ];
  slides: Slide[] = [
    {
      src: "/assets/images/carousel/radha_govind_banner.jpg",
    },
    {
      // headline: "Education with character, competence & devotion",
      src: "/assets/images/carousel/education.jpg",
      text: "Help us in educating kids for building character, competence & devotion?",
      callToActionText: "Donate for education of under-priviledged",
      linkToAction: "campaigns/edit"
    },
    {
      headline: "Create donation landing page",
      src: "/assets/images/carousel/medical.jpg",
      text: "Need funds for Medical?",
      callToActionText: "Create Campaign",
      linkToAction: "/campaigns/edit"
    },
    {
      headline: "We help people in getting job and work",
      src: "/assets/images/carousel/unemployment.jpg",
      text: "Help us to remove unemployment?",
      callToActionText: "Spread our platform to eradicate unemployment",
      linkToAction: "campaigns/edit"
    },
    {
      headline: "Help us in spreading holy name and making life blissful",
      src: "/assets/images/carousel/Nagar_kirtan.JPG",
      text: "Call us to conduct kirtan in your locality",
      callToActionText: "Connect to start kirtan in your locality",
      linkToAction: "campaigns/edit"
    },
  ];

  goodActReasons: any[] = [
    {
      title: "HOME.NEED-JOB",
      content: "HOME.NEED-JOB-DET",
      actionLink: "",
      actionText: "Join Now",
      img: "/assets/images/why-good-act/job-crisis.avif"
    }, {
      title: "HOME.MORE-CUST",
      content: "HOME.MORE-CUST-DET",
      actionLink: "",
      actionText: "Join Now",
      img: "/assets/images/why-good-act/crowd1.jpg"
    }, {
      title: "HOME.RAISE-FUNDS",
      content: "HOME.RAISE-FUNDS-DET",
      actionLink: "",
      actionText: "Join Now",
      img: "/assets/images/why-good-act/raise-funds.webp"
    }, {
      title: "HOME.FREE-GURUKUL",
      content: "HOME.FREE-GURUKUL-DET",
      actionLink: "",
      actionText: "Join Now",
      img: "/assets/images/why-good-act/gurukul.jpg"
    }, {
      title: "HOME.LOCAL",
      content: "HOME.LOCAL-DET",
      actionLink: "",
      actionText: "Join Now",
      img: "/assets/images/carousel/education.jpg"
    }, {
      title: "HOME.NAGAR-KIRTAN",
      content: "HOME.NAGAR-KIRTAN-DET",
      actionLink: "",
      actionText: "Join Now",
      img: "/assets/images/carousel/Nagar_Kirtan.jpg"
    }, {
      title: "HOME.FOOD",
      content: "HOME.FOOD-DET",
      actionLink: "",
      actionText: "Join Now",
      img: "/assets/images/why-good-act/free-food.jpg"
    }, {
      title: "HOME.AID",
      content: "HOME.AID-DET",
      actionLink: "",
      actionText: "Join Now",
      img: "/assets/images/why-good-act/financial-aid.webp"
    }, {
      title: "HOME.OLD",
      content: "HOME.OLD-DET",
      actionLink: "",
      actionText: "Join Now",
      img: "/assets/images/why-good-act/old-age-care.jpg"
    }, {
      title: "HOME.UNEMPLOYMENT",
      content: "HOME.UNEMPLOYMENT-DET",
      actionLink: "",
      actionText: "Join Now",
      img: "/assets/images/carousel/unemployment.jpg"
    }, {
      title: "HOME.ENV",
      content: "HOME.ENV-DET",
      actionLink: "",
      actionText: "Join Now",
      img: "/assets/images/why-good-act/planting.jpg"
    },  {
      title: "HOME.GRP-MRG",
      content: "HOME.GRP-MRG-DET",
      actionLink: "",
      actionText: "Join Now",
      img: "/assets/images/why-good-act/masswedding.webp"
    },  {
      title: "HOME.MATCH-MAKING",
      content: "HOME.MATCH-MAKING-DET",
      actionLink: "",
      actionText: "Join Now",
      img: "/assets/images/why-good-act/marriage.jpg"
    }, {
      title: "HOME.GOVT",
      content: "HOME.GOVT-DET",
      actionLink: "",
      actionText: "Join Now",
      img: "/assets/images/why-good-act/govt.webp"
    },
  ];

  images: Array<string> = [];

  constructor(
    private router: Router,
    private notifier: NotifierService,
    private translate: TranslateService
  ) {
  }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
    this.images.push("/assets/images/extras/list-icon.png");
  
  }

  setAnimationType(type) {
    this.animationType = type.value;
    setTimeout(() => {
      this.carousel.onNextClick();
    });
  }

  slideActionClicked(event){
    this.router.navigate([event]);
  }

  navigateTo(event){
    this.router.navigate([event]);
  }

  scrollToTopFunc(event) {
    var scrollElem= document.querySelector('#moveTop');
    console.log(scrollElem);
    scrollElem.scrollIntoView({ behavior: "smooth"});
  }
}
