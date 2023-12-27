
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { MatDialog } from '@angular/material/dialog';
import { StoreService } from './store.service';
import { GeneralService } from 'src/app/general.service';
import { LeadsComponent } from './leads/leads.component';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styles: [".prod-card{max-width: 250px; cursor: pointer; margin: 12px;} .bContainer:{}"]
})
export class StoreComponent {

    amazonLinks = [
        {
            link: "https://www.amazon.in/s?k=groceries&linkCode=ll2&tag=radhagovind-21&linkId=253104e28889cbc8097dc34e85c4c778&language=en_IN&ref_=as_li_ss_tl",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2Famazon-icon-8.png?alt=media&token=1436af06-4c9f-43e3-8860-59af8b2b59f5",
            title: {
                en: "Amazon",
                hi: "अमेज़न"
            }
        },
        {
            link: "https://flipkart.com?affid=deeppraka",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2Fflipkart.svg?alt=media&token=1abfef25-5dc1-4d6d-aad2-f3572b41cddf",
            title: {
                en: "Flipkart",
                hi: "Flipkart"
            }
        },
        {
            link: "#",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2Finsurance.jpg?alt=media&token=b7e9b002-29b4-4e33-8e0a-6d3669c21dcd",
            title: {
                en: "Vehicle Insurance",
                hi: "वाहन बीमा"
            },
            cat: "Vehicle Insurance"
        },
        {
            link: "#",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2FSunsai%2FSunsai.jpeg?alt=media&token=a273ce62-1022-43ff-babc-93de7606d39b",
            title: {
                en: "Sansui Electric Vehicles",
                hi: "सैंसुईबिजली वाहन"
            },
            cat: "Sansui Electric Vehicles"
        },
        {
            link: "#",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2FBakery.jpg?alt=media&token=85dbbdce-4d0f-4b80-90db-301b958a2dce",
            title: {
                en: "Gaura Snacks(Bakery)",
                hi: "गौरा स्नैक्स(बेकरी)"
            },
            cat: "Gaura Snacks(Bakery)"
        },
        {
            link: "#",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2Fe-rickshaw.jpg?alt=media&token=850a825a-cfcc-4a93-9ca7-08f563bf9ac6",
            title: {
                en: "E-Rickshaw",
                hi: "ई-रिक्शा"
            },
            cat: "E-Rickshaw"
        },
        {
            link: "#",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2Fcctv.webp?alt=media&token=3f1a3c56-9f26-4fdb-926b-613a3a46b3c4",
            title: {
                en: "CCTV Camera Installation",
                hi: "सीसीटीवी कैमरा"
            },
            cat: "CCTV Camera"
        },     
    ];
    
    lang: string;
    
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private generalService: GeneralService
  ) {
        this.lang = this.generalService.selectedLanguage.value;
        this.generalService.selectedLanguage.subscribe(result=>this.lang=result);
    }

    navigateTo(link: string, category: string="#"){
        if(link==="#"){
            var dialogRef = this.dialog.open(LeadsComponent, {
                data: {
                    "category": category
                }
            });
            dialogRef.afterClosed().subscribe(result=>{
                console.log(result);
            });
            return;
        }
        this.router.navigate([]).then(result => {  window.open(link, '_blank'); });
    }
}