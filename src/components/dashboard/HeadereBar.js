import React, { useEffect, useLayoutEffect } from "react";
import avatar from '../../images/svg/avatar.svg';
import Oliver_Type from '../../images/svg/Oliver-Type.svg';
import Search_Icon_Blue from '../../images/svg/Search-Icon-Blue.svg';
import Ellipsis_Icon_DarkBlue from '../../images/svg/Ellipsis-Icon-DarkBlue.svg';

import Add_Discount_Icon from '../../images/svg/Add-Discount-Icon.svg';
import AddNote_Icon from '../../images/svg/AddNote-Icon.svg';
import ClearCart_Icon from '../../images/svg/ClearCart-Icon.svg';
import Notifications_Icon from '../../images/svg/Notifications-Icon.svg';

const HeadereBar = () => {
    return (<React.Fragment>
        <div className="header">
            <div className="row">
                <button id="mobileNavToggle">
                    <img src="" alt="" />
                </button>
                <img src={Oliver_Type} alt="" />
                <button id="searchButton">
                    <img src={Search_Icon_Blue} alt="" />
                    Search Console
                </button>
                <button id="userInfoButton">
                    <img src={avatar} alt="" />
                </button>
                <button id="mobileOptionsButton">
                    <img src={Ellipsis_Icon_DarkBlue} alt="" />
                </button>
                <button id="mobileAppsButton">
                    <img src="../Assets/Images/SVG/Oliver_Icon_BaseBlue" alt="" />
                </button>
            </div>
        </div>
        <div id="pageOptions" className="page-options-wrapper hidden">
            <div className="page-options">
                <p>Options Menu</p>
                <button id="notificationsButton">
                    <div className="img-container">
                        <img src={Notifications_Icon} alt="" />
                    </div>
                    <p>Notifications</p>
                </button>
                <button id="addDiscountButton">
                    <div className="img-container">
                        <img src={Add_Discount_Icon} alt="" />
                    </div>
                    <p>Discount</p>
                </button>
                <button id="addNoteButton">
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