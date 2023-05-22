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
      headline: "For Your Current Mood",
      src:
        "https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
    },
    {
      headline: "Miouw",
      src:
        "https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80"
    },
    {
      headline: "In The Wilderness",
      src:
        "https://images.unsplash.com/photo-1557800634-7bf3c7305596?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2001&q=80"
    },
    {
      headline: "Focus On The Writing",
      src:
        "https://images.unsplash.com/photo-1551410224-699683e15636?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80"
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
}
