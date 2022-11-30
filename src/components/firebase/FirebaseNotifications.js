//import firebase from './firebase';
import { initializeApp } from "firebase/app";
import { getMessaging,getToken,onMessage } from "firebase/messaging";
import ActiveUser from '../../settings/ActiveUser';
import { sendToken,removeSubscription,registerAccessed,pingRegister } from './firebaseSlice';
import { updateOrderStatusNotification } from "./orderCompleteNotification";
import { updatQuantityOnIndexDB } from "./updateProductQuantityNotification";
import { updateNewCustomerList } from "./customerAddedNotification";
import { attribute } from "../common/commonAPIs/attributeSlice";
import { store } from "../../app/store";
const firebaseConfig= {
    apiKey: "AIzaSyDIchZt-7bPvGktHrZXvTVIrVdGcGpSJ0o",
    authDomain: "oliver-pos-287408.firebaseapp.com",
    databaseURL: "https://oliver-pos-287408.firebaseio.com",
    projectId: "oliver-pos-287408",
    storageBucket: "oliver-pos-287408.appspot.com",
    messagingSenderId: "740768807687",
    appId: "1:740768807687:web:e667539f6c1b37e8f963a2",
    measurementId: "G-21F4SFGPJR"
}
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
// import { firebaseAdminActions } from './action/firebaseAdmin.action'
// import { history, store } from '../_helpers';
// import { showProductxModal } from '../_components';
// import ActiveUser from "../settings/ActiveUser";
// import Config from '../Config'
// import { updateOrderStatusNotification } from './components/OrderCompleteNotification'
// import { updatQuantityOnIndexDB } from './components/UpdateProductQuantity'
// import { updateNewCustomerList } from './components/CustomerAddedNotification';
// import { openDb } from 'idb';
// import { get_UDid } from '../ALL_localstorage';
// import { attributesActions } from '../_actions';

// get device token via firebase and sent to the firebase server to get notification
export const getFirebaseNotification = () => {
    //const messaging = firebase.messaging()
    var firebaseRegisters = []
    // messaging.requestPermission().then(() => {
    //     return messaging.getToken();
    // }).then((token) => {
    getToken(messaging).then((token) => {
        //console.log('---token---------------------', token);
        // var requestOptions = {
        //     method: 'POST',
        //     headers: {
        //         "access-control-allow-origin": "*",
        //         "access-control-allow-credentials": "true",
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //     }
        //     , mode: 'cors',
        //     body: JSON.stringify({ token: token })

        // };
        onMessage(messaging, (payload) => {
            console.log('Message received. ', payload);
            if (payload) {
                var _data = payload.data;
                
                if (_data && _data.oliver_receipt_id && _data.event_name == "order") {
                    updateOrderStatusNotification.updateOrderStatus(_data)
                }
                if (_data && _data.event_name == "product") { // notification when quantity update
                    updatQuantityOnIndexDB.updateQuantity(_data.product_id)
                }

                if (_data && _data.event_name == "customer") { // notification when new customer added
                    updateNewCustomerList.getAllCustomer(_data)
                }
                if (_data && _data.event_name == "attribute") { // notification when new "attribute" updated
                    store.dispatch(attribute());
                }

                // if plan changed from hub Plan-Changed event call 
                if (_data && _data.event_name == "Plan-Changed") { // notification when plan updated
                    //showModal('commonFirebaseNotificationPopup')
                }
                var _staffName=_data.staff_name && _data.staff_name !=='undefined' ?_data.staff_name:'Another User';
                localStorage.setItem('firebaseStaffName', _staffName)
                const firebasePopupDetails = {
                    FIREBASE_POPUP_TITLE: 'Register Already In Use.',
                    FIREBASE_POPUP_SUBTITLE: `${_staffName} is now logged into this register.`,
                    FIREBASE_POPUP_SUBTITLE_TWO: `To overtake this register, please login again.`,
                    FIREBASE_BUTTON_TITLE: 'Back To login'
                }
                ActiveUser.key.firebasePopupDetails = firebasePopupDetails;

                firebaseRegisters.push(_data)
                localStorage.setItem('firebaseSelectedRegisters', JSON.stringify(firebaseRegisters))

                var selectedRegister = localStorage.getItem('selectedRegister') ? JSON.parse(localStorage.getItem('selectedRegister')) : ''


                if (_data && _data.token && selectedRegister.id == _data.registerId) {
                    if (token !== _data.token) {
                        //etTimeout(() => {
                            console.log('-firebaseRegisterAlreadyusedPopup-')
                           // showModal('firebaseRegisterAlreadyusedPopup')
                        //}, 500);
                    }
                }
            }
        });
    }).catch((err) => {
        console.log('error---', err);
    })
}

export const sendFireBaseTokenToAdmin = (dispatch) => {

    getToken(messaging).then((currentToken) => {
        if (currentToken) {
            console.log('---Admin token-----', currentToken);
        var ClientGuid = localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")).subscription_detail.client_guid : "";
        if (ClientGuid !== "") {
            dispatch(sendToken({"currentToken":currentToken, "ClientGuid":ClientGuid}));
        }
          // Send the token to your server and update the UI if necessary
          // ...
        } else {
          // Show permission request UI
          console.log('No registration token available. Request permission to generate one.');
          // ...
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
      });

    //const messaging = firebase.messaging();
    // messaging.requestPermission().then(() => {
    //     return messaging.getToken();
    // }).then((token) => {

    //     console.log('---Admin token-----', token);
    //     var ClientGuid = localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")).subscription_detail.client_guid : "";
    //     if (ClientGuid !== "") {
    //         dispatch(sendToken(token, ClientGuid));
    //     }

    // }).catch((err) => {
    //     console.log('error---', err);
    // })
}
export const removeFirebaseSubscription = (dispatch) => {
    //const messaging = firebase.messaging()
    // messaging.requestPermission().then(() => {
    //     return messaging.getToken();
    // }).then((token) => {
    //    dispatch(removeSubscription(token));

    // })
    getToken(messaging).then((currentToken) => {
        if (currentToken) {
            dispatch(removeSubscription(currentToken));
        } else {
          // Show permission request UI
          console.log('No registration token available. Request permission to generate one.');
          // ...
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
      });
}

export const SendRegisterAccessed = (dispatch) => {
    //const messaging = firebase.messaging()
    // messaging.requestPermission().then(() => {
    //     return messaging.getToken();
    // }).then((token) => {
    //     console.log('---Admin token-----', token);

    //     var staff = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : "";

    //     var parameters = {
    //         ClientId: localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")).subscription_detail.client_guid : "",
    //         FirbaseDeviceToken: token,
    //         RegisterId: localStorage.getItem("register") ? localStorage.getItem("register") : null,
    //         //AccessTime:""	,
    //         StaffName: staff && staff !== "" ? staff.display_name : "",
    //         StaffId: staff && staff !== "" ? staff.user_id : "",
    //     }

    //     dispatch(registerAccessed(parameters));

    // })

    getToken(messaging).then((currentToken) => {
        if (currentToken) {
            console.log('---Admin token-----', currentToken);

            var staff = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : "";
    
            var parameters = {
                ClientId: localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")).subscription_detail.client_guid : "",
                FirbaseDeviceToken: currentToken,
                RegisterId: localStorage.getItem("register") ? localStorage.getItem("register") : null,
                //AccessTime:""	,
                StaffName: staff && staff !== "" ? staff.display_name : "",
                StaffId: staff && staff !== "" ? staff.user_id : "",
            }
    
            dispatch(registerAccessed(parameters));
        } else {
          // Show permission request UI
          console.log('No registration token available. Request permission to generate one.');
          // ...
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
      });
}
export const GetUsedRegisters = (dispatch) => {

    var ClientId = localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")).subscription_detail.client_guid : "";
    if (ClientId !== "") {
        //dispatch(firebaseAdminActions.getRegisters(ClientId));
    }
}
export const log_out = () => {
    localStorage.removeItem("CUSTOMER_TO_OrderId");
    localStorage.removeItem("LANG");
    localStorage.removeItem("firebaseStaffName");
    var decodedString = localStorage.getItem('UDID');
    var decod = decodedString ? window.atob(decodedString) : "";
    var getudid = decod;
    if (getudid && getudid != "") {
        localStorage.removeItem(`last_login_location_name_${getudid}`);
        localStorage.removeItem(`last_login_location_id_${getudid}`);
        localStorage.removeItem(`last_login_register_id_${getudid}`);
        localStorage.removeItem(`last_login_register_name_${getudid}`);
        localStorage.removeItem(`registerName`);
        localStorage.removeItem('register');
        localStorage.removeItem('UserLocations');
        localStorage.removeItem('firebaseStaffName');
        localStorage.removeItem('firebaseSelectedRegisters');

    }
    localStorage.removeItem("SHOP_TAXRATE_LIST");
    // localStorage.removeItem("sitelist")
    sessionStorage.removeItem('CUSTOMER_ID');
    localStorage.removeItem('CHECKLIST');
    localStorage.removeItem('AdCusDetail');
    localStorage.removeItem('CARD_PRODUCT_LIST');
    localStorage.removeItem('SELECTED_TAX');
    localStorage.removeItem('TAXT_RATE_LIST');
    localStorage.removeItem('DEFAULT_TAX_STATUS');
    localStorage.removeItem('APPLY_DEFAULT_TAX');
    localStorage.removeItem('CART');
    localStorage.removeItem("Productlist" + localStorage.getItem('UDID'));
    localStorage.removeItem('CASH_ROUNDING');
    localStorage.removeItem('discountlst');
    //localStorage.removeItem('userId');   this is client Id, Do not remove on it
    localStorage.removeItem('orderreciept');
    var _env = localStorage.getItem('env_type');
    setTimeout(function () {
        var url = _env && (_env == 'ios' || _env == 'android' || _env == 'Android') ? "/login" : "/login";
        if (_env && (_env == 'ios' || _env == 'android' || _env == 'Android')) {
            url = url + "?goto=logout";
            window.location = url;
        }
        else{}
            //history.push(url);

    }.bind(this), 100)
}

export const pingFirebaseRegister = (dispatch) => {
    //const messaging = firebase.messaging()
    // messaging.requestPermission().then(() => {
    //     return messaging.getToken();
    // }).then((token) => {
    //     console.log('---Admin token-----', token);

    //     var staff = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : "";

    //     var parameters = {
    //         ClientId: localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")).subscription_detail.client_guid : "",
    //         FirbaseDeviceToken: token,
    //         RegisterId: localStorage.getItem("register") ? localStorage.getItem("register") : null,
    //         //AccessTime:""	,
    //         StaffName: staff && staff !== "" ? staff.display_name : "",
    //         StaffId: staff && staff !== "" ? staff.user_id : "",
    //     }
    //    dispatch(pingRegister (parameters));
    // })

    getToken(messaging).then((currentToken) => {
        if (currentToken) {
            console.log('---Admin token-----', currentToken);
            var staff = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : "";
            var parameters = {
                ClientId: localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")).subscription_detail.client_guid : "",
                FirbaseDeviceToken: currentToken,
                RegisterId: localStorage.getItem("register") ? localStorage.getItem("register") : null,
                //AccessTime:""	,
                StaffName: staff && staff !== "" ? staff.display_name : "",
                StaffId: staff && staff !== "" ? staff.user_id : "",
            }
           dispatch(pingRegister (parameters));
        } else {
          // Show permission request UI
          console.log('No registration token available. Request permission to generate one.');
          // ...
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
      });

}