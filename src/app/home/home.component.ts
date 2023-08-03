import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Slide } from "../shared/carousel/carousel.interface";
import { AnimationType } from "../shared/carousel/carousel.animations";
import { CarouselComponent } from "../shared/carousel/carousel.component";
// import { SwiperComponent } from "swiper/angular";
// import SwiperCore, { EffectFlip, Pagination, Navigation, Autoplay, Swiper } from "swiper/core";

// // install Swiper modules
// SwiperCore.use([EffectFlip, Pagination, Navigation, Autoplay]);

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
      headline: "Create donation landing page",
      src: "/assets/images/carousel/medical.jpg",
      text: "Need funds for Medical?",
      callToActionText: "Create Campaign",
      linkToAction: "/campaigns/edit"
    },
    {
      headline: "Raising money has never been so easy",
      src: "/assets/images/carousel/business.jpg",
      text: "Need funds for Business?",
      callToActionText: "Create Project",
      linkToAction: "campaigns/edit"
    },
    {
      headline: "Scholarship for brilliant students",
      src: "/assets/images/carousel/education.jpg",
      text: "Need funds for Education?",
      callToActionText: "Join Scholarship Program",
      linkToAction: "campaigns/edit"
    }
  ];

  images: Array<string> = [];

  constructor(
    private router: Router,
  ) {
  }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
    this.images.push("/assets/images/extras/list-icon.png")
  }

  setAnimationType(type) {
    this.animationType = type.value;
    setTimeout(() => {
      this.carousel.onNextClick();
    });
  }

  slideActionClicked(event){
    console.log(event);

    this.router.navigate([event]);
  }
}
