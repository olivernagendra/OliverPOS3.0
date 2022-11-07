import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
// import avatar from '../../assets/images/svg/avatar.svg';
import avatar_2 from '../../assets/images/svg/avatar-2.svg';
import Arrow_Left from '../../assets/images/svg/Arrow_Left.svg';
import Oliver_Icon_BaseBlue from '../../assets/images/svg/Oliver-Icon-BaseBlue.svg';
import Ellipsis_Icon_DarkBlue from '../../assets/images/svg/Ellipsis-Icon-DarkBlue.svg';
import AddNote_Icon from '../../assets/images/svg/AddNote-Icon.svg';
import ClearCart_Icon from '../../assets/images/svg/ClearCart-Icon.svg';

import Clock from '../../assets/images/svg/Clock.svg';
import UserInfo from "../common/commonComponents/UserInfo";
import SwitchUser from "../common/commonComponents/SwitchUser";
import EndSession from "../common/commonComponents/EndSession";
import OrderNote from "../common/commonComponents/OrderNote";
import { useNavigate, useLocation } from 'react-router-dom';
import AppLauncher from "../common/commonComponents/AppLauncher";
import IframeWindow from "../dashboard/IframeWindow";
// import ParkSale from "./ParkSale";
import LocalizedLanguage from "../../settings/LocalizedLanguage";
import { get_UDid } from "../common/localSettings";
import { checkTempOrderSync } from "./checkoutSlice";
import ActiveUser from '../../settings/ActiveUser';
import Config from '../../Config';
import { removeCheckOutList } from '../dashboard/product/productLogic';
import { product } from "../dashboard/product/productSlice";
const Header = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isShowOrderNote, setisShowOrderNote] = useState(false);
    const [isShowUserProfile, setisShowUserProfile] = useState(false);
    const [isShowSwitchUser, setisShowSwitchUser] = useState(false);
    const [isShowEndSession, setisShowEndSession] = useState(false);
    // const [isShowParkSale, setisShowParkSale] = useState(false);
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
    // const toggleParkSale = () => {
    //     setisShowParkSale(!isShowParkSale)
    // }
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
        toggleOrderNote();
        // if(e==="park_sale")
        // {
        //     props.placeParkLayAwayOrder && props.placeParkLayAwayOrder('park_sale');
        // }
    }
    const goBack = () => {
        if (props.title) {navigate('/transactions'); }
        else { 
            localStorage.removeItem('paybyproduct');
            localStorage.removeItem('paybyproduct_unpaid');
            navigate('/home'); }
    }
    const checkTempOrderSyncStatus = () => {
        var udid = get_UDid;
        const { Email } = ActiveUser.key;
        setTimeout(function () {
            var TempOrdersForSync = localStorage.getItem(`TempOrders_${Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${Email}`)) : [];
            if (TempOrdersForSync && TempOrdersForSync.length > 0) {
                var TempOrders = TempOrdersForSync.filter(item => item.Status.toString() == "false" && item.Sync_Count < Config.key.SYNC_COUNT_LIMIT);
                if (TempOrders && TempOrders.length > 0) {
                    var sortArr = TempOrders.sort(function (obj1, obj2) {
                        return obj1.Index - obj2.Index;
                    })
                    var syncOrderID = sortArr[0].TempOrderID;

                    if (syncOrderID && syncOrderID !== '') {
                        // console.log("checkTempOrderSync", syncOrderID)
                        dispatch(checkTempOrderSync(udid, syncOrderID));
                    }
                }

                /// Sync for add new customer to order and send email to customer
                TempOrders = TempOrdersForSync.filter(item => item.new_customer_email !== "" && item.isCustomerEmail_send == false && item.Sync_Count < Config.key.SYNC_COUNT_LIMIT);
                if (TempOrders && TempOrders.length > 0) {
                    var sortArr = TempOrders.sort(function (obj1, obj2) {
                        return obj1.Index - obj2.Index;
                    })
                    var syncOrderID = sortArr[0].TempOrderID;

                    //Sync_Count<=1 FOR ONLY ONE TIME EXCECUTION
                    // console.log("TempOrders[0].Sync_Count", TempOrders[0].Sync_Count)
                    if (syncOrderID && TempOrders[0].Sync_Count <= 1 && TempOrders[0].new_customer_email !== "" && TempOrders[0].isCustomerEmail_send == false) {
                        // console.log("Call email customer", TempOrders[0].Sync_Count)
                        //dispatch(saveCustomerInOrderAction.saveCustomerToTempOrder(udid, syncOrderID, TempOrders[0].new_customer_email))
                    }

                }
            }
        }, 10000);
    }
    const clearCart = () => {
        removeCheckOutList();
        dispatch(product());
    }
    return (<React.Fragment>
        <div className="header">
            <button id="exitCheckoutButton" onClick={() => goBack()}>
                <img src={Arrow_Left} alt="" />
            </button>
            <p>{props.title ? props.title : LocalizedLanguage.checkout}</p>
            <button id="userInfoButton" onClick={() => toggleUserProfile()}>
                <img src={avatar_2} alt="" />
            </button>
            <button id="mobileOptionsButton" onClick={() => toggleOptionPage()} className={isShowOptionPage ? "filter" : ""}>
                <img src={Ellipsis_Icon_DarkBlue} alt="" />
            </button>
            <button id="mobileAppsButton">
                <img src={Oliver_Icon_BaseBlue} alt="" onClick={() => toggleAppLauncher()} />
            </button>
        </div>
        {props.title == null ?
            <div id="pageOptions" className={isShowOptionPage ? "page-options-wrapper" : "page-options-wrapper hidden"}>
                <div className="page-options">
                    <p>Options Menu</p>
                    <button id="clearCartButton" onClick={()=>clearCart()}>
						<div class="img-container">
							<img src={ClearCart_Icon} alt="" />
						</div>
						<p>Clear Cart</p>
					</button>
                    <button id="parkSaleButton" onClick={() => props.toggleParkSale('park_sale')}>
                        <div className="img-container">
                            <img src={Clock} alt="" />
                        </div>
                        <p>{LocalizedLanguage.parkSale}</p>
                    </button>
                    <button id="addNoteButton" onClick={() => toggleOrderNote()}>
                        <div className="img-container">
                            <img src={AddNote_Icon} alt="" />
                        </div>
                        <p>Add Order Note</p>
                    </button>
                </div>
            </div> : null}
        <OrderNote isShow={isShowOrderNote} toggleOrderNote={toggleOrderNote} addNote={addNote}></OrderNote>
        <UserInfo isShow={isShowUserProfile} toggleSwitchUser={toggleSwitchUser} toggleUserProfile={toggleUserProfile} toggleShowEndSession={toggleShowEndSession}></UserInfo>
        <SwitchUser toggleSwitchUser={toggleSwitchUser} isShow={isShowSwitchUser}></SwitchUser>
        <EndSession toggleShowEndSession={toggleShowEndSession} isShow={isShowEndSession}></EndSession>
        {/* <ParkSale toggleParkSale={toggleParkSale} isShow={isShowParkSale} addNote={addNote}></ParkSale> */}
        <AppLauncher isShow={isShowAppLauncher} toggleAppLauncher={toggleAppLauncher} toggleiFrameWindow={toggleiFrameWindow}></AppLauncher>
        <IframeWindow isShow={isShowiFrameWindow} toggleiFrameWindow={toggleiFrameWindow}></IframeWindow>
    </React.Fragment>)
}

export default Header 