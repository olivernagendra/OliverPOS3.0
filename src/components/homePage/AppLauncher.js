import React, { useEffect, useLayoutEffect } from "react";
import AngledBracket_Left_BaseBlue from '../../images/svg/AngledBracket-Left-BaseBlue.svg';
import NoApps_Message from '../../images/svg/NoApps-Message.svg';
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
                        <img src="../Assets/Images/Temp/ClockIn_Icon.png" alt="" />
                    </div>
                    <p>Clock-in App</p>
                </button>
                <button>
                    <div className="img-container">
                        <img src="../Assets/Images/Temp/Stripe Icon.png" alt="" />
                    </div>
                    <p>Stripe Payments</p>
                </button>
                <button>
                    <div className="img-container">
                        <img src="../Assets/Images/Temp/QRCode_Icon.png" alt="" />
                    </div>
                    <p>QR Code App</p>
                </button>
                <button>
                    <div className="img-container">
                        <img src="../Assets/Images/Temp/DYMO-Icon.png" alt="" />
                    </div>
                    <p>DYMO Label Printing</p>
                </button>
                <button>
                    <div className="img-container">
                        <img src="../Assets/Images/Temp/Fortis-Icon.png" alt="" />
                    </div>
                    <p>Fortis Payments</p>
                </button>
                <button>
                    <div className="img-container">
                        <img src="../Assets/Images/Temp/QuoteApp_Icon.png" alt="" />
                    </div>
                    <p>Quote Printer</p>
                </button>
                <button>
                    <div className="img-container">
                        <img src="../Assets/Images/Temp/GiftCard_Icon.png" alt="" />
                    </div>
                    <p>Giftcards</p>
                </button>
            </div>
        </div>
    </div>)
}

export default AppLauncher 
