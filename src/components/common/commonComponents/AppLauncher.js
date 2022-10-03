import React, { useState,useEffect, useLayoutEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import AngledBracket_Left_BaseBlue from '../../../images/svg/AngledBracket-Left-BaseBlue.svg';
import NoApps_Message from '../../../images/svg/NoApps-Message.svg';
// import ClockIn_Icon from '../../../images/Temp/GiftCard_Icon.png';
// import Stripe_Icon from '../../../images/Temp/Stripe Icon.png';
// import GiftCard_Icon from '../../../images/Temp/GiftCard_Icon.png';
// import QRCode_Icon from '../../../images/Temp/QRCode_Icon.png';
// import DYMO_Icon from '../../../images/Temp/DYMO-Icon.png';
// import Fortis_Icon from '../../../images/Temp/Fortis-Icon.png';
// import QuoteApp_Icon from '../../../images/Temp/QuoteApp_Icon.png';
import NoImageAvailable from '../../../images/svg/NoImageAvailable.svg';
const AppLauncher = (props) => {
    const [page,setPage]=useState('ShopView');
    const location = useLocation();
     useEffect(() => {
        var _route=location.pathname;
        if(props && props.view &&  props.view==="Product View")
        {
            _route="/product";
        }
        switch (_route) {
            case '/home':
                setPage('Shop View');
                break;
            case '/customer':
                setPage('Customer View');
                break;
            case '/transactions':
                setPage('Activity View');
                break;
            case '/checkout':
                setPage('Checkout');
                break;
            case '/product':
                setPage('Product View');
                break;
            default:
                break;
        }
    },[page]);

    var true_dimaond_field = localStorage.getItem('GET_EXTENTION_FIELD') ? JSON.parse(localStorage.getItem('GET_EXTENTION_FIELD')) : [];
    return (
        <div id="appLauncherWrapper" className={props.isShow === true ? "app-launcher-wrapper" : "app-launcher-wrapper hidden"} onClick={() => props.toggleAppLauncher()}>
            <div className="app-launcher">
                <div className="header">
                    <button id="appLauncherExit">
                        <img src={AngledBracket_Left_BaseBlue} alt="" />
                    </button>
                    <p>App Launcher</p>
                </div>
                <div className="body">
                    {true_dimaond_field && true_dimaond_field.length > 0 ? true_dimaond_field.map((Items, index) => {
                        {
                            return (Items.PluginId == 0 && Items.Name !== 'Contact Details' && Items.ShowAtCheckout === true) ||
                                (Items.viewManagement && Items.viewManagement !== [] && Items.viewManagement.find(type => type.ViewSlug == page)) ?
                                <button onClick={() => props.toggleiFrameWindow(Items)}>
                                    <div className="img-container">
                                        {Items.logo != null ? <img src={Items.logo} alt="" onError={({ currentTarget }) => {
                                            currentTarget.onerror = null; // prevents looping
                                            currentTarget.src = NoImageAvailable;
                                        }} /> : <img src={NoImageAvailable} alt="" />}
                                    </div>
                                    <p>{Items.Name}</p>
                                </button>
                                : null
                        }
                    }) : <img src={NoApps_Message} alt="" />}

                    {/* <button onClick={() => props.toggleiFrameWindow()}>
                        <div className="img-container">
                            <img src={ClockIn_Icon} alt="" />
                        </div>
                        <p>Clock-in App</p>
                    </button>
                    <button onClick={() => props.toggleiFrameWindow()}>
                        <div className="img-container">
                            <img src={Stripe_Icon} alt="" />
                        </div>
                        <p>Stripe Payments</p>
                    </button>
                    <button onClick={() => props.toggleiFrameWindow()}>
                        <div className="img-container">
                            <img src={QRCode_Icon} alt="" />
                        </div>
                        <p>QR Code App</p>
                    </button>
                    <button onClick={() => props.toggleiFrameWindow()}>
                        <div className="img-container">
                            <img src={DYMO_Icon} alt="" />
                        </div>
                        <p>DYMO Label Printing</p>
                    </button>
                    <button onClick={() => props.toggleiFrameWindow()}>
                        <div className="img-container">
                            <img src={Fortis_Icon} alt="" />
                        </div>
                        <p>Fortis Payments</p>
                    </button>
                    <button onClick={() => props.toggleiFrameWindow()}>
                        <div className="img-container">
                            <img src={QuoteApp_Icon} alt="" />
                        </div>
                        <p>Quote Printer</p>
                    </button>
                    <button onClick={() => props.toggleiFrameWindow()}>
                        <div className="img-container">
                            <img src={GiftCard_Icon} alt="" />
                        </div>
                        <p>Giftcards</p>
                    </button> */}
                </div>
            </div>
        </div>)
}

export default AppLauncher 
