import React, { useEffect, useState, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import AddTile from "./tiles/AddTile";
import AdvancedSearch from "./AdvancedSearch";
import CartDiscount from "./CartDiscount";
import CreateCustomer from "./CreateCustomer";
import Notifications from "./Notifications";
import OrderNote from "../common/commonComponents/OrderNote";
import { getCountryList, getStateList } from "../customer/CustomerSlice";
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
import { discount } from "../common/commonAPIs/discountSlice";
import { getExtensions, getPaymentTypeName } from "../checkout/checkoutSlice";
import { getRates, isMultipleTaxSupport, getTaxRateList } from "../common/commonAPIs/taxSlice";
import { useIndexedDB } from 'react-indexed-db';
import STATUSES from "../../constants/apiStatus";
import { getTaxAllProduct } from "../common/TaxSetting";
import MsgPopupOutOfStock from "./product/MsgPopupOutOfStock";
import TaxList from "./TaxList";
import MsgPopup from "../common/commonComponents/MsgPopup";
import { popupMessage } from "../common/commonAPIs/messageSlice";
import { useNavigate } from "react-router-dom";
import CommonModuleJS from "../../settings/CommonModuleJS";
import LocalizedLanguage from "../../settings/LocalizedLanguage";
import { callProductXWindow, sendMessageToComposite, getCompositeAddedToCart, getCompositeSetProductxData } from "../../settings/CommonFunctionProductX";
import { getInventory } from "./slices/inventorySlice";
import { getDetails } from "../cashmanagement/CashmanagementSlice";
import { getCloudPrinters } from "../common/commonAPIs/cloudPrinterSlice"
// import ProductxWindow from "./product/ProductxWindow";
import Customercreate from "../customer/Customercreate";
import { cashRounding } from "../common/commonAPIs/cashRoundingSlice";
import { get_UDid } from "../common/localSettings";
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
    const [isShowProductxWindow, setisShowProductxWindow] = useState(false);

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
    const [searchSringCreate, setsearchSringCreate] = useState('')
    const [isShowMobLeftNav, setisShowMobLeftNav] = useState(false);
    const [isSelectDiscountBtn, setisSelectDiscountBtn] = useState(false);
    const [isShowTaxList, setisShowTaxList] = useState(false);
    const [isShowMsg, setisShowMsg] = useState(false);
    const [msgTitle, setmsgTitle] = useState('');
    const [msgBody, setmsgBody] = useState('');
    const [productxItem, setProductxItem] = useState('');
    const navigate = useNavigate()
    var Cash_Management_ID = localStorage.getItem('Cash_Management_ID')
    const dispatch = useDispatch();
    useEffect(() => {
        fetchData();
    }, []);

    const [resGetRates, respIsMultipleTaxSupport] = useSelector((state) => [state.getRates, state.isMultipleTaxSupport])
    useEffect(() => {
        if ((resGetRates && resGetRates.status == STATUSES.IDLE && resGetRates.is_success) && (respIsMultipleTaxSupport && respIsMultipleTaxSupport.status == STATUSES.IDLE && respIsMultipleTaxSupport.is_success)) {
            getTax(respIsMultipleTaxSupport.data.content, resGetRates.data.content);
        }
    }, [resGetRates, respIsMultipleTaxSupport]);
    // useEffect(() => {
    //     var multiple_tax_support = localStorage.getItem("multiple_tax_support") ? JSON.parse(localStorage.getItem("multiple_tax_support")) : false
    //     var get_tax_rates = localStorage.getItem("TAXT_RATE_LIST") ? JSON.parse(localStorage.getItem("TAXT_RATE_LIST")) : [];
    //     getTax(multiple_tax_support, get_tax_rates);
    // }, []);

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
        dispatch(discount());
        dispatch(getExtensions());
        dispatch(getPaymentTypeName());
        dispatch(cashRounding(get_UDid()));
        dispatch(getDetails(Cash_Management_ID));
        getFavourites();
        dispatch(getCountryList())
        dispatch(getStateList())
        var locationId = localStorage.getItem('Location');
        dispatch(getCloudPrinters(locationId));
        var user_ = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        if (user_ && user_.group_sales && user_.group_sales !== null && user_.group_sales !== "" && user_.group_sales !== "undefined") {
            dispatch(group({ "locationId": locationId, "group_sales": user_.group_sales_by }));
        }
    }
    // Set First time CashManagment Datain localStore

    const [cashDrawerAllDetails] = useSelector((state) => [state.cashmanagementgetdetail])
    useEffect(() => {
        if (cashDrawerAllDetails && cashDrawerAllDetails.statusgetdetail == STATUSES.IDLE && cashDrawerAllDetails.is_successgetdetail && cashDrawerAllDetails.getdetail) {
            localStorage.setItem("Cash_Management_Data", JSON.stringify(cashDrawerAllDetails.getdetail && cashDrawerAllDetails.getdetail.content));
        }
    }, [cashDrawerAllDetails]);

    // useEffect(() => {
    //     initFn();
    // });
    setTimeout(() => {
        initHomeFn();
    }, 1000);

    const compositeSwitchCases = (jsonMsg) => {
        console.log("compositeEvent", jsonMsg)
        var compositeEvent = jsonMsg && jsonMsg !== '' && jsonMsg.oliverpos && jsonMsg.oliverpos.event ? jsonMsg.oliverpos.event : '';
        if (compositeEvent && compositeEvent !== '') {
            //console.log("compositeEvent", compositeEvent)
            switch (compositeEvent) {
                case "extensionReady":
                    // this.setState({ incr: 1 })
                    sendMessageToComposite(jsonMsg);
                    break;
                //oliverAddedToCart
                case "oliverAddedToCart":
                    getCompositeAddedToCart(jsonMsg)
                    break;
                //oliverSetProductxData
                case "oliverSetProductxData":
                    var data = getCompositeSetProductxData(jsonMsg)
                    if (data && data.quantity /*&& this.state.incr == 1*/) // added to check data run only once
                    {
                        //this.setState({ incr: 2, productXQantity: data.quantity, strProductX: data.strProductX });
                        if (data.discount_type !== '' && data.discount_amount && data.discount_amount !== '0' && data.discount_amount !== 0) {
                            //this.setState({ isProductxDiscount: true })
                            //addProductXDiscount()
                        }
                        else {
                            // var _productX=jsonMsg && jsonMsg.data && jsonMsg.data.product && jsonMsg.data.product[0];
                            //var _prdXItem='';
                            // for (var k in _productX) {
                            //     _prdXItem=_productX[k];
                            // }

                            //addProductXtoCart(data.quantity, null, JSON.stringify(data.strProductX));

                            //this.addProductXtoCart(data.quantity);
                        }
                    }
                    // if (typeof Android !== "undefined" && Android !== null && Android.getDatafromDevice("isWrapper") == true) {
                    //     Android.removeAddOnPopup();
                    //     console.log("close popup from shopview.js")
                    // }

                    break;
                // extensionFinished
                case "extensionFinished":
                    //getCompositeExtensionFinished(jsonMsg)
                    break;
                default:
                    break;
            }
        }
    }

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
    // const editPopUp = async (item) => {
    //     var _item = await getByID(item.product_id ? item.product_id : item.WPID ? item.WPID : item.Product_Id);

    //     // setSelProduct(_item)
    //     var _product = getTaxAllProduct([_item])
    //     setSelProduct(_product[0]);
    //     setisShowPopups(true)
    // }
    // useEffect(() => {
    //     ToggleiFrameWindow();
    // }, [productxLink]);

    var windowCloseEv = null;
    const openPopUp = async (item, index = null) => {

        let type = item.Type;

        var taglist = item.Tags ? item.Tags !== "" ? item.Tags.split(",") : null : null;
        if (taglist && (taglist !== null && taglist.includes('oliver_produt_x') == true) &&
            (CommonModuleJS.showProductxModal() !== null && CommonModuleJS.showProductxModal()
                == true) && item !== null && item.ParamLink !== "" && item.ParamLink
            !== "False" && item.ParamLink !== null) {
            console.log("product x with tag--" + item.ParamLink)
            setProductxItem(item);
            //ToggleiFrameWindow();
            //this.props.showPopuponcartlistView(item, document.getElementById("qualityUpdater") ? document.getElementById("qualityUpdater").value : this.props.variationDefaultQunatity);
        }
        else
            if ((type !== "simple" && type !== "variable" && type !== "variation") && (CommonModuleJS.showProductxModal() !== null && CommonModuleJS.showProductxModal() == false)) {
                //alert(LocalizedLanguage.productxOutOfStock);
                var data = { title: "", msg: LocalizedLanguage.productxOutOfStock, is_success: true }
                dispatch(popupMessage(data));
            }
            else
                if ((type !== "simple" && type !== "variable" && type !== "variation") && item !== null && item.ParamLink !== "" && item.ParamLink !== "False" && item.ParamLink !== null && typeof item.ParamLink !== "undefined") {
                    console.log("product x---" + item.ParamLink)
                    setProductxItem(item);
                    ToggleProductxWindow();
                    windowCloseEv = callProductXWindow(item);
                    window.addEventListener('message', function (e) {
                        var data = e && e.data;
                        if (typeof data == 'string' && data !== "") {
                            console.log('-- -- -- --' + data);
                            //compositeSwitchCases(JSON.parse(data))
                        }
                    })
                    //+"?wopen='childwindow"
                    // setProductxItem(item);

                    // ToggleiFrameWindow();
                    //this.props.showPopuponcartlistView(product, document.getElementById("qualityUpdater") ? document.getElementById("qualityUpdater").value : this.props.variationDefaultQunatity);
                }
                else {
                    // var vp_id=0;
                    // if(variationProduct)
                    // {
                    //      vp_id=variationProduct.WPID;
                    // }
                    // console.log("vp_id--"+vp_id)

                    updateVariationProduct(null);
                    var _item = await getByID(item.product_id ? item.product_id : item.WPID ? item.WPID : item.Product_Id);
                    var _product = getTaxAllProduct([_item])
                    _product[0]["quantity"] = item.quantity;
                    if (item.hasOwnProperty("selectedOptions")) {
                        _product[0]["selectedOptions"] = item.selectedOptions;

                    }
                    if (index != null) {
                        _product[0]["selectedIndex"] = index;
                    }
                    if (item) {
                        _product[0]['after_discount'] = item.after_discount ? item.after_discount : 0;
                        _product[0]['discount_amount'] = item.discount_amount ? item.discount_amount : 0;
                        _product[0]['product_after_discount'] = item.product_after_discount ? item.product_after_discount : 0;
                        _product[0]['product_discount_amount'] = item.product_discount_amount ? item.product_discount_amount : 0;
                        _product[0]['discount_type'] = item.discount_type ? item.discount_type : "";
                        _product[0]['new_product_discount_amount'] = item.new_product_discount_amount ? item.new_product_discount_amount : 0;
                        _product[0]['cart_after_discount'] = item.cart_after_discount ? item.cart_after_discount : 0;
                        _product[0]['cart_discount_amount'] = item.cart_discount_amount ? item.cart_discount_amount : 0;
                    }
                    setSelProduct(_product[0]);
                    setisShowPopups(true);

                    if (item.hasOwnProperty("SelVariationId")) //edit variation product
                    {
                        dispatch(getInventory(item.SelVariationId));
                    }
                    else if (item.hasOwnProperty("WPID")) {
                        dispatch(getInventory(item.WPID)); // To fetch latest inventory
                    }
                    else if (item.hasOwnProperty("Product_Id")) {
                        dispatch(getInventory(item.Product_Id));
                    }
                    else if (item.hasOwnProperty("product_id")) // get inventory for simple product
                    {
                        dispatch(getInventory(item.product_id));
                    }

                }
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
        setisShowOptionPage(false)
        setisShowOrderNote(!isShowOrderNote)
    }
    const toggleCartDiscount = () => {
        // if (CommonModuleJS.permissionsForDiscount() == false) {
        //     alert(LocalizedLanguage.discountPermissionerror);
        // }
        // else
        // {
        setisShowOptionPage(false)
        setisShowCartDiscount(!isShowCartDiscount)
        //}

    }
    const toggleEditCartDiscount = () => {
        setisShowOptionPage(false)
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

    const ToggleiFrameWindow = () => {
        setisShowiFrameWindow(!isShowiFrameWindow)
    }
    const ToggleProductxWindow = () => {
        setisShowProductxWindow(!isShowProductxWindow)
    }
    const toggleOptionPage = () => {
        setisShowOptionPage(!isShowOptionPage)
    }
    const toggleOutOfStock = () => {
        setisOutOfStock(!isOutOfStock)
    }
    const toggleCreateCustomer = (serachString) => {
        setisShowCreateCustomer(!isShowCreateCustomer)
        //console.log("serachString",serachString)
        setsearchSringCreate(serachString)
    }
    const parentEmail = (data) => {
        setsearchSringCreate(data)
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
                localStorage.setItem('TAXT_RATE_LIST', JSON.stringify(taxData));
                if (!localStorage.getItem('DEFAULT_TAX_STATUS')) {
                    localStorage.setItem('DEFAULT_TAX_STATUS', 'true');
                }
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
        if (!localStorage.getItem('APPLY_DEFAULT_TAX') && localStorage.getItem('DEFAULT_TAX_STATUS') && localStorage.getItem('DEFAULT_TAX_STATUS') === 'true') {
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


    const [resCountryList] = useSelector((state) => [state.CountryList])
    useEffect(() => {
        if (resCountryList && resCountryList.status == STATUSES.IDLE && resCountryList.is_success && resCountryList.data) {
            localStorage.setItem('countrylist', JSON.stringify(resCountryList.data.content))
        }
    }, [resCountryList]);

    const [resStateList] = useSelector((state) => [state.StateList])
    useEffect(() => {
        if (resStateList && resStateList.status == STATUSES.IDLE && resStateList.is_success && resStateList.data) {
            localStorage.setItem('statelist', JSON.stringify(resStateList.data.content))
        }
    }, [resStateList]);



    return (
        <React.Fragment>
            {isShowPopups === true ?
                <Product variationProduct={variationProduct} updateVariationProduct={updateVariationProduct} openPopUp={openPopUp} closePopUp={closePopUp} selProduct={selProduct} isShowPopups={isShowPopups} toggleAppLauncher={toggleAppLauncher}></Product> : null}
            <div onClick={(e) => clearDeleteTileBtn(e)} className={isShowPopups == true ? "homepage-wrapper hide" : "homepage-wrapper"} /*style={{ display: isShowPopups == false ? "grid" : "none" }}*/>
                {/* left nav bar */}
                {/* top header */}
                {/* prodct list/item list */}
                {/* cart list */}
                <LeftNavBar isShowMobLeftNav={isShowMobLeftNav} toggleLinkLauncher={toggleLinkLauncher} toggleAppLauncher={toggleAppLauncher} ToggleiFrameWindow={ToggleiFrameWindow} ></LeftNavBar>
                <HeadereBar isShow={isShowOptionPage} isShowLinkLauncher={isShowLinkLauncher} isShowAppLauncher={isShowAppLauncher}
                    toggleAdvancedSearch={toggleAdvancedSearch} toggleShowMobLeftNav={toggleShowMobLeftNav}
                    toggleCartDiscount={toggleCartDiscount} toggleNotifications={toggleNotifications} toggleOrderNote={toggleOrderNote} toggleAppLauncher={toggleAppLauncher} toggleLinkLauncher={toggleLinkLauncher} ToggleiFrameWindow={ToggleiFrameWindow} toggleOptionPage={toggleOptionPage}></HeadereBar>
                {isShowAppLauncher === true ? <AppLauncher isShow={isShowAppLauncher} toggleAppLauncher={toggleAppLauncher} ToggleiFrameWindow={ToggleiFrameWindow}></AppLauncher> : null}
                {isShowLinkLauncher === true ? <LinkLauncher isShow={isShowLinkLauncher} toggleLinkLauncher={toggleLinkLauncher} ></LinkLauncher> : null}
                {isShowiFrameWindow === true ? <IframeWindow isShow={isShowiFrameWindow} ToggleiFrameWindow={ToggleiFrameWindow}></IframeWindow> : null}
                {/* {isShowProductxWindow===true ? <ProductxWindow product={productxItem} isShow={isShowProductxWindow} ToggleProductxWindow={ToggleProductxWindow}></ProductxWindow> : null} */}
                <TileList openPopUp={openPopUp} toggleAddTitle={toggleAddTitle} clearDeleteTileBtn={clearDeleteTileBtn} toggleOutOfStock={toggleOutOfStock}></TileList>
                <CartList updateVariationProduct={updateVariationProduct} openPopUp={openPopUp} selProduct={selProduct} variationProduct={variationProduct} listItem={listItem} /*editPopUp={editPopUp}*/ toggleEditCartDiscount={toggleEditCartDiscount} toggleTaxList={toggleTaxList}></CartList>


                {/* top naviagtion bar */}
                {/* app launcher */}
                {/* link launcher */}
                {/* notifications */}
                {/* user info */}
                {/* <UserInfo isShow={isShowUserProfile} toggleSwitchUser={toggleSwitchUser} toggleUserProfile={toggleUserProfile} toggleShowEndSession={toggleShowEndSession}></UserInfo> */}
                {/* <AppLauncher></AppLauncher> */}
                {/* <LinkLauncher></LinkLauncher> */}
                {isShowNotifications === true ? <Notifications isShow={isShowNotifications} toggleNotifications={toggleNotifications}></Notifications> : null}
                <div id="navCover" className="nav-cover"></div>
            </div>
            {/* <div className="subwindow-wrapper"> */}

            {isShowTaxList === true ? <TaxList isShow={isShowTaxList} toggleTaxList={toggleTaxList}></TaxList> : null}
            <CartDiscount isShow={isShowCartDiscount} toggleSelectDiscountBtn={toggleSelectDiscountBtn} isSelectDiscountBtn={isSelectDiscountBtn} toggleCartDiscount={toggleCartDiscount}> </CartDiscount>
            {isShowAddTitle === true ? <AddTile isShow={isShowAddTitle} toggleAddTitle={toggleAddTitle}></AddTile> : null}
            <OrderNote isShow={isShowOrderNote} toggleOrderNote={toggleOrderNote} ></OrderNote>
            <MsgPopup_ProductNotFound></MsgPopup_ProductNotFound>
            <MsgPopup_UpgradeToUnlock></MsgPopup_UpgradeToUnlock>
            {isShowAdvancedSearch === true ? <AdvancedSearch isShow={isShowAdvancedSearch} toggleCreateCustomer={toggleCreateCustomer} openPopUp={openPopUp} closePopUp={closePopUp} toggleAdvancedSearch={toggleAdvancedSearch} toggleOutOfStock={toggleOutOfStock}></AdvancedSearch> : null}
            {/* <CreateCustomer searchSringCreate={searchSringCreate} childEmail={parentEmail} isShow={isShowCreateCustomer} toggleCreateCustomer={toggleCreateCustomer} ></CreateCustomer> */}
            <Customercreate searchSringCreate={searchSringCreate} childEmail={parentEmail} isShow={isShowCreateCustomer} toggleCreateCustomer={toggleCreateCustomer} />
            {/* <SwitchUser toggleSwitchUser={toggleSwitchUser} isShow={isShowSwitchUser}></SwitchUser>
            <EndSession toggleShowEndSession={toggleShowEndSession} isShow={isShowEndSession}></EndSession> */}
            <MsgPopupOutOfStock isShow={isOutOfStock} toggleOutOfStock={toggleOutOfStock}></MsgPopupOutOfStock>
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