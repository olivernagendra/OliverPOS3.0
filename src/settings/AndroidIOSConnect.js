// import {
//   BrowserView,
//   MobileView,
//   isBrowser,
//   isMobile,isIOS,iPhone,iPad,iPod,IOS
// } from "react-device-detect";

export function showAndroidToast(udid,orderId,orderType) {
   // alert("AndroidFunctionCall ="+printBody )
   console.log("Android Call");
   var Android=window.Android;
    if(typeof Android !== "undefined" && Android !== null) {
       // console.log("Android Call")
       // Android.showToast(toast);
        Android.makePrint(udid,orderId,orderType)
    } 
}
export function showAndroidReceipt(receipt,PrintReceiptData) {
  // alert("AndroidFunctionCall ="+printBody )
  console.log("Android Call");
  console.log("receipt",receipt,"PrintReceiptData",PrintReceiptData)  
  var Android=window.Android;
   if(typeof Android !== "undefined" && Android !== null) {
        
       Android.generateReceipt(JSON.stringify(receipt),JSON.stringify(PrintReceiptData))
   }
}


export function setAndroidKeyboard(eventname) { 
  var Android=window.Android;
  if(typeof Android !== "undefined" && Android !== null) {
   // var logout=localStorage.getItem("logoutclick");
  // alert(eventname);
  localStorage.setItem("env_type", "Android");
     Android.androidClickEvent(eventname)
 }
 
}


export function androidSearchClick() { 
  var Android=window.Android;
  if(typeof Android !== "undefined" && Android !== null) {
   // var logout=localStorage.getItem("logoutclick");
     Android.searchClick('text')
 }
}

export function androidGetUser() { 
  var Android=window.Android;
  if(typeof Android !== "undefined" && Android !== null) {
   // var logout=localStorage.getItem("logoutclick");
     Android.getuser()
 }
}
export function androidDisplayScreen(itemname, amount, total, mode) { 
  var Android=window.Android;
  if((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true))
  {
    // let fdata=localStorage.getItem('selected_ffdisplay');
    // if(typeof fdata!="undefined" && fdata=="yes")
    // {
      Android.displayScreen(itemname,amount,total,mode);
    // }
  }
  // else
  // {
  //   if(typeof Android !== "undefined" && Android !== null) {    
  //     Android.displayScreen(itemname,amount,total,mode)
  //   }
  // }

}
export function openCahsDrawer() { 
  console.log("openCahsDrawer");
  var Android=window.Android;
    if(typeof Android !== "undefined" && Android !== null) {    
     Android.openCahsDrawer()
 }
}

export function AndroidExtentionFinished() { 
  console.log("extentionFinished");
  var Android=window.Android;
    if(typeof Android !== "undefined" && Android !== null) {   
      var path = window.location.href
      console.log('--------path--------------',path); 
     Android.extentionFinished(path)
 }
}