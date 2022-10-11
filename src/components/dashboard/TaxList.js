import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import X_Icon_DarkBlue from '../../assets/images/svg/X-Icon-DarkBlue.svg';
import { AddAttribute } from "../common/EventFunctions";
import { product } from "./product/productSlice";
import { addtoCartProduct } from "./product/productLogic";
import { changeTaxRate } from "../common/TaxSetting";
import { updateTaxRateList,selectedTaxList } from "../common/commonAPIs/taxSlice";
import LocalizedLanguage from "../../settings/LocalizedLanguage";
import STATUSES from "../../constants/apiStatus";
const TaxList = (props) => {
    const dispatch = useDispatch();
    const [selTax, setSelTax] = useState([]);
     const [taxRateList, setTaxRateList] = useState([]);
    const [tax_items, setTax_items] = useState([]);
    const [isShowTaxList, setisShowTaxList] = useState(false);
    const [isDefaultTax, setisDefaultTax] = useState(true);
    const toggleShowTaxList = () => {
        if(isShowTaxList==false)
        {
            getTaxList();
        }
        
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
        //onSubmit();
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
                    // var result1 = apply_tax_is;
                    // var result2 = taxData;
                    // var props = ['TaxId', 'TaxName'];
                    // var result = result1.filter(function (o1) {
                    //     // filter out (!) items in result2
                    //     return !result2.some(function (o2) {
                    //         return parseInt(o1.TaxId) === parseInt(o2.TaxId); // assumes unique id
                    //     });
                    // }).map(function (o) {
                    //     // use reduce to make objects with only the required properties
                    //     // and map to apply this to the filtered array as a whole
                    //     return props.reduce(function (newo, TaxName) {
                    //         newo[TaxName] = o[TaxName];
                    //         return newo;
                    //     }, {});
                    // });
                    taxData.map(checkTax => {
                        apply_tax_is.map(items => {
                            if (items.TaxId == checkTax.TaxId) {
                                if (items) {
                                    items['check_is'] = checkTax.check_is;
                                }
                            }
                        })
                    })

                    // if (result && result.length > 0) {
                    //     result.map(checkTax => {
                    //         apply_tax_is.map(items => {
                    //             if (parseInt(items.TaxId) == parseInt(checkTax.TaxId)) {
                    //                 if (items) {
                    //                     items['check_is'] = false;
                    //                 }
                    //             }
                    //         })
                    //     })
                    // }

                    // var updateTaxCarproduct = changeTaxRate(apply_tax_is, 2);
                    // dispatch(updateTaxRateList(apply_tax_is));
                    // var cartItems = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
                    // //dispatch(cartProductActions.addtoCartProduct(cartItems))
                    // addtoCartProduct(cartItems);
                    // dispatch(product());

                    // if (isMobileOnly == true) {
                    //     this.props.openModal("view_cart");
                    // }
                }
            }
            else {
                // var defaultTax = localStorage.getItem('DEFAULT_TAX') && JSON.parse(localStorage.getItem('DEFAULT_TAX'));
                // if (defaultTax && defaultTax.length > 0) {
                //     var updateTaxCarproduct = changeTaxRate(defaultTax, 2);
                //     localStorage.setItem("SELECTED_TAX", JSON.stringify(defaultTax));
    
                //     dispatch(updateTaxRateList(defaultTax));
                //     addtoCartProduct(updateTaxCarproduct);
                //     dispatch(product());
                // }
            }
        } else {
            // var defaultTax = localStorage.getItem('DEFAULT_TAX') && JSON.parse(localStorage.getItem('DEFAULT_TAX'));
            // if (defaultTax && defaultTax.length > 0) {
            //     var updateTaxCarproduct = changeTaxRate(defaultTax, 2);
            //     localStorage.setItem("SELECTED_TAX", JSON.stringify(defaultTax));

            //     dispatch(updateTaxRateList(defaultTax));
            //     addtoCartProduct(updateTaxCarproduct);
            //     dispatch(product());
            // } else {
            //     localStorage.removeItem("SELECTED_TAX");
            //     localStorage.removeItem('TAXT_RATE_LIST');
            //     var updateTaxCarproduct = changeTaxRate(null, 2);
            //     dispatch(updateTaxRateList(null));
            //     addtoCartProduct(updateTaxCarproduct);
            //     dispatch(product());
            // }
        }
        dispatch(selectedTaxList(taxData));
        // setTimeout(() => {
        //     getSelectedTaxList();
        // }, 100);
        toggleShowTaxList();
        props.toggleTaxList();
        // this.props.dispatch(taxRateAction.selectedTaxList(taxData))
        //setTax_items([]);
    }
    useEffect(() => {
        getSelectedTaxList();
        // setTimeout(() => {
        //     getTaxList();
        // }, 400);
        
    }, []);
    const getTaxList = () => {
        var _tax_items = localStorage.getItem("SHOP_TAXRATE_LIST") ? JSON.parse(localStorage.getItem("SHOP_TAXRATE_LIST")) : [];
        _tax_items = AddAttribute(_tax_items, "check_is", false);
        if (selTax && selTax.length > 0 && _tax_items) {
            _tax_items.map(t => {
                var item = selTax.find(a => a.TaxId === t.TaxId);
                if (item && typeof item != "undefined") {
                    console.log("-----item existed" + JSON.stringify(item));
                    console.log("-----item t" + JSON.stringify(t));
                    t["check_is"]=true
                }
            })
        }
        setTax_items(_tax_items);
    }
    const getSelectedTaxList = () => {
        
        var selected_tax_list =  localStorage.getItem('SELECTED_TAX') ? JSON.parse(localStorage.getItem('SELECTED_TAX')) :[];
        var UpdateTaxRateList=localStorage.getItem('TAXT_RATE_LIST') ? JSON.parse(localStorage.getItem('TAXT_RATE_LIST')) : [];;
        selected_tax_list && selected_tax_list.map((item, index) => {
            var checkStatus = false;
            if (UpdateTaxRateList && UpdateTaxRateList.length > 0) {
                var updatedTax = UpdateTaxRateList.find(items => parseInt(items.TaxId) == parseInt(item.TaxId));
                if (updatedTax && typeof updatedTax!="undefined" && updatedTax.check_is == true) {
                    checkStatus = true;
                    item["check_is"]=true;
                }
                else if(updatedTax && updatedTax.check_is == false)
                {
                    item["check_is"]=false;
                }
                else if(typeof updatedTax!="undefined")
                {item["check_is"]=false;}
            }
        });
        
        setSelTax(selected_tax_list);
        
        
        
        
        var apply_defult_tax = localStorage.getItem('DEFAULT_TAX_STATUS') ? localStorage.getItem('DEFAULT_TAX_STATUS').toString() : null;
        if(apply_defult_tax==="true")
        {
            setisDefaultTax(true);
        }
        else
        {
            setisDefaultTax(false);
        }
    }
    // const [resGetRates] = useSelector((state) => [state.getRates])
    // useEffect(() => {
    //     if ((resGetRates && resGetRates.status == STATUSES.IDLE && resGetRates.is_success)) {
    //         setTaxRateList(resGetRates.data.content);
    //         console.log("---resGetRates.data.content---"+JSON.stringify(resGetRates.data.content))
    //     }
    // }, [resGetRates]);
    const updateOnSelectedTax=(tax,e)=>
    {
        console.log("---selecte dtax---"+JSON.stringify(tax))
        // console.log("---selecte dtax event---"+JSON.stringify(e.currentTarget))
        var is_check=true;
        if(e && e.currentTarget && e.currentTarget.checked && e.currentTarget.checked)
        {
            is_check=e.currentTarget.checked;
        }
        //{"TaxId":4,"TaxRate":"15%","TaxName":"sgst","TaxClass":"zero-rate","Country":"","State":"","City":null,"PostCode":null,"Priority":"1","Compound":"0","Shipping":"1","check_is":true}
        //var _taxRateList= taxRateList && taxRateList.length>0? (localStorage.getItem('TAXT_RATE_LIST') ? JSON.parse(localStorage.getItem('TAXT_RATE_LIST')) : []):[];
        var _taxRateList=localStorage.getItem('TAXT_RATE_LIST') ? JSON.parse(localStorage.getItem('TAXT_RATE_LIST')) : [];
        // taxRateList.push({
        //     check_is: tax.check_is,
        //     TaxRate: tax.TaxRate,
        //     TaxName: tax.TaxName,
        //     TaxId: tax.TaxId,
        //     Country: tax.Country,
        //     State: tax.State,
        //     TaxClass: tax.TaxClass
        // })
        

        //---
        if (_taxRateList.length == 0) {
            _taxRateList.push({
                check_is: is_check,
                TaxRate: tax.TaxRate,
                TaxName: tax.TaxName,
                TaxId: tax.TaxId,
                Country: tax.Country,
                State: tax.State,
                TaxClass: tax.TaxClass
            })
        } else {
            var FindId = _taxRateList.find(isName => parseInt(isName.TaxId) === parseInt(tax.TaxId));
            if (FindId) {
                _taxRateList.map(item => {
                    if (item.TaxId == FindId.TaxId) {
                        // if (!item.hasOwnProperty('check_is')) {
                        //     item['check_is'] = is_check;
                        // }
                        // else
                        {item['check_is'] = FindId.check_is == true ? false : true;}
                    }
                })
            } else {
                _taxRateList.push({
                    check_is: is_check,
                    TaxRate: tax.TaxRate,
                    TaxName: tax.TaxName,
                    TaxId: tax.TaxId,
                    Country: tax.Country,
                    State: tax.State,
                    TaxClass: tax.TaxClass
                })
            }
        }

        //--
        var updateTaxCarproduct = changeTaxRate(_taxRateList, 1);
        //console.log("---updateTaxCarproduct---"+JSON.stringify(updateTaxCarproduct))
        dispatch(updateTaxRateList(_taxRateList));
        var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];//this.state.cartproductlist;
        addtoCartProduct(cartlist);
        //dispatch(addtoCartProduct(updateTaxCarproduct));
        dispatch(product());
    }
    const defaultTax=()=>
    {
        setisDefaultTax(!isDefaultTax)
        localStorage.setItem('DEFAULT_TAX_STATUS',(!isDefaultTax).toString());
        var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];//this.state.cartproductlist;
        addtoCartProduct(cartlist);
        dispatch(product());
    }

    const [ respupdateTaxRateList] = useSelector((state) => [ state.updateTaxRateList])
    useEffect(() => {
        if (respupdateTaxRateList && respupdateTaxRateList.status == STATUSES.IDLE && respupdateTaxRateList.is_success) {
            //setTaxRateList(respupdateTaxRateList.data)
            getSelectedTaxList();
        }
    }, [respupdateTaxRateList]);
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
                            <input type="radio" id="defaultTax" name="tax-type" value="defaultTax" onClick={()=>defaultTax()} checked={isDefaultTax==true?true:false}/>
                            <div className="custom-toggle">
                                <div className="knob"></div>
                            </div>
                        </label>
                    </div>
                    {selTax && selTax.map(m => {
                        return (
                            <div className= {isDefaultTax===false ?"row":"row btn-disable"} key={m.TaxId}>
                                <p>{m.TaxName}</p>
                                <label>
                                    <input type="radio" id={m.TaxName} name={m.TaxName} value={m.TaxName} onClick={(e)=>isDefaultTax===false ?updateOnSelectedTax(m,e):null} checked={m.check_is==true?true:false}/>
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
                    <p>{LocalizedLanguage.selectTax}</p>
                    <button className="close-subwindow" onClick={() => closePopup()}>
                        <img src={X_Icon_DarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <div className="header-row">
                        <p>{LocalizedLanguage.taxName}</p>
                        <p>{LocalizedLanguage.taxRate}</p>
                        <p>{LocalizedLanguage.country}</p>
                        <p>{LocalizedLanguage.province}</p>
                        <p>Select</p>
                    </div>
                    <div className="options-container">
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
                    <div className="footer" onClick={()=>onSubmit()}>
						<button id="saveTax">Save & Update</button>
					</div>
                </div>
            </div>
        </div>
    )
}

export default TaxList; 