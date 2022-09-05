import React, { useEffect, useLayoutEffect } from "react";
import avatar from '../../images/svg/avatar.svg';
import Oliver_Type from '../../images/svg/Oliver-Type.svg';
import Search_Icon_Blue from '../../images/svg/Search-Icon-Blue.svg';
import Ellipsis_Icon_DarkBlue from '../../images/svg/Ellipsis-Icon-DarkBlue.svg';

import Add_Discount_Icon from '../../images/svg/Add-Discount-Icon.svg';
import AddNote_Icon from '../../images/svg/AddNote-Icon.svg';
import ClearCart_Icon from '../../images/svg/ClearCart-Icon.svg';
import Notifications_Icon from '../../images/svg/Notifications-Icon.svg';
import Oliver_Icon_BaseBlue from '../../images/svg/Oliver-Icon-BaseBlue.svg';
const HeadereBar = (props) => {
    return (<React.Fragment>
        <div className="header">
            <div className="row">
                <button id="mobileNavToggle">
                    <img src="" alt="" />
                </button>
                <img src={Oliver_Type} alt="" />
                <button id="searchButton" onClick={()=>props.toggleAdvancedSearch()}>
                    <img src={Search_Icon_Blue} alt="" />
                    Search Console
                </button>
                <button id="userInfoButton" onClick={()=>props.toggleUserProfile()}>
                    <img src={avatar} alt="" />
                </button>
                <button id="mobileOptionsButton">
                    <img src={Ellipsis_Icon_DarkBlue} alt="" onClick={()=>props.toggleOptionPage()}/>
                </button>
                <button id="mobileAppsButton">
                    <img src={Oliver_Icon_BaseBlue} alt="" onClick={()=>props.toggleAppLauncher()}  />
                </button>
            </div>
        </div>
        <div id="pageOptions" className={props.isShow? "page-options-wrapper":"page-options-wrapper hidden"}>
            <div className="page-options">
                <p>Options Menu</p> 
                <button id="notificationsButton" onClick={()=>props.toggleNotifications()}>
                    <div className="img-container">
                        <img src={Notifications_Icon} alt="" />
                    </div>
                    <p>Notifications</p>
                </button>
                <button id="customFeeDiscountButton" onClick={()=>props.toggleCartDiscount()}>
                    <div className="img-container">
                        <img src={Add_Discount_Icon} alt="" />
                    </div>
                    <p>Custom Fee / Cart Discount</p>
                </button>
                <button id="addNoteButton" onClick={()=>props.toggleOrderNote()}>
                    <div className="img-container">
                        <img src={AddNote_Icon} alt="" />
                    </div>
                    <p>Add Note</p>
                </button>
                <button id="clearCartButton">
                    <div className="img-container">
                        <img src={ClearCart_Icon} alt="" />
                    </div>
                    <p>Clear Cart</p>
                </button>
            </div>
        </div></React.Fragment>)
}

export default HeadereBar 