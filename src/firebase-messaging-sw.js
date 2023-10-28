importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");
firebase.initializeApp({
  apiKey: "AIzaSyCxGjyohdgsmJM3uteNGGfAUrzXh3qY-ww",
    authDomain: "good-act.firebaseapp.com",
    projectId: "good-act",
    storageBucket: "good-act.appspot.com",
    messagingSenderId: "769896398353",
    appId: "1:769896398353:web:6d2873cc864e1495927bb0",
    measurementId: "G-T3FZ3Q73RL",
    vapidKey: "BA0S0lJt3-47LRSRNYCzcGMASjiUvDiFJs4lvKxng6-HFFsXs3q5a17zYBrjxxJJNz414rwHJkN53v--8m87m9Y"
});
const messaging = firebase.messaging();