import React, { useEffect, useLayoutEffect } from "react";
import AngledBracket_Left_BaseBlue from '../../images/svg/AngledBracket-Left-BaseBlue.svg';
import NoApps_Message from '../../images/svg/NoApps-Message.svg';
import ClockIn_Icon from '../..//images/Temp/GiftCard_Icon.png';
import Stripe_Icon from '../..//images/Temp/Stripe Icon.png';
import GiftCard_Icon from '../..//images/Temp/GiftCard_Icon.png';
import QRCode_Icon from '../..//images/Temp/QRCode_Icon.png';
import DYMO_Icon from '../..//images/Temp/DYMO-Icon.png';
import Fortis_Icon from '../..//images/Temp/Fortis-Icon.png';
import QuoteApp_Icon from '../..//images/Temp/QuoteApp_Icon.png';
const AppLauncher = () => {
    return (
        <div id="appLauncherWrapper" className="app-launcher-wrapper hidden">
        <div className="app-launcher">
            <div className="header">
                <button id="appLauncherExit">
                    <img src={AngledBracket_Left_BaseBlue} alt="" />
                </button>
                <p>App Launcher</p>
            </div>
            <div className="body">
                <img src={NoApps_Message} alt="" />
                <button>
                    <div className="img-container">
                        <img src={ClockIn_Icon} alt="" />
                    </div>
                    <p>Clock-in App</p>
                </button>
                <button>
                    <div className="img-container">
                        <img src={Stripe_Icon} alt="" />
                    </div>
                    <p>Stripe Payments</p>
                </button>
                <button>
                    <div className="img-container">
                        <img src={QRCode_Icon} alt="" />
                    </div>
                    <p>QR Code App</p>
                </button>
                <button>
                    <div className="img-container">
                        <img src={DYMO_Icon} alt="" />
                    </div>
                    <p>DYMO Label Printing</p>
                </button>
                <button>
                    <div className="img-container">
                        <img src={Fortis_Icon} alt="" />
                    </div>
                    <p>Fortis Payments</p>
                </button>
                <button>
                    <div className="img-container">
                        <img src={QuoteApp_Icon} alt="" />
                    </div>
                    <p>Quote Printer</p>
                </button>
                <button>
                    <div className="img-container">
                        <img src={GiftCard_Icon} alt="" />
                    </div>
                    <p>Giftcards</p>
                </button>
            </div>
        </div>
    </div>)
}

export default AppLauncher 
