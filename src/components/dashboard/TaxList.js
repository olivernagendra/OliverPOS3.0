import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import X_Icon_DarkBlue from '../../images/svg/X-Icon-DarkBlue.svg';
import { AddAttribute } from "../common/EventFunctions";
import { product } from "./product/productSlice";
import { addtoCartProduct } from "./product/productLogic";
import { changeTaxRate } from "../common/TaxSetting";
import { updateTaxRateList } from "../common/commonAPIs/taxSlice";
const TaxList = (props) => {
    const dispatch = useDispatch();
    const [selTax, setSelTax] = useState([]);
    const [taxList, setTaxList] = useState([]);
    const [tax_items, setTax_items] = useState([]);
    const [isShowTaxList, setisShowTaxList] = useState(false);
    const toggleShowTaxList = () => {
        setisShowTaxList(!isShowTaxList)
    }
    const closePopup = () => {
        props.toggleTaxList();
        setisShowTaxList(false)
    }

    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleTaxList();
            toggleShowTaxList();
            setisShowTaxList(false);
        }
    }
    const handleChange = (Id) => {
        var tax_item = tax_items.find(a => a.TaxId == Id);
        var index = tax_items.findIndex(x => x.TaxId === Id);
        if (index === -1) { }
        else if (tax_item != null && typeof tax_item != "undefined") {
            tax_item.check_is = !tax_item.check_is;
            var tax_List = [
                ...tax_items.slice(0, index),
                Object.assign({}, tax_items[index], tax_item),
                ...tax_items.slice(index + 1)
            ];
            setTax_items(tax_List);
        }
        onSubmit();
    }
    const onSubmit = () => {
        var taxData = []
        tax_items.map(item => {
            if (item.check_is == true)
                taxData.push(item)
        })
        if (taxData.length > 0) {
            localStorage.setItem("SELECTED_TAX", JSON.stringify(taxData));
            if (localStorage.getItem('TAXT_RATE_LIST')) {
                var apply_tax_is = JSON.parse(localStorage.getItem('TAXT_RATE_LIST'));
                if (apply_tax_is.length > 0) {
                    var result1 = apply_tax_is;
                    var result2 = taxData;
                    var props = ['TaxId', 'TaxName'];
                    var result = result1.filter(function (o1) {
                        // filter out (!) items in result2
                        return !result2.some(function (o2) {
                            return parseInt(o1.TaxId) === parseInt(o2.TaxId); // assumes unique id
                        });
                    }).map(function (o) {
                        // use reduce to make objects with only the required properties
                        // and map to apply this to the filtered array as a whole
                        return props.reduce(function (newo, TaxName) {
                            newo[TaxName] = o[TaxName];
                            return newo;
                        }, {});
                    });
                    taxData.map(checkTax => {
                        apply_tax_is.map(items => {
                            if (items.TaxId == checkTax.TaxId) {
                                if (items) {
                                    items['check_is'] = items.check_is;
                                }
                            }
                        })
                    })

                    if (result && result.length > 0) {
                        result.map(checkTax => {
                            apply_tax_is.map(items => {
                                if (parseInt(items.TaxId) == parseInt(checkTax.TaxId)) {
                                    if (items) {
                                        items['check_is'] = false;
                                    }
                                }
                            })
                        })
                    }

                    var updateTaxCarproduct = changeTaxRate(apply_tax_is, 2);
                    dispatch(updateTaxRateList(apply_tax_is));
                    var cartItems = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
                    //dispatch(cartProductActions.addtoCartProduct(cartItems))
                    addtoCartProduct(cartItems);
                    dispatch(product());

                    // if (isMobileOnly == true) {
                    //     this.props.openModal("view_cart");
                    // }
                }
            }
        } else {
            var defaultTax = localStorage.getItem('DEFAULT_TAX') && JSON.parse(localStorage.getItem('DEFAULT_TAX'));
            if (defaultTax && defaultTax.length > 0) {
                var updateTaxCarproduct = changeTaxRate(defaultTax, 2);
                localStorage.setItem("SELECTED_TAX", JSON.stringify(defaultTax));

                dispatch(updateTaxRateList(defaultTax));
                addtoCartProduct(updateTaxCarproduct);
                dispatch(product());
            } else {
                // localStorage.removeItem("SELECTED_TAX");
                // localStorage.removeItem('TAXT_RATE_LIST');
                var updateTaxCarproduct = changeTaxRate(null, 2);


                dispatch(updateTaxRateList(null));
                addtoCartProduct(updateTaxCarproduct);
                dispatch(product());
            }
        }

        // this.props.dispatch(taxRateAction.selectedTaxList(taxData))
        //setTax_items([]);
    }
    useEffect(() => {
        getSelectedTaxList();
        getTaxList();

    }, []);
    const getTaxList = () => {
        var tax_items = localStorage.getItem("SHOP_TAXRATE_LIST") ? JSON.parse(localStorage.getItem("SHOP_TAXRATE_LIST")) : [];
        tax_items = AddAttribute(tax_items, "check_is", false);
        // if (selTax && selTax.length > 0 && tax_items) {
        //    tax_items.map(t => {
        //         var item = selTax.find(a => a.TaxId === t.TaxId);
        //         if (item && typeof item != "undefined") {
        //             console.log("-----item existed" + JSON.stringify(item));
        //             console.log("-----item t" + JSON.stringify(t));
        //         }
        //         return t;
        //     })
        // }
        setTax_items(tax_items);
    }
    const getSelectedTaxList = () => {
        var selected_tax_list = props.selectedTaxList ? props.selectedTaxList : localStorage.getItem('SELECTED_TAX') ? JSON.parse(localStorage.getItem('SELECTED_TAX')) : null;
        setSelTax(selected_tax_list);
    }
    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
            <div className={(props.isShow === true && isShowTaxList === false) ? "subwindow quick-tax current" : "subwindow quick-tax"}>
                <div className="subwindow-header" onClick={() => toggleShowTaxList()}>
                    <p>Select Tax Rate</p>
                    <button id="editTaxButton">Edit</button>
                </div>
                <div className="subwindow-body">
                    <div className="auto-margin-top"></div>
                    <div className="row">
                        <p>Default Tax</p>
                        <label>
                            <input type="radio" id="defaultTax" name="tax-type" value="defaultTax" />
                            <div className="custom-toggle">
                                <div className="knob"></div>
                            </div>
                        </label>
                    </div>
                    {selTax && selTax.map(m => {
                        return (
                            <div className="row">
                                <p>{m.TaxName}</p>
                                <label>
                                    <input type="radio" id={m.TaxName} name="tax-type" value={m.TaxName} />
                                    <div className="custom-toggle">
                                        <div className="knob"></div>
                                    </div>
                                </label>
                            </div>
                        )
                    })}
                    {/* <div className="row">
                        <p>Default Tax</p>
                        <label>
                            <input type="radio" id="defaultTax" name="tax-type" value="defaultTax" />
                            <div className="custom-toggle">
                                <div className="knob"></div>
                            </div>
                        </label>
                    </div>
                    <div className="row">
                        <p>NL Tax</p>
                        <label>
                            <input type="radio" id="NLTax" name="tax-type" value="NLTax" />
                            <div className="custom-toggle">
                                <div className="knob"></div>
                            </div>
                        </label>
                    </div> */}
                    <div className="auto-margin-bottom"></div>
                </div>
            </div>
            <div className={(props.isShow === true && isShowTaxList === true) ? "subwindow detailed-tax current" : "subwindow detailed-tax"}>
                <div className="subwindow-header">
                    <p>Select Tax Rate</p>
                    <button className="close-subwindow" onClick={() => closePopup()}>
                        <img src={X_Icon_DarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <div className="header-row">
                        <p>Tax Name</p>
                        <p>Tax Rate</p>
                        <p>Country</p>
                        <p>Province</p>
                        <p>Select</p>
                    </div>
                    {tax_items && tax_items.map((item, index) => {
                        return (<div className="option-row" key={item.TaxId}>
                            <p> {item.TaxName}</p>
                            <p> {item.TaxRate}</p>
                            <p> {item.Country}</p>
                            <p> {item.State}</p>
                            <div className="radio-container">
                                <label>

                                    <input type="radio" id={`tax_${item.TaxId}`} name={`tax_${item.TaxId}`} value={item.TaxRate} onClick={() => handleChange(item.TaxId)} checked={item.hasOwnProperty("check_is") && item.check_is == true ? true : false} />
                                    <div className="custom-radio">
                                        <div className="dot"></div>
                                    </div>
                                </label>
                            </div>
                        </div>)
                    })
                    }
                </div>
            </div>
        </div>
    )
}

export default TaxList; 