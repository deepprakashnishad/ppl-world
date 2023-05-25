// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  appName: "Trendy Fashion",
  logoUrl: "https://fir-erp-944d6.web.app/assets/images/logo.jpeg",
  production: false,
  minOrderFreeDelivery: 500,
  deliveryCharges: 100,
  // baseurl: "https://giriraj-backend.onrender.com",
  baseurl: "http://localhost:4200/api",
  // baseurl: "https://giriraj-store.herokuapp.com",
  // baseurl: "https://merp-demo.herokuapp.com/",
  firebase: {
    apiKey: "AIzaSyAhZuYfYus07UoRic1O7JAtT9FcTWLTpzY",
    authDomain: "giriraj-store.firebaseapp.com",
    projectId: "giriraj-store",
    storageBucket: "giriraj-store.appspot.com",
    messagingSenderId: "76938672473",
    appId: "1:76938672473:web:b6104cac7a86829024b448"
  },
  razorpay: {
    keyId: "rzp_test_n79BXV5lUVYL1R"
  },
  paytm: {
    merchantId: "PvIEXq67462511961659",
    merchantName: "Everything Satvik"
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
