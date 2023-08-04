import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../loader.service';
import { LoaderState } from '../loader';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';


@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.scss'],
  animations: [
    trigger('valueChanged', [
        transition('void => *', []),   // when the item is created
        transition('* => void', []),   // when the item is removed
        transition('* => *', [         // when the item is changed
            animate(1000, keyframes([  // animate for 1200 ms
                style ({ opacity: 0 }),
                style ({ opacity: 1 }),
            ])),
        ]),
    ])
  ]
})
export class ProgressSpinnerComponent 
  implements OnInit, OnDestroy {

  @Input() loaderType: string = "bar";

	show = false;

  i: number = 0;



  messages: Array<string> = [
    "<div class='text-center'>क्या आप जानते हैं?<div><br>अगर 3 लोग एक जरूरतमंद की मदद करना शुरू कर दें तो पूरी दुनिया में किसी को कोई समस्या नहीं रहेगी।",  
    "<div class='text-center'>क्या आप जानते हैं?<div><br>अगर आप पहले महीने में 1 रुपये कमाना शुरू कर दें और फिर हर अगले महीने अपनी आय दोगुनी करते रहें तो आप 3 साल में दुनिया के सबसे अमीर आदमी बन जाएंगे।",
    "<div class='text-center'>क्या आप जानते हैं?<div>आज भी भारत में 25% से अधिक जनसंख्या अशिक्षित है।",
    "<div class='text-center'>क्या आप जानते हैं?<div><br>यदि हम एक समुदाय के रूप में जुड़ते हैं तो हम कई समस्याओं का समाधान आसानी से कर सकते हैं और यह कई प्रकार के नए कार्यों को भी जन्म देता है।",
    "<div class='text-center'>क्या आप जानते हैं?<div><br>Good Act में आप अपना खुद का व्यवसाय बना सकते हैं जो आपके द्वारा और आपके लाभ के लिए चलाया जाएगा।",
    "<div class='text-center'>क्या आप जानते हैं?<div><br>Good Act में प्रत्येक सदस्य Good Act समुदाय को बढ़ाने में मदद करके मालिक बन सकता है।"
  ];

  private subscription: Subscription;
  constructor(
    private loaderService: LoaderService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.subscription = this.loaderService.loaderState
    .subscribe((state: LoaderState) => {
      this.show = state.show;
      this.cdr.detectChanges();
    });

    this.i = Math.floor(Math.random() * this.messages.length);

    setInterval(() => {
      this.i = (this.i+1) % this.messages.length;
    }, 8000);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewChecked(){
    this.cdr.detectChanges();
  }

}
