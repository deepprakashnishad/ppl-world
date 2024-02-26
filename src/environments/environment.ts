// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  appName: "Good Act",
  logoUrl: "https://fir-erp-944d6.web.app/assets/images/logo.jpeg",
  production: false,
  slotPrice: 250,
  maxPermittedSlot: 1000,
  maxPermittedAmt: 1000000,
  baseurl: "http://localhost:4200/api",
  ecomUrl: "http://localhost:4200/ecom",
  allpayurl: "http://localhost:4200/allpay",

  phonepeurl: "http://localhost:4200/phonepe",
  pincodeUrl: "http://localhost:4200/api-pincode",
  mtoken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzQ29kZSI6IjZuUGM1QnR6YkZtSnRVNGVUTjFsY2FPdiIsIm1pZCI6IjY0YjdjODg5NzkwY2EwMDhiY2Y2ZTU4ZiIsIndlYnNpdGUiOiJodHRwczovL2dvb2QtYWN0LndlYi5hcHAvcGF5bWVudCIsImlhdCI6MTY5MTc0MzA0OSwiZXhwIjoxNzc4MTQzMDQ5fQ.VFM-2DkpgFmX_I_OgfFTLsJb_83BOhnnWqHSKvZCcp8",
  mid: "64b7c7944bf57d4abcd86978",
  appUrl: "http://localhost:4200",
  firebase: {
    apiKey: "AIzaSyCxGjyohdgsmJM3uteNGGfAUrzXh3qY-ww",
    authDomain: "good-act.firebaseapp.com",
    projectId: "good-act",
    storageBucket: "good-act.appspot.com",
    messagingSenderId: "769896398353",
    appId: "1:769896398353:web:6d2873cc864e1495927bb0",
    measurementId: "G-T3FZ3Q73RL",
    vapidKey: "BA0S0lJt3-47LRSRNYCzcGMASjiUvDiFJs4lvKxng6-HFFsXs3q5a17zYBrjxxJJNz414rwHJkN53v--8m87m9Y"
  },
  razorpay: {
    keyId: "rzp_test_OhtTwkr00dbNU1"
  },

  /*phonepe: {
    payUrl: "/pg/v1/pay",
    merchantId: "PGTESTPAYUAT93",
    saltIndex: 1,
    saltKey: "875126e4-5a13-4dae-ad60-5b8c8b629035"
  },*/

  recaptcha_site_key: "6LdbScYcAAAAAMy3OZigFtko17jK8DiQvEy7YzV4",
  google_api_key: "AIzaSyBpqNa1E6nugGw6KMUU9YkXP49O2W1vDUEs",

  langs: [
    {displayName: "हिंदी", mValue:"hi"},
    {displayName: "English", mValue:"en"}
  ],
  defaultLang: "en" 
};

export var EXTRAS = {
  storeSettings: {
    logo: {
      downloadUrl: "",
      uploadPath: ""
    }
  }
}

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
