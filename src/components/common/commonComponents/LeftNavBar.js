import React, { useState, useEffect, useLayoutEffect } from "react";
import Oliver_Icon_Color from '../../../images/svg/Oliver-Icon-Color.svg';
import Oliver_Type from '../../../images/svg/Oliver-Type.svg';
import Register_Icon from '../../../images/svg/Register-Icon.svg';
import Customers_Icon from '../../../images/svg/Customers-Icon.svg';
import Transactions_Icon from '../../../images/svg/Transactions-Icon.svg';
import CashManagement_Icon from '../../../images/svg/CashManagement-Icon.svg';
import LinkLauncher_Icon from '../../../images/svg/LinkLauncher-Icon.svg';
import Oliver_Icon_BaseBlue from '../../../images/svg/Oliver-Icon-BaseBlue.svg';
import ToggleNavbar_Icon from '../../../images/svg/ToggleNavbar-Icon.svg';

import ClockIn_Icon from '../../../images/Temp/ClockIn_Icon.png';
import MC_Logo1 from '../../../images/Temp/MC_Logo 1.png';
import Quickbooks1 from '../../../images/Temp/Quickbooks 1.png';
import { useNavigate,useLocation } from 'react-router-dom';
import AppLauncher from "./AppLauncher"; 
import LinkLauncher from "./LinkLauncher";
import IframeWindow from "../../dashboard/IframeWindow";
import {isMobile} from "react-device-detect";
const LeftNavBar = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isShowLeftMenu, setisShowLeftMenu] = useState(false);
    const [isShowAppLauncher, setisShowAppLauncher] = useState(false);
    const [isShowLinkLauncher, setisShowLinkLauncher] = useState(false);
    const [isShowiFrameWindow, setisShowiFrameWindow] = useState(false);
    const [isShowMobileView, setisShowMobileView] = useState(false);
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
    const toggleiFrameWindow = () => {
        setisShowiFrameWindow(!isShowiFrameWindow)
    }
    const toggleMobileView = () => {
        setisShowMobileView(!isShowMobileView)
    }
    


    return (
        <React.Fragment>
        <div className={isShowLeftMenu == true || (props.isShowMobLeftNav && props.isShowMobLeftNav===true) ? "navbar open" : "navbar"} >
            <div className="header-row">
                <img src={Oliver_Icon_Color} alt="" className="oliver-logo" />
                <img src={Oliver_Type} alt="" className="oliver-text" />
            </div>
            <button id="registerButton" className= {location.pathname==="/dashboard"?"page-link selected":"page-link"} disabled={location.pathname==="/dashboard"?true:false} onClick={()=>navigateTo('/dashboard')}>
                <div className="img-container">
                    <img src={Register_Icon} alt="" />
                </div>
                <p>Register</p>
                <div className="f-key">F1</div>
            </button>
            <button id="customersButton" className= {location.pathname==="/customer"?"page-link selected":"page-link"} disabled={location.pathname==="/customer"?true:false} onClick={()=>navigateTo('/customer')}>
                <div className="img-container">
                    <img src={Customers_Icon} alt="" />
                </div>
                <p>Customers</p>
                <div className="f-key">F2</div>
            </button>
            <button id="transactionsButton" className= {location.pathname==="/transaction"?"page-link selected":"page-link"} disabled={location.pathname==="/transaction"?true:false} onClick={()=>navigateTo('/transaction')}>
                <div className="img-container">
                    <img src={Transactions_Icon} alt="" />
                </div>
                <p>Transactions</p>
                <div className="f-key">F3</div>
            </button>
            <button id="cashManagementButton" className= {location.pathname==="/cashdrawer"?"page-link selected":"page-link"} disabled={location.pathname==="/cashdrawer"?true:false} onClick={()=>navigateTo('/cashdrawer')}>
                <div className="img-container">
                    <img src={CashManagement_Icon} alt="" />
                </div>
                <p>Cash Management</p>
                <div className="f-key">F4</div>
            </button>
            <button id="linkLauncherButton" className={isShowLinkLauncher===true? "launcher filter":"launcher"} onClick={()=>toggleLinkLauncher()}>
                <div className="img-container">
                    <img src={LinkLauncher_Icon} alt="" />
                </div>
                <p>Link Launcher</p>
            </button>
            <div className="divider"></div>
            <button id="appLauncherButton" className={isShowAppLauncher===true? "launcher filter":"launcher"} onClick={()=>toggleAppLauncher()}>
                <div className="img-container">
                    <img src={Oliver_Icon_BaseBlue} alt="" />
                </div>
                <p>App Launcher</p>
            </button>
            <button id="navApp1" className="launcher app" onClick={()=>toggleiFrameWindow()}>
                <div className="img-container">
                    <img src={ClockIn_Icon} alt="" />
                </div>
                <p>{"Clock-in App"}</p>
            </button>
            <button id="navApp2" className="launcher app" onClick={()=>toggleiFrameWindow()}>
                <div className="img-container">
                    <img src={MC_Logo1} alt="" />
                </div>
                <p>MailChimp</p>
            </button>
            <button id="navApp3" className="launcher app" onClick={()=>toggleiFrameWindow()}>
                <div className="img-container">
                    <img src={Quickbooks1} alt="" />
                </div>
                <p>Quickbooks Sync</p>
            </button>
            <button id="navToggle" className="toggle-nav" onClick={() => toggleLeftMenu()}>
                <div className="img-container">
                    <img src={ToggleNavbar_Icon} alt="" />
                </div>
                <p>Minimize Sidebar</p>
            </button>
            </div>
        <AppLauncher isShow={isShowAppLauncher} toggleAppLauncher={toggleAppLauncher} toggleiFrameWindow={toggleiFrameWindow}></AppLauncher>
        <LinkLauncher isShow={isShowLinkLauncher} toggleLinkLauncher={toggleLinkLauncher} ></LinkLauncher>
        <IframeWindow isShow={isShowiFrameWindow} toggleiFrameWindow={toggleiFrameWindow}></IframeWindow>
        </React.Fragment>)
}

export default LeftNavBar 