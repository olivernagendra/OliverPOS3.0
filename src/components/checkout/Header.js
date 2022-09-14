import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import avatar from '../../images/svg/avatar.svg';
import Arrow_Left from '../../images/svg/Arrow_Left.svg';
import Oliver_Icon_BaseBlue from '../../images/svg/Oliver-Icon-BaseBlue.svg';
import Ellipsis_Icon_DarkBlue from '../../images/svg/Ellipsis-Icon-DarkBlue.svg';
import AddNote_Icon from '../../images/svg/AddNote-Icon.svg';
import Clock from '../../images/svg/Clock.svg';
import UserInfo from "../common/commonComponents/UserInfo";
import SwitchUser from "../common/commonComponents/SwitchUser";
import EndSession from "../common/commonComponents/EndSession";
import OrderNote from "../common/commonComponents/OrderNote";
import { useNavigate, useLocation } from 'react-router-dom';
import AppLauncher from "../common/commonComponents/AppLauncher";
import IframeWindow from "../dashboard/IframeWindow";
import ParkSale from "./ParkSale";
const Header = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isShowOrderNote, setisShowOrderNote] = useState(false);
    const [isShowUserProfile, setisShowUserProfile] = useState(false);
    const [isShowSwitchUser, setisShowSwitchUser] = useState(false);
    const [isShowEndSession, setisShowEndSession] = useState(false);
    const [isShowParkSale, setisShowParkSale] = useState(false);
    const [isShowAppLauncher, setisShowAppLauncher] = useState(false);
    const [isShowiFrameWindow, setisShowiFrameWindow] = useState(false);
    const [isShowOptionPage, setisShowOptionPage] = useState(false);
    const toggleOrderNote = () => {
        setisShowOrderNote(!isShowOrderNote)
    }
    const toggleUserProfile = () => {
        setisShowUserProfile(!isShowUserProfile)
    }
    const toggleShowEndSession = () => {
        setisShowEndSession(!isShowEndSession)
    }
    const toggleSwitchUser = () => {
        setisShowSwitchUser(!isShowSwitchUser)
    }
    const toggleParkSale = () => {
        setisShowParkSale(!isShowParkSale)
    }
    const toggleAppLauncher = () => {
        setisShowAppLauncher(!isShowAppLauncher)
        setisShowOptionPage(false)
    }
    const toggleiFrameWindow = () => {
        setisShowiFrameWindow(!isShowiFrameWindow)
    }
    const toggleOptionPage = () => {
        setisShowOptionPage(!isShowOptionPage)
    }

    const addNote = (e) => {
        console.log("----order note-----" + e);
        toggleOrderNote()
    }
    const goBack = () => {
        navigate('/dashboard');
    }
    return (<React.Fragment>
        <div className="header">
            <button id="exitCheckoutButton" onClick={() => goBack()}>
                <img src={Arrow_Left} alt="" />
            </button>
            <p>Checkout</p>
            <button id="userInfoButton" onClick={() => toggleUserProfile()}>
                <img src={avatar} alt="" />
            </button>
            <button id="mobileOptionsButton" onClick={()=>toggleOptionPage()} className={isShowOptionPage?"filter":""}>
                <img src={Ellipsis_Icon_DarkBlue} alt="" />
            </button>
            <button id="mobileAppsButton">
                <img src={Oliver_Icon_BaseBlue} alt="" onClick={()=>toggleAppLauncher()}  />
            </button>
        </div>
        
        <div id="pageOptions" className={isShowOptionPage? "page-options-wrapper":"page-options-wrapper hidden"}>
            <div className="page-options">
                <p>Options Menu</p>
                <button id="parkSaleButton"  onClick={() => toggleParkSale()}>
                    <div className="img-container">
                        <img src={Clock} alt="" />
                    </div>
                    <p>Park Sale</p>
                </button>
                <button id="addNoteButton" onClick={() => toggleOrderNote()}>
                    <div className="img-container">
                        <img src={AddNote_Icon} alt="" />
                    </div>
                    <p>Add Order Note</p>
                </button>
            </div>
        </div>
        <OrderNote isShow={isShowOrderNote} toggleOrderNote={toggleOrderNote} addNote={addNote}></OrderNote>
        <UserInfo isShow={isShowUserProfile} toggleSwitchUser={toggleSwitchUser} toggleUserProfile={toggleUserProfile} toggleShowEndSession={toggleShowEndSession}></UserInfo>
        <SwitchUser toggleSwitchUser={toggleSwitchUser} isShow={isShowSwitchUser}></SwitchUser>
        <EndSession toggleShowEndSession={toggleShowEndSession} isShow={isShowEndSession}></EndSession>
        <ParkSale toggleParkSale={toggleParkSale} isShow={isShowParkSale} addNote={addNote}></ParkSale>
        <AppLauncher isShow={isShowAppLauncher} toggleAppLauncher={toggleAppLauncher} toggleiFrameWindow={toggleiFrameWindow}></AppLauncher>
        <IframeWindow isShow={isShowiFrameWindow} toggleiFrameWindow={toggleiFrameWindow}></IframeWindow>
    </React.Fragment>)
}

export default Header 