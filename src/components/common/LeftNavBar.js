import React, { useEffect, useLayoutEffect } from "react";
import Oliver_Icon_Color from '../../images/svg/Oliver-Icon-Color.svg';
import Oliver_Type from '../../images/svg/Oliver-Type.svg';
import Register_Icon from '../../images/svg/Register-Icon.svg';
import Customers_Icon from '../../images/svg/Customers-Icon.svg';
import Transactions_Icon from '../../images/svg/Transactions-Icon.svg';
import CashManagement_Icon from '../../images/svg/CashManagement-Icon.svg';
import LinkLauncher_Icon from '../../images/svg/LinkLauncher-Icon.svg';
import Oliver_Icon_BaseBlue from '../../images/svg/Oliver-Icon-BaseBlue.svg';
import ToggleNavbar_Icon from '../../images/svg/ToggleNavbar-Icon.svg';

const LeftNavBar = () => {
    return (
        <div className="navbar">
        <div className="header-row">
            <img src={Oliver_Icon_Color} alt="" className="oliver-logo" />
            <img src={Oliver_Type} alt="" className="oliver-text" />
        </div>
        <button id="registerButton" className="page-link selected" disabled>
            <div className="img-container">
                <img src={Register_Icon} alt="" />
            </div>
            <p>Register</p>
            <div className="f-key">F1</div>
        </button>
        <button id="customersButton" className="page-link">
            <div className="img-container">
                <img src={Customers_Icon} alt="" />
            </div>
            <p>Customers</p>
            <div className="f-key">F2</div>
        </button>
        <button id="transactionsButton" className="page-link">
            <div className="img-container">
                <img src={Transactions_Icon} alt="" />
            </div>
            <p>Transactions</p>
            <div className="f-key">F3</div>
        </button>
        <button id="cashManagementButton" className="page-link">
            <div className="img-container">
                <img src={CashManagement_Icon} alt="" />
            </div>
            <p>Cash Management</p>
            <div className="f-key">F4</div>
        </button>
        <button id="linkLauncherButton" className="launcher">
            <div className="img-container">
                <img src={LinkLauncher_Icon} alt="" />
            </div>
            <p>Link Launcher</p>
        </button>
        <div className="divider"></div>
        <button id="appLauncherButton" className="launcher">
            <div className="img-container">
                <img src={Oliver_Icon_BaseBlue} alt="" />
            </div>
            <p>App Launcher</p>
        </button>
        <button id="navApp1" className="launcher app">
            <div className="img-container">
                <img src="../../images/temp/ClockIn_Icon.png" alt="" />
            </div>
            <p>{"Clock-in App"}</p>
        </button>
        <button id="navApp2" className="launcher app">
            <div className="img-container">
                <img src="../../images/temp/MC_Logo1.png" alt="" />
            </div>
            <p>MailChimp</p>
        </button>
        <button id="navApp3" className="launcher app">
            <div className="img-container">
                <img src="../../images/temp/Quickbooks1.png" alt="" />
            </div>
            <p>Quickbooks Sync</p>
        </button>
        <button id="navToggle" className="toggle-nav">
            <div className="img-container">
                <img src={ToggleNavbar_Icon} alt="" />
            </div>
            <p>Minimize Sidebar</p>
        </button>
    </div>)
}

export default LeftNavBar 