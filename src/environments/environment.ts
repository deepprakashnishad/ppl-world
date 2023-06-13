// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  appName: "Good Act",
  logoUrl: "https://fir-erp-944d6.web.app/assets/images/logo.jpeg",
  production: false,
  joiningCharges: 2200,
  baseurl: "http://localhost:4200/api",
  
  firebase: {
    apiKey: "AIzaSyCxGjyohdgsmJM3uteNGGfAUrzXh3qY-ww",
    authDomain: "good-act.firebaseapp.com",
    projectId: "good-act",
    storageBucket: "good-act.appspot.com",
    messagingSenderId: "769896398353",
    appId: "1:769896398353:web:6d2873cc864e1495927bb0",
    measurementId: "G-T3FZ3Q73RL"
  },
  razorpay: {
    keyId: "rzp_test_OhtTwkr00dbNU1"
  },
  recaptcha_site_key: "6LdbScYcAAAAAMy3OZigFtko17jK8DiQvEy7YzV4"
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
