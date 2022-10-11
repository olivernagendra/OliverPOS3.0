import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import avatar from '../../assets/images/svg/avatar.svg';
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
                    <img src={avatar} alt="" />
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