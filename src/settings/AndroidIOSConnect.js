// import {
//   BrowserView,
//   MobileView,
//   isBrowser,
//   isMobile,isIOS,iPhone,iPad,iPod,IOS
// } from "react-device-detect";

export function showAndroidToast(udid, orderId, orderType) {
  // alert("AndroidFunctionCall ="+printBody )
  console.log("Android Call");
  const Android = window.Android;
  if (typeof Android !== "undefined" && Android !== null) {
    // console.log("Android Call")
    // Android.showToast(toast);
    Android.makePrint(udid, orderId, orderType)
  }
}
export function showAndroidReceipt(receipt, PrintReceiptData) {
  // alert("AndroidFunctionCall ="+printBody )
  console.log("Android Call");
  console.log("receipt", receipt, "PrintReceiptData", PrintReceiptData)
  const Android = window.Android;
  if (typeof Android !== "undefined" && Android !== null) {

    Android.generateReceipt(JSON.stringify(receipt), JSON.stringify(PrintReceiptData))
  }
}


export function setAndroidKeyboard(eventname) {
  const Android = window.Android;
  if (typeof Android !== "undefined" && Android !== null) {
    // var logout=localStorage.getItem("logoutclick");
    // alert(eventname);
    localStorage.setItem("env_type", "Android");
    Android.androidClickEvent(eventname)
  }

}


export function androidSearchClick() {
  const Android = window.Android;
  if (typeof Android !== "undefined" && Android !== null) {
    // var logout=localStorage.getItem("logoutclick");
    Android.searchClick('text')
  }
}

export function androidGetUser() {
  const Android = window.Android;
  if (typeof Android !== "undefined" && Android !== null) {
    // var logout=localStorage.getItem("logoutclick");
    Android.getuser()
  }
}
export function androidDisplayScreen(itemname, amount, total, mode) {
  const Android = window.Android;
  if ((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper") == true)) {
    // let fdata=localStorage.getItem('selected_ffdisplay');
    // if(typeof fdata!="undefined" && fdata=="yes")
    // {
    Android.displayScreen(itemname, amount, total, mode);
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
  const Android = window.Android;
  if (typeof Android !== "undefined" && Android !== null) {
    Android.openCahsDrawer()
  }
}

export function AndroidExtentionFinished() {
  console.log("extentionFinished");
  const Android = window.Android;
  if (typeof Android !== "undefined" && Android !== null) {
    var path = window.location.href
    console.log('--------path--------------', path);
    Android.extentionFinished(path)
  }
}
export function openCashBox  ()  {
  const Tizen = window.Tizen;
  const Android = window.Android;
  var isTizenWrapper = localStorage.getItem("isTizenWrapper");
  if (isTizenWrapper && isTizenWrapper != null && typeof isTizenWrapper != "undefined" && isTizenWrapper == "true") {
      if (Tizen && Tizen != null && typeof Tizen != "undefined") {
          Tizen.openCashBox();
      }
  }
  if ((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper") == true)) {
      Android.openCahsDrawer();
  }
}