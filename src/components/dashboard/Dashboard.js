import React, { useEffect, useState, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import AddTile from "./tiles/AddTile";
import AdvancedSearch from "./AdvancedSearch";
import CartDiscount from "./CartDiscount";
import CreateCustomer from "./CreateCustomer";
import Notifications from "./Notifications";
import OrderNote from "../common/commonComponents/OrderNote";

import MsgPopup_ProductNotFound from "./MsgPopup_ProductNotFound";
import MsgPopup_UpgradeToUnlock from "./MsgPopup_UpgradeToUnlock";

import LinkLauncher from "../common/commonComponents/LinkLauncher";
import AppLauncher from "../common/commonComponents/AppLauncher";
import IframeWindow from "./IframeWindow";
import LeftNavBar from "../common/commonComponents/LeftNavBar";
import HeadereBar from "./HeadereBar";
// import IframeWindow from "./IframeWindow";

import CartList from "./product/CartList";
import TileList from "./tiles/TileList";
import { initHomeFn } from "../common/commonFunctions/homeFn";
import { attribute } from "../common/commonAPIs/attributeSlice";
import { category } from "../common/commonAPIs/categorySlice";
import { group } from "../common/commonAPIs/groupSlice";
import { tile } from './tiles/tileSlice';
import Product from "./product/Product";
import { product } from "./product/productSlice";
import { userList } from "../common/commonAPIs/userSlice";
import { getRates, isMultipleTaxSupport, getTaxRateList } from "../common/commonAPIs/taxSlice";
import { useIndexedDB } from 'react-indexed-db';
import STATUSES from "../../constants/apiStatus";
import { getTaxAllProduct } from "../common/TaxSetting";
import MsgPopup_OutOfStock from "./product/MsgPopup_OutOfStock";
import TaxList from "./TaxList";
import MsgPopup from "../common/commonComponents/MsgPopup";
import { popupMessage } from "../common/commonAPIs/messageSlice";
import { useNavigate } from "react-router-dom";
const Home = () => {
    const { add, update, getByID, getAll, deleteRecord } = useIndexedDB("products");
    const [isShowPopups, setisShowPopups] = useState(false);
    const [selProduct, setSelProduct] = useState(null);
    // const [isShowUserProfile, setisShowUserProfile] = useState(false);
    // const [isShowSwitchUser, setisShowSwitchUser] = useState(false);
    // const [isShowEndSession, setisShowEndSession] = useState(false);

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
    const [isOutOfStock, setisOutOfStock] = useState(false);
    const [isShowCreateCustomer, setisShowCreateCustomer] = useState(false);
    const [variationProduct, setVariationProduct] = useState(null);
    const [isShowMobLeftNav, setisShowMobLeftNav] = useState(false);
    const [isSelectDiscountBtn, setisSelectDiscountBtn] = useState(false);
    const [isShowTaxList, setisShowTaxList] = useState(false);
    const [isShowMsg, setisShowMsg] = useState(false);
    const [msgTitle, setmsgTitle] = useState('');
    const [msgBody, setmsgBody] = useState('');
    const navigate = useNavigate()

    const dispatch = useDispatch();
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        var multiple_tax_support = localStorage.getItem("multiple_tax_support") ? JSON.parse(localStorage.getItem("multiple_tax_support")) : false
        var get_tax_rates = localStorage.getItem("TAXT_RATE_LIST") ? JSON.parse(localStorage.getItem("TAXT_RATE_LIST")) : [];
        getTax(multiple_tax_support, get_tax_rates);
    }, []);

    if (!localStorage.getItem('user')) {
        navigate('/pin')
    }

    const getFavourites = () => {
        var regId = localStorage.getItem('register');
        if (typeof regId != "undefined" && regId != null) {
            dispatch(tile({ "id": regId }));
        }
    }
    const updateVariationProduct = (item) => {
        //setSelProduct(item);
        setVariationProduct(item);
    }

    const fetchData = async () => { //calling multiple api
        dispatch(attribute());
        dispatch(category());
        dispatch(product());
        dispatch(userList());
        dispatch(getRates());
        dispatch(isMultipleTaxSupport());
        dispatch(getTaxRateList());

        getFavourites();
        var locationId = localStorage.getItem('Location')
        var user_ = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        if (user_ && user_.group_sales && user_.group_sales !== null && user_.group_sales !== "" && user_.group_sales !== "undefined") {
            dispatch(group({ "locationId": locationId, "group_sales": user_.group_sales_by }));
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
        var _item = await getByID(item.product_id ? item.product_id : item.WPID ? item.WPID : item.Product_Id);

        // setSelProduct(_item)
        var _product = getTaxAllProduct([_item])
        setSelProduct(_product[0]);
        setisShowPopups(true)
    }
    const openPopUp = async (item) => {
        updateVariationProduct(null);
        var _item = await getByID(item.product_id ? item.product_id : item.WPID ? item.WPID : item.Product_Id);
        var _product = getTaxAllProduct([_item])
        setSelProduct(_product[0]);
        setisShowPopups(true)
    }
    const closePopUp = () => {
        setisShowPopups(false);
    }
    // const toggleUserProfile = () => {
    //     setisShowUserProfile(!isShowUserProfile)
    // }
    // const toggleShowEndSession = () => {
    //     setisShowEndSession(!isShowEndSession)
    // }
    // const toggleSwitchUser = () => {
    //     setisShowSwitchUser(!isShowSwitchUser)
    // }
    const toggleOrderNote = () => {
        setisShowOrderNote(!isShowOrderNote)
    }
    const toggleCartDiscount = () => {
        setisShowCartDiscount(!isShowCartDiscount)
    }
    const toggleEditCartDiscount = () => {
        setisSelectDiscountBtn(true);
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
    const toggleOutOfStock = () => {
        setisOutOfStock(!isOutOfStock)
    }
    const toggleCreateCustomer = () => {
        setisShowCreateCustomer(!isShowCreateCustomer)
    }
    const toggleShowMobLeftNav = () => {
        setisShowMobLeftNav(!isShowMobLeftNav)
    }
    const toggleSelectDiscountBtn = () => {
        setisSelectDiscountBtn(!isSelectDiscountBtn)
    }
    const toggleMsgPopup = () => {
        setisShowMsg(!isShowMsg)
    }
    const toggleTaxList = () => {

        // var subscriptionClientDetail = localStorage.getItem('clientDetail') ? JSON.parse(localStorage.getItem('clientDetail')) : '';
        // if (subscriptionClientDetail && subscriptionClientDetail.subscription_detail && subscriptionClientDetail.subscription_detail.subscription_type !== "oliverpos-free") {
        setisShowTaxList(!isShowTaxList)
        // }
        // else {
        //     alert('This "Feature" is not included in your plan! ;In order to upgrade please go to the Oliver HUB')
        // }
    }
    const clearDeleteTileBtn = (e) => {
        if (!e.target.classList.contains("remove-state") && !e.target.classList.contains("remove-cover")) {
            const tile_remove_cover = document.querySelectorAll('.remove-cover');
            tile_remove_cover && tile_remove_cover.forEach(cvr => {
                cvr.classList.add('hide');
            });
            const tile_remove_state = document.querySelectorAll('.remove-state');
            tile_remove_state && tile_remove_state.forEach(st => {
                st.classList.remove('remove-state');
            });
        }
    }
    const getTax = (multiple_tax_support, get_tax_rates) => {
        if (multiple_tax_support && multiple_tax_support == true) {
            var taxList = localStorage.getItem('TAXT_RATE_LIST') ? JSON.parse(localStorage.getItem('TAXT_RATE_LIST')) : [];
            if ((typeof taxList !== 'undefined') && taxList !== null && taxList && taxList.length > 0) {
                var taxData = [];
                taxList && taxList.length > 0 && taxList.map(rate => {
                    taxData.push({
                        check_is: rate.check_is,
                        TaxRate: rate.TaxRate ? rate.TaxRate : '0%',
                        TaxName: rate.TaxName ? rate.TaxName : '',
                        TaxId: rate.TaxId ? rate.TaxId : '',
                        Country: rate.Country ? rate.Country : '',
                        State: rate.State ? rate.State : '',
                        TaxClass: rate.TaxClass ? rate.TaxClass : '',
                        Priority: rate.Priority ? rate.Priority : ''
                    })
                })
                localStorage.setItem('TAXT_RATE_LIST', JSON.stringify(taxData))
                // setTimeout(function () {
                //     //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
                //     if (typeof setHeightDesktop != "undefined") { setHeightDesktop() };
                // }, 500);
            } else {
                localStorage.setItem('DEFAULT_TAX_STATUS', 'true')
                var taxData = [];
                var inactiveTaxData = [];
                if (get_tax_rates && get_tax_rates.length > 0) {
                    get_tax_rates && get_tax_rates.length > 0 && get_tax_rates.map(rate => {
                        taxData.push({
                            check_is: true,
                            TaxRate: rate.TaxRate ? rate.TaxRate : '0%',
                            TaxName: rate.TaxName ? rate.TaxName : '',
                            TaxId: rate.TaxId ? rate.TaxId : '',
                            Country: rate.Country ? rate.Country : '',
                            State: rate.State ? rate.State : '',
                            TaxClass: rate.TaxClass ? rate.TaxClass : '',
                            Priority: rate.Priority ? rate.Priority : ''
                        })
                        inactiveTaxData.push({
                            check_is: false,
                            TaxRate: rate.TaxRate ? rate.TaxRate : '0%',
                            TaxName: rate.TaxName ? rate.TaxName : '',
                            TaxId: rate.TaxId ? rate.TaxId : '',
                            Country: rate.Country ? rate.Country : '',
                            State: rate.State ? rate.State : '',
                            TaxClass: rate.TaxClass ? rate.TaxClass : '',
                            Priority: rate.Priority ? rate.Priority : ''
                        })
                    })
                    localStorage.setItem('TAXT_RATE_LIST', JSON.stringify(inactiveTaxData))
                    if (!localStorage.getItem("SELECTED_TAX")) {
                        localStorage.setItem("SELECTED_TAX", JSON.stringify(inactiveTaxData));
                    }
                    //Update by Nagendra: Remove the tax which has same priority and lower rate, only for default tax..................................
                    taxData && taxData.length > 0 && taxData.map(rate => {
                        var duplicateArr = taxData.filter((ele, index) => ele.TaxClass == rate.TaxClass && ele.Priority == rate.Priority && ele.TaxClass == "");
                        if (duplicateArr && duplicateArr.length > 0) {
                            duplicateArr.map(dup => {
                                if (rate.TaxId < dup.TaxId) {
                                    taxData.splice(taxData.indexOf(dup), 1);
                                }
                            });

                            if (taxData && taxData.length > 0) {
                                var taxfilterData = taxData.filter((ele, index) => ele.TaxClass == "");
                                if (taxfilterData) {
                                    taxData = taxfilterData;
                                }
                            }

                            //..............................................................................
                        }
                    })
                    // taxData && taxData.length > 0 && taxData.map(rate => {
                    //     var duplicateArr = taxData.filter((ele, index) => ele.TaxId !== rate.TaxId && ele.Priority == rate.Priority && ele.TaxClass == "");
                    //     if (duplicateArr && duplicateArr.length > 0) {
                    //         duplicateArr && duplicateArr.length > 0 && duplicateArr.map(dup => {
                    //             if (parseFloat(rate.TaxRate.replace("%", '')) > parseFloat(dup.TaxRate.replace("%", ''))) {
                    //                 taxData.splice(taxData.indexOf(dup), 1);
                    //             }
                    //         });
                    //         //Apply only single default tax rate which have Priority One.
                    //         if (duplicateArr && duplicateArr.length == 1) {
                    //             taxData = duplicateArr;
                    //         }
                    //         else if (taxData && taxData.length > 1) {
                    //             var taxfilterData = taxData.filter((ele, index) => ele.Priority == 1 && ele.TaxClass == "");
                    //             if (taxfilterData) {
                    //                 taxData = taxfilterData;
                    //             }
                    //         }
                    //         //..............................................................................
                    //     }
                    // })
                    localStorage.setItem('APPLY_DEFAULT_TAX', JSON.stringify(taxData));
                }
            }
        } else if (!multiple_tax_support || multiple_tax_support == false) {
            var taxList = localStorage.getItem('TAXT_RATE_LIST') ? JSON.parse(localStorage.getItem('TAXT_RATE_LIST')) : [];
            if (taxList && taxList.length == 0) {
                localStorage.setItem('DEFAULT_TAX_STATUS', 'true');
                var taxData = [];
                if (get_tax_rates && get_tax_rates.length > 0) {
                    get_tax_rates && get_tax_rates.length > 0 && get_tax_rates.map(rate => {
                        taxData.push({
                            check_is: true,
                            TaxRate: rate.TaxRate ? rate.TaxRate : '0%',
                            TaxName: rate.TaxName ? rate.TaxName : '',
                            TaxId: rate.TaxId ? rate.TaxId : '',
                            Country: rate.Country ? rate.Country : '',
                            State: rate.State ? rate.State : '',
                            TaxClass: rate.TaxClass ? rate.TaxClass : '',
                            Priority: rate.Priority ? rate.Priority : ''
                        })
                    })
                    var taxRateListIs = []
                    taxRateListIs.push(taxData[0]);
                    localStorage.setItem('APPLY_DEFAULT_TAX', JSON.stringify(taxData))
                    if (typeof multiple_tax_support != "undefined") {
                        localStorage.setItem('TAXT_RATE_LIST', JSON.stringify(taxRateListIs))
                    }
                }
            }
        }
    }
    const addNote = (e) => {
        console.log("----order note-----" + e);
        toggleOrderNote()
    }


    // It is refreshing the tile list from server when a new tile is added
    const [resAddTile, resdeletTile] = useSelector((state) => [state.addTile, state.deletTile])
    useEffect(() => {
        if (resAddTile && resAddTile.status == STATUSES.IDLE && resAddTile.is_success) {
            getFavourites && getFavourites();
        }
        if (resdeletTile && resdeletTile.status == STATUSES.IDLE && resdeletTile.is_success) {
            getFavourites && getFavourites();
        }
    }, [resAddTile, resdeletTile]);

    const [resProduct, respupdateTaxRateList] = useSelector((state) => [state.product, state.updateTaxRateList])
    useEffect(() => {
        if (respupdateTaxRateList && respupdateTaxRateList.status == STATUSES.IDLE && respupdateTaxRateList.is_success) {
            getTax();
        }
    }, [respupdateTaxRateList]);

    const [respopupMessage] = useSelector((state) => [state.popupMessage])
    useEffect(() => {
        if (respopupMessage && respopupMessage.status == STATUSES.IDLE && respopupMessage.is_success && respopupMessage.data) {
            toggleMsgPopup(true);
            setmsgBody(respopupMessage.data.msg);
            setmsgTitle(respopupMessage.data.title);
            dispatch(popupMessage(null));
        }
    }, [respopupMessage]);


    useEffect(() => {
        if (resProduct && resProduct.status == STATUSES.IDLE && resProduct.is_success) {
            setListItem(resProduct.data);
            setisShowPopups(false);
            // console.log("---resProduct--" + JSON.stringify(resProduct.data));
        }
    }, [resProduct]);


    return (
        <React.Fragment>
            <Product variationProduct={variationProduct} updateVariationProduct={updateVariationProduct} openPopUp={openPopUp} closePopUp={closePopUp} selProduct={selProduct} isShowPopups={isShowPopups} toggleAppLauncher={toggleAppLauncher}></Product>
            <div onClick={(e) => clearDeleteTileBtn(e)} className={isShowPopups == true ? "homepage-wrapper hide" : "homepage-wrapper"} /*style={{ display: isShowPopups == false ? "grid" : "none" }}*/>
                {/* left nav bar */}
                {/* top header */}
                {/* prodct list/item list */}
                {/* cart list */}
                <LeftNavBar isShowMobLeftNav={isShowMobLeftNav} toggleLinkLauncher={toggleLinkLauncher} toggleAppLauncher={toggleAppLauncher} toggleiFrameWindow={toggleiFrameWindow} ></LeftNavBar>
                <HeadereBar isShow={isShowOptionPage} isShowLinkLauncher={isShowLinkLauncher} isShowAppLauncher={isShowAppLauncher}
                    toggleAdvancedSearch={toggleAdvancedSearch} toggleShowMobLeftNav={toggleShowMobLeftNav}
                    toggleCartDiscount={toggleCartDiscount} toggleNotifications={toggleNotifications} toggleOrderNote={toggleOrderNote} toggleAppLauncher={toggleAppLauncher} toggleLinkLauncher={toggleLinkLauncher} toggleiFrameWindow={toggleiFrameWindow} toggleOptionPage={toggleOptionPage}></HeadereBar>
                <AppLauncher isShow={isShowAppLauncher} toggleAppLauncher={toggleAppLauncher} toggleiFrameWindow={toggleiFrameWindow}></AppLauncher>
                <LinkLauncher isShow={isShowLinkLauncher} toggleLinkLauncher={toggleLinkLauncher} ></LinkLauncher>
                <IframeWindow isShow={isShowiFrameWindow} toggleiFrameWindow={toggleiFrameWindow}></IframeWindow>
                <TileList openPopUp={openPopUp} toggleAddTitle={toggleAddTitle} clearDeleteTileBtn={clearDeleteTileBtn}></TileList>
                <CartList listItem={listItem} editPopUp={editPopUp} toggleEditCartDiscount={toggleEditCartDiscount} toggleTaxList={toggleTaxList}></CartList>


                {/* top naviagtion bar */}
                {/* app launcher */}
                {/* link launcher */}
                {/* notifications */}
                {/* user info */}
                {/* <UserInfo isShow={isShowUserProfile} toggleSwitchUser={toggleSwitchUser} toggleUserProfile={toggleUserProfile} toggleShowEndSession={toggleShowEndSession}></UserInfo> */}
                {/* <AppLauncher></AppLauncher> */}
                {/* <LinkLauncher></LinkLauncher> */}
                <Notifications isShow={isShowNotifications} toggleNotifications={toggleNotifications}></Notifications>
                <div id="navCover" className="nav-cover"></div>
            </div>
            {/* <div className="subwindow-wrapper"> */}

            <TaxList isShow={isShowTaxList} toggleTaxList={toggleTaxList}></TaxList>
            <CartDiscount isShow={isShowCartDiscount} toggleSelectDiscountBtn={toggleSelectDiscountBtn} isSelectDiscountBtn={isSelectDiscountBtn} toggleCartDiscount={toggleCartDiscount}> </CartDiscount>
            <AddTile isShow={isShowAddTitle} toggleAddTitle={toggleAddTitle}></AddTile>
            <OrderNote isShow={isShowOrderNote} toggleOrderNote={toggleOrderNote} ></OrderNote>
            <MsgPopup_ProductNotFound></MsgPopup_ProductNotFound>
            <MsgPopup_UpgradeToUnlock></MsgPopup_UpgradeToUnlock>
            <AdvancedSearch toggleCreateCustomer={toggleCreateCustomer} openPopUp={openPopUp} closePopUp={closePopUp} isShow={isShowAdvancedSearch} toggleAdvancedSearch={toggleAdvancedSearch}></AdvancedSearch>
            <CreateCustomer isShow={isShowCreateCustomer} toggleCreateCustomer={toggleCreateCustomer} ></CreateCustomer>
            {/* <SwitchUser toggleSwitchUser={toggleSwitchUser} isShow={isShowSwitchUser}></SwitchUser>
            <EndSession toggleShowEndSession={toggleShowEndSession} isShow={isShowEndSession}></EndSession> */}
            <MsgPopup_OutOfStock isShow={isOutOfStock} toggleOutOfStock={toggleOutOfStock}></MsgPopup_OutOfStock>
            <MsgPopup isShow={isShowMsg} toggleMsgPopup={toggleMsgPopup} msgTitle={msgTitle} msgBody={msgBody}></MsgPopup>
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

            {/* <div className="subwindow tax-rate-small">
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
            </div> */}
            {/* </div> */}
        </React.Fragment>)
    // }

}
export default Home 