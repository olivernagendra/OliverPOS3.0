import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import LeftNavBar from "../../common/commonComponents/LeftNavBar";
import X_Icon_DarkBlue from '../../../images/svg/X-Icon-DarkBlue.svg';
import Oliver_Icon_BaseBlue from '../../../images/svg/Oliver-Icon-BaseBlue.svg';
import Coin_Blue from '../../../images/svg/Coin-Blue.svg';
import Minus_Blue from '../../../images/svg/Minus-Blue.svg';
import Plus_Blue from '../../../images/svg/Plus-Blue.svg';
import CircledPlus_White from '../../../images/svg/CircledPlus-White.svg';
import NoVariationDisplay from '../../../images/svg/NoVariationDisplay.svg';
import NoImageAvailable from '../../../images/svg/NoImageAvailable.svg';
import Pencil from '../../../images/svg/Pencil.svg';
// import Shoes from '../../../images/Temp/Shoes.png';
// import CoffeeCup from '../../../images/Temp/CoffeeCup.png';
// import SnapbackHat from '../../../images/Temp/SnapbackHat.png';
// import Face_Mask from '../../../images/Temp/Face Mask.png';
import Checkmark from '../../../images/svg/Checkmark.svg';
import LockedIcon from '../../../images/svg/LockedIcon.svg';
import Hanged_Tshirt from '../../../images/Temp/Hanged-Tshirt.png';
import { useIndexedDB } from 'react-indexed-db';
import FormateDateAndTime from '../../../settings/FormateDateAndTime';
import Config from '../../../Config'
import { initProuctFn } from '../../common/commonFunctions/productFn';
import ProductNote from "./ProductNote";
import ProductDiscount from "./ProductDiscount";
import AdjustInventory from "./AdjustInventory";
import NoVariationSelected from "./NoVariationSelected";
import MsgPopup_OutOfStock from "./MsgPopup_OutOfStock";
import { addSimpleProducttoCart, updateProductNote } from './productLogic';
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

    const [respAttribute] = useSelector((state) => [state.attribute])
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
        if (currentWareHouseDetail && currentWareHouseDetail.Quantity) {
            setVariationStockQunatity(currentWareHouseDetail.Quantity)
            console.log("product Qty", currentWareHouseDetail.Quantity)
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
    const addModifierAsCustomFee = () => {

        var tax_is = props.selProduct; //this.props.getVariationProductData && getVariatioModalProduct(this.props.single_product ? this.props.single_product : this.state.variationfound ? this.state.variationfound : this.props.getVariationProductData, this.state.variationDefaultQunatity);
        var product_price = props.selProduct.Price;//getSettingCase() == 2 || getSettingCase() == 4 || getSettingCase() == 7 ? tax_is && cartPriceWithTax(tax_is.old_price, getSettingCase(), tax_is.TaxClass) : getSettingCase() == 6 ? tax_is && tax_is.old_price : tax_is && tax_is.old_price;
        // console.log("---product_price---" + product_price);
        var _data = [];
        saveSelectedModifiers && saveSelectedModifiers.map(m => {
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
            setCustomFeeModifiers(_data)
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

    // const saveSelectedOption = () => {
    //     //console.log("selOptions--" + JSON.stringify(selVariations.length))
    //     if (selVariations.length == 0)
    //     {
    //         console.log("----_selVariations save" + JSON.stringify(_selVariationsEdit))
    //         setTimeout(() => {
    //         setSelVariations(_selVariationsEdit);
    //         }, 100);
    //     }
    // }



    var _selVariationsEdit = [];
    const setSelectedOption = (option, attribute, AttrIndex) => {
        // _disableAttribute = []
        _selVariationsEdit = selVariations;
        var _item = _selVariationsEdit.findIndex((element) => {
            return element.Name === attribute.Name;
        })
        if (_item == -1) {
            _selVariationsEdit.push({ "Name": attribute.Name, "Option": option, "Index": AttrIndex, "OptionTitle": option.replace(/\s/g, '-').toLowerCase() });
        }
        _selVariationsEdit = _selVariationsEdit.map(obj => {
            if (obj.Name === attribute.Name) {
                return { ...obj, Option: option, OptionTitle: option.replace(/\s/g, '-').toLowerCase() };
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
        _disableAttribute = []
        var _selVariations = selVariations;
        var _item = _selVariations.findIndex((element) => {
            return element.Name === attribute.Name;
        })
        if (_item == -1) {
            _selVariations.push({ "Name": attribute.Name, "Option": option, "Index": AttrIndex, "OptionTitle": option.replace(/\s/g, '-').toLowerCase() });
        }
        _selVariations = _selVariations.map(obj => {
            if (obj.Name === attribute.Name) {
                return { ...obj, Option: option, OptionTitle: option.replace(/\s/g, '-').toLowerCase() };
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
                        return selVariations.every(ele => (allCombi.includes(ele.OptionTitle) || allCombi.includes("**")) && _attribute.length === selVariations.length)
                    })
                    if (filteredAttribute && filteredAttribute.length == 1) {
                        props.updateVariationProduct && props.updateVariationProduct(filteredAttribute[0]);
                        dispatch(getInventory(filteredAttribute[0].WPID)); //call to get product warehouse quantity

                    }
                    else {
                        props.updateVariationProduct && props.updateVariationProduct(null);
                        // dispatch(getInventory(null)); //call to get product warehouse quantity
                    }
                    //console.log("--filteredAttribute--- ", JSON.stringify(filteredAttribute));
                    //console.log("--att p count--- ", JSON.stringify(filteredAttribute.length));

                    var filteredAttribute1 = allProdcuts.filter(item => {
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
                        if (attribute && attribute.Option) {
                            (attribute.Option ? attribute.Option.split(',') : []).map((a, i) => {
                                var _att = a.replace(/\//g, "-").toLowerCase();
                                const index = _disableAttribute.findIndex(item => item === _att)
                                if (index === -1) {
                                    _disableAttribute.push(_att);
                                }
                            })
                        }

                        var result = selVariations.every(ele => (allCombi.includes(ele.OptionTitle) || allCombi.includes("**")) /*&& _attribute.length===selVariations.length*/)
                        // if (result === true) {
                        //     console.log("--att p count--->> ", allCombi.join(','));
                        // }
                        return result;
                    })
                    // filteredAttribute1 && filteredAttribute1.length > 0 && filteredAttribute1.map(a => {
                    //     console.log("-------combi----" + a.combination);
                    // })
                    // console.log("--_disableAttribute--- ", JSON.stringify(_disableAttribute));
                    // console.log("--allVariations--- ", JSON.stringify(allVariations));

                }

            });
        }
    }

    ///-------xxxxx-------
    var filterTerms = [];
    var selectedAttribute = [];
    var filteredAttributeArray = [];
    var selectedOptionCode = [];
    var selectedOptions = [];
    var variationfound = {};
    var Variations = [];
    // const optionClick1 = (option, attribute, AttrIndex) => {

    //     getAllProducts().then((rows) => {
    //         var data = rows.filter(a => a.ParentId === props.selProduct.WPID);
    //         Variations = getTaxAllProduct(data)



    //         //var filterTerms = this.state.filterTerms;
    //         var optExist = false;
    //         filterTerms && filterTerms.map(opItem => {
    //             if (opItem.attribute === attribute) {
    //                 opItem.attribute = attribute;
    //                 opItem.option = option;
    //                 optExist = true
    //             }
    //         })
    //         if (optExist == false) {
    //             filterTerms.push({
    //                 attribute: attribute,
    //                 option: option,
    //                 index: AttrIndex
    //             })
    //             // this.state.filterTerms = filterTerms
    //             // this.setState({ filterTerms: filterTerms })
    //         }
    //         // this.setState({ filterTerms: filterTerms })
    //         // if (this.clickTimeout !== null) {
    //         //     clearTimeout(this.clickTimeout)
    //         //     this.clickTimeout = null
    //         // } else {
    //         //     this.clickTimeout = setTimeout(() => {
    //         //         clearTimeout(this.clickTimeout)
    //         //         this.clickTimeout = null
    //         //     }, 300);
    //         //this.setState({
    //         selectedAttribute = attribute;
    //         //});
    //         if (props.selProduct.ProductAttributes && props.selProduct.ProductAttributes.length > 1) {
    //             var filteredAttribute = Variations.filter(item => {
    //                 var optionRes = option.replace(/\s/g, '-').toLowerCase();
    //                 optionRes = optionRes.replace(/\//g, "-").toLowerCase();
    //                 var isExist = false;
    //                 item && item.combination !== null && item.combination !== undefined && item.combination.split("~").map(combination => {
    //                     if (combination.replace(/\s/g, '-').replace(/\//g, "-").toLowerCase() === optionRes || combination == "**")
    //                         isExist = true;
    //                 })
    //                 return isExist;
    //             })
    //             filteredAttributeArray = filteredAttribute;
    //         }
    //         setSelectedOption(option, attribute, AttrIndex);
    //         // var attributeLenght = this.getAttributeLenght();
    //         searchvariationProduct(option);
    //         //}
    //     });
    // }

    // const setSelectedOption = (option, attribute, AttrIndex) => {
    //     //Find Attribute Code----------------------------------------------
    //     var attribute_list = [];
    //     if (respAttribute.is_success === true && respAttribute.data && respAttribute.data.content != null) { attribute_list = respAttribute.data.content; }

    //     //var attribute_list = localStorage.getItem("attributelist") && Array.isArray(JSON.parse(localStorage.getItem("attributelist"))) === true ? JSON.parse(localStorage.getItem("attributelist")) : null;
    //     var sub_attribute;

    //     var found = null;
    //     if (attribute_list !== null && attribute_list !== undefined) {
    //         found = attribute_list.find(function (element) {
    //             return element.Code.toLowerCase() == attribute.Name.toLowerCase()
    //         })
    //     }
    //     if (found !== null && found !== undefined) {
    //         sub_attribute = found.SubAttributes && found.SubAttributes.find(function (element) {
    //             return element.Value.toLowerCase() == option.toLowerCase()
    //         })
    //     }
    //     var newOption = sub_attribute ? sub_attribute.Code : option;
    //     selectedOptionCode = newOption;
    //     //this.setState({ selectedOptionCode: newOption })
    //     //---------Array of selected options-----------------------------
    //     var arrAttr = selectedOptionCode ? selectedOptionCode : [];
    //     var isAttributeExist = false;
    //     arrAttr && Array.isArray(arrAttr) == true && arrAttr.length > 0 && arrAttr.map(item => {
    //         if (item.attribute.toLowerCase() == attribute.Name.toLowerCase()) {
    //             item.option = option;
    //             isAttributeExist = true;
    //         }
    //     })
    //     if (isAttributeExist == false)
    //         Array.isArray(arrAttr) == true && arrAttr.push({ attribute: attribute, option: selectedOptionCode, index: AttrIndex });
    //     //Remove Dumplecate attribute------------
    //     arrAttr = Array.isArray(arrAttr) == true && arrAttr.filter((val, id, array) => {
    //         return array.indexOf(val) == id;
    //     });
    //     selectedOptions = arrAttr;

    //     console.log("----selectedOptions---" + JSON.stringify(selectedOptions));
    //     //-------------------------------------------------------
    // }

    const combo = (c) => {
        var r = [];
        var len = c.length;
        var tmp = [];
        function nodup() {
            var got = {};
            for (var l = 0; l < tmp.length; l++) {
                if (got[tmp[l]]) return false;
                got[tmp[l]] = true;
            }
            return true;
        }
        function iter(col, done) {
            var l, rr;
            if (col === len) {
                if (nodup()) {
                    rr = [];
                    for (l = 0; l < tmp.length; l++)
                        rr.push(c[tmp[l]]);
                    r.push(rr.join('~'));
                }
            } else {
                for (l = 0; l < len; l++) {
                    tmp[col] = l;
                    iter(col + 1);
                }
            }
        }
        iter(0);
        return r;
    }

    // Decription: Update the product search on the basis of product combination. also handle the '**' search in combination  
    const searchvariationProduct = (options) => {
        var filteredArr = []
        // this.state.showQantity = false
        filterTerms.map(itm => {
            var attribute_list = localStorage.getItem("attributelist") && Array.isArray(JSON.parse(localStorage.getItem("attributelist"))) === true ? JSON.parse(localStorage.getItem("attributelist")) : null;
            var sub_attribute;
            if (attribute_list && attribute_list != undefined && attribute_list.length > 0) {
                var found = attribute_list && attribute_list.find(function (element) {
                    return element.Code.toLowerCase() == itm.attribute.Name.toLowerCase()
                })
                if (found) {
                    var SubAttributes = found.SubAttributes;
                    if (SubAttributes) {
                        sub_attribute = SubAttributes.find(function (element) {
                            return (element.Value).toLowerCase() == itm.option.toLowerCase();
                        })
                    }
                }
            }
            filteredArr.push(sub_attribute ? sub_attribute.Code : itm.option);
        })
        var cominationArr = combo(filteredArr);
        // console.log("----cominationArr---" + JSON.stringify(cominationArr));
        var variations = Variations;
        var getVariationProductData = props.selProduct
        var _fileterTerm = filterTerms ? filterTerms : "";
        var checkFound = false;
        var found = variations.find(function (element) {
            cominationArr && cominationArr.map(comb => {
                if (element && element !== undefined && element.combination && element.combination !== undefined && element.combination.replace(/\s/g, '-').replace(/\//g, "-").toLowerCase() === comb.replace(/\s/g, '-').replace(/\//g, "-").toLowerCase()) {
                    checkFound = true;
                    return true;
                }
            })
            if (checkFound == true) {
                return true;
            }
            // if product not found then--------------------------------
            ///------check 'Any One' option --------------------------------        
            if (checkFound == false) {
                //=======check variation exist for option==========================   
                // ckeck when render the attribute options-------------------  
                var checkExist = [];
                if (_fileterTerm) {
                    var sortArr = _fileterTerm.sort(function (obj1, obj2) {
                        return obj1.index - obj2.index;
                    })
                    sortArr && sortArr.map(filterattr => {
                        var arrComb = element && element !== undefined && element.combination !== null && element.combination !== undefined && element.combination.split('~');
                        if (arrComb && arrComb.length > 0) {
                            var combinationAtindex = arrComb[filterattr.index];
                            if (combinationAtindex && filterattr.option && (combinationAtindex.toLowerCase() === filterattr.option.toLowerCase() || combinationAtindex == '**'))  //variation exist for option to be displayed
                            {
                                checkExist.push('match');
                            } else {
                                checkExist.push('mismatch');
                            }
                        }
                    })
                    if (!checkExist.includes("mismatch")) {
                        return element;
                    }


                    // if product not found then--------------------------------
                    ///------check 'Any One' option --------------------------------    
                    var _attribute = getVariationProductData.ProductAttributes.filter(item => item.Variation == true)
                    if (!found && checkFound == false && _fileterTerm.length == _attribute.length)  //checking all attrbite's option selceted 
                    {
                        //=======check variation exist for option==========================   
                        // ckeck when render the attribute options-------------------  
                        var checkExist = [];
                        if (_fileterTerm) {
                            var sortArr = _fileterTerm.sort(function (obj1, obj2) {
                                return obj1.index - obj2.index;
                            })

                            sortArr && sortArr.map(filterattr => {
                                var arrComb = element.combination.split('~');
                                if (arrComb && arrComb.length > 0) {
                                    var combinationAtindex = arrComb[filterattr.index];
                                    if (combinationAtindex.toLowerCase() === filterattr.option.toLowerCase() || combinationAtindex == '**')  //variation exist for option to be displayed
                                    {
                                        checkExist.push('match');
                                    } else {
                                        checkExist.push('mismatch');
                                    }
                                }
                            })
                        }
                        if (!checkExist.includes("mismatch")) {
                            return element;
                        }
                    }
                }
            }
        })

        // if (this.props.single_product) {
        //     if ( found && this.props.single_product && found.WPID !== this.props.single_product.WPID) {
        //         localStorage.removeItem("PRODUCT");
        //         localStorage.removeItem("SINGLE_PRODUCT")
        //         this.props.dispatch(cartProductActions.singleProductDiscount());
        //     }
        // }
        // this.setState({ showSelectStatus: false })
        if (typeof found !== 'undefined') {
            var cartItemList = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
            var qty = 0;
            cartItemList.map(item => {
                if (found.WPID == item.variation_id) {

                    qty = item.quantity;

                }
            })
            variationfound = found;
            console.log("--variationfound--" + JSON.stringify(variationfound))
            // when active selected product show change variationDefaultQunatity.
            var selectedDefaultQty = 0;
            // if (this.props.showSelectedProduct && found) {
            //     const { showSelectedProduct } = this.props;
            //     if (showSelectedProduct.ParentId == found.ParentId && showSelectedProduct.WPID == found.WPID) {
            //         selectedDefaultQty = showSelectedProduct.quantity
            //     }
            // }
            // if(found){
            //     var _addTaxFoundData = getVariatioModalProduct(found, selectedDefaultQty !== 0 ? selectedDefaultQty : 1);
            //     console.log("_addTaxFoundData", _addTaxFoundData);
            // }
            // if(found){ found=this.updateActualStockQty(found);}

            // this.setState({
            //     variationTitle: found.Title && found.Title != "" ? found.Title : found.Sku,
            //     Sku: found.Sku && found.Sku != "" ? found.Sku : '',
            //     variationId: found && found.WPID,
            //     variationParentId: found && found.ParentId,
            //     variationPrice: found.Price,
            //     variationStockQunatity: (found.ManagingStock == true && found.StockStatus == "outofstock") ? "outofstock" : (found.StockStatus == null || found.StockStatus == 'instock') && found.ManagingStock == false ? "Unlimited" : found.StockQuantity - qty,
            //     variationImage: (found.ProductImage == null) ? this.state.variationImage : found.ProductImage,
            //     variationIsTaxable: found.Taxable,
            //     variationDefaultQunatity: selectedDefaultQty !== 0 ? selectedDefaultQty : 1,
            //     ManagingStock: found.ManagingStock,
            //     old_price: found.old_price,
            //     incl_tax: this.state.incl_tax,
            //     excl_tax: this.state.excl_tax,
            //     variationfound: found
            // });
            variationfound = found;
            //this.state.variationStyles = { cursor: "pointer", pointerEvents: "auto" }
            // $("#add_variation_product_btn").css({ "cursor": "pointer", "pointer-events": "auto" });
            // var _attribute = getVariationProductData.ProductAttributes.filter(item => item.Variation == true)
            // if(found && _fileterTerm.length == _attribute.length && found.ManagingStock == true){
            //     this.setState({isFetchWarehouseQty:true  ,isRefereshIconInventory : true}) 
            //     this.props.dispatch(allProductActions.productWarehouseQuantity(found.WPID));
            // }
            // if( found.ManagingStock == false){  //check the product managing stock is false then we are not calling the productWarehouseQuantity api
            //     this.state.isAttributeDelete=true;
            //     this.setState({ isRefereshIconInventory : false })
            // }
        } else {
            // this.setState({
            //     variationParentId: 0,
            //     variationPrice: 0,
            //     variationStockQunatity: 0,
            //     variationImage: "",
            //     ManagingStock: null,
            // });
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
                if (customFeeModifiers && customFeeModifiers.length > 0) {
                    //cartItemList= cartItemList.concat(this.state.CustomFee_Modifiers);
                }

                setTimeout(() => {
                    dispatch(product());
                }, 100);


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
    // useEffect(() => {
    //     props.selProduct && props.selProduct.quantity && setProductQty(props.selProduct.quantity)
    // }, [props.selProduct && props.selProduct.quantity]);

    useEffect(() => {
        if (props.selProduct && props.selProduct.quantity) {
            setProductQty(props.selProduct.quantity);
        }
        //props.selProduct && props.selProduct.quantity && setProductQty(props.selProduct.quantity)
    }, [props.selProduct]);


    const clearSelection = () => {
        setSelVariations([]);
    }
    useEffect(() => {
        if (props.isShowPopups == true) {
            setSelVariations([]);
            getModifiers();
            getRecomProducts();

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
            var item = { Name: attribute.Name, Option: attribute.Option, Slug: attribute.Slug, Option: attribute.Option, Variation: attribute.Variation, OptionAll: attribute.OptionAll };
            var isExist = _DistictAttribute && _DistictAttribute.find(function (element) {
                return (element.Slug == item.Slug)
            });
            // if (!isExist)               
            _DistictAttribute.push(item);
        });
    }
    setTimeout(() => {
        initProuctFn();
    }, 1000);

    var _product = props.variationProduct != null ? props.variationProduct : props.selProduct;
    var product_price = 0;
    var after_discount_total_price = 0;
    if (_product) {

        var after_discount_total_price = _product && _product.product_discount_amount ?
            _product.product_discount_amount * (_product.discount_type != "Number" ? _product.quantity ? _product.quantity : productQty : 1) : 0;
        product_price = getSettingCase() == 2 || getSettingCase() == 4 || getSettingCase() == 7 ? _product && cartPriceWithTax(_product.old_price, getSettingCase(), _product.TaxClass) : getSettingCase() == 6 ? _product && _product.old_price : _product && _product.old_price;
    }

    var _currentStock = currentWareHouseDetail && currentWareHouseDetail !== "" ? currentWareHouseDetail.Quantity : variationStockQunatity;
    console.log("Quantity", currentWareHouseDetail.Quantity, variationStockQunatity)
    return (
        props.isShowPopups == false ? <React.Fragment></React.Fragment> :
            <React.Fragment>
                <div className="product-wrapper" >
                    <LeftNavBar></LeftNavBar>
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
                            <div className="img-container display-flex">
                                <img src={NoVariationDisplay} alt="" />
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
                                            <div className="radio-group">
                                                {
                                                    (attribute.Option ? attribute.Option.split(',') : []).map((a, i) => {
                                                        let _item = a.replace(/\//g, "-").toLowerCase();
                                                        allVariations.push(_item);
                                                        // return <label key={"l_" + a} onClick={() => optionClick(a, attribute, i)}><input type="radio" id={attribute.Name + "" + a} name={attribute.Name} checked={selVal}/><div className="custom-radio"><p>{a}</p></div></label>
                                                        //var selVal = props.selProduct.selectedOptions ? props.selProduct.selectedOptions.includes(_item):false;
                                                        if (isEdit === true) {
                                                            var selVal = selOptions ? selOptions.includes(_item) : false;
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
                                                            var selVal = selVariations ? selVariations.some(a => a.OptionTitle === _item) : false;
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
                                            </div></React.Fragment>
                                    )
                                })
                                )
                                : <div className='noAttribute'></div>}
                        {productModifiers && productModifiers.length > 0 ? <div className="row">
                            <p>Select Modifier</p>
                        </div> : null} <div onChange={onChangeValue}>
                            {
                                productModifiers && productModifiers.map(mod => {
                                    var gpid = (mod.Title).replace(/ /g, "_");
                                    var gpname = (mod.Title).replace(/ /g, "_");
                                    switch (mod.Type) {
                                        case Config.key_InputTypes.CheckBox:
                                            return (
                                                <React.Fragment>
                                                    <p>{mod.Title}</p>
                                                    <div className="radio-group">{
                                                        mod.modifierFields && mod.modifierFields.map(mf => {
                                                            return (mf.ExtendFormData && mf.ExtendFormData.map(efm => {
                                                                var id = (efm.Name != null && typeof efm.Name != "undefined") && (efm.Name).replace(/ /g, "_");
                                                                return (
                                                                    <label>
                                                                        <input type="checkbox" id={id} name={efm.Name} value={id} data-checked-value={efm.Default} data-gparent-name={gpname} data-gpid={gpid} data-amount={efm.Amount} data-add-sub={efm.AddnSubtract} data-amount-type={efm.Type} />
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
                                                                    <p className="label">{efm.Name}</p>
                                                                    <div className="row">
                                                                        <div className="increment-input">
                                                                            <div className="decrement" onClick={qunatityChange} data-parent-id={id} data-btn-type="minus" data-gparent-name={gpname} data-gpid={gpid} data-add-sub={efm.AddnSubtract}>
                                                                                <svg width={16} height={2} viewBox="0 0 16 2">
                                                                                    <rect width={16} height={2} fill="var(--primary)" />
                                                                                </svg>
                                                                            </div>
                                                                            <input id={id + "-quantityUpdater"} type="number" name={id} data-max-number={efm.Maxnumber} defaultValue={efm.Startingnumber} data-amount={efm.Amount} data-amount-type={efm.Type} data-gparent-name={gpname} data-gpid={gpid} data-add-sub={efm.AddnSubtract} />
                                                                            <div className="increment" id="btn_dv_plus_popup" onClick={qunatityChange} data-parent-id={id} data-btn-type="plus" data-gparent-name={gpname} data-gpid={gpid} data-add-sub={efm.AddnSubtract}>
                                                                                <svg className='checkout-increament-mr' width={16} height={16} viewBox="0 0 16 16" id="btn_svg_plus_popup" >
                                                                                    <path d="M16 7H9V0H7V7H0V9H7V16H9V9H16V7Z" fill="var(--primary)" />
                                                                                </svg>
                                                                            </div>
                                                                        </div>
                                                                        <input id={id + "-amount"} type="text" defaultValue={efm.Type + " " + efm.Amount} data-amount-type={efm.Type} readOnly className='modiferAmount' />
                                                                    </div>
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
                                                    <div className="radio-group">{
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
                                                                    <p className="label">{efm.Name}</p>
                                                                    <div className="row">
                                                                        <input id={id + "-txt"} type="text" name={id + "-txt"} defaultValue={efm.Startingnumber} data-amount={efm.Amount} data-amount-type={efm.Type} data-gparent-name={gpname} data-gpid={gpid} data-add-sub={efm.AddnSubtract} className="mod-textInput" />
                                                                        <input id={id + "-amount"} type="text" defaultValue={efm.Type + " " + efm.Amount} data-amount-type={efm.Type} readOnly className='modiferAmount' />
                                                                    </div>
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
                            }</div>
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
                                        <p className="mobile-only">Currently in stock:</p>
                                        <p className="quantity">{variationStockQunatity}</p>
                                    </div>

                                    {isOutOfStock == false && <p className="desktop-only">In Stock</p>}
                                    {variationStockQunatity.toString().toLocaleLowerCase() !== 'unlimited' &&  //no need update stock when unlimited
                                        <button onClick={() => toggleAdjustInventory()}>Adjust Stock</button>
                                    }
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
                            {/* <button>
                                <div className="img-container">
                                    <img src={Shoes} alt="" />
                                </div>
                                <div className="prod-name">
                                    <p>Funky Shoes</p>
                                </div>
                            </button>
                            <button>
                                <div className="img-container">
                                    <img src={Face_Mask} alt="" />
                                </div>
                                <div className="prod-name">
                                    <p>Face Mask</p>
                                </div>
                            </button>
                            <button>
                                <div className="img-container">
                                    <img src={CoffeeCup} alt="" />
                                </div>
                                <div className="prod-name">
                                    <p>Reusable Coffee Cup</p>
                                </div>
                            </button>
                            <button>
                                <div className="img-container">
                                    <img src={SnapbackHat} alt="" />
                                </div>
                                <div className="prod-name">
                                    <p>Snapback Ballcap with Logo</p>
                                </div>
                            </button> */}
                        </div>
                    </div>
                    <div className="product-footer">
                        <div className="row">
                            <button id="addProductNote" onClick={() => toggleProductNote()}>
                                <img src={Pencil} alt="" />
                                Add Note
                            </button>
                            <button id="addProductDiscount" onClick={() => toggleProductDiscount()}>Add Discount</button>
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
                                Add to Cart - $
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
                <MsgPopup_OutOfStock isShow={isOutOfStock} toggleOutOfStock={toggleOutOfStock}></MsgPopup_OutOfStock>
            </React.Fragment>)
}
export default Product 