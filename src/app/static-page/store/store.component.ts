import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { GeneralService } from 'src/app/general.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styles: [".prod-card{max-width: 250px; cursor: pointer; margin: 12px;} .bContainer:{}"],
  encapsulation: ViewEncapsulation.None
})
export class StoreComponent implements OnInit {

    amazonLinks = [
        {
            link: "https://www.amazon.in/s?k=groceries&linkCode=ll2&tag=radhagovind-21&linkId=253104e28889cbc8097dc34e85c4c778&language=en_IN&ref_=as_li_ss_tl",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2Fgroceries.png?alt=media&token=900ed33c-cfd6-42bc-afc6-e8f0144b9b1d&_gl=1*syqrm7*_ga*Mjc5MjEwMjQ5LjE2ODYxMjgxOTI.*_ga_CW55HF8NVT*MTY5NjQwNzQ5Ni40OS4xLjE2OTY0MDc1MTYuNDAuMC4w",
            title: {
                en: "Groceries",
                hi: "किराने का सामान"
            }
        },
        {
            link: "https://www.amazon.in/b?_encoding=UTF8&tag=radhagovind-21&linkCode=ur2&linkId=ce98ba28c5a08d2b065780a1ed3d7dca&camp=3638&creative=24630&node=1571271031",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2Fapparel.jpg?alt=media&token=c6041d30-d4fe-4407-9dd7-aaa823aed3f0&_gl=1*1on4ceh*_ga*Mjc5MjEwMjQ5LjE2ODYxMjgxOTI.*_ga_CW55HF8NVT*MTY5NjI0MTk2OC40NC4xLjE2OTYyNDIwNDQuNjAuMC4w",
            title: {
                en: "Apparel & Accessories",
                hi: "कपड़े और उप साधन"
            }
        },
        {
            link: "https://www.amazon.in/b?_encoding=UTF8&tag=radhagovind-21&linkCode=ur2&linkId=522df100bcfd55fd81d297a7aacaf0db&camp=3638&creative=24630&node=1571274031",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2Fbaby.jpg?alt=media&token=f8d2f25d-9b8f-4e87-9c60-bf8d278194cc&_gl=1*1gqijst*_ga*Mjc5MjEwMjQ5LjE2ODYxMjgxOTI.*_ga_CW55HF8NVT*MTY5NjI2Mjk4OS40NS4xLjE2OTYyNjMxNTQuMjUuMC4w",
            title: {
                en: "Baby Items",
                hi: "बच्चे का सामान"
            }
        },
        {
            link: "https://www.amazon.in/b?_encoding=UTF8&tag=radhagovind-21&linkCode=ur2&linkId=984842f14311e462491f569fc4949a9f&camp=3638&creative=24630&node=976389031",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2Fbooks.webp?alt=media&token=421acfb0-2fd9-48fa-91fd-9bf15a0f1e84&_gl=1*115v9m*_ga*Mjc5MjEwMjQ5LjE2ODYxMjgxOTI.*_ga_CW55HF8NVT*MTY5NjI2Mjk4OS40NS4xLjE2OTYyNjMzMzQuNTMuMC4w",
            title: {
                en: "Books",
                hi: "पुस्तकें"
            }
        },
        
        {
            link: "https://www.amazon.in/b?_encoding=UTF8&tag=radhagovind-21&linkCode=ur2&linkId=6623903c8110dcf3b24d195d8146dfd2&camp=3638&creative=24630&node=976392031",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2FComputers.jpg?alt=media&token=e75dd8a9-e718-4c24-9483-a87f5534b628&_gl=1*1ospjac*_ga*Mjc5MjEwMjQ5LjE2ODYxMjgxOTI.*_ga_CW55HF8NVT*MTY5NjM0MjIzNS40OC4xLjE2OTYzNDMzMDQuNjAuMC4w",
            title: {
                en: "Computers",
                hi: "कंप्यूटर"
            }
        },
        
        {
            link: "https://www.amazon.in/b?_encoding=UTF8&tag=radhagovind-21&linkCode=ur2&linkId=46e911d34f48c3d2859658385b94f375&camp=3638&creative=24630&node=976419031",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2FElectronic.jpg?alt=media&token=f028a133-b81c-41ab-939e-6ce2c2e0f789&_gl=1*1hend3g*_ga*Mjc5MjEwMjQ5LjE2ODYxMjgxOTI.*_ga_CW55HF8NVT*MTY5NjM0MjIzNS40OC4xLjE2OTYzNDMzOTMuNjAuMC4w",
            title: {
                en: "Electronics",
                hi: "इलेक्ट्रानिक्स"
            }
        },
        
        {
            link: "https://www.amazon.in/b?_encoding=UTF8&tag=radhagovind-21&linkCode=ur2&linkId=7d7f796906688179b4b61e40e75f8663&camp=3638&creative=24630&node=1350385031",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2FHealthAndBeauty.jpg?alt=media&token=65ff019a-a67c-48af-915e-e6e61e554748&_gl=1*1sxiivb*_ga*Mjc5MjEwMjQ5LjE2ODYxMjgxOTI.*_ga_CW55HF8NVT*MTY5NjM0MjIzNS40OC4xLjE2OTYzNDM0MDUuNDguMC4w",
            title: {
                en: "Health &amp; Beauty",
                hi: "स्वास्थ्य &amp; सुंदरता"
            }
        },
        
        {
            link: "https://www.amazon.in/b?_encoding=UTF8&tag=radhagovind-21&linkCode=ur2&linkId=ece9dc01f1d241190fe44b7303d4f62c&camp=3638&creative=24630&node=1951048031",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2Fjewelry.jpeg?alt=media&token=c3b1ba70-ef29-42be-828a-d8e8f33c415b&_gl=1*mp3oqd*_ga*Mjc5MjEwMjQ5LjE2ODYxMjgxOTI.*_ga_CW55HF8NVT*MTY5NjM0MjIzNS40OC4xLjE2OTYzNDM0MjQuMjkuMC4w",
            title: {
                en: "Jewelry",
                hi: "जेवर"
            }
        },
        
        {
            link: "https://www.amazon.in/b?_encoding=UTF8&tag=radhagovind-21&linkCode=ur2&linkId=ebc15721f3e0f65733298a499dd389ba&camp=3638&creative=24630&node=976442031",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2Fkitchen.jpeg?alt=media&token=fd9bfce4-c765-4dc5-9488-e2f1bda9932e&_gl=1*1y4lm3c*_ga*Mjc5MjEwMjQ5LjE2ODYxMjgxOTI.*_ga_CW55HF8NVT*MTY5NjM0MjIzNS40OC4xLjE2OTYzNDM0NDAuMTMuMC4w",
            title: {
                en: "Kitchen &amp; Housewares",
                hi: "रसोई &amp; घरेलू वस्तुएं"
            }
        },
        {
            link: "https://www.amazon.in/b?_encoding=UTF8&tag=radhagovind-21&linkCode=ur2&linkId=afae0d4520e2a7ba8883e9898bc01f3c&camp=3638&creative=24630&node=2454169031",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2Fluggage.webp?alt=media&token=dfa543e8-e8d4-4c9a-ab16-6bb584eb1e4a&_gl=1*33c43f*_ga*Mjc5MjEwMjQ5LjE2ODYxMjgxOTI.*_ga_CW55HF8NVT*MTY5NjM0MjIzNS40OC4xLjE2OTYzNDM0NTEuMi4wLjA.",
            title: {
                en: "Luggage",
                hi: "लगेज"
            }
        },
        
        {
            link: "https://www.amazon.in/b?_encoding=UTF8&tag=radhagovind-21&linkCode=ur2&linkId=0571cbaed9cb492464089ca34d9afea1&camp=3638&creative=24630&node=976416031",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2FFire-TV-free-hub.webp?alt=media&token=a4d246f7-730d-4f3e-8393-16fc3920aad1&_gl=1*486bdf*_ga*Mjc5MjEwMjQ5LjE2ODYxMjgxOTI.*_ga_CW55HF8NVT*MTY5NjM0MjIzNS40OC4xLjE2OTYzNDM0NjguNjAuMC4w",
            title: {
                en: "Movies &amp; TV",
                hi: "फ़िल्में और टीवी"
            }
        },
        
        {
            link: "https://www.amazon.in/b?_encoding=UTF8&tag=radhagovind-21&linkCode=ur2&linkId=3916ff638380a2af3a96f60b7d169d3e&camp=3638&creative=24630&node=976445031",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2FMusic.jpg?alt=media&token=d1e77143-2453-41d9-befa-64f21286a9e9&_gl=1*1q4x0mk*_ga*Mjc5MjEwMjQ5LjE2ODYxMjgxOTI.*_ga_CW55HF8NVT*MTY5NjM0MjIzNS40OC4xLjE2OTYzNDM0ODguNDAuMC4w",
            title: {
                en: "Music",
                hi: "संगीत"
            }
        },
        
        {
            link: "https://www.amazon.in/b?_encoding=UTF8&tag=radhagovind-21&linkCode=ur2&linkId=a207cc0a34a1a62c936790de282408c7&camp=3638&creative=24630&node=2454181031",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2FPet-Supplies.webp?alt=media&token=b192ba45-d82d-48f4-91f8-9853facaf93b&_gl=1*16kf7hs*_ga*Mjc5MjEwMjQ5LjE2ODYxMjgxOTI.*_ga_CW55HF8NVT*MTY5NjM0MjIzNS40OC4xLjE2OTYzNDM1MDQuMjQuMC4w",
            title: {
                en: "Pet Supplies",
                hi: "पालतु जानवरों का सामान"
            }
        },
        
        {
            link: "https://www.amazon.in/b?_encoding=UTF8&tag=radhagovind-21&linkCode=ur2&linkId=a9fdf4dd5e4747da50aa7b3bbb087807&camp=3638&creative=24630&node=1983396031",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2Fshoes.jpg?alt=media&token=a45e5d2e-1e54-4e87-957d-aa5cddd5f760&_gl=1*1dggiy6*_ga*Mjc5MjEwMjQ5LjE2ODYxMjgxOTI.*_ga_CW55HF8NVT*MTY5NjM0MjIzNS40OC4xLjE2OTYzNDM1MTUuMTMuMC4w",
            title: {
                en: "Shoes",
                hi: "जूते"
            }
        },
        
        {
            link: "https://www.amazon.in/b?_encoding=UTF8&tag=radhagovind-21&linkCode=ur2&linkId=24c71b136f1b05638465f1a1592228f0&camp=3638&creative=24630&node=1984443031",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2Fsports.jpg?alt=media&token=9ec5fcea-9761-4f8a-b484-2c967e311e6a&_gl=1*1gelqv4*_ga*Mjc5MjEwMjQ5LjE2ODYxMjgxOTI.*_ga_CW55HF8NVT*MTY5NjM0MjIzNS40OC4xLjE2OTYzNDM1OTkuMS4wLjA.",
            title: {
                en: "Sports &amp; Outdoors",
                hi: "खेल के सामान"
            }
        },
        
        {
            link: "https://www.amazon.in/b?_encoding=UTF8&tag=radhagovind-21&linkCode=ur2&linkId=f944f2ac17d796db5464bd6182f06ab0&camp=3638&creative=24630&node=1350380031",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2Ftoys.jpg?alt=media&token=f971fbba-ff07-4b29-9ca0-64a7123cb8d4&_gl=1*n35wzq*_ga*Mjc5MjEwMjQ5LjE2ODYxMjgxOTI.*_ga_CW55HF8NVT*MTY5NjM0MjIzNS40OC4xLjE2OTYzNDM1MjUuMy4wLjA.",
            title: {
                en: "Toys &amp; Games",
                hi: "खिलौने और खेल"
            }
        },
        
        {
            link: "https://www.amazon.in/b?_encoding=UTF8&tag=radhagovind-21&linkCode=ur2&linkId=740963a0fc64d828393876c39b8ffa6f&camp=3638&creative=24630&node=976460031",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2FVideoGames.jpg?alt=media&token=ef8961f5-83c1-4578-8fec-e14e67594787&_gl=1*1sgextq*_ga*Mjc5MjEwMjQ5LjE2ODYxMjgxOTI.*_ga_CW55HF8NVT*MTY5NjM0MjIzNS40OC4xLjE2OTYzNDM1NDAuNjAuMC4w",
            title: {
                en: "Video Games",
                hi: "वीडियो गेम"
            }
        },
        
        {
            link: "https://www.amazon.in/b?_encoding=UTF8&tag=radhagovind-21&linkCode=ur2&linkId=388f00f4e5f185ff23a2fc391b6aa7f9&camp=3638&creative=24630&node=1350387031",
            img: "https://firebasestorage.googleapis.com/v0/b/good-act.appspot.com/o/prod-cat%2FWatches.webp?alt=media&token=43e0cac0-5024-4d28-8593-8c59b09191c4&_gl=1*7g4pff*_ga*Mjc5MjEwMjQ5LjE2ODYxMjgxOTI.*_ga_CW55HF8NVT*MTY5NjM0MjIzNS40OC4xLjE2OTYzNDM1NTkuNDEuMC4w",
            title: {
                en: "Watches",
                hi: "घड़ियों"
            }
        },
    ];
    
    lang: string;
    
  constructor(
    private router: Router,
    private generalService: GeneralService
  ) {
        this.lang = this.generalService.selectedLanguage.value;
        this.generalService.selectedLanguage.subscribe(result=>this.lang=result);
    }

  ngOnInit() {
      
  }

    navigateTo(link: string){
        this.router.navigate([]).then(result => {  window.open(link, '_blank'); });
    }
}