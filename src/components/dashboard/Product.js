import React, { useState, useEffect, useLayoutEffect } from "react";
import LeftNavBar from "../common/LeftNavBar";
import X_Icon_DarkBlue from '../../images/svg/X-Icon-DarkBlue.svg';
import Oliver_Icon_BaseBlue from '../../images/svg/Oliver-Icon-BaseBlue.svg';
import Coin_Blue from '../../images/svg/Coin-Blue.svg';
import Minus_Blue from '../../images/svg/Minus-Blue.svg';
import Plus_Blue from '../../images/svg/Plus-Blue.svg';
import CircledPlus_White from '../../images/svg/CircledPlus-White.svg';
import Pencil from '../../images/svg/Pencil.svg';
// import Shoes from '../../images/Temp/Shoes.png';
// import CoffeeCup from '../../images/Temp/CoffeeCup.png';
// import SnapbackHat from '../../images/Temp/SnapbackHat.png';
// import Face_Mask from '../../images/Temp/Face Mask.png';
import Checkmark from '../../images/svg/Checkmark.svg';
import LockedIcon from '../../images/svg/LockedIcon.svg';
import Hanged_Tshirt from '../../images/Temp/Hanged-Tshirt.png';
import { useIndexedDB } from 'react-indexed-db';
import FormateDateAndTime from '../../settings/FormateDateAndTime';
import Config from '../../Config'
import { initProuctFn } from '../common/commonFunctions/productFn';


const Product = (props) => {
    const { add, update, getByID, getAll, deleteRecord } = useIndexedDB("modifiers");
    const { getByID: getProductByID } = useIndexedDB("products");
    const [modifierList, setModifierList] = useState([])
    const [selectedModifiers, setSelectedModifiers] = useState([])
    const [productModifiers, setProductModifiers] = useState([])
    const [saveSelectedModifiers, setSaveSelectedModifiers] = useState([])
    const [recommProducts, setRecommProducts] = useState([])


    // useIndexedDB("modifiers").getAll().then((rows) => {
    //     setModifierList(rows);
    // });

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
            console.log("---ModifierList modifiers--" + JSON.stringify(modifiers))
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
    }
    const submitChanges = () => {
        // this.setState({ SaveSelectedModifiers: selectedModifiers });
        setSaveSelectedModifiers(selectedModifiers)
        console.log("----selected modifier----" + JSON.stringify(selectedModifiers));
        setTimeout(() => {
            addModifierAsCustomFee();
            // closeModifier();
        }, 300);
    }
    const addModifierAsCustomFee = () => {

        var tax_is = props.selProduct; //this.props.getVariationProductData && getVariatioModalProduct(this.props.single_product ? this.props.single_product : this.state.variationfound ? this.state.variationfound : this.props.getVariationProductData, this.state.variationDefaultQunatity);
        var product_price = props.selProduct.Price;//getSettingCase() == 2 || getSettingCase() == 4 || getSettingCase() == 7 ? tax_is && cartPriceWithTax(tax_is.old_price, getSettingCase(), tax_is.TaxClass) : getSettingCase() == 6 ? tax_is && tax_is.old_price : tax_is && tax_is.old_price;
        console.log("---product_price---" + product_price);
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
        // if (_data && _data.length > 0)
        //     this.setState({ CustomFee_Modifiers: _data });
        console.log("----modifier as custom fee----" + JSON.stringify(_data));
    }
    const getRecomProducts = () => {
        var ids = "";
        if (props && props.selProduct) {
            ids = props.selProduct.ReletedIds;
            if (ids != "" && typeof ids!="undefined") {
                var tempArr = ids.split(',');
                if (tempArr && tempArr.length > 4) {
                    tempArr = tempArr.slice(0, 4);
                    ids = tempArr;
                }
                else if(tempArr)
                {
                    ids = tempArr;
                }
            }
        }

        if (ids != "" && typeof ids!="undefined") {
            var recomProducts = [];
            ids.map(async (id) => {
                var aa = await getProductByID(id).then((row) => {
                    return row;
                });
                recomProducts.push(aa);
                if(ids.length==recomProducts.length)
                {
                    setRecommProducts(recomProducts);
                }
            });
        }
    }
    useEffect(() => {
        if (props.isShowPopups == true) {
            getModifiers();
            getRecomProducts();
        }
    }, [props.isShowPopups,props.selProduct]);
    
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
   var  variationStockQunatity=props.selProduct?
                     (props.selProduct.ManagingStock == true && props.selProduct.StockStatus == "outofstock") ? "outofstock" :
                        (props.selProduct.StockStatus == null || props.selProduct.StockStatus == 'instock') && props.selProduct.ManagingStock == false ? "Unlimited" : (typeof props.selProduct.StockQuantity != 'undefined') && props.selProduct.StockQuantity != '' ? props.selProduct.StockQuantity  : '0':'0';
    return (
        props.isShowPopups == false ? <React.Fragment></React.Fragment> :
            <React.Fragment>
                <div className="product-wrapper" >
                    {/* <div className="navbar">
    <div className="header-row">
        <img src="../Assets/Images/SVG/Oliver-Icon-Color.svg" alt="" className="oliver-logo" />
        <img src="../Assets/Images/SVG/Oliver-Type.svg" alt="" className="oliver-text" />
    </div>
    <button id="registerButton" className="page-link selected" disabled>
        <div className="img-container">
            <img src="../Assets/Images/SVG/Register-Icon.svg" alt="" />
        </div>
        <p>Register</p>
        <div className="f-key">F1</div>
    </button>
    <button id="customersButton" className="page-link disabled" disabled>
        <div className="img-container">
            <img src="../Assets/Images/SVG/Customers-Icon.svg" alt="" />
        </div>
        <p>Customers</p>
        <div className="f-key">F2</div>
    </button>
    <button id="transactionsButton" className="page-link disabled" disabled>
        <div className="img-container">
            <img src="../Assets/Images/SVG/Transactions-Icon.svg" alt="" />
        </div>
        <p>Transactions</p>
        <div className="f-key">F3</div>
    </button>
    <button id="cashManagementButton" className="page-link disabled" disabled>
        <div className="img-container">
            <img src="../Assets/Images/SVG/CashManagement-Icon.svg" alt="" />
        </div>
        <p>Cash Management</p>
        <div className="f-key">F4</div>
    </button>
    <button id="linkLauncherButton" className="launcher">
        <div className="img-container">
            <img src="../Assets/Images/SVG/LinkLauncher-Icon.svg" alt="" />
        </div>
        <p>Link Launcher</p>
    </button>
    <div className="divider"></div>
    <button id="appLauncherButton" className="launcher">
        <div className="img-container">
            <img src={Oliver_Icon_BaseBlue} alt="" />
        </div>
        <p>App Launcher</p>
    </button>
    <button id="navApp1" className="launcher app">
        <div className="img-container">
            <img src="../Assets/Images/Temp/ClockIn_Icon.png" alt="" />
        </div>
        <p>Clock-in App</p>
    </button>
    <button id="navApp2" className="launcher app">
        <div className="img-container">
            <img src="../Assets/Images/Temp/MC_Logo 1.png" alt="" />
        </div>
        <p>MailChimp</p>
    </button>
    <button id="navApp3" className="launcher app">
        <div className="img-container">
            <img src="../Assets/Images/Temp/Quickbooks 1.png" alt="" />
        </div>
        <p>Quickbooks Sync</p>
    </button>
    <button id="navToggle" className="toggle-nav">
        <div className="img-container">
            <img src="../Assets/Images/SVG/ToggleNavbar-Icon.svg" alt="" />
        </div>
        <p>Minimize Sidebar</p>
    </button>
</div> */}
                    <LeftNavBar></LeftNavBar>
                    <div className="header">
                        <div className="mobile-buttons">
                            <button id="mobileExitProductButton">
                                <img src={X_Icon_DarkBlue} alt="" />
                            </button>
                            <button id="mobileAppsButton">
                                <img src={Oliver_Icon_BaseBlue} alt="" />
                            </button>
                        </div>
                        <div className="main">
                            <p className="route">{"Clothing > T-Shirts"}</p>
                            <p className="prod-name">{props.selProduct && props.selProduct.Title}</p>
                            <button id="desktopExitProductButton" onClick={() => props.closePopUp()}>
                                <img src={X_Icon_DarkBlue} alt="" />
                            </button>
                        </div>
                    </div>
                    <div className="mod-product">
                        <div className="row">
                            <p>Select Variations</p>
                            <button id="clearModsButton">Clear Selection</button>
                        </div>
                        {

                            _DistictAttribute && _DistictAttribute.length > 0 ?
                                (_DistictAttribute.map((attribute, index) => {
                                    return (
                                        attribute && attribute.Variation == true &&
                                        // <div className="col" key={index}>
                                        <React.Fragment><p>{attribute.Name}</p>
                                            <div className="radio-group">
                                                {
                                                    (attribute.Option ? attribute.Option.split(',') : []).map(a => {
                                                        return <label><input type="radio" id={attribute.Name + "" + a} name={attribute.Name} /><div className="custom-radio"><p>{a}</p></div></label>
                                                        {/* return <p key={"att_name"+index}>{a}</p> */ }
                                                    })
                                                }
                                                {/* <p key={"att_name"+index}>{attribute.Name}</p>
                        <div className="row" key={"sub_att_name"+index}>
                            </div> */}

                                            </div></React.Fragment>
                                    )
                                })
                                )
                                : <div className='noAttribute'></div>}
                        {/* <p>Size</p>
                    <div className="radio-group">
                        <label>
                            <input type="radio" id="sizeSmall" name="size" />
                            <div className="custom-radio">
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis laudantium recusandae, ea dolorem, excepturi distinctio quibusdam vitae commodi assumenda illum accusamus! Consequatur dignissimos vel nulla in! Blanditiis expedita quibusdam illo.</p>
                            </div>
                        </label>
                        <label>
                            <input type="radio" id="sizeMedium" name="size" />
                            <div className="custom-radio">
                                <p>Medium</p>
                            </div>
                        </label>
                        <label>
                            <input type="radio" id="sizeLarge" name="size" />
                            <div className="custom-radio">
                                <p>Large</p>
                            </div>
                        </label>
                        <label>
                            <input type="radio" id="sizeXL" name="size" />
                            <div className="custom-radio">
                                <p>XL</p>
                            </div>
                        </label>
                        <label>
                            <input type="radio" id="sizeXXL" name="size" />
                            <div className="custom-radio">
                                <p>XXL</p>
                            </div>
                        </label>
                    </div>
                    <p>Color</p>
                    <div className="radio-group">
                        <label>
                            <input type="radio" id="colorBlue" name="color" />
                            <div className="custom-radio">
                                <p>Blue</p>
                            </div>
                        </label>
                        <label>
                            <input type="radio" id="colorRed" name="color" />
                            <div className="custom-radio">
                                <p>Red</p>
                            </div>
                        </label>
                        <label>
                            <input type="radio" id="colorYellow" name="color" />
                            <div className="custom-radio">
                                <p>Yellow</p>
                            </div>
                        </label>
                        <label>
                            <input type="radio" id="colorPurple" name="color" />
                            <div className="custom-radio">
                                <p>Purple</p>
                            </div>
                        </label>
                        <label>
                            <input type="radio" id="colorBlack" name="color" />
                            <div className="custom-radio">
                                <p>Black</p>
                            </div>
                        </label>
                        <label>
                            <input type="radio" id="colorPink" name="color" />
                            <div className="custom-radio">
                                <p>Pink</p>
                            </div>
                        </label>
                    </div> */}
                        <div className="row">
                            <p>Select Modifier</p>
                        </div>
                        {/* <div onChange={onChangeValue}> */}
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
                                                            var id = (efm.Name != null && typeof efm.Name != "undefined") &&(efm.Name).replace(/ /g, "_");
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
                                                            var id = (efm.Name != null && typeof efm.Name != "undefined") &&(efm.Name).replace(/ /g, "_");
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
                        }
                        {/* </div> */}
                        {/* <p>Custom Logo</p>
                    <div className="radio-group">
                        <label>
                            <input type="radio" id="customLogoYes" name="customLogo" />
                            <div className="custom-radio">
                                <p>Yes</p>
                            </div>
                        </label>
                        <label>
                            <input type="radio" id="customLogoNo" name="customLogo" />
                            <div className="custom-radio">
                                <p>No</p>
                            </div>
                        </label>
                        <label>
                            <input type="radio" id="customLogoExtra" name="customLogo" />
                            <div className="custom-radio">
                                <p>Extra (+$2.00)</p>
                            </div>
                        </label>
                    </div>
                    <p>Logo on Back</p>
                    <div className="radio-group">
                        <label>
                            <input type="radio" id="backLogoYes" name="backLogo" />
                            <div className="custom-radio">
                                <p>Yes</p>
                            </div>
                        </label>
                        <label>
                            <input type="radio" id="backLogoNo" name="backLogo" />
                            <div className="custom-radio">
                                <p>No</p>
                            </div>
                        </label>
                    </div>
                    <p>Pickles</p>
                    <div className="radio-group">
                        <label>
                            <input type="radio" id="picklesYes" name="pickles" />
                            <div className="custom-radio">
                                <p>Yes</p>
                            </div>
                        </label>
                        <label>
                            <input type="radio" id="picklesNo" name="pickles" />
                            <div className="custom-radio">
                                <p>No</p>
                            </div>
                        </label>
                    </div> */}
                    </div>
                    <div className="detailed-product">
                        <div className="row">
                            <div className="product-image-container">
                                <img src={props.selProduct && props.selProduct.ProductImage} alt="" id="productImage" className="height-fit"/>
                            </div>
                            <div className="col">
                                <p className="mobile-only">Stock Details</p>
                                <div className="group">
                                    <div className="text-row">
                                        <p className="mobile-only">Currently in stock:</p>
                                        <p className="quantity">{variationStockQunatity}</p>
                                    </div>
                                    <p className="desktop-only">In Stock</p>
                                    <button>Adjust Stock</button>
                                </div>

                                <button id="addProductDiscountMobile">
                                    <img src={Coin_Blue} alt="" />
                                    Add Discount
                                </button>
                            </div>
                        </div>
                        <div className="col">
                            <p className="title">Description</p>
                            <p className="para" dangerouslySetInnerHTML={{__html: props.selProduct && props.selProduct.Description}}>
                                
                            </p>
                            <p className="title">Additional Fields</p>
                            <p className="para">
                                Material: 100% Cotton <br />
                                Origin: Made in Canada
                            </p>
                            <p className="title">Custom Fields</p>
                            <p className="para">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean erat sem, facilisis vel tincidunt nec, posuere ac ante.
                            </p>
                            <p className="title">SKU #</p>
                            <p className="para">{props.selProduct && props.selProduct.Sku}</p>
                            <p className="title">Barcode ID #</p>
                            <p className="para">{props.selProduct && props.selProduct.Barcode}</p>
                        </div>
                    </div>
                    <div className="recommended-upsells">
                        <p>Recommended Upsells</p>
                        <div className="button-row">
                            {recommProducts && recommProducts.map(a => {
                                return <button onClick={()=>props.openPopUp(a)}>
                                    <div className="img-container">
                                        <img src={a && a.ProductImage} alt="" className="height-fit"/>
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
                            <button id="addProductNote">
                                <img src={Pencil} alt="" />
                                Add Note
                            </button>
                            <button id="addProductDiscount">Add Discount</button>
                        </div>
                        <div className="row">
                            <div className="increment-input">
                                <button>
                                    <img src={Minus_Blue} alt="" />
                                </button>
                                <input type="number" readOnly placeholder="0" />
                                <button>
                                    <img src={Plus_Blue} alt="" />
                                </button>
                            </div>
                            <button id="addProductToCart" >
                                <img src={CircledPlus_White} alt="" />
                                Add to Cart
                            </button>
                        </div>
                    </div>

                    <div id="navCover" className="nav-cover"></div>
                </div>
                <div className="subwindow-wrapper hidden">
                    <div id="iframeSubwindow" className="subwindow iframe-popup">
                        <div className="subwindow-header">
                            <div className="img-container">
                                <img src="" alt="" />
                            </div>
                            <div className="col">
                                <p className="style1">Placeholder</p>
                                <p className="style2">Placeholder</p>
                            </div>
                            <button className="close-subwindow">
                                <img src={X_Icon_DarkBlue} alt="" />
                            </button>
                        </div>
                        <div className="subwindow-body">
                            <iframe src="" frameBorder="0"></iframe>
                        </div>
                    </div>
                    <div className="subwindow create-customer">
                        <div className="subwindow-header">
                            <p>Create Customer</p>
                            <button className="close-subwindow">
                                <img src={X_Icon_DarkBlue} alt="" />
                            </button>
                        </div>
                        <div className="subwindow-body">
                            <section id="contactInfoSection">
                                <p>Contact Information</p>
                                <div className="input-row">
                                    <div className="input-col">
                                        <label htmlFor="email">Email*</label>
                                        <input type="email" id="email" placeholder="Enter Email" />
                                    </div>
                                    <div className="input-col">
                                        <label htmlFor="tel">Phone Number</label>
                                        <input type="tel" id="tel" placeholder="Enter Phone Number" />
                                    </div>
                                </div>
                                <div className="input-row">
                                    <div className="input-col">
                                        <label htmlFor="fName">First Name</label>
                                        <input type="text" id="fName" placeholder="Enter First Name" />
                                    </div>
                                    <div className="input-col">
                                        <label htmlFor="lName">Last Name</label>
                                        <input type="text" id="lName" placeholder="Enter Last Name" />
                                    </div>
                                    <div className="input-col">
                                        <label htmlFor="website">Website</label>
                                        <input type="url" id="website" placeholder="Enter URL" />
                                    </div>
                                </div>
                            </section>
                            <section id="billingAddress">
                                <p>Billing Address</p>
                                <div className="input-row">
                                    <div className="input-col">
                                        <label htmlFor="billingAddress1">Address 1</label>
                                        <input type="text" id="billingAddress1" placeholder="Enter Address 1" />
                                    </div>
                                    <div className="input-col">
                                        <label htmlFor="billingAddress2">Address 2</label>
                                        <input type="text" id="billingAddress2" placeholder="Enter Address 2" />
                                    </div>
                                </div>
                                <div className="input-row">
                                    <div className="input-col">
                                        <label htmlFor="billingZipPostal">Zip/Postal Code</label>
                                        <input type="text" id="billingZipPostal" placeholder="Enter Zip/Postal Code" />
                                    </div>
                                    <div className="input-col">
                                        <label htmlFor="billingCity">City</label>
                                        <input type="text" id="billingCity" placeholder="Enter City" />
                                    </div>
                                    <div className="input-col">
                                        <label htmlFor="billingCountry">Country</label>
                                        <input type="text" id="billingCountry" placeholder="Select Country" />
                                    </div>
                                </div>
                            </section>
                            <section id="shippingAddress">
                                <div className="title-row">
                                    <p>Shipping Address</p>
                                    <label className="custom-checkbox-wrapper">
                                        <input type="checkbox" id="sameAsBillingCheckbox" />
                                        <div className="custom-checkbox">
                                            <img src={Checkmark} alt="" />
                                        </div>
                                        Same as billing
                                    </label>
                                </div>
                                <div className="input-row">
                                    <div className="input-col">
                                        <label htmlFor="shippingAddress1">Address 1</label>
                                        <input type="text" id="shippingAddress1" placeholder="Enter Address 1" />
                                    </div>
                                    <div className="input-col">
                                        <label htmlFor="shippingAddress2">Address 2</label>
                                        <input type="text" id="shippingAddress2" placeholder="Enter Address 2" />
                                    </div>
                                </div>
                                <div className="input-row">
                                    <div className="input-col">
                                        <label htmlFor="shippingZipPostal">Zip/Postal Code</label>
                                        <input type="text" id="shippingZipPostal" placeholder="Enter Zip/Postal Code" />
                                    </div>
                                    <div className="input-col">
                                        <label htmlFor="shippingCity">City</label>
                                        <input type="text" id="shippingCity" placeholder="Enter City" />
                                    </div>
                                    <div className="input-col">
                                        <label htmlFor="shippingCountry">Country</label>
                                        <input type="text" id="shippingCountry" placeholder="Select Country" />
                                    </div>
                                </div>
                            </section>
                            <button>Create Customer</button>
                        </div>
                    </div>
                    <div className="subwindow upgrade-to-unlock">
                        <div className="subwindow-body">
                            <div className="auto-margin-top"></div>
                            <img src={LockedIcon} alt="" />
                            <p className="style1">Upgrade to unlock this feature!</p>
                            <p className="style2">
                                This feature is not included in your plan. <br />
                                Please upgrade your plan in Oliver HUB <br />
                                to access this feature.
                            </p>
                            <button id="upgradeToUnlockExit">Go Back</button>
                            <div className="auto-margin-bottom"></div>
                        </div>
                    </div>
                </div>
            </React.Fragment>)
}
export default Product 