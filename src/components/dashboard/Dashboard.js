import React, { useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import AddTile from "./tiles/AddTile";
import AdvancedSearch from "./AdvancedSearch";
import CartDiscount from "./CartDiscount";
import CreateCustomer from "./CreateCustomer";
import Notifications from "./Notifications";
import OrderNote from "./OrderNote";
import SwitchUser from "./SwitchUser";
import MsgPopup_ProductNotFound from "./MsgPopup_ProductNotFound";
import MsgPopup_UpgradeToUnlock from "./MsgPopup_UpgradeToUnlock";
import MsgPopup_EndSession from "./MsgPopup_EndSession";
import LinkLauncher from "./LinkLauncher";
import AppLauncher from "./AppLauncher";

import LeftNavBar from "../common/LeftNavBar";
import HeadereBar from "./HeadereBar";
import IframeWindow from "./IframeWindow";
import UserInfo from "./UserInfo";
import CartList from "./CartList";
import TileList from "./tiles/TileList";
import { initHomeFn } from "../common/commonFunctions/homeFn";
import { attribute } from "../common/commonAPIs/attributeSlice";
import { category } from "../common/commonAPIs/categorySlice";
import { tile } from './tiles/tileSlice';
const Home = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        fetchData();
    }, []);
 
    const fetchData = async () => { //calling multiple api
        dispatch(attribute());
        dispatch(category());
        var regId = localStorage.getItem('register');
        if (typeof regId != "undefined" && regId != null) {
            dispatch(tile({ "id": regId }));
        }
     }


    // useEffect(() => {
    //     initFn();
    // });
    setTimeout(() => {
        initHomeFn ();
    }, 1000);
    // useLayoutEffect(() => {
    //     //Open Mobile Cart Button
    //     if (document.getElementById("openMobileCart")) {
    //         document.getElementById("openMobileCart").addEventListener("click", () => {
    //             document.querySelector(".cart").classList.add("open");
    //         });
    //     }

    //     //Close Mobile Cart
    //     if (document.getElementById("exitCart")) {
    //         document.getElementById("exitCart").addEventListener("click", () => {
    //             document.querySelector(".cart").classList.remove("open");
    //         });
    //     }

    // }, []);
 
    return <React.Fragment>
        <div className="homepage-wrapper">
            {/* left nav bar */}
            {/* top header */}
            {/* prodct list/item list */}
            {/* cart list */}
            <LeftNavBar></LeftNavBar>
            <HeadereBar></HeadereBar>
            <TileList ></TileList>
             <CartList></CartList>
            <div className="mobile-homepage-footer">
                <button id="openMobileCart">View Cart (2) - $24.99</button>
            </div>

            {/* top naviagtion bar */}
            {/* app launcher */}
            {/* link launcher */}
            {/* notifications */}
            {/* user info */}
            <UserInfo></UserInfo>
            <AppLauncher></AppLauncher>
            <LinkLauncher></LinkLauncher>
            <Notifications></Notifications>
            <div id="navCover" className="nav-cover"></div>
        </div>
        <div className="subwindow-wrapper hidden">
            <IframeWindow></IframeWindow>
            <CreateCustomer></CreateCustomer>
            <CartDiscount></CartDiscount>
            <AddTile></AddTile>
            <OrderNote></OrderNote>
            <MsgPopup_ProductNotFound></MsgPopup_ProductNotFound>
            <MsgPopup_UpgradeToUnlock></MsgPopup_UpgradeToUnlock>
            <AdvancedSearch></AdvancedSearch>
            <SwitchUser></SwitchUser>
            <MsgPopup_EndSession></MsgPopup_EndSession>
            {/* iframe subview */}
            {/* create customer */}
            {/* cart discount */}
            {/* add tile */}
            {/* order note */}
            {/* product not found */}
            {/* upgrade to unlock */}
            {/* advanced search */}
            {/* swtich  user */}
            {/* end session */}

            <div className="subwindow tax-rate-small">
                <div className="subwindow-header">
                    <p>Select Tax Rate</p>
                    <button>Edit</button>
                </div>
                <div className="row">
                    <p>Default Tax</p>
                    <label className="toggle-wrapper">
                        <input type="radio" name="tax_type" id="taxToggle1" />
                        <div className="custom-toggle">
                            <div className="knob"></div>
                        </div>
                    </label>
                </div>
                <div className="row">
                    <p>NL Tax</p>
                    <label className="toggle-wrapper">
                        <input type="radio" name="tax_type" id="taxToggle2" />
                        <div className="custom-toggle">
                            <div className="knob"></div>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    </React.Fragment>
}
export default Home 