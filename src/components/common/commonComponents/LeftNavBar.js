import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Oliver_Icon_Color from '../../../assets/images/svg/Oliver-Icon-Color.svg';
import Oliver_Type from '../../../assets/images/svg/Oliver-Type.svg';
import Register_Icon from '../../../assets/images/svg/Register-Icon.svg';
import Customers_Icon from '../../../assets/images/svg/Customers-Icon.svg';
import Transactions_Icon from '../../../assets/images/svg/Transactions-Icon.svg';
import CashManagement_Icon from '../../../assets/images/svg/CashManagement-Icon.svg';
import LinkLauncher_Icon from '../../../assets/images/svg/LinkLauncher-Icon.svg';
import Oliver_Icon_BaseBlue from '../../../assets/images/svg/Oliver-Icon-BaseBlue.svg';
import ToggleNavbar_Icon from '../../../assets/images/svg/ToggleNavbar-Icon.svg';

import ClockIn_Icon from '../../../assets/images/Temp/ClockIn_Icon.png';
import MC_Logo1 from '../../../assets/images/Temp/MC_Logo 1.png';
import Quickbooks1 from '../../../assets/images/Temp/Quickbooks 1.png';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLauncher from "./AppLauncher";
import LinkLauncher from "./LinkLauncher";
import IframeWindow from "../../dashboard/IframeWindow";
import { isMobile } from "react-device-detect";
import CommonModuleJS from "../../../settings/CommonModuleJS";
import LocalizedLanguage from "../../../settings/LocalizedLanguage";
import { popupMessage } from "../commonAPIs/messageSlice";
import { CheckAppDisplayInView } from '../commonFunctions/appDisplayFunction'
import NoImageAvailable from '../../../assets/images/svg/NoImageAvailable.svg';

import { handleAppEvent } from '../../common/AppHandeler/commonAppHandler'

const LeftNavBar = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [isShowLeftMenu, setisShowLeftMenu] = useState(false);
    const [isShowAppLauncher, setisShowAppLauncher] = useState(false);
    const [isShowLinkLauncher, setisShowLinkLauncher] = useState(false);
    const [isShowiFrameWindow, setisShowiFrameWindow] = useState(false);
    const [isShowMobileView, setisShowMobileView] = useState(false);
    const [extApp, setExtApp] = useState('');
    const [isInit, setisInit] = useState(false);

    let useCancelled = false;
    useEffect(() => {
        if (isInit === false && useCancelled == false) {
            window.addEventListener('message', function (e) {
                var data = e && e.data;

                if (typeof data == 'string' && data !== "" && window.location.pathname !== "/checkout") {  //checkout page handle independentaly 
                    responseData(JSON.parse(data))
                    //compositeSwitchCases(JSON.parse(data))
                    console.log("leftnavigation")
                }
            })
            setisInit(true);
        }
        return () => {
            useCancelled = true;
        }
    }, [isInit]);

    const responseData = (data) => {
        console.log("---ext app data--" + data);
        var _route = location.pathname;
        var whereToview = "";
        if (_route == "checkout")
            whereToview = "CheckoutView"
        else
            whereToview = "home"
        handleAppEvent(data, whereToview)
    }
    const toggleLeftMenu = () => {
        setisShowLeftMenu(!isShowLeftMenu)
    }
    const toggleAppLauncher = () => {
        setisShowAppLauncher(!isShowAppLauncher)
        setisShowLinkLauncher(false)
    }
    const toggleLinkLauncher = () => {
        setisShowLinkLauncher(!isShowLinkLauncher)
        setisShowAppLauncher(false)
    }
    const navigateTo = (page) => {
        navigate(page);
    }
    const toggleiFrameWindow = (_exApp = null) => {
        if (_exApp != null) { setExtApp(_exApp); }
        setisShowiFrameWindow(!isShowiFrameWindow)
    }
    const toggleMobileView = () => {
        setisShowMobileView(!isShowMobileView)
    }


    var client = localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")) : '';
    var selectedRegister = localStorage.getItem('selectedRegister') ? JSON.parse(localStorage.getItem("selectedRegister")) : '';
    var isAllowCashDrawer = false;
    if (client && client.subscription_permission && client.subscription_permission.AllowCashManagement == true && selectedRegister && selectedRegister.EnableCashManagement == true) {
        isAllowCashDrawer = true;
    }

    const notInCurrentPlan = () => {
        var msg = "";
        var title = "";
        if (client && client.subscription_permission && client.subscription_permission.AllowCashManagement != true) {
            title = LocalizedLanguage.notInCurrentPlan;
            msg = LocalizedLanguage.toUpdateCurrentPlan;
        }
        else if (selectedRegister && selectedRegister.EnableCashManagement == false) {
            title = "This feature is disabled from Admin side";
            msg = "To enable your plan, go to Oliver Hub";
        }

        var data = { title: title, msg: msg, is_success: true }
        dispatch(popupMessage(data));
    }
    var appsList = JSON.parse(localStorage.getItem("GET_EXTENTION_FIELD"));
    var displayAppCount = 0;
    return (
        <React.Fragment>
            <div className={isShowLeftMenu == true || (props.isShowMobLeftNav && props.isShowMobLeftNav === true) ? "navbar open" : "navbar"} >
                <div className="header-row" onClick={() => navigate('/home')}>
                    <img src={Oliver_Icon_Color} alt="" className="oliver-logo" />
                    <img src={Oliver_Type} alt="" className="oliver-text" />
                </div>
                <button id="registerButton" className={location.pathname === "/home" ? "page-link selected" : "page-link"} disabled={location.pathname === "/home" ? true : false} onClick={() => navigateTo('/home')}>
                    <div className="img-container">
                        <img src={Register_Icon} alt="" />
                    </div>
                    <p>Register</p>
                    <div className="f-key">F1</div>
                </button>
                <button id="customersButton" className={location.pathname === "/customers" ? "page-link selected" : "page-link"} disabled={location.pathname === "/customers" ? true : false} onClick={() => navigateTo('/customers')}>
                    <div className="img-container">
                        <img src={Customers_Icon} alt="" />
                    </div>
                    <p>Customers</p>
                    <div className="f-key">F2</div>
                </button>
                <button id="transactionsButton" className={location.pathname === "/transactions" ? "page-link selected" : "page-link"} disabled={location.pathname === "/transactions" ? true : false} onClick={() => navigateTo('/transactions')}>
                    <div className="img-container">
                        <img src={Transactions_Icon} alt="" />
                    </div>
                    <p>Transactions</p>
                    <div className="f-key">F3</div>
                </button>
                {client && client.subscription_permission && client.subscription_permission.AllowCashManagement == true && selectedRegister && selectedRegister.EnableCashManagement == true ?
                    <button id="cashManagementButton" className={location.pathname === "/cashdrawer" && isAllowCashDrawer == true ? "page-link selected" : "page-link"} disabled={location.pathname === "/cashdrawer" && isAllowCashDrawer == true ? true : false}
                        onClick={() => isAllowCashDrawer == true ? navigateTo('/cashdrawer') : ""}>
                        <div className="img-container">
                            <img src={CashManagement_Icon} alt="" />
                        </div>
                        <p>Cash Management</p>
                        <div className="f-key">F4</div>
                    </button>
                    :
                    <button id="cashManagementButton" className={location.pathname === "/cashdrawer" && isAllowCashDrawer == true ? "page-link selected" : "page-link"} disabled={location.pathname === "/cashdrawer" && isAllowCashDrawer == true ? true : false}
                        onClick={() => notInCurrentPlan()}>
                        <div className="img-container">
                            <img src={CashManagement_Icon} alt="" />
                        </div>
                        <p>Cash Management</p>
                        <div className="f-key">F4</div>
                    </button>
                }

                <button id="linkLauncherButton" className={isShowLinkLauncher === true ? "launcher filter" : "launcher"} onClick={() => toggleLinkLauncher()}>
                    <div className="img-container">
                        <img src={LinkLauncher_Icon} alt="" />
                    </div>
                    <p>Link Launcher</p>
                </button>
                <div className="divider"></div>
                <button id="appLauncherButton" className={isShowAppLauncher === true ? "launcher filter" : "launcher"} onClick={() => toggleAppLauncher()}>
                    <div className="img-container">
                        <img src={Oliver_Icon_BaseBlue} alt="" />
                    </div>
                    <p>App Launcher</p>
                </button>


                {/* display Apps for home page */}
                {appsList && appsList !== [] && appsList.length > 0 && appsList.map((appItem, index) => {
                    var isDisplay = CheckAppDisplayInView(appItem.viewManagement)
                    if (isDisplay == true) displayAppCount += 1;
                    {
                        return displayAppCount < 4 && isDisplay == true &&

                            <button key={appItem.Id + "_" + index} id={appItem.Id + "_" + index} className="launcher app" onClick={() => toggleiFrameWindow(appItem)}>
                                <div className="img-container">
                                    {/* <img src={appItem.logo && appItem.logo !== "" ? appItem.logo : ClockIn_Icon} alt="" /> */}
                                    {appItem && appItem.logo != null ? <img src={appItem.logo} alt="" onError={({ currentTarget }) => {
                                        currentTarget.onerror = null; // prevents looping
                                        currentTarget.src = NoImageAvailable;
                                    }} /> : <img src={NoImageAvailable} alt="" />}
                                </div>
                                <p>{appItem.Name}</p>
                            </button>

                    }
                })}



                {/* <button id="navApp1" className="launcher app" onClick={() => toggleiFrameWindow()}>
                    <div className="img-container">
                        <img src={ClockIn_Icon} alt="" />
                    </div>
                    <p>{"Clock-in App"}</p>
                </button>
                <button id="navApp2" className="launcher app" onClick={() => toggleiFrameWindow()}>
                    <div className="img-container">
                        <img src={MC_Logo1} alt="" />
                    </div>
                    <p>MailChimp</p>
                </button>
                <button id="navApp3" className="launcher app" onClick={() => toggleiFrameWindow()}>
                    <div className="img-container">
                        <img src={Quickbooks1} alt="" />
                    </div>
                    <p>Quickbooks Sync</p>
                </button> */}
                <button id="navToggle" className="toggle-nav" onClick={() => toggleLeftMenu()}>
                    <div className="img-container">
                        <img src={ToggleNavbar_Icon} alt="" />
                    </div>
                    <p>Minimize Sidebar</p>
                </button>

            </div>
            <AppLauncher view={props.view} isShow={isShowAppLauncher} toggleAppLauncher={toggleAppLauncher} toggleiFrameWindow={toggleiFrameWindow}></AppLauncher>
            <LinkLauncher isShow={isShowLinkLauncher} toggleLinkLauncher={toggleLinkLauncher} ></LinkLauncher>
            {isShowiFrameWindow == true ? <IframeWindow exApp={extApp} isShow={isShowiFrameWindow} toggleiFrameWindow={toggleiFrameWindow}></IframeWindow> : null}
        </React.Fragment>)
}

export default LeftNavBar 