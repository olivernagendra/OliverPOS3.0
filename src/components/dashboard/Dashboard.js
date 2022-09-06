import React, { useEffect, useState, useLayoutEffect } from "react";
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
import LinkLauncher from "../common/LinkLauncher";
import AppLauncher from "../common/AppLauncher";
import IframeWindow from "./IframeWindow";
import LeftNavBar from "../common/LeftNavBar";
import HeadereBar from "./HeadereBar";
// import IframeWindow from "./IframeWindow";
import UserInfo from "./UserInfo";
import CartList from "./product/CartList";
import TileList from "./tiles/TileList";
import { initHomeFn } from "../common/commonFunctions/homeFn";
import { attribute } from "../common/commonAPIs/attributeSlice";
import { category } from "../common/commonAPIs/categorySlice";
import { group } from "../common/commonAPIs/groupSlice";
import { tile } from './tiles/tileSlice';
import Product from "./product/Product";
import { product } from "./product/productSlice";
import { useIndexedDB } from 'react-indexed-db';
import STATUSES from "../../constants/apiStatus";
const Home = () => {
    const { add, update, getByID, getAll, deleteRecord } = useIndexedDB("products");
    const [isShowPopups, setisShowPopups] = useState(false);
    const [selProduct, setSelProduct] = useState(null);
    const [isShowUserProfile, setisShowUserProfile] = useState(false);
    const [isShowSwitchUser, setisShowSwitchUser] = useState(false);
    const [isShowEndSession, setisShowEndSession] = useState(false);

    const [isShowAppLauncher, setisShowAppLauncher] = useState(false);
    const [isShowLinkLauncher, setisShowLinkLauncher] = useState(false);
    const [isShowiFrameWindow, setisShowiFrameWindow] = useState(false);

    const [isShowOrderNote, setisShowOrderNote] = useState(false);
    const [isShowCartDiscount, setisShowCartDiscount] = useState(false);
    const [isShowNotifications, setisShowNotifications] = useState(false);

    const [isShowAdvancedSearch, setisShowAdvancedSearch] = useState(false);
    const [isShowAddTitle, setisShowAddTitle] = useState(false);
    const [isShowOptionPage, setisShowOptionPage] = useState(false);
    const [listItem, setListItem] = useState([]);
    const [isShowCreateCustomer, setisShowCreateCustomer] = useState(false);


    const dispatch = useDispatch();
    useEffect(() => {
        fetchData();
    }, []);

    const getFavourites = () => {
        var regId = localStorage.getItem('register');
        if (typeof regId != "undefined" && regId != null) {
            dispatch(tile({ "id": regId }));
        }
    }

    const fetchData = async () => { //calling multiple api
        dispatch(attribute());
        dispatch(category());
        dispatch(product({}));
        getFavourites();
        var locationId = localStorage.getItem('Location')
        var user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        if (user && user.group_sales && user.group_sales !== null && user.group_sales !== "" && user.group_sales !== "undefined") {
            dispatch(group({ "locationId": locationId, "group_sales": user.group_sales_by }));
        }
    }


    // useEffect(() => {
    //     initFn();
    // });
    setTimeout(() => {
        initHomeFn();
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

    // return   
    //  <Product></Product>
    // {isShowPopups==true? <Product></Product>:
    const editPopUp = async (item) => {
        var _item = await getByID(item.product_id ? item.product_id : item.WPID);
        setSelProduct(_item)
        setisShowPopups(true)
    }
    const openPopUp = async (item) => {
        var _item = await getByID(item.Product_Id ? item.Product_Id : item.WPID);
        setSelProduct(_item)
        setisShowPopups(true)
    }
    const closePopUp = () => {
        setisShowPopups(false)
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
    const toggleOrderNote = () => {
        setisShowOrderNote(!isShowOrderNote)
    }
    const toggleCartDiscount = () => {
        setisShowCartDiscount(!isShowCartDiscount)
    }
    const toggleNotifications = () => {
        setisShowNotifications(!isShowNotifications)
    }

    const toggleAdvancedSearch = () => {
        setisShowAdvancedSearch(!isShowAdvancedSearch)
    }
    const toggleAddTitle = () => {
        setisShowAddTitle(!isShowAddTitle)
    }

    const toggleAppLauncher = () => {
        setisShowAppLauncher(!isShowAppLauncher)
        setisShowLinkLauncher(false)
    }
    const toggleLinkLauncher = () => {
        setisShowLinkLauncher(!isShowLinkLauncher)
        setisShowAppLauncher(false)
    }

    const toggleiFrameWindow = () => {
        setisShowiFrameWindow(!isShowiFrameWindow)
    }
    const toggleOptionPage = () => {
        setisShowOptionPage(!isShowOptionPage)
    }
    const toggleCreateCustomer = () => {
        setisShowCreateCustomer(!isShowCreateCustomer)
    }

    // It is refreshing the tile list from server when a new tile is added
    const [resAddTile] = useSelector((state) => [state.addTile])
    useEffect(() => {
        if (resAddTile && resAddTile.status == STATUSES.IDLE && resAddTile.is_success) {
            getFavourites && getFavourites();
            toggleAddTitle();
        }
    }, [resAddTile]);

    const [resProduct] = useSelector((state) => [state.product])
    useEffect(() => {
        if (resProduct && resProduct.status == STATUSES.IDLE && resProduct.is_success) {
            setListItem(resProduct.data);
            setisShowPopups(false);
            console.log("---resProduct--" + JSON.stringify(resProduct.data));
        }
    }, [resProduct]);


    return (
        <React.Fragment>
            <Product openPopUp={openPopUp} closePopUp={closePopUp} selProduct={selProduct} isShowPopups={isShowPopups}></Product>
            <div className="homepage-wrapper" style={{ display: isShowPopups == false ? "grid" : "none" }}>
                {/* left nav bar */}
                {/* top header */}
                {/* prodct list/item list */}
                {/* cart list */}
                <LeftNavBar toggleLinkLauncher={toggleLinkLauncher} toggleAppLauncher={toggleAppLauncher} toggleiFrameWindow={toggleiFrameWindow} ></LeftNavBar>
                <HeadereBar isShow={isShowOptionPage} isShowLinkLauncher={isShowLinkLauncher} isShowAppLauncher={isShowAppLauncher} toggleAdvancedSearch={toggleAdvancedSearch} toggleUserProfile={toggleUserProfile} toggleCartDiscount={toggleCartDiscount} toggleNotifications={toggleNotifications} toggleOrderNote={toggleOrderNote} toggleAppLauncher={toggleAppLauncher} toggleLinkLauncher={toggleLinkLauncher} toggleiFrameWindow={toggleiFrameWindow} toggleOptionPage={toggleOptionPage}></HeadereBar>
                <AppLauncher isShow={isShowAppLauncher} toggleAppLauncher={toggleAppLauncher} toggleiFrameWindow={toggleiFrameWindow}></AppLauncher>
                <LinkLauncher isShow={isShowLinkLauncher} toggleLinkLauncher={toggleLinkLauncher} ></LinkLauncher>
                <IframeWindow isShow={isShowiFrameWindow} toggleiFrameWindow={toggleiFrameWindow}></IframeWindow>
                <TileList openPopUp={openPopUp} toggleAddTitle={toggleAddTitle}></TileList>
                <CartList listItem={listItem} editPopUp={editPopUp}></CartList>
                <div className="mobile-homepage-footer">
                    <button id="openMobileCart">View Cart (2) - $24.99</button>
                </div>

                {/* top naviagtion bar */}
                {/* app launcher */}
                {/* link launcher */}
                {/* notifications */}
                {/* user info */}
                <UserInfo isShow={isShowUserProfile} toggleSwitchUser={toggleSwitchUser} toggleUserProfile={toggleUserProfile} toggleShowEndSession={toggleShowEndSession}></UserInfo>
                {/* <AppLauncher></AppLauncher> */}
                {/* <LinkLauncher></LinkLauncher> */}
                <Notifications isShow={isShowNotifications} toggleNotifications={toggleNotifications}></Notifications>
                <div id="navCover" className="nav-cover"></div>
            </div>
            {/* <div className="subwindow-wrapper"> */}

           
            <CartDiscount isShow={isShowCartDiscount} toggleCartDiscount={toggleCartDiscount}></CartDiscount>
            <AddTile isShow={isShowAddTitle} toggleAddTitle={toggleAddTitle}></AddTile>
            <OrderNote isShow={isShowOrderNote} toggleOrderNote={toggleOrderNote}></OrderNote>
            <MsgPopup_ProductNotFound></MsgPopup_ProductNotFound>
            <MsgPopup_UpgradeToUnlock></MsgPopup_UpgradeToUnlock>
            <AdvancedSearch  toggleCreateCustomer={toggleCreateCustomer}  openPopUp={openPopUp} closePopUp={closePopUp} isShow={isShowAdvancedSearch} toggleAdvancedSearch={toggleAdvancedSearch}></AdvancedSearch>
            <CreateCustomer  isShow={isShowCreateCustomer} ></CreateCustomer>
            <SwitchUser toggleSwitchUser={toggleSwitchUser} isShow={isShowSwitchUser}></SwitchUser>
            <MsgPopup_EndSession toggleShowEndSession={toggleShowEndSession} isShow={isShowEndSession}></MsgPopup_EndSession>
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
            {/* </div> */}
        </React.Fragment>)
    // }

}
export default Home 