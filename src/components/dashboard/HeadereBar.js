import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import avatar from '../../assets/images/svg/avatar.svg';
import Avatar_Blue_Background from '../../assets/images/svg/Avatar-Blue_Background.svg';
import avatar_2 from '../../assets/images/svg/avatar-2.svg';
import Oliver_Type from '../../assets/images/svg/Oliver-Type.svg';
import Search_Icon_Blue from '../../assets/images/svg/Search-Icon-Blue.svg';
import Ellipsis_Icon_DarkBlue from '../../assets/images/svg/Ellipsis-Icon-DarkBlue.svg';

import Add_Discount_Icon from '../../assets/images/svg/Add-Discount-Icon.svg';
import AddNote_Icon from '../../assets/images/svg/AddNote-Icon.svg';
import ClearCart_Icon from '../../assets/images/svg/ClearCart-Icon.svg';
import Notifications_Icon from '../../assets/images/svg/Notifications-Icon.svg';
import Oliver_Icon_BaseBlue from '../../assets/images/svg/Oliver-Icon-BaseBlue.svg';
import { removeCheckOutList } from '../dashboard/product/productLogic';
import { product } from "../dashboard/product/productSlice";
import UserInfo from "../common/commonComponents/UserInfo";
import SwitchUser from "../common/commonComponents/SwitchUser";
import EndSession from "../common/commonComponents/EndSession";
import Config from '../../Config';
import { checkTempOrderSync } from "../checkout/checkoutSlice";
import { saveCustomerToTempOrder } from "../customer/CustomerSlice";
import { checkTempOrderStatus } from "../checkout/checkoutSlice";
import { get_UDid } from "../common/localSettings";
import ActiveUser from "../../settings/ActiveUser";
const HeadereBar = (props) => {
    const dispatch = useDispatch();
    const [isShowUserProfile, setisShowUserProfile] = useState(false);
    const [isShowSwitchUser, setisShowSwitchUser] = useState(false);
    const [isShowEndSession, setisShowEndSession] = useState(false);
    const [isMobileNav, setisMobileNav] = useState(false);
    const toggleUserProfile = () => {
        setisShowUserProfile(!isShowUserProfile)
    }
    const toggleShowEndSession = () => {
        setisShowEndSession(!isShowEndSession);
    }
    const toggleSwitchUser = () => {
        setisShowSwitchUser(!isShowSwitchUser)
    }
    const toggleMobileNav = () => {
        setisMobileNav(!isMobileNav)
        props.toggleShowMobLeftNav();
    }
    const clearCart = () => {
        removeCheckOutList();
        dispatch(product());
    }
    useEffect(()=>{
       checkTempOrderSyncStatus();
        //checkTempOrderStatus();
    })
   const checkTempOrderSyncStatus=()=> {
        const { Email } = ActiveUser.key;
        setTimeout(function () {
            var TempOrdersForSync = localStorage.getItem(`TempOrders_${Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${Email}`)) : [];
            if (TempOrdersForSync && TempOrdersForSync.length > 0) {
                var TempOrders = TempOrdersForSync.filter(item => (item.Status.toString() == "false" /*|| item.Status.toString() == "failed"*/) && item.Sync_Count < Config.key.SYNC_COUNT_LIMIT);
                if (TempOrders && TempOrders.length > 0) {
                    var sortArr = TempOrders.sort(function (obj1, obj2) {
                        return obj1.Index - obj2.Index;
                    })
                    var syncOrderID = sortArr[0].TempOrderID;

                    if (syncOrderID && syncOrderID !== '') {
                        dispatch(checkTempOrderSync(syncOrderID));
                    }
                }

                /// Sync for add new customer to order and send email to customer
                TempOrders = TempOrdersForSync.filter(item => item.new_customer_email !== "" && item.isCustomerEmail_send == false && item.Sync_Count < Config.key.SYNC_COUNT_LIMIT && (item.Status.toString() == "false" /*|| item.Status.toString() == "failed"*/));
                if (TempOrders && TempOrders.length > 0) {
                    var sortArr = TempOrders.sort(function (obj1, obj2) {
                        return obj1.Index - obj2.Index;
                    })
                    var syncOrderID = sortArr[0].TempOrderID;

                    //Sync_Count<=1 FOR ONLY ONE TIME EXCECUTION
                    // console.log("TempOrders[0].Sync_Count", TempOrders[0].Sync_Count)
                    if (syncOrderID && TempOrders[0].Sync_Count <= 1 && TempOrders[0].new_customer_email !== "" && TempOrders[0].isCustomerEmail_send == false) {
                        // console.log("Call email customer", TempOrders[0].Sync_Count)
                        dispatch(saveCustomerToTempOrder({"order_id":syncOrderID,"email_id":TempOrders[0].new_customer_email}));
                    }
                }
            }
        }, 10000);
    }
    return (<React.Fragment>
        <div className="header">
            <div className="row">
                <button id="mobileNavToggle" onClick={() => toggleMobileNav()} className={isMobileNav === true ? "opened" : ""}>
                    <img src="" alt="" />
                </button>
                <img src={Oliver_Type} alt="" />
                <button id="searchButton" onClick={() => props.toggleAdvancedSearch()}>
                    <img src={Search_Icon_Blue} alt="" />
                    Search Console
                </button>
                <button id="userInfoButton" onClick={() => toggleUserProfile()}>
                    {/* <img src={avatar} alt="" /> */}
                    {/* Will use by default if no other img is given  */}
						<img src={Avatar_Blue_Background} alt="" class="default" />
						<img src={avatar_2} alt="" />
                </button>
                <button id="mobileOptionsButton" onClick={() => props.toggleOptionPage()} className={props.isShow == true ? "filter" : ""}>
                    <img src={Ellipsis_Icon_DarkBlue} alt="" />
                </button>
                <button id="mobileAppsButton" onClick={() => props.toggleAppLauncher()}>
                    <img src={Oliver_Icon_BaseBlue} alt="" />
                </button>
            </div>
        </div >
        <div id="pageOptions" className={props.isShow ? "page-options-wrapper" : "page-options-wrapper hidden"}>
            <div className="page-options">
                <p>Options Menu</p>
                <button id="notificationsButton" onClick={() => props.toggleNotifications()}>
                    <div className="img-container">
                        <img src={Notifications_Icon} alt="" />
                    </div>
                    <p>Notifications</p>
                </button>
                <button id="customFeeDiscountButton" onClick={() => props.toggleCartDiscount()}>
                    <div className="img-container">
                        <img src={Add_Discount_Icon} alt="" />
                    </div>
                    <p>Custom Fee / Cart Discount</p>
                </button>
                <button id="addNoteButton" onClick={() => props.toggleOrderNote()}>
                    <div className="img-container">
                        <img src={AddNote_Icon} alt="" />
                    </div>
                    <p>Add Note</p>
                </button>
                <button id="clearCartButton" onClick={() => clearCart()}>
                    <div className="img-container">
                        <img src={ClearCart_Icon} alt="" />
                    </div>
                    <p>Clear Cart</p>
                </button>
            </div>
        </div>
        <UserInfo isShow={isShowUserProfile} toggleSwitchUser={toggleSwitchUser} toggleUserProfile={toggleUserProfile} toggleShowEndSession={toggleShowEndSession}></UserInfo>
        <SwitchUser toggleSwitchUser={toggleSwitchUser} isShow={isShowSwitchUser}></SwitchUser>
        <EndSession toggleShowEndSession={toggleShowEndSession} isShow={isShowEndSession}></EndSession>
    </React.Fragment >)
}

export default HeadereBar 