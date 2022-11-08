import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import LeftNavBar from "../../common/commonComponents/LeftNavBar";
import X_Icon_DarkBlue from '../../../assets/images/svg/X-Icon-DarkBlue.svg';
import Oliver_Icon_BaseBlue from '../../../assets/images/svg/Oliver-Icon-BaseBlue.svg';
import Coin_Blue from '../../../assets/images/svg/Coin-Blue.svg';
import Minus_Blue from '../../../assets/images/svg/Minus-Blue.svg';
import Plus_Blue from '../../../assets/images/svg/Plus-Blue.svg';
import CircledPlus_White from '../../../assets/images/svg/CircledPlus-White.svg';
import NoVariationDisplay from '../../../assets/images/svg/NoVariationDisplay.svg';
import NoImageAvailable from '../../../assets/images/svg/NoImageAvailable.svg';
import Product_OutOfStock from '../../../assets/images/svg/ProductOutOfStock.svg';
import Checkout_Minus from '../../../assets/images/svg/Checkout-Minus.svg';
import Checkout_Plus from '../../../assets/images/svg/Checkout-Plus.svg';

import Pencil from '../../../assets/images/svg/Pencil.svg';
import RefreshGrey from '../../../assets/images/svg/RefreshGrey.svg';
// import Shoes from '../../../assets/images/Temp/Shoes.png';
// import CoffeeCup from '../../../assets/images/Temp/CoffeeCup.png';
// import SnapbackHat from '../../../assets/images/Temp/SnapbackHat.png';
// import Face_Mask from '../../../assets/images/Temp/Face Mask.png';
import Checkmark from '../../../assets/images/svg/Checkmark.svg';
import LockedIcon from '../../../assets/images/svg/LockedIcon.svg';
import Hanged_Tshirt from '../../../assets/images/Temp/Hanged-Tshirt.png';
import { useIndexedDB } from 'react-indexed-db';
import FormateDateAndTime from '../../../settings/FormateDateAndTime';
import Config from '../../../Config'
import { initProuctFn } from '../../common/commonFunctions/productFn';
import ProductNote from "./ProductNote";
import ProductDiscount from "./ProductDiscount";
import AdjustInventory from "./AdjustInventory";
import NoVariationSelected from "./NoVariationSelected";
import MsgPopup_OutOfStock from "./MsgPopup_OutOfStock";
import { addSimpleProducttoCart, updateProductNote, addtoCartProduct } from './productLogic';
import { getTaxAllProduct, getSettingCase, cartPriceWithTax } from "../../common/TaxSetting";

import { product } from "./productSlice";
import CommonModuleJS from "../../../settings/CommonModuleJS";
import LocalizedLanguage from "../../../settings/LocalizedLanguage";
import { popupMessage } from "../../common/commonAPIs/messageSlice";
import { getInventory } from "../slices/inventorySlice";
import { NumericFormat } from 'react-number-format';
import { RoundAmount } from "../../common/TaxSetting";
const Product = (props) => {
    const dispatch = useDispatch();
    const { add, update, getByID, getAll, deleteRecord } = useIndexedDB("modifiers");
    const { getByID: getProductByID, getAll: getAllProducts } = useIndexedDB("products");
    const [modifierList, setModifierList] = useState([])
    const [selectedModifiers, setSelectedModifiers] = useState([])
    const [productModifiers, setProductModifiers] = useState([])
    const [saveSelectedModifiers, setSaveSelectedModifiers] = useState([])
    const [recommProducts, setRecommProducts] = useState([])

    const [isProductNote, setisProductNote] = useState(false);
    const [isProductDiscount, setisProductDiscount] = useState(false);
    const [isAdjustInventory, setisAdjustInventory] = useState(false);
    const [isNoVariationSelected, setisNoVariationSelected] = useState(false);
    const [isOutOfStock, setisOutOfStock] = useState(false);
    const [productQty, setProductQty] = useState(1);
    const [note, setNote] = useState("");
    const [selVariations, setSelVariations] = useState([]);
    const [selOptions, setSelOptions] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedVariationProduct, setSelectedVariationProduct] = useState(null)

    const [variationStockQunatity, setVariationStockQunatity] = useState(0)
    const [customFeeModifiers, setCustomFeeModifiers] = useState([]);
    const [discounts, setDiscounts] = useState(null);
    const [disableAttribute, setDisableAttribute] = useState([]);
    const [availableAttribute, setAvailableAttribute] = useState([]);

    const [respAttribute] = useSelector((state) => [state.attribute]);
    const [stockStatusInOut, setStockStatusInOut] = useState('In Stock');
    const [isRefereshIconInventory, setisRefereshIconInventory] = useState(false);
    var allVariations = [];
    // useIndexedDB("modifiers").getAll().then((rows) => {
    //     setModifierList(rows);
    // });
    const [inventoryStatus] = useSelector((state) => [state.inventories])

    // useEffect(() => {
    //     var _product = props.variationProduct != null ? props.variationProduct : props.selProduct;
    //     setVariationStockQunatity(_product ? ((_product.ManagingStock == true && _product.StockStatus == "outofstock") ? "outofstock" :
    //         (_product.StockStatus == null || _product.StockStatus == 'instock') && _product.ManagingStock == false ? "Unlimited" : (typeof _product.StockQuantity != 'undefined') && _product.StockQuantity != '' ? _product.StockQuantity : '0'
    //     ) : 0)
    // }, [props.variationProduct]);
    var itemQauntity = 0;
    const fatchUpdateInventory = async () => {
        var _product = props.variationProduct != null ? props.variationProduct : props.selProduct;
        // getByID(_product.WPID).then((prodcut) => {
        //     itemQauntity = prodcut && prodcut.StockQuantity
        //     console.log("itemQauntity", itemQauntity)
        //     variationStockQunatity = itemQauntity;
        // });

        // var prodcut = await getProductByID(_product.WPID).then((row) => {
        //     return row;
        // });
        // if (prodcut) {
        //     itemQauntity = prodcut && prodcut.StockQuantity
        //     console.log("itemQauntity", itemQauntity)
        //     setVariationStockQunatity(itemQauntity);
        // }
    }

    var currentWareHouseDetail = "";
    useEffect(() => {

        var warehouseDetail = inventoryStatus && inventoryStatus.inventoryGet && inventoryStatus.inventoryGet.data && inventoryStatus.inventoryGet.data.content
        var CurrentWarehouseId = localStorage.getItem("WarehouseId");

        if (warehouseDetail && warehouseDetail.length > 0) {
            currentWareHouseDetail = warehouseDetail.find(item => item.warehouseId == CurrentWarehouseId)
        }
        if (currentWareHouseDetail && currentWareHouseDetail.hasOwnProperty("Quantity")) {

            var _product = props.variationProduct != null ? props.variationProduct : props.selProduct;
            var _stockStatus = _product ? ((_product.ManagingStock == true && _product.StockStatus == "outofstock") ? LocalizedLanguage.outOfStock :
                (_product.StockStatus == null || _product.StockStatus == 'instock') && _product.ManagingStock == false ? LocalizedLanguage.unlimited : (typeof _product.StockQuantity != 'undefined') && currentWareHouseDetail.Quantity != '' ? currentWareHouseDetail.Quantity : 0
            ) : 0;
            if (typeof _stockStatus === "string") {
                setStockStatusInOut(_stockStatus);
            }
            else {
                setStockStatusInOut("In Stock");
            }

            setVariationStockQunatity(currentWareHouseDetail.Quantity)
            if (currentWareHouseDetail.Quantity == 0) {
                setProductQty(0);
            }
            else {
                if (productQty == 0) { setProductQty(1); }
            }
            setisRefereshIconInventory(false);
            // console.log("product Qty", currentWareHouseDetail.Quantity)
            //console.log("sel _stockStatus--", _stockStatus)
        }
    }, [inventoryStatus])
    const toggleProductNote = () => {
        setisProductNote(!isProductNote)
    }
    const toggleProductDiscount = () => {
        if (CommonModuleJS.permissionsForDiscount() == false) {

            var data = { title: "", msg: LocalizedLanguage.discountPermissionerror, is_success: true }
            dispatch(popupMessage(data));
            //alert(LocalizedLanguage.discountPermissionerror);
        }
        else {
            setisProductDiscount(!isProductDiscount)
        }
    }

    const toggleAdjustInventory = (istoggle) => {
        console.log("istoggle", istoggle)
        console.log("isAdjustInventory", isAdjustInventory)
        setisAdjustInventory(istoggle == null || istoggle == "undefined" ? !isAdjustInventory : istoggle)
    }

    const toggleNoVariationSelected = () => {
        setisNoVariationSelected(!isNoVariationSelected)
    }
    const toggleOutOfStock = () => {
        setisOutOfStock(!isOutOfStock)
    }

    const quantityUpdate = (type) => {
        const { selProduct } = props;
        if (selProduct) {
            if (type === "plus") {
                var qty = parseInt(productQty);
                //if (this.state.variationfound ? selProduct.WPID == this.state.variationfound.WPID : selProduct.WPID == this.props.getVariationProductData.WPID) {
                var maxQty = (selProduct.ManagingStock == false && selProduct.StockStatus == "outofstock") ? "outofstock" :
                    (selProduct.StockStatus == null || selProduct.StockStatus == 'instock') && selProduct.ManagingStock == false ? "Unlimited" : (typeof selProduct.StockQuantity != 'undefined') && selProduct.StockQuantity != '' ? parseFloat(selProduct.StockQuantity) : 0;
                // var maxQty = this.state.variationStockQunatity == 'Unlimited' ? 'Unlimited' : parseFloat(this.state.variationStockQunatity) + parseFloat(showSelectedProduct.quantity);
                if (maxQty == 'Unlimited' || qty < maxQty) {
                    qty++;
                }
                setProductQty(qty)
            }
            else if (type === "minus") {
                var qty = parseInt(productQty);
                if (qty > 1) {
                    qty--;
                    setProductQty(qty);
                };

            }

            //} else {
            //     var maxQty = $("#txtInScock").text();
            //     if (maxQty == 'Unlimited' || qty < maxQty) {
            //         qty++;
            //     }
            //     if (qty > this.state.variationStockQunatity)
            //         qty = this.state.variationStockQunatity;

            //         this.setDefaultQuantity(qty);
            // }
        }
        // else {
        //     var maxQty = $("#txtInScock").text();
        //     if (maxQty == 'Unlimited' || this.state.variationDefaultQunatity >= 0) {
        //         var product = this.state.getVariationProductData
        //         var qty = parseInt(this.state.variationDefaultQunatity);
        //         // if ((product.StockStatus == null || product.StockStatus == 'instock')
        //         //     && (product.ManagingStock == false || (product.ManagingStock == true && qty < this.state.variationStockQunatity))) {
        //         //     qty++;
        //         // }
        //         if (maxQty == 'Unlimited' || qty < maxQty) {
        //             qty++;
        //         }
        //         if (qty > this.state.variationStockQunatity)
        //             qty = this.state.variationStockQunatity;
        //         this.setDefaultQuantity(qty);

        //     }
    }

    // Modifers --start

    const isActive = (modifierSchedulings) => {
        var schedul = modifierSchedulings;
        var isActive = false;
        if (schedul != null) {
            if (!schedul.AllowScheduling)
                isActive = true;
            else {
                //var today = SystemTime != null ? SystemTime : DateTime.Today.ToLocalTime();
                var today = new Date();
                if (schedul.SelectDateRange) {
                    //if (today.Date >= schedul.FromDate.Date && today.Date <= schedul.ToDate.Date)
                    if (new Date(today.toDateString()) >= new Date(schedul.FromDate) && new Date(today.toDateString()) <= new Date(schedul.ToDate))
                        isActive = checkActiveTime(today, schedul);
                    else
                        isActive = false;
                }
                else
                    isActive = checkActiveTime(today, schedul);
            }
        }
        return isActive;

    }
    const checkActiveTime = (today, schedul) => {
        //var todayTime = today.TimeOfDay;
        var todayTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var _to = 0;
        var _from = 0;
        switch (today.getDay()) {
            case 1:
                if (schedul.MondayActive && schedul.MondayActive == true) {
                    _to = FormateDateAndTime.timeCompare(todayTime, schedul.MondayFrom);
                    _from = FormateDateAndTime.timeCompare(schedul.MondayTo, todayTime);
                    if ((_to == 1 || _to == 0) && (_from == 1 || _from == 0)) { return true; }
                    else { return false; }
                }
                // if (schedul.MondayActive && todayTime >= schedul.MondayFrom && todayTime <= schedul.MondayTo)
                //     return true;
                break;
            case 2:
                if (schedul.TuesdayActive && schedul.TuesdayActive == true) {
                    _to = FormateDateAndTime.timeCompare(todayTime, schedul.TuesdayFrom);
                    _from = FormateDateAndTime.timeCompare(schedul.TuesdayTo, todayTime);
                    if ((_to == 1 || _to == 0) && (_from == 1 || _from == 0)) { return true; }
                    else { return false; }
                }
                // if (schedul.TuesdayActive && todayTime >= schedul.TuesdayFrom && todayTime <= schedul.TuesdayTo)
                //     return true;
                break;
            case 3:
                if (schedul.WednesdayActive && schedul.WednesdayActive == true) {
                    _to = FormateDateAndTime.timeCompare(todayTime, schedul.WednesdayFrom);
                    _from = FormateDateAndTime.timeCompare(schedul.WednesdayTo, todayTime);
                    if ((_to == 1 || _to == 0) && (_from == 1 || _from == 0)) { return true; }
                    else { return false; }
                }
                // if (schedul.WednesdayActive && todayTime >= schedul.WednesdayFrom && todayTime <= schedul.WednesdayTo)
                //     return true;
                break;
            case 4:
                if (schedul.ThursdayActive && schedul.ThursdayActive == true) {
                    _to = FormateDateAndTime.timeCompare(todayTime, schedul.ThursdayFrom);
                    _from = FormateDateAndTime.timeCompare(schedul.ThursdayTo, todayTime);
                    if ((_to == 1 || _to == 0) && (_from == 1 || _from == 0)) { return true; }
                    else { return false; }
                }
                // if (schedul.ThursdayActive && todayTime >= schedul.ThursdayFrom && todayTime <= schedul.ThursdayTo)
                //     return true;
                break;
            case 5:
                if (schedul.FridayActive && schedul.FridayActive == true) {
                    _to = FormateDateAndTime.timeCompare(todayTime, schedul.FridayFrom);
                    _from = FormateDateAndTime.timeCompare(schedul.FridayTo, todayTime);
                    if ((_to == 1 || _to == 0) && (_from == 1 || _from == 0)) { return true; }
                    else { return false; }
                }
                // if (schedul.FridayActive && todayTime >= schedul.FridayFrom && todayTime <= schedul.FridayTo)
                //     return true;
                break;
            case 6:
                if (schedul.SaturdayActive && schedul.SaturdayActive == true) {
                    _to = FormateDateAndTime.timeCompare(todayTime, schedul.SaturdayFrom);
                    _from = FormateDateAndTime.timeCompare(schedul.FridayTo, schedul.SaturdayTo);
                    if ((_to == 1 || _to == 0) && (_from == 1 || _from == 0)) { return true; }
                    else { return false; }
                }
                // if (schedul.SaturdayActive && todayTime >= schedul.SaturdayFrom && todayTime <= schedul.SaturdayTo)
                //     return true;
                break;
            case 0:
                if (schedul.SundayActive && schedul.SundayActive == true) {
                    _to = FormateDateAndTime.timeCompare(todayTime, schedul.SundayFrom);
                    _from = FormateDateAndTime.timeCompare(schedul.FridayTo, schedul.SundayTo);
                    if ((_to == 1 || _to == 0) && (_from == 1 || _from == 0)) { return true; }
                    else { return false; }
                }
                // if (schedul.SundayActive && todayTime >= schedul.SundayFrom && todayTime <= schedul.SundayTo)
                //     return true;
                break;
            default:
                return false;
                break;
        }
        return false;
    }
    const getModifiers = () => {
        getAll().then((rows) => {
            setModifierList(rows);
            var _modifierList = rows;
            // showOverlay();
            // showModal("modifiers");
            //console.log("---ModifierList--"+JSON.stringify(  this.props.getVariationProductData) )
            var product = props.selProduct;
            if (product == null || typeof product == "undefined")
                return;

            // console.log("---ModifierList--"+JSON.stringify(val) )
            //this.setState({ Modifiers: val });
            var d = _modifierList && _modifierList.filter(match => match.Visible == true && match.modifierAssingnees.find(m =>

                (m.AssigneeId == product.WPID && m.AssigneeType == Config.key_AssigneeType.Product) ||
                (product.CategorieList && product.CategorieList.find(x => x.toLowerCase() == m.AssigneeName.toLowerCase()) && m.AssigneeType == Config.key_AssigneeType.Category) ||
                (product.ProductAttributes && product.ProductAttributes.find(x => x.Name.toLowerCase() == m.AssigneeName.toLowerCase()) && m.AssigneeType == Config.key_AssigneeType.Attribute) ||
                (product.CategorieList && product.CategorieList.find(x => x.toLowerCase() == m.AssigneeName.toLowerCase()) && m.AssigneeType == Config.key_AssigneeType.SubCategory) ||
                (product.ProductAttributes && product.ProductAttributes.find(x => x.Name.toLowerCase() == m.AssigneeName.toLowerCase()) && m.AssigneeType == Config.key_AssigneeType.SubAttribute)

            ))
                .map((match) =>
                // console.log("---ModifierList match--"+JSON.stringify(match) )
                { return match }
                )

            var all_modifiers = [];
            var modifiers = [];
            if (d && d.length > 0) {
                d.map(m => {
                    let result = (m.modifierSchedulings && m.modifierSchedulings.length > 0) ? isActive(m.modifierSchedulings[0]) : true;
                    if (result && result == true) {
                        all_modifiers.push(m);
                        modifiers.push({ modifier_id: m.Title.replace(/ /g, "_"), title: m.Title, type: m.Type, is_active: false, TaxOption: m.TaxOption, data: [] })
                    }
                });
            }
            if (selectedModifiers && selectedModifiers.length > 0) {
                setProductModifiers(all_modifiers);
                // this.setState({ ProductModifiers: all_modifiers });
            }
            else {
                setProductModifiers(all_modifiers);
                setSelectedModifiers(modifiers);
            }
            //this.setState({ ProductModifiers: all_modifiers, SelectedModifiers: modifiers });

            // console.log("---ModifierList d--"+JSON.stringify(d) )
            //console.log("---ModifierList modifiers--" + JSON.stringify(modifiers))
        });
        // showOverlay();
        // showModal("modifiers");

    }
    // editModifiersSelections()
    // {
    //     selectedModifiers && selectedModifiers.map(mod =>{
    //         switch (mod.type) {
    //             case Config.key_InputTypes.CheckBox:
    //                 return(
    //                     mod.data && mod.data.map(mf=>{
    //                         if(document.getElementById(mf.id)) { document.getElementById(mf.id).checked=true};
    //                     })
    //                 )
    //                 break;
    //             case Config.key_InputTypes.NumberField:
    //                 return(
    //                     mod.data && mod.data.map(mf=>{
    //                         if(document.getElementById(mf.id+"-quantityUpdater")) { document.getElementById(mf.id).value=mf.qty};
    //                         if(document.getElementById(mf.id+"-amount")) { document.getElementById(mf.id).value=mf.amount};
    //                     })
    //                 )
    //                 break;
    //             case Config.key_InputTypes.RadioButton:
    //                 return(
    //                     mod.data && mod.data.map(mf=>{
    //                         if(document.getElementById(mf.id)) { document.getElementById(mf.id).checked=true};
    //                     })
    //                 )
    //                 break;
    //             case Config.key_InputTypes.TextField:
    //                 return(
    //                     mod.data && mod.data.map(mf=>{
    //                         if(document.getElementById(mf.id+"-txt")) { document.getElementById(mf.id).value=mf.sub_title};
    //                         if(document.getElementById(mf.id+"-amount")) { document.getElementById(mf.id).value=mf.amount};
    //                     })
    //                 )
    //                 break;
    //             default:
    //                 break;
    //         }
    //     })
    // }
    const qunatityChange = (event) => {
        if (event.currentTarget.getAttribute("data-parent-id")) {
            var id = event.currentTarget.getAttribute("data-parent-id");
            var gpid = event.currentTarget.getAttribute("data-gpid");
            var btnType = event.currentTarget.getAttribute("data-btn-type")
            var inputField = document.getElementById(id + "-quantityUpdater")
            if (btnType == "plus") {
                if (inputField.getAttribute("data-max-number") && parseInt(inputField.value) < parseInt(inputField.getAttribute("data-max-number"))) {
                    inputField.value = parseInt(inputField.value) + 1
                }
            }
            else {
                if (parseInt(inputField.value) > 1) {
                    inputField.value = parseInt(inputField.value) - 1
                }
            }

            var amount = inputField.getAttribute("data-amount") && inputField.getAttribute("data-amount") * inputField.value;
            var amount_type = inputField.getAttribute("data-amount-type") && inputField.getAttribute("data-amount-type");
            var add_sub = inputField.getAttribute("data-add-sub") && inputField.getAttribute("data-add-sub");
            document.getElementById(id + "-amount").value = amount_type + " " + parseFloat(amount).toFixed(2);
            var data = { id: id, sub_title: event.target.getAttribute("name"), qty: inputField.value, amount: amount, add_sub: add_sub, amount_type: amount_type };
            var update_data = selectedModifiers.map(md => {
                if (md.modifier_id === gpid) {
                    md.is_active = true;
                    const index = md.data.findIndex(object => object.id === data.id);
                    if (index === -1) { md.data.push(data); }
                    else { md.data[index] = data; }
                    return md;
                }
                return md;
            });
            // this.setState({ SelectedModifiers: update_data });
            // console.log("----selected modifier----"+JSON.stringify(update_data));
        }
    }

    const onChangeValue = (event) => {
        var add_sub = "";
        var amount_type = "";
        if (event.target.getAttribute("id").includes("quantityUpdater")) {
            if (event.target.value == "")
                event.target.value = 1;
            var amount = event.target.getAttribute("data-amount") && event.target.getAttribute("data-amount") * event.target.value;
            amount_type = event.target.getAttribute("data-amount-type") && event.target.getAttribute("data-amount-type");
            var newid = event.target.getAttribute("id").replace("quantityUpdater", "amount");
            document.getElementById(newid).value = amount_type + " " + parseFloat(amount).toFixed(2);
        }
        if (event.target.type) {
            amount_type = event.target.getAttribute("data-amount-type") && event.target.getAttribute("data-amount-type");
            // console.log("--modifier type---"+event.target.type)
            // console.log("--modifier parent id---"+event.target.getAttribute("data-gpid"));
            var gpid = event.target.getAttribute("data-gpid") ? event.target.getAttribute("data-gpid") : "";
            add_sub = event.target.getAttribute("data-add-sub") && event.target.getAttribute("data-add-sub");
            var data = {};
            var action = "add_update";
            switch (event.target.type) {
                case "number":
                    data = { id: event.target.getAttribute("id").replace("-quantityUpdater", ""), sub_title: event.target.getAttribute("name"), qty: event.target.value, amount: event.target.getAttribute("data-amount"), add_sub: add_sub, amount_type: amount_type };
                    break;
                case "radio":
                    action = "update";
                    data = { id: event.target.getAttribute("id"), sub_title: event.target.value, qty: 1, amount: event.target.getAttribute("data-amount"), add_sub: add_sub, amount_type: amount_type };
                    break;
                case "checkbox":
                    if (event.target.checked == false) { action = "remove"; }
                    data = { id: event.target.getAttribute("id"), sub_title: event.target.value, qty: 1, amount: event.target.getAttribute("data-amount"), add_sub: add_sub, amount_type: amount_type };
                    break;
                case "text":
                    if (event.target.value == "")
                        return
                    data = { id: event.target.getAttribute("id"), sub_title: event.target.value, qty: 1, amount: event.target.getAttribute("data-amount"), add_sub: add_sub, amount_type: amount_type };
                    break;
                default:
                    break;
            }
            if (action == "add_update") {
                var update_data = selectedModifiers.map(obj => {
                    if (obj.modifier_id === gpid) {
                        obj.is_active = true;
                        const index = obj.data.findIndex(object => object.id === data.id);
                        if (index === -1) { obj.data.push(data); }
                        else { obj.data[index] = data; }
                        return obj;
                    }
                    return obj;
                });
                setSelectedModifiers(update_data)
                // this.setState({ SelectedModifiers: update_data });
            }
            else if (action == "remove") {
                var update_data = selectedModifiers.map(md => {
                    if (md.modifier_id === gpid) {
                        md.is_active = true;
                        md.data = md.data.filter(d => d.id !== data.id);
                    }
                    return md;
                });
                // this.setState({ SelectedModifiers: update_data });
                setSelectedModifiers(update_data)
            }
            else if (action == "update") {
                var update_data = selectedModifiers.map(md => {
                    if (md.modifier_id === gpid) {
                        md.is_active = true;
                        md.data = [data];
                    }
                    return md;
                });
                // this.setState({ SelectedModifiers: update_data });
                setSelectedModifiers(update_data)
            }
        }
        //  console.log("---selectedModifiers----" + JSON.stringify(selectedModifiers))
    }
    const submitChanges = () => {
        // this.setState({ SaveSelectedModifiers: selectedModifiers });
        setSaveSelectedModifiers(selectedModifiers)
        // console.log("----selected modifier----" + JSON.stringify(selectedModifiers));
        setTimeout(() => {
            addModifierAsCustomFee();
            // closeModifier();
        }, 300);
    }
    const addModifierAsCustomFee = (_selectedModifiers) => {
        var _saveSelectedModifiers = _selectedModifiers;
        var tax_is = props.selProduct; //this.props.getVariationProductData && getVariatioModalProduct(this.props.single_product ? this.props.single_product : this.state.variationfound ? this.state.variationfound : this.props.getVariationProductData, this.state.variationDefaultQunatity);
        var product_price = props.selProduct.Price;//getSettingCase() == 2 || getSettingCase() == 4 || getSettingCase() == 7 ? tax_is && cartPriceWithTax(tax_is.old_price, getSettingCase(), tax_is.TaxClass) : getSettingCase() == 6 ? tax_is && tax_is.old_price : tax_is && tax_is.old_price;
        // console.log("---product_price---" + product_price);
        var _data = [];
        _saveSelectedModifiers && _saveSelectedModifiers.map(m => {
            if (m.is_active == true) {
                var _summary = "";
                var _sum = 0;
                var _amount = 0;
                m.data.map(n => {
                    _summary += (_summary == "" ? "" : ", ") + (n.sub_title != null ? n.sub_title : "");
                    if (n.add_sub && n.add_sub == "subtract") {

                        if (n.amount_type == "%") {
                            var a = (product_price * n.amount) / 100;
                            _sum += parseFloat(-a);
                        }
                        else { _sum += parseFloat(-n.amount); }
                    }
                    else {

                        if (n.amount_type == "%") {
                            var a = (product_price * n.amount) / 100;
                            _sum += parseFloat(a);
                        }
                        else { _sum += parseFloat(n.amount); }
                    }
                });
                if (m.data.length > 0)
                    _data.push({ Title: m.title + (_summary != null & _summary != "" ? "(" + _summary + ")" : ""), Price: _sum, old_price: _sum, isTaxable: m.TaxOption, TaxStatus: (m.TaxOption == true ? "taxable" : "none"), TaxClass: '', quantity: 1 });
            }
        })
        if (_data && _data.length > 0) {
            var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
            cartlist = cartlist == null ? [] : cartlist;
            cartlist = cartlist.concat(_data);
            addtoCartProduct(cartlist);
            // cartlist.push(data)
            // _data.map(m=>{
            //     addSimpleProducttoCart(m);
            // })

            // setCustomFeeModifiers(_data)
        }
        //this.setState({ CustomFee_Modifiers: _data });
        //console.log("----modifier as custom fee----" + JSON.stringify(_data));
    }
    const getRecomProducts = () => {
        var ids = "";
        if (props && props.selProduct) {
            ids = props.selProduct.ReletedIds;
            if (ids != "" && typeof ids != "undefined") {
                var tempArr = ids.split(',');
                if (tempArr && tempArr.length > 4) {
                    tempArr = tempArr.slice(0, 4);
                    ids = tempArr;
                }
                else if (tempArr) {
                    ids = tempArr;
                }
            }
        }

        if (ids != "" && typeof ids != "undefined") {
            var recomProducts = [];
            ids.map(async (id) => {
                var aa = await getProductByID(id).then((row) => {
                    return row;
                });
                aa && recomProducts.push(aa);
                if (ids.length == recomProducts.length) {
                    setRecommProducts(recomProducts);
                }
            });
        }
    }

    var _selVariationsEdit = [];
    const setSelectedOption = (option, attribute, AttrIndex) => {
        // _disableAttribute = []
        _selVariationsEdit = selVariations;

        var _slug = null;
        let _OptionAll = attribute.OptionAll;// && JSON.parse(attribute.OptionAll);
        var isAllOption = false;
        if (Array.isArray(_OptionAll) == true || _OptionAll.length >= 1) {
            isAllOption = true;
        }
        else {
            _OptionAll = attribute.options ? attribute.options.split(',') : [];
        }
        var result = _OptionAll.filter(b => b.slug === option);
        if (result && typeof result != "undefined" && result.length > 0) {
            _slug = result;
        }
        console.log("---setSelectedOption--slug" + JSON.stringify(_slug));

        var _item = _selVariationsEdit.findIndex((element) => {
            return element.Name === attribute.Name;
        })
        if (_item == -1) {
            _selVariationsEdit.push({ "Name": attribute.Name, "Option": option, "Index": AttrIndex, "OptionTitle": option.replace(/\s/g, '-').toLowerCase(), "Slug": _slug ? _slug[0].slug : "" });
        }
        _selVariationsEdit = _selVariationsEdit.map(obj => {
            if (obj.Name === attribute.Name) {
                return { ...obj, Option: option, OptionTitle: option.replace(/\s/g, '-').toLowerCase(), "Slug": _slug ? _slug[0].slug : "" };
            }
            return obj;
        });

        if (checkLength() == false) {
            if (
                JSON.stringify(selVariations) != JSON.stringify(_selVariationsEdit)) {
                // console.log("----_selVariations" + JSON.stringify(_selVariationsEdit))
                setSelVariations(_selVariationsEdit);
            }
        }
    }
    const availableVariations = () => {
        if (props && props.selProduct) {
            var _product = props.selProduct;
            var _attribute = [];
            var _attribute1 = [];
            // var ProductAttribute = [];

            // if (_product && _product.ProductAttributes !== null) {
            //     ProductAttribute = _product.ProductAttributes;
            //     _attribute = ProductAttribute && ProductAttribute.filter(item => item.Variation == true);
            // }
            getAllProducts().then((rows) => {
                var data = rows.filter(a => a.ParentId === _product.WPID);
                var allProdcuts = getTaxAllProduct(data)
                if (allProdcuts && allProdcuts.length > 0) {
                    var filteredAttribute = allProdcuts.filter(item => {
                        if (item && item.combination !== null && item.combination !== undefined) {
                            if (_attribute1 && _attribute1.length > 0) {
                                var _result = _attribute1.find(b => b == item.combination);
                                if (typeof _result == "undefined" || _result == null) {
                                    _attribute1.push(item.combination);
                                }
                                console.log(_result);
                            }
                            else {
                                _attribute1.push(item.combination);
                            }
                        }

                        console.log("-_attribute combination----" + JSON.stringify(_attribute1))
                        var allCombi = item && item.combination !== null && item.combination !== undefined && item.combination.split("~");
                        allCombi = allCombi.map(a => {
                            let _a = a.replace(/\//g, "-").toLowerCase();
                            if (_attribute && _attribute.length > 0) {
                                var _result = _attribute.find(b => b == _a);
                                if (typeof _result == "undefined" || _result == null) {
                                    _attribute.push(_a);
                                }
                                console.log(_result);
                            }
                            else {
                                _attribute.push(_a);
                            }

                            // return  _a;
                        });

                    });
                    setAvailableAttribute(_attribute);
                    console.log("-_attribute----" + JSON.stringify(_attribute))
                    //     //-------
                    //     // var _slug = "";
                    //     // selVariations && selVariations.map(v => {

                    //     //     let _OptionAll = v.OptionAll && JSON.parse(v.OptionAll);
                    //     //     var isAllOption = false;
                    //     //     if (Array.isArray(_OptionAll) == true || _OptionAll.length >= 1) {
                    //     //         isAllOption = true;
                    //     //     }
                    //     //     else {
                    //     //         _OptionAll = v.options ? v.options.split(',') : [];
                    //     //     }
                    //     //     var result = _OptionAll.filter(b => b.name === option);
                    //     //     if (result && typeof result != "undefined" && result.length > 0) {
                    //     //         _slug = result;
                    //     //         //selVariations.find(ele => ele.OptionTitle===result[0].name);
                    //     //     }
                    //     //     console.log("------result---" + result && JSON.stringify(result));
                    //     //     // _OptionAll.map((_allOpt, index) => {
                    //     //     //     var newOption = isAllOption ==true && _allOpt.slug ? _allOpt.slug:_allOpt;
                    //     //     // });
                    //     // })
                    //     //return selVariations.every(ele => ((allCombi.includes(_slug[0].slug) && (option===ele.Option)) ) && _attribute.length === selVariations.length)


                    //     // var _data= selVariations.every(ele => ((allCombi.includes(_slug[0].slug) && (option===ele.Option)) ) && _attribute.length === selVariations.length)

                    //     // if(typeof _data!="undefined" && _data!=null)
                    //     // {
                    //     //     return true;
                    //     // }
                    //     // else
                    //     // {
                    //     //     return false;
                    //     // }

                    //     //return (allCombi.includes(_slug)  || allCombi.includes("**")) && _attribute.length === selVariations.length;
                    //     //return selVariations.every(ele => (allCombi.includes(_slug) || allCombi.includes("**")) && _attribute.length === selVariations.length)

                    //     //-------


                    //     return _selVariations.every(ele => (allCombi.includes(ele.Slug) || allCombi.includes("**")) && _attribute.length === selVariations.length)
                    // })
                    // if (filteredAttribute && filteredAttribute.length == 1) {
                    //     props.updateVariationProduct && props.updateVariationProduct(filteredAttribute[0]);
                    //     setisRefereshIconInventory(true);
                    //     dispatch(getInventory(filteredAttribute[0].WPID)); //call to get product warehouse quantity

                    // }
                    // else {
                    //     props.updateVariationProduct && props.updateVariationProduct(null);
                    //     // dispatch(getInventory(null)); //call to get product warehouse quantity
                    // }
                    //console.log("--filteredAttribute--- ", JSON.stringify(filteredAttribute));
                    //console.log("--att p count--- ", JSON.stringify(filteredAttribute.length));

                    // var filteredAttribute1 = allProdcuts.filter(item => {
                    //     // var allCombi = item && item.combination !== null && item.combination !== undefined && item.combination.split("~");
                    //     // var aa = _selVariations.every(ele => (allCombi.includes(ele.OptionTitle) || allCombi.includes("**")))

                    //     var allCombi = item && item.combination !== null && item.combination !== undefined && item.combination.split("~");
                    //     allCombi = allCombi.map(a => { return a.replace(/\//g, "-").toLowerCase() });
                    //     // var aa = _selVariations.every(ele => (allCombi.includes(ele.Slug) || allCombi.includes("**")))

                    //     // if (aa == true) {
                    //     //     allCombi = allCombi.map(a => {
                    //     //         var _att = a.replace(/\//g, "-").toLowerCase();
                    //     //         const index = _disableAttribute.findIndex(item => item === _att)
                    //     //         if (index === -1) {
                    //     //             _disableAttribute.push(_att);
                    //     //         }
                    //     //         return _att;
                    //     //     });
                    //     // }
                    //     // if (attribute && attribute.Option) {
                    //     //     (attribute.Option ? attribute.Option.split(',') : []).map((a, i) => {
                    //     //         var _att = a.replace(/\//g, "-").toLowerCase();
                    //     //         const index = _disableAttribute.findIndex(item => item === _att)
                    //     //         if (index === -1) {
                    //     //             _disableAttribute.push(_att);
                    //     //         }
                    //     //     })
                    //     // }

                    //     // //var result = selVariations.every(ele => (allCombi.includes(ele.OptionTitle) || allCombi.includes("**")) /*&& _attribute.length===selVariations.length*/)
                    //     // var result = selVariations.every(ele => (allCombi.includes(ele.Slug) || allCombi.includes("**")) /*&& _attribute.length===selVariations.length*/)
                    //     // if (result === true) {
                    //     //     console.log("--att p count--->> ", allCombi.join(','));
                    //     // }
                    //     // return result;
                    // })
                    // filteredAttribute1 && filteredAttribute1.length > 0 && filteredAttribute1.map(a => {
                    //     console.log("-------combi----" + a.combination);
                    // })
                    //  console.log("--_disableAttribute--- ", JSON.stringify(_disableAttribute));
                    //  console.log("--allVariations--- ", JSON.stringify(allVariations));
                    //  console.log("--filteredAttribute1--- ", JSON.stringify(filteredAttribute1.length));
                    //  var array3 = allVariations.filter(function(obj) { return _disableAttribute.indexOf(obj) == -1; });
                    //  //_disableAttribute=array3;
                    //  setDisableAttribute(array3);
                    //  console.log("--array3--- ", JSON.stringify(array3));
                }

            });

        }
    }
    const doVariationSearch = () => {
        if (props && props.selProduct) {
            var _product = props.selProduct;
            var _attribute = [];
            var ProductAttribute = [];

            if (_product && _product.ProductAttributes !== null) {
                ProductAttribute = _product.ProductAttributes;
                _attribute = ProductAttribute && ProductAttribute.filter(item => item.Variation == true);
            }
            getAllProducts().then((rows) => {
                var data = rows.filter(a => a.ParentId === _product.WPID);
                var allProdcuts = getTaxAllProduct(data)
                if (allProdcuts && allProdcuts.length > 0) {
                    var filteredAttribute = allProdcuts.filter(item => {
                        var allCombi = item && item.combination !== null && item.combination !== undefined && item.combination.split("~");
                        allCombi = allCombi.map(a => { return a.replace(/\//g, "-").toLowerCase() });
                        return selVariations.every(ele => (allCombi.includes(ele.OptionTitle) || allCombi.includes("**")) && _attribute.length === selVariations.length)
                    })
                    if (filteredAttribute && filteredAttribute.length == 1) {
                        props.updateVariationProduct && props.updateVariationProduct(filteredAttribute[0]);
                    }
                    else {
                        props.updateVariationProduct && props.updateVariationProduct(null);
                    }
                    //  console.log("--filteredAttribute--- ", JSON.stringify(filteredAttribute));
                    //console.log("--att p count--- ", JSON.stringify(filteredAttribute.length));

                    allProdcuts.filter(item => {
                        var allCombi = item && item.combination !== null && item.combination !== undefined && item.combination.split("~");
                        var aa = selVariations.every(ele => (allCombi.includes(ele.OptionTitle) || allCombi.includes("**")))

                        if (aa == true) {
                            allCombi = allCombi.map(a => {
                                var _att = a.replace(/\//g, "-").toLowerCase();
                                const index = _disableAttribute.findIndex(item => item === _att)
                                if (index === -1) {
                                    _disableAttribute.push(_att);
                                }
                                return _att;
                            });
                        }
                        // if (attribute && attribute.Option) {
                        //     (attribute.Option ? attribute.Option.split(',') : []).map((a, i) => {
                        //         var _att = a.replace(/\//g, "-").toLowerCase();
                        //         const index = _disableAttribute.findIndex(item => item === _att)
                        //         if (index === -1) {
                        //             _disableAttribute.push(_att);
                        //         }
                        //     })
                        // }

                        var result = selVariations.every(ele => (allCombi.includes(ele.OptionTitle) || allCombi.includes("**")) /*&& _attribute.length===selVariations.length*/)
                        // if (result === true) {
                        //     console.log("--att p count--->> ", allCombi.join(','));
                        // }
                        return result;
                    })
                    // filteredAttribute1 && filteredAttribute1.length > 0 && filteredAttribute1.map(a => {
                    //     console.log("-------combi----" + a.combination);
                    // })
                    // console.log("--allVariatiooo--- ", JSON.stringify(_disableAttribute));
                    // console.log("--allVariations--- ", JSON.stringify(allVariations));

                }

            });
        }
    }
    //var selVariations = [];
    var _disableAttribute = [];
    const optionClick = async (option, attribute, AttrIndex) => {
        setIsEdit(false);

        //    if(selOptions && selOptions.length>0)
        //    {
        //     setSelOptions([]);

        //    }
        //----------
        var _slug = null;
        let _OptionAll = attribute.OptionAll;// && JSON.parse(attribute.OptionAll);
        var isAllOption = false;
        if (Array.isArray(_OptionAll) == true || _OptionAll.length >= 1) {
            isAllOption = true;
        }
        else {
            _OptionAll = attribute.options ? attribute.options.split(',') : [];
        }
        var result = _OptionAll.filter(b => b.slug === option);
        if (result && typeof result != "undefined" && result.length > 0) {
            _slug = result;
            //selVariations.find(ele => ele.OptionTitle===result[0].name);
        }
        //------
        _disableAttribute = []
        var _selVariations = selVariations;
        var _item = _selVariations.findIndex((element) => {
            return element.Name === attribute.Name;
        })
        if (_item == -1) {
            _selVariations.push({ "Name": attribute.Name, "Option": option, "Index": AttrIndex, "OptionTitle": option.replace(/\s/g, '-').toLowerCase(), "Slug": _slug ? _slug[0].slug : "", });
        }
        _selVariations = _selVariations.map(obj => {
            if (obj.Name === attribute.Name) {
                return { ...obj, Option: option, OptionTitle: option.replace(/\s/g, '-').toLowerCase(), "OptionAll": attribute.OptionAll, "Slug": _slug ? _slug[0].slug : "" };
            }
            return obj;
        });
        setSelVariations(_selVariations);
        // console.log("-----if exists----" + JSON.stringify(_selVariations))
        // doVariationSearch();
        // return;
        if (props && props.selProduct) {
            var _product = props.selProduct;
            var _attribute = [];
            var ProductAttribute = [];

            if (_product && _product.ProductAttributes !== null) {
                ProductAttribute = _product.ProductAttributes;
                _attribute = ProductAttribute && ProductAttribute.filter(item => item.Variation == true);
            }
            getAllProducts().then((rows) => {
                var data = rows.filter(a => a.ParentId === _product.WPID);
                var allProdcuts = getTaxAllProduct(data)
                if (allProdcuts && allProdcuts.length > 0) {
                    var filteredAttribute = allProdcuts.filter(item => {
                        var allCombi = item && item.combination !== null && item.combination !== undefined && item.combination.split("~");
                        allCombi = allCombi.map(a => { return a.replace(/\//g, "-").toLowerCase() });

                        //-------
                        // var _slug = "";
                        // selVariations && selVariations.map(v => {

                        //     let _OptionAll = v.OptionAll && JSON.parse(v.OptionAll);
                        //     var isAllOption = false;
                        //     if (Array.isArray(_OptionAll) == true || _OptionAll.length >= 1) {
                        //         isAllOption = true;
                        //     }
                        //     else {
                        //         _OptionAll = v.options ? v.options.split(',') : [];
                        //     }
                        //     var result = _OptionAll.filter(b => b.name === option);
                        //     if (result && typeof result != "undefined" && result.length > 0) {
                        //         _slug = result;
                        //         //selVariations.find(ele => ele.OptionTitle===result[0].name);
                        //     }
                        //     console.log("------result---" + result && JSON.stringify(result));
                        //     // _OptionAll.map((_allOpt, index) => {
                        //     //     var newOption = isAllOption ==true && _allOpt.slug ? _allOpt.slug:_allOpt;
                        //     // });
                        // })
                        //return selVariations.every(ele => ((allCombi.includes(_slug[0].slug) && (option===ele.Option)) ) && _attribute.length === selVariations.length)


                        // var _data= selVariations.every(ele => ((allCombi.includes(_slug[0].slug) && (option===ele.Option)) ) && _attribute.length === selVariations.length)

                        // if(typeof _data!="undefined" && _data!=null)
                        // {
                        //     return true;
                        // }
                        // else
                        // {
                        //     return false;
                        // }

                        //return (allCombi.includes(_slug)  || allCombi.includes("**")) && _attribute.length === selVariations.length;
                        //return selVariations.every(ele => (allCombi.includes(_slug) || allCombi.includes("**")) && _attribute.length === selVariations.length)

                        //-------


                        return _selVariations.every(ele => (allCombi.includes(ele.Slug) || allCombi.includes("**")) && _attribute.length === selVariations.length)
                    })
                    if (filteredAttribute && filteredAttribute.length == 1) {
                        props.updateVariationProduct && props.updateVariationProduct(filteredAttribute[0]);
                        setisRefereshIconInventory(true);
                        dispatch(getInventory(filteredAttribute[0].WPID)); //call to get product warehouse quantity

                    }
                    else {
                        props.updateVariationProduct && props.updateVariationProduct(null);
                        // dispatch(getInventory(null)); //call to get product warehouse quantity
                    }
                    //console.log("--filteredAttribute--- ", JSON.stringify(filteredAttribute));
                    //console.log("--att p count--- ", JSON.stringify(filteredAttribute.length));

                    var filteredAttribute1 = allProdcuts.filter(item => {
                        // var allCombi = item && item.combination !== null && item.combination !== undefined && item.combination.split("~");
                        // var aa = _selVariations.every(ele => (allCombi.includes(ele.OptionTitle) || allCombi.includes("**")))

                        var allCombi = item && item.combination !== null && item.combination !== undefined && item.combination.split("~");
                        allCombi = allCombi.map(a => { return a.replace(/\//g, "-").toLowerCase() });
                        var aa = _selVariations.every(ele => (allCombi.includes(ele.Slug) || allCombi.includes("**")))

                        if (aa == true) {
                            allCombi = allCombi.map(a => {
                                var _att = a.replace(/\//g, "-").toLowerCase();
                                const index = _disableAttribute.findIndex(item => item === _att)
                                if (index === -1) {
                                    _disableAttribute.push(_att);
                                }
                                return _att;
                            });
                        }
                        if (attribute && attribute.Option) {
                            (attribute.Option ? attribute.Option.split(',') : []).map((a, i) => {
                                var _att = a.replace(/\//g, "-").toLowerCase();
                                const index = _disableAttribute.findIndex(item => item === _att)
                                if (index === -1) {
                                    _disableAttribute.push(_att);
                                }
                            })
                        }

                        //var result = selVariations.every(ele => (allCombi.includes(ele.OptionTitle) || allCombi.includes("**")) /*&& _attribute.length===selVariations.length*/)
                        var result = selVariations.every(ele => (allCombi.includes(ele.Slug) || allCombi.includes("**")) /*&& _attribute.length===selVariations.length*/)
                        if (result === true) {
                            console.log("--att p count--->> ", allCombi.join(','));
                        }
                        return result;
                    })
                    // filteredAttribute1 && filteredAttribute1.length > 0 && filteredAttribute1.map(a => {
                    //     console.log("-------combi----" + a.combination);
                    // })
                    console.log("--_disableAttribute--- ", JSON.stringify(_disableAttribute));
                    console.log("--allVariations--- ", JSON.stringify(allVariations));
                    console.log("--filteredAttribute1--- ", JSON.stringify(filteredAttribute1.length));
                    var array3 = allVariations.filter(function (obj) { return _disableAttribute.indexOf(obj) == -1; });
                    //_disableAttribute=array3;
                    setDisableAttribute(array3);
                    console.log("--array3--- ", JSON.stringify(array3));
                }

            });
        }
    }

    const checkLength = () => {
        var result = true;
        var _product = props.selProduct;
        var _attribute = [];
        var ProductAttribute = [];

        if (_product && _product.ProductAttributes !== null) {
            ProductAttribute = _product.ProductAttributes;
            _attribute = ProductAttribute && ProductAttribute.filter(item => item.Variation == true);
            if (_attribute && _attribute.length > 0 && selVariations) {
                if (_attribute.length === selVariations.length) { result = true; }
                else { result = false; }
            }
            else { result = true; }
        }


        return result;
    }
    ///-------xxxxx-------
    const addToCart = () => {
        if (checkLength() === true) {

            var _product = props.variationProduct ? props.variationProduct : props.selProduct;
            if (_product) {
                // _product = props.selProduct;
                _product.quantity = productQty;

                //---- Replace exsiting product if different variation or proudct is selected
                if (props.selProduct && props.selProduct.hasOwnProperty("selectedIndex")) {
                    _product['selectedIndex'] = props.selProduct.selectedIndex;
                }
                // if (props.selProduct && props.selProduct.hasOwnProperty("selectedIndex")) {
                //     _product['selectedIndex'] = props.selProduct.selectedIndex;
                //     _product['product_id'] = props.selProduct.WPID;
                //     var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
                //     if (cartlist.length > 0) {
                //         cartlist.map((item, index) => {
                //             if (typeof _product !== 'undefined' && _product !== null) {
                //                 var _index = -1;
                //                 if (_product['selectedIndex'] >= 0) {
                //                     _index = parseInt(_product.selectedIndex)
                //                 }
                //                 if (_index > -1 && _product.selectedIndex == index && item.product_id != _product.WPID) {
                //                     cartlist[index] = _product;
                //                     //cartlist.splice(index,1);
                //                     localStorage.setItem("CARD_PRODUCT_LIST", JSON.stringify(cartlist));
                //                 }
                //             }
                //         })

                //     }
                //     // setTimeout(() => {
                //     //     dispatch(product());
                //     // }, 100);
                // }
                // else
                // {
                //     var result = addSimpleProducttoCart(_product);
                //     if (result === 'outofstock') {
                //         toggleOutOfStock();
                //     }
                //     else {
                //         if (note != "") {
                //             var result = addSimpleProducttoCart({ "Title": note, "IsTicket": false, "pid": _product.hasOwnProperty("product_id") ? _product.product_id : _product.WPID, "vid": _product.variation_id });
                //             console.log("----product note---" + note);
                //         }
                //         setTimeout(() => {
                //             dispatch(product());
                //         }, 100);

                //     }
                // }

                //----

                var result = addSimpleProducttoCart(_product);
                if (result === 'outofstock') {
                    toggleOutOfStock();
                }
                if (note != "" && result !== 'outofstock') {
                    var pid = _product.hasOwnProperty("product_id") ? _product.product_id : _product.WPID;
                    // if(_product.Type!="simple")
                    // {
                    //     pid=_product.ParentId;
                    // }
                    var noteData = { "Title": note, "IsTicket": false, "pid": pid, "vid": _product.variation_id };
                    if (!updateProductNote(noteData)) {
                        var result = addSimpleProducttoCart(noteData);
                    }
                    console.log("----product note---" + note);
                }
                if (selectedModifiers && selectedModifiers.length > 0) {

                    addModifierAsCustomFee(selectedModifiers);
                    // customFeeModifiers.map(m=>{
                    //     addSimpleProducttoCart(m);
                    // })
                    //cartItemList= cartItemList.concat(this.state.CustomFee_Modifiers);
                }
                if (result !== 'outofstock') {
                    setTimeout(() => {
                        dispatch(product());
                    }, 100);
                }
            }
        }
        else {
            toggleNoVariationSelected();
        }
    }
    const addNote = (note) => {
        setNote(note);
        toggleProductNote();
    }

    //Showing indivdual and overall discount 30sep2022
    const showDiscounts = () => {
        var _product = props.variationProduct != null ? props.variationProduct : props.selProduct;
        var disString = "";
        if (_product.product_discount_amount > 0) {
            if (_product.discount_type == "Number") {
                disString = "$" + _product.new_product_discount_amount + " " + LocalizedLanguage.individual;
            }
            else {
                disString = _product.new_product_discount_amount + "% " + LocalizedLanguage.individual;
            }
        }
        let cart = localStorage.getItem("CART") ? JSON.parse(localStorage.getItem("CART")) : null;
        if (_product.cart_discount_amount > 0 && cart) {
            if (disString != "") {
                disString += " + "
            }
            if (cart && cart.discountType == "Number") {
                disString += "$" + cart.discount_amount + " " + LocalizedLanguage.overall;
            }
            else {
                disString += cart.discount_amount + "% " + LocalizedLanguage.overall;
            }
        }
        if ((_product.product_discount_amount > 0 || _product.cart_discount_amount > 0) && disString != "") {
            disString = "(" + disString + ") "
            disString += " " + LocalizedLanguage.discountAdded;
        }
        else {
            disString += " " + LocalizedLanguage.addDiscount;
        }
        setDiscounts(disString != "" ? disString : LocalizedLanguage.addDiscount);
    }
    useEffect(() => {
        if (props.selProduct && props.selProduct.quantity) {
            setProductQty(props.selProduct.quantity);
        }
    }, [props.selProduct]);

    const clearSelection = () => {
        setSelVariations([]);
    }
    useEffect(() => {
        if (props.isShowPopups == true) {
            setSelVariations([]);
            getModifiers();
            getRecomProducts();
            showDiscounts();
            availableVariations();

        }
    }, [props.isShowPopups, props.selProduct]);

    useEffect(() => {
        if (props.isShowPopups == true) {
            if (props.selProduct && props.selProduct.hasOwnProperty("selectedOptions") && props.selProduct.selectedOptions.length > 0) {
                setSelOptions(props.selProduct.selectedOptions)
                setIsEdit(true);
                doVariationSearch();
            }
        }
    }, [selOptions, props.isShowPopups]);


    //   end
    var _DistictAttribute = [];
    var _OptionAll = [];
    var ProductAttribute = props.selProduct && props.selProduct.ProductAttributes;
    var _attribute = [];
    if (ProductAttribute !== null) {
        _attribute = ProductAttribute && ProductAttribute.filter(item => item.Variation == true);

        _attribute && _attribute.map((attribute, index) => {
            var item = { Name: attribute.Name, Option: attribute.Option, Slug: attribute.Slug, Variation: attribute.Variation, OptionAll: attribute.OptionAll ? JSON.parse(attribute.OptionAll) : [] };
            // var isExist = _DistictAttribute && _DistictAttribute.find(function (element) {
            //     return (element.Slug == item.Slug)
            // });
            // if (!isExist)        
            _DistictAttribute.push(item);
        });
    }
    setTimeout(() => {
        initProuctFn();
    }, 1000);

    var _product = props.variationProduct != null ? props.variationProduct : props.selProduct;
    // if (isEdit === true && _product.StockQuantity != variationStockQunatity) {
    //     setVariationStockQunatity(_product.StockQuantity)
    //     setProductQty(_product.quantity);
    // }
    var product_price = 0;
    var after_discount_total_price = 0;
    if (_product) {

        var after_discount_total_price = _product && _product.product_discount_amount ?
            _product.product_discount_amount * (_product.discount_type != "Number" ? _product.quantity ? _product.quantity : productQty : 1) : 0;
        product_price = getSettingCase() == 2 || getSettingCase() == 4 || getSettingCase() == 7 ? _product && cartPriceWithTax(_product.old_price, getSettingCase(), _product.TaxClass) : getSettingCase() == 6 ? _product && _product.old_price : _product && _product.old_price;
    }


    var warehouseDetail = inventoryStatus && inventoryStatus.inventoryGet && inventoryStatus.inventoryGet.data && inventoryStatus.inventoryGet.data.content
    var CurrentWarehouseId = localStorage.getItem("WarehouseId");

    if (warehouseDetail && warehouseDetail.length > 0) {
        currentWareHouseDetail = warehouseDetail.find(item => item.warehouseId == CurrentWarehouseId)
    }

    var _currentStock = currentWareHouseDetail && currentWareHouseDetail !== "" ? currentWareHouseDetail.Quantity : variationStockQunatity;
    //console.log("Quantity", currentWareHouseDetail.Quantity, variationStockQunatity)

    return (
        props.isShowPopups == false ? null :
            <React.Fragment>
                <div className="product-wrapper" >
                    <LeftNavBar view={"Product View"}></LeftNavBar>
                    <div className="header">
                        <div className="mobile-buttons">
                            <button id="mobileExitProductButton" onClick={() => props.closePopUp()}>
                                <img src={X_Icon_DarkBlue} alt="" />
                            </button>
                            <button id="mobileAppsButton" onClick={() => props.toggleAppLauncher()}>
                                <img src={Oliver_Icon_BaseBlue} alt="" />
                            </button>
                        </div>
                        <div className="main">
                            <p className="route">{"Clothing > T-Shirts"}</p>
                            <p className="prod-name">{_product && _product.Title}</p>
                            <button id="desktopExitProductButton" onClick={() => props.closePopUp()}>
                                <img src={X_Icon_DarkBlue} alt="" />
                            </button>
                        </div>
                    </div>
                    <div className="mod-product">
                        {_DistictAttribute && _DistictAttribute.length === 0 ?
                            <div className="img-container no-var">
                                <img src={NoVariationDisplay} alt="" />
                                <img src={Product_OutOfStock} alt="" />
                            </div> :
                            <div className="row">
                                <p>Select Variations</p>
                                <button id="clearModsButton" onClick={() => clearSelection()}>Clear Selection</button>
                            </div>}
                        {

                            _DistictAttribute && _DistictAttribute.length > 0 ?
                                (_DistictAttribute.map((attribute, index) => {
                                    return (
                                        attribute && attribute.Variation == true &&
                                        <React.Fragment key={attribute.Slug}><p>{attribute.Name}</p>
                                            {/* <div className="radio-group">
                                                {
                                                    (attribute.Option ? attribute.Option.split(',') : []).map((a, i) => {
                                                        let _item = a.replace(/\//g, "-").toLowerCase();
                                                        allVariations.push(_item);
                                                        // return <label key={"l_" + a} onClick={() => optionClick(a, attribute, i)}><input type="radio" id={attribute.Name + "" + a} name={attribute.Name} checked={selVal}/><div className="custom-radio"><p>{a}</p></div></label>
                                                        //var selVal = props.selProduct.selectedOptions ? props.selProduct.selectedOptions.includes(_item):false;
                                                        if (isEdit === true) {
                                                            //var selVal = selOptions ? selOptions.includes(_item) : false;
                                                            
                                                            var selVal = selOptions ? selOptions.some(a => a.replace(/\-/g, " ").toLowerCase() === _item.toLowerCase()) : false;
                                                            if (selVal === true) {
                                                                setSelectedOption(a, attribute, i)
                                                            }
                                                            return <label key={"l_" + a} onClick={() => optionClick(a, attribute, i)}><input type="radio" id={attribute.Name + "" + a} name={attribute.Name} checked={selVal} /><div className="custom-radio"><p>{a}</p></div></label>

                                                            // if (_DistictAttribute.length === (index + 1) && attribute.Option.split(',').length === (i + 1)) {
                                                            //     console.log("_DistictAttribute length--->"+_DistictAttribute.length,index+1+"----"+attribute.Option.split(',').length,i+1)
                                                            //     saveSelectedOption();
                                                            // }
                                                        }
                                                        else {
                                                            var selVal = selVariations ? selVariations.some(a => a.OptionTitle.replace(/\-/g, " ").toLowerCase() === _item.toLowerCase()) : false;
                                                            // return <label key={"l_" + a} onClick={() => optionClick(a, attribute, i)}><input type="radio" id={attribute.Name + "" + a} name={attribute.Name} /><div className="custom-radio"><p>{a}</p></div></label>
                                                            return <label key={"l_" + a} onClick={() => optionClick(a, attribute, i)}><input type="radio" id={attribute.Name + "" + a} name={attribute.Name} checked={selVal} /><div className="custom-radio"><p>{a}</p></div></label>
                                                        }

                                                        // console.log("_DistictAttribute length--->"+_DistictAttribute.length,index)
                                                        //     console.log("attribute length--->"+attribute.Option.split(',').length,i)
                                                        //console.log("a, attribute, s--------"+selVal)
                                                        // if(selOptions && selOptions.length>0)
                                                        // {
                                                        //     var selVal = selOptions.includes(_item);
                                                        //     console.log("a, attribute, s--------"+a, attribute, i);
                                                        //     return <label key={"l_" + a} onClick={() => optionClick(a, attribute, i)}><input type="radio" id={attribute.Name + "" + a} name={attribute.Name} checked={selVal}/><div className="custom-radio"><p>{a}</p></div></label>
                                                        // }
                                                        // else
                                                        // allVariations.push(_item);
                                                        // return <label key={"l_" + a} onClick={() => optionClick(a, attribute, i)}><input type="radio" id={attribute.Name + "" + a} name={attribute.Name} /><div className="custom-radio"><p>{a}</p></div></label>
                                                    })
                                                }
                                            </div> */}
                                            <div className="radio-group">
                                                {
                                                    attribute.OptionAll && attribute.OptionAll.map((opt, i) => {
                                                        let _item = opt.slug;

                                                        var _disabled = false
                                                        if (disableAttribute && disableAttribute.length > 0) {
                                                            _disabled = disableAttribute && disableAttribute.some(a => a === opt.slug);
                                                        }
                                                        if (_disabled === false) {
                                                            var _vari = availableAttribute && availableAttribute.find(a => a === opt.slug);
                                                            _disabled = typeof _vari != "undefined" && _vari != null ? false : true;
                                                        }



                                                        allVariations.push(_item);
                                                        // return <label key={"l_" + a} onClick={() => optionClick(a, attribute, i)}><input type="radio" id={attribute.Name + "" + a} name={attribute.Name} checked={selVal}/><div className="custom-radio"><p>{a}</p></div></label>
                                                        //var selVal = props.selProduct.selectedOptions ? props.selProduct.selectedOptions.includes(_item):false;
                                                        if (isEdit === true) {
                                                            //var selVal = selOptions ? selOptions.includes(_item) : false;

                                                            var selVal = selOptions ? selOptions.some(a => a === _item) : false;
                                                            if (selVal === true) {
                                                                setSelectedOption(_item, attribute, i)
                                                            }
                                                            return <label style={{ opacity: _disabled === true ? 0.7 : 1 }} disabled={_disabled} key={"l_" + opt.slug} onClick={() => _disabled === false ? optionClick(opt.slug, attribute, i) : null}><input type="radio" id={attribute.Name + "" + opt.slug} name={attribute.Name} checked={selVal} /><div className="custom-radio"><p>{opt.name}</p></div></label>

                                                        }
                                                        else {
                                                            var selVal = selVariations ? selVariations.some(a => a.OptionTitle.toLowerCase() === _item.toLowerCase()) : false;
                                                            // var selVal = selVariations ? selVariations.some(a => a.Slug.toLowerCase() === _item.toLowerCase()) : false;
                                                            return <label style={{ opacity: _disabled === true ? 0.7 : 1 }} disabled={_disabled} key={"l_" + opt.slug} onClick={() => _disabled === false ? optionClick(opt.slug, attribute, i) : null}><input type="radio" id={attribute.Name + "" + opt.slug} name={attribute.Name} checked={selVal} /><div className="custom-radio"><p>{opt.name}</p></div></label>
                                                        }

                                                    })
                                                }
                                            </div>
                                        </React.Fragment>
                                    )
                                })
                                )
                                : <div className='noAttribute'></div>}
                        {productModifiers && productModifiers.length > 0 ? <div className="row">
                            <p>Select Modifier</p>
                        </div> : null} <React.Fragment /*onChange={onChangeValue}*/>
                            {
                                productModifiers && productModifiers.map(mod => {
                                    var gpid = (mod.Title).replace(/ /g, "_");
                                    var gpname = (mod.Title).replace(/ /g, "_");
                                    switch (mod.Type) {
                                        case Config.key_InputTypes.CheckBox:
                                            return (
                                                <React.Fragment>
                                                    <p>{mod.Title}</p>
                                                    <div className="radio-group" onChange={onChangeValue}>{
                                                        mod.modifierFields && mod.modifierFields.map(mf => {
                                                            return (mf.ExtendFormData && mf.ExtendFormData.map(efm => {
                                                                var id = (efm.Name != null && typeof efm.Name != "undefined") && (efm.Name).replace(/ /g, "_");
                                                                return (
                                                                    <label>
                                                                        <input type="radio" id={id} name={efm.Name} value={id} data-checked-value={efm.Default} data-gparent-name={gpname} data-gpid={gpid} data-amount={efm.Amount} data-add-sub={efm.AddnSubtract} data-amount-type={efm.Type} />
                                                                        <div className="custom-radio">
                                                                            <p>{efm.Name}</p>
                                                                        </div>
                                                                    </label>)
                                                            }))
                                                        })
                                                    }</div></React.Fragment>
                                            )
                                            break;
                                        case Config.key_InputTypes.NumberField:
                                            return (
                                                <React.Fragment>
                                                    <p className="labelTitle">{mod.Title}</p>
                                                    {
                                                        mod.modifierFields && mod.modifierFields.map(mf => {
                                                            return (mf.ExtendFormData && mf.ExtendFormData.map(efm => {
                                                                var id = ((efm.Name != null && typeof efm.Name != "undefined") ? efm.Name : String(efm.ModifierId)).replace(/ /g, "_");
                                                                return (<React.Fragment>
                                                                    <div className="main-row" onChange={onChangeValue}>
                                                                        <div className="input-col1" >
                                                                            <label htmlFor={id + "-txt"}>{efm.Name}</label>



                                                                            {/* <div className="text-group">
                                                                            <p className="label">{efm.Name}</p>
                                                                        </div> */}
                                                                            <div className="increment-input">
                                                                                <button onClick={qunatityChange} data-parent-id={id} data-btn-type="minus" data-gparent-name={gpname} data-gpid={gpid} data-add-sub={efm.AddnSubtract}>
                                                                                    <img src={Checkout_Minus} alt="" />
                                                                                </button>
                                                                                <input id={id + "-quantityUpdater"} type="number" name={id} data-max-number={efm.Maxnumber} defaultValue={efm.Startingnumber} data-amount={efm.Amount} data-amount-type={efm.Type} data-gparent-name={gpname} data-gpid={gpid} data-add-sub={efm.AddnSubtract} />
                                                                                <button id="btn_dv_plus_popup" onClick={qunatityChange} data-parent-id={id} data-btn-type="plus" data-gparent-name={gpname} data-gpid={gpid} data-add-sub={efm.AddnSubtract}>
                                                                                    <img src={Checkout_Plus} alt="" />
                                                                                </button>
                                                                            </div>

                                                                        </div><div> <input id={id + "-amount"} type="text" defaultValue={efm.Type + " " + efm.Amount} data-amount-type={efm.Type} readOnly className='modiferAmount' /></div></div>
                                                                </React.Fragment>)
                                                            }))
                                                        })
                                                    }</React.Fragment>
                                            )
                                            break;
                                        case Config.key_InputTypes.RadioButton:
                                            return (
                                                <React.Fragment>
                                                    <p >{mod.Title}</p>
                                                    <div className="radio-group" onChange={onChangeValue}>{
                                                        mod.modifierFields && mod.modifierFields.map(mf => {
                                                            return (mf.ExtendFormData && mf.ExtendFormData.map(efm => {
                                                                var id = (efm.Name != null && typeof efm.Name != "undefined") && (efm.Name).replace(/ /g, "_");
                                                                return (
                                                                    <label htmlFor={id}>
                                                                        <input type="radio" id={id} name={mod.Title} value={efm.Name} data-checked-value={efm.Default} data-gparent-name={gpname} data-gpid={gpid} data-amount={efm.Amount} data-add-sub={efm.AddnSubtract} data-amount-type={efm.Type} />
                                                                        <div className="custom-radio">
                                                                            <p>{efm.Name}</p>
                                                                        </div>
                                                                    </label>)
                                                            }))
                                                        })
                                                    }</div></React.Fragment>
                                            )
                                            break;
                                        case Config.key_InputTypes.TextField:
                                            return (
                                                <React.Fragment>
                                                    <p className="labelTitle">{mod.Title}</p>
                                                    {
                                                        mod.modifierFields && mod.modifierFields.map(mf => {
                                                            return (mf.ExtendFormData && mf.ExtendFormData.map(efm => {
                                                                var id = (efm.Name).replace(/ /g, "_");
                                                                return (<React.Fragment>
                                                                    <div className="main-row" onChange={onChangeValue}>
                                                                        <div className="input-col" >
                                                                            <label htmlFor={id + "-txt"}>{efm.Name}</label>
                                                                            <input id={id + "-txt"} type="text" name={id + "-txt"} defaultValue={efm.Startingnumber} data-amount={efm.Amount} data-amount-type={efm.Type} data-gparent-name={gpname} data-gpid={gpid} data-add-sub={efm.AddnSubtract} />

                                                                        </div>
                                                                        <div className="input-col0" > <input id={id + "-amount"} type="text" defaultValue={efm.Type + " " + efm.Amount} data-amount-type={efm.Type} readOnly className='modiferAmount' /></div></div>
                                                                </React.Fragment>)
                                                            }))
                                                        })
                                                    }</React.Fragment>
                                            )
                                            break;
                                        default:
                                            break;
                                    }
                                })
                            }</React.Fragment>
                    </div>
                    <div className="detailed-product">
                        <div className="row">
                            <div className="product-image-container">
                                {
                                    _product && _product.ProductImage != null ?
                                        <img src={_product.ProductImage} alt="" id="productImage" className="height-fit" /> :
                                        <img src={NoImageAvailable} alt="" id="productImage" className="height-fit" />
                                }
                            </div>
                            <div className="col">
                                <p className="mobile-only">Stock Details</p>
                                <div className="group">
                                    <div className="text-row">
                                        {/* <p className="mobile-only">Currently in stock:</p> */}

                                        <p className="mobile-only">Currently {stockStatusInOut}:</p>
                                        {isRefereshIconInventory === true ?
                                            <p className="text-center"><img src={RefreshGrey} alt=""></img></p>
                                            :
                                            stockStatusInOut != LocalizedLanguage.outOfStock ? stockStatusInOut.toString().toLocaleLowerCase() !== 'unlimited' ? <p className="quantity">{variationStockQunatity}</p> : null : <p className="quantity">0</p>}
                                    </div>

                                    {isOutOfStock == false && <p className="desktop-only">{stockStatusInOut}</p>}
                                    {variationStockQunatity.toString().toLocaleLowerCase() !== 'unlimited' && _product.ManagingStock === true &&   //no need update stock when unlimited
                                        <button onClick={() => toggleAdjustInventory()} disabled={stockStatusInOut.toString().toLocaleLowerCase() !== 'unlimited' ? false : true} style={{ opacity: stockStatusInOut.toString().toLocaleLowerCase() !== 'unlimited' ? 1 : 0.5 }}>Adjust Stock</button>
                                    }
                                    {/* {stockStatusInOut.toString().toLocaleLowerCase() !== 'unlimited'} */}
                                </div>

                                <button id="addProductDiscountMobile" onClick={() => toggleProductDiscount()}>
                                    <img src={Coin_Blue} alt="" />
                                    Add Discount
                                </button>
                            </div>
                        </div>
                        <div className="col">
                            {_product && _product.ShortDescription && <p className="title">Description</p>}
                            <p className="para" dangerouslySetInnerHTML={{ __html: _product && _product.ShortDescription }}>

                            </p>
                            {_product && _product.ProductAttributes && _product.ProductAttributes.length > 0 &&
                                <p className="title">Additional Fields</p>}
                            <p className="para">

                                {_product && _product.ProductAttributes && _product.ProductAttributes.map((item, index) => {
                                    if (item && item.Option) {
                                        return <div key={index}>{item.Name + " : " + item.Option}</div>
                                    }
                                })
                                }
                            </p>
                            {/* {_product.ShortDescription && <p className="title">Custom Fields</p>}
                            <p className="para">
                                {_product.ShortDescription}
                            </p> */}
                            {_product && _product.Sku && _product.Sku !== "" && <p className="title">SKU #</p>}
                            <p className="para">{_product && _product.Sku}</p>
                            {_product && _product.Barcode && _product.Barcode !== "" && <p className="title">Barcode ID #</p>}
                            <p className="para">{_product && _product.Barcode}</p>
                        </div>
                    </div>
                    <div className="recommended-upsells">
                        <p>Recommended Upsells</p>
                        <div className="button-row">
                            {recommProducts && recommProducts.length > 0 && recommProducts.map(a => {
                                return <button onClick={() => props.openPopUp(a)} key={a.WPID}>
                                    <div className="img-container">
                                        {a && a.ProductImage != null ?
                                            <img src={a && a.ProductImage} alt="" className="height-fit" /> :
                                            <img src={NoImageAvailable} alt="" id="productImage" className="height-fit" />
                                        }
                                    </div>
                                    <div className="prod-name">
                                        <p>{a && a.Title}</p>
                                    </div>
                                </button>
                            })}
                        </div>
                    </div>
                    <div className="product-footer">
                        <div className="row">
                            <button id="addProductNote" onClick={() => toggleProductNote()}>
                                <img src={Pencil} alt="" />
                                {LocalizedLanguage.addNote}
                            </button>
                            <button id="addProductDiscount" onClick={() => toggleProductDiscount()}>{discounts}</button>
                        </div>
                        <div className="row">
                            <div className="increment-input">
                                <button onClick={() => quantityUpdate('minus')}>
                                    <img src={Minus_Blue} alt="" />
                                </button>
                                <input type="number" readOnly placeholder="0" value={productQty} />
                                <button onClick={() => quantityUpdate('plus')}>
                                    <img src={Plus_Blue} alt="" />
                                </button>
                            </div>
                            <button id="addProductToCart" onClick={() => addToCart()}>
                                <img src={CircledPlus_White} alt="" />
                                {LocalizedLanguage.addToCart} - $
                                <NumericFormat value={_product && RoundAmount(((product_price * productQty) - after_discount_total_price) + (_product.excl_tax ? _product.excl_tax : 0))} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                            </button>
                        </div>
                    </div>

                    <div id="navCover" className="nav-cover"></div>
                </div>
                <ProductDiscount isShow={isProductDiscount} toggleProductDiscount={toggleProductDiscount} selecteditem={props.selProduct}></ProductDiscount>
                <AdjustInventory isShow={isAdjustInventory} toggleAdjustInventory={toggleAdjustInventory}
                    productStockQuantity={_currentStock}
                    product={_product}
                    fatchUpdateInventory={fatchUpdateInventory}
                    isAdjustInventory={isAdjustInventory}
                ></AdjustInventory>
                <NoVariationSelected isShow={isNoVariationSelected} toggleNoVariationSelected={toggleNoVariationSelected}></NoVariationSelected>
                <ProductNote isShow={isProductNote} toggleProductNote={toggleProductNote} addNote={addNote}></ProductNote>
                <MsgPopup_OutOfStock isShow={isOutOfStock} toggleOutOfStock={toggleOutOfStock} toggleAdjustInventory={toggleAdjustInventory}></MsgPopup_OutOfStock>
            </React.Fragment>)
}
export default Product 