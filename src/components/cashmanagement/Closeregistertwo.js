import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { SaveClosingNote, openRegister } from './CashmanagementSlice'
import { useNavigate } from "react-router-dom";
import ActiveUser from '../../settings/ActiveUser';
import moment from 'moment';
import Config from '../../Config'
import { createPin, validatePin } from "../pinPage/pinSlice"
import { setAndroidKeyboard, showAndroidReceipt } from "../../settings/AndroidIOSConnect";

const Closeregistertwo = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [enterNotes, setenterNotes] = useState('')
    const enterNote = (e) => {
        const { value } = e.target;
        setenterNotes(value)
    }


    const CloseRegister = () => {
        var cashManagementID = localStorage.getItem('Cash_Management_ID');
        var saveCountParm = { "CashManagementId": cashManagementID, "Note": enterNotes }
        // console.log("saveCountParm", saveCountParm)
        dispatch(SaveClosingNote(saveCountParm))


        localStorage.removeItem("CUSTOMER_TO_OrderId")
        localStorage.removeItem('CASH_ROUNDING');
        localStorage.setItem("IsCashDrawerOpen", "false");
        localStorage.removeItem('Cash_Management_ID');
        //Webview Android keyboard setting.................... 
        localStorage.setItem('logoutclick', "true");
        setAndroidKeyboard('logout');
        //--------------------------------------------------------
        //this.props.dispatch(userActions.logout())
        // redirectToURL()
        // history.push('/loginpin');
        dispatch(validatePin(null))
        var open_register_param = {
            "RegisterId": 0,
            "RegisterName": 0,
            "LocationId": 0,
            "LocationName": "",
            "LocalDateTime": null,
            "LocalTimeZoneType": null,
            "SalePersonId": '',
            "SalePersonName": '',
            "SalePersonEmail": '',
            "ActualOpeningBalance": 0,
            "OpeningNote": '',
            "LocalTimeZoneOffsetValue": ''
        }
        dispatch(openRegister());
        localStorage.removeItem('user');
        setTimeout(() => {
            navigate('/openregister')
        }, 500);

    }

    const printHtml = (_closeRegister) => {
        var PrintAndroidReceiptData = {};
        var PrintAndroidData = [];
        var rowNumber = 0;
        var _taxDetail = [];

        console.log('_closeRegister', _closeRegister)
        //console.log(' this.state.enterNote', this.state.enterNote)
        const pageSize = ActiveUser.key.pdfFormate;
        console.log("==-------pageSize----", pageSize)

        var _totalDiff = _closeRegister && _closeRegister.Actual - _closeRegister.Expected;
        var _totalActual = _closeRegister && _closeRegister.Actual;
        var _totalExpected = _closeRegister && _closeRegister.Expected;
        var closePersonName = _closeRegister && _closeRegister.ClosingByName && _closeRegister.ClosingByName.trim() !== '' ? _closeRegister.ClosingByName : _closeRegister.ClosingByEmail;
        var SalePersonName = _closeRegister && _closeRegister.SalePersonName && _closeRegister.SalePersonName.trim() !== '' ? _closeRegister.SalePersonName : _closeRegister.SalePersonEmail;
        var otherPayments = ''
        var finaltotal = _closeRegister.Expected;
        var finalactual = _closeRegister.Actual;
        var _otherPayments = [];
        _closeRegister && _closeRegister.PaymentSummery && _closeRegister.PaymentSummery.map(item => {
            _totalDiff = _totalDiff + (item.Actual - item.Expected);
            _totalActual = _totalActual + item.Actual;
            _totalExpected = _totalExpected + item.Expected;

            finaltotal += item.Expected
            finalactual += item.Actual
            _otherPayments.push({ "rn": rowNumber++, "cms": 3, "c1": parseFloat(item.Expected).toFixed(2), "c2": parseFloat(item.Actual).toFixed(2), "c3": parseFloat(item.Actual - item.Expected).toFixed(2), "bold": "0,0,0", "fs": "24", "alg": "0,1,2" });

            otherPayments = otherPayments +
                `<tr>
                                        <td class="font-bold" colspan="2">${item.Name}</td>
                                    </tr>
                                    <tr>
                                    <td>Expected </td>
                                    <td>Actual </td>
                                    <td style="text-align: right;">Difference </td>
                                    </tr>
                <tr>
                                                <td>${parseFloat(item.Expected).toFixed(2)}</td>
                                                <td>${parseFloat(item.Actual).toFixed(2)}</td>
                                                <td style="text-align: right;">  ${parseFloat(item.Actual - item.Expected).toFixed(2) < 0 ? "" : "+"}${parseFloat(item.Actual - item.Expected).toFixed(2)}</td>
                                            </tr>`;
        })
        var locationName = localStorage.getItem('LocationName');
        var registerName = localStorage.getItem('registerName');
        var user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
        var shopName = user && user.shop_name ? user.shop_name : '';
        var shopWebsite = user && user.website ? user.website : '';
        var shopaddress = user && user.shop_address1 ? user.shop_address1 : '';


        var manualTransac = ''
        let initialValue = 0;
        let staffTotal = _closeRegister.CashRegisterlog.reduce((totalvalue, currentValue) => {
            return totalvalue + currentValue.Expected
        }, 0)
        var _manualTransac = [];
        var totalManual = 0
        // _manualTransac.push({"rn": rowNumber++,"cms":1,"c1":"Add/Remove Cash","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"})
        var int = 0
        _closeRegister && _closeRegister.CashRegisterlog && _closeRegister.CashRegisterlog.map(item => {

            if (item.IsManual == true) {
                if (int === 0) {
                    int++;
                    _manualTransac.push({ "rn": rowNumber, "cms": 1, "c1": "Add/Remove Cash", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "1" })
                    _manualTransac.push({ "rn": rowNumber, "cms": 0, "c1": "d_lne", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "1" });
                    _manualTransac.push({ "rn": rowNumber, "cms": 3, "c1": "Name", "c2": "Time", "c3": "Amount", "bold": "0,0,0", "fs": "24", "alg": "0,1,2" });
                }
                // _manualTransac.push({"rn": rowNumber++,"cms":1,"c1":parseFloat(item.Expected).toFixed(2),"c2":parseFloat(item.Actual).toFixed(2),"c3":parseFloat(item.Actual - item.Expected).toFixed(2),"bold":"0,0,0","fs":"24","alg":"0,1,2"})

                totalManual += item.Expected;
                _manualTransac.push({ "rn": rowNumber, "cms": 3, "c1": item.SalePersonName, "c2": item.TransactionTime, "c3": (parseFloat(item.Expected).toFixed(2) > 0 ? "+" : "") + item.Expected, "bold": "0,0,0", "fs": "24", "alg": "0,1,2" })
                manualTransac = manualTransac + `<tr>
                                                        <td>${item.SalePersonName}</td>
                                                        <td>${item.TransactionTime}</td>
                                                        <td style="text-align: right;">${(parseFloat(item.Expected).toFixed(2) > 0 ? "+" : "") + item.Expected}</td>                                                    
                                                    </tr> `
                if (item.Notes && item.Notes !== "") {
                    manualTransac = manualTransac + `<tr><td colspan="3">Note: ${item.Notes}</td> </tr> `
                    _manualTransac.push({ "rn": rowNumber, "cms": 1, "c1": "Note: " + item.Notes, "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "1" })
                }

            }
        })
        if (_manualTransac && _manualTransac.length > 0) {
            _manualTransac.push({ "rn": rowNumber, "cms": 0, "c1": "d_lne", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "1" });
            _manualTransac.push({ "rn": rowNumber, "cms": 2, "c1": "Total", "c2": "", "c3": totalManual.toFixed(2), "bold": "0,0,0", "fs": "24", "alg": "1,3" })
        }
        manualTransac = manualTransac !== "" ?
            `<div>
                <h1 class="section-heading">
                    Add/Remove Cash
                </h1>
                <div class="category-list">
                    <table class="table-common" style="width: 100%;text-align: left;border-collapse: collapse;">
                        <tbody>
                            <tr>
                            <td>Name</td> 
                            <td>time</td>  
                            <td style="text-align: right;">Amount</td>   
                            </tr>                        
                            ${manualTransac}                 
                        
                    <tr>
                        <td class="font-bold" colspan="2">Total</td>
                    
                        <td style="text-align: right;">${totalManual.toFixed(2)} </td>                   
                       
                    </tr> 
                </tbody>                    
                    </table>
                </div>
            </div>`: ``



        var totalTax = 0.0;
        var taxDetail = '';
        var orderTaxes = [];
        var totalTaxRatePerc = 0;
        var taxGrossAmount = 0.0;
        var taxNetAmount = 0;
        var totalRefund = 0.0;
        var totalRefundCount = 0;
        var totallDiscount = 0.0;
        var totalCanceled = 0;
        var totalCanceledCount = 0;
        var totalTransaction = 0;
        var toaltRevenue = 0;
        _closeRegister && _closeRegister.orders && _closeRegister.orders.map(item => {
            //var taxInclusiveName = getInclusiveTaxType(item.order_meta_lines);
            // var arrItem = orderTaxes[item.order_taxes.RateId]
            if (item.order_status.toLowerCase() == "cancelled" || item.order_status == "void_sale") {
                totalCanceled += item.total_amount;
                totalCanceledCount += 1;
            } else if (item.order_status.toLowerCase() !== "pending" && item.order_status.toLowerCase() !== "park_sale") {
                toaltRevenue += item.total_amount;
                var existInArry = false;
                // var isCash=false;
                var totalGrossAmount = 0
                item.line_items.forEach(function (litem) {
                    //if item is not taxable so we do not include the amount into gross total, check litem.total_tax==0
                    totalGrossAmount += (litem.total_tax !== 0 ? parseFloat(litem.total) : 0) + parseFloat(litem.total_tax) //(taxInclusiveName == "" ? parseFloat(litem.total_tax) : 0)
                        //- parseFloat(litem.amount_refunded);
                        - (litem.amount_refunded > 0 ?
                            (parseFloat(litem.price) * (litem.quantity_refunded * -1) + parseFloat(litem.total_tax)
                            ) : 0)
                    //we are not using the field item.amount_refunded  due to .01 difference
                })
                //refunded Custome Fee Amount deduct from the gross
                var customefeeRefundAmount = 0
                item.order_custom_fee.forEach(function (Ritem) {
                    //totalGrossAmount -= parseFloat(Ritem.amount_refunded)
                    customefeeRefundAmount += parseFloat(Ritem.amount_refunded)
                })

                if (item.order_meta_lines) {// add taxable custom fee amount into gross total
                    var _data = item.order_meta_lines.find(data => data.ItemName == '_order_oliverpos_product_discount_amount');
                    if (_data && _data.CustomFees) {
                        _data.CustomFees.forEach(function (fItem) {
                            if (fItem.isTaxable && fItem.isTaxable == true) {
                                totalGrossAmount += fItem.amount //- fItem.incl_tax;

                            }
                        })
                    }
                }
                totalGrossAmount -= customefeeRefundAmount;


                item.line_items.forEach(function (lineItem) {

                    if (lineItem.Taxes) {
                        var lineItemTaxRates = lineItem.Taxes && lineItem.Taxes != "null" && JSON.parse(lineItem.Taxes).total;
                        lineItemTaxRates && lineItemTaxRates != "" && Object.keys(lineItemTaxRates).map(key => {
                            existInArry = false;
                            var _lineItemRefund = 0
                            var _lineItemRefundTax = 0
                            var taxvalue = lineItemTaxRates[key];
                            // calucate the refund -------------------
                            if (lineItem.quantity_refunded) {
                                _lineItemRefund = ((lineItem.total + parseFloat(taxvalue)) / lineItem.quantity) * lineItem.quantity_refunded
                                _lineItemRefundTax = (parseFloat(taxvalue) / lineItem.quantity) * lineItem.quantity_refunded
                            }
                            //-----------------------------------------
                            orderTaxes.forEach(function (arrItem) {
                                if (key == arrItem.RateId) {
                                    arrItem["Total"] = arrItem.Total + parseFloat(taxvalue) + _lineItemRefundTax//- ordtax.RefundadInDecimal                               
                                    arrItem["OrderAmount"] = parseFloat(arrItem.OrderAmount) + parseFloat(lineItem.total) + parseFloat(lineItem.total_tax) + _lineItemRefund//tax sholud be added only for exclusive
                                    //(taxInclusiveName == "" ? parseFloat(lineItem.total_tax) : 0)
                                    existInArry = true;
                                }
                            })
                            if (existInArry == false) {
                                var ordtax = { ...item.order_taxes.find(oTax => oTax.RateId == key), OrderAmount: 0, Total: 0 }
                                if (ordtax) {
                                    ordtax["OrderAmount"] = parseFloat(lineItem.total) + parseFloat(lineItem.total_tax) + _lineItemRefund; //tax sholud be added only for exclusive
                                    //(taxInclusiveName == "" ? parseFloat(lineItem.total_tax) : 0)
                                    ordtax["Total"] = parseFloat(taxvalue) + _lineItemRefundTax //parseFloat(ordtax.Total) - ordtax.RefundadInDecimal
                                    orderTaxes.push(ordtax);
                                }

                            }
                        })
                    }
                })
                // item.order_taxes.forEach(function (ordtax) {
                //     var existInArry = false;
                //     orderTaxes.forEach(function (arrItem) {
                //         if (arrItem.RateId == ordtax.RateId) {
                //             arrItem["Total"] = arrItem.Total + parseFloat(ordtax.TotalInDecimal - ordtax.RefundadInDecimal)
                //             existInArry = true;
                //             arrItem["OrderAmount"] = parseFloat(arrItem.OrderAmount) + parseFloat(totalGrossAmount)
                //         }
                //     });

                //     if (existInArry == false && ordtax) {
                //         ordtax["OrderAmount"] = parseFloat(totalGrossAmount);
                //         ordtax["Total"] = parseFloat(ordtax.Total) - ordtax.RefundadInDecimal
                //         orderTaxes.push(ordtax);

                //     }

                // });
                if (item.refunded_amount) {
                    totalRefund += parseFloat(item.refunded_amount)
                    totalRefundCount += 1;
                }

                if (item.discount) {
                    totallDiscount += parseFloat(item.discount);
                }
                // if(item.order_taxes && item.order_taxes.length>0){ //cooment due remove conflict 
                //   totalTax +=parseFloat(item.total_tax);                 
                // }
                //}

                //taxGrossAmount += totalGrossAmount;

            }
        })
        console.log("totalTransaction", totalTransaction)
        var ratelist = localStorage.getItem('SHOP_TAXRATE_LIST') && JSON.parse(localStorage.getItem('SHOP_TAXRATE_LIST'));


        orderTaxes.forEach(function (arrItem) {
            var ratePerc = ""
            ratelist && ratelist.map(item => {
                if (item.TaxId == arrItem.RateId) {
                    ratePerc = item.TaxRate
                    totalTaxRatePerc += parseFloat(item.TaxRate.replace('%', ''))
                }
            })
            //  taxGrossAmount += parseFloat(arrItem.OrderAmount);
            taxNetAmount += parseFloat(arrItem.OrderAmount) - parseFloat(arrItem.Total)
            //totalTax +=arrItem.Total;
            _taxDetail.push({ "rn": rowNumber++, "cms": 1, "c1": arrItem.Title + "(" + ratePerc + ")", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0" });
            _taxDetail.push({ "rn": rowNumber++, "cms": 3, "c1": "Gross", "c2": "Net", "c3": "Tax", "bold": "0,0,0", "fs": "24", "alg": "0,1,2" });
            _taxDetail.push({ "rn": rowNumber++, "cms": 3, "c1": arrItem.OrderAmount.toFixed(2), "c2": (arrItem.OrderAmount - parseFloat(arrItem.Total)).toFixed(2), "c3": parseFloat(arrItem.Total).toFixed(2), "bold": "0,0,0", "fs": "24", "alg": "0,1,2" });


            taxDetail += `<tr><td class="font-bold" colspan="2"> ${arrItem.Title} (${ratePerc}) </td></tr>`
            taxDetail += `<tr><td>Gross </td><td>Net </td><td style="text-align: right;">Tax </td></tr>`
            //taxDetail += `<tr><td>Gross </td><td style="text-align: right;">Tax </td></tr>`
            taxDetail += `<tr><td>${arrItem.OrderAmount.toFixed(2)} </td><td>${(arrItem.OrderAmount - parseFloat(arrItem.Total)).toFixed(2)}</td><td style="text-align: right;">${parseFloat(arrItem.Total).toFixed(2)}</td></tr>`
            //taxDetail += `<tr><td>${arrItem.OrderAmount.toFixed(2)} </td><td style="text-align: right;">${parseFloat(arrItem.Total).toFixed(2)}</td></tr>`
            totalTax += parseFloat(arrItem.Total);
            taxGrossAmount += parseFloat(arrItem.OrderAmount)
        });


        console.log("orderTaxes", orderTaxes)
        var openingDate = _closeRegister && _closeRegister.UtcOpenDateTime ? _closeRegister.UtcOpenDateTime : ''
        var openingDateTime = moment.utc(openingDate).local().format(Config.key.DATETIME_FORMAT);

        var closingDate = _closeRegister && _closeRegister.UtcClosedDateTime ? _closeRegister.UtcClosedDateTime : ''
        var closingDateTime = moment.utc(closingDate).local().format(Config.key.DATETIME_FORMAT);
        const orderReceipt = localStorage.getItem('orderreciept') ? JSON.parse(localStorage.getItem('orderreciept')) : '';
        var now = moment.utc(_closeRegister.UtcClosedDateTime); //todays date
        var end = moment.utc(_closeRegister.UtcOpenDateTime); // another date
        var duration = moment.duration(now.diff(end));
        console.log(now.diff(end, 'hours')) // 745
        // var duration = moment.duration(closingDateTime.diff(closingDate));
        var hours = duration.asHours().toFixed(2);
        //var hours=0
        var _tip;
        if ((typeof window.Android !== "undefined" && window.Android !== null) && (window.Android.getDatafromDevice("isWrapper") == true)) {
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 1, "c1": "End of Day / Z report", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "1" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 1, "c1": shopaddress, "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 2, "c1": "End of Day Z Report #", "c2": _closeRegister && _closeRegister.CashManagementId, "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0,2" });

            PrintAndroidData.push({ "rn": rowNumber++, "cms": 0, "c1": "d_lne", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "1" });

            PrintAndroidData.push({ "rn": rowNumber++, "cms": 1, "c1": "Report From:" + openingDateTime, "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 1, "c1": "Opened by:" + SalePersonName, "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 1, "c1": "Report Until:" + closingDateTime, "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 1, "c1": "Closed by:" + closePersonName, "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 1, "c1": "Duration:" + hours + " hr", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 1, "c1": "Register:" + registerName, "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0" });

            PrintAndroidData.push({ "rn": rowNumber++, "cms": 0, "c1": "d_lne", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "1" });

            PrintAndroidData.push({ "rn": rowNumber++, "cms": 1, "c1": "Cash Report", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 0, "c1": "d_lne", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "1" });

            PrintAndroidData.push({ "rn": rowNumber++, "cms": 3, "c1": "Expected", "c2": "Actual", "c3": "Difference", "bold": "0,0,0", "fs": "24", "alg": "0,1,2" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 3, "c1": _closeRegister && parseFloat(_closeRegister.Expected).toFixed(2), "c2": _closeRegister && parseFloat(_closeRegister.Actual).toFixed(2), "c3": parseFloat(_closeRegister && (_closeRegister.Actual - _closeRegister.Expected)).toFixed(2), "bold": "0,0,0", "fs": "24", "alg": "0,1,2" });

            PrintAndroidData.push({ "rn": rowNumber++, "cms": 1, "c1": "Card", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 3, "c1": "Expected", "c2": "Actual", "c3": "Difference", "bold": "0,0,0", "fs": "24", "alg": "0,1,2" });

            _otherPayments && _otherPayments.length > 0 && _otherPayments.map(item => {
                PrintAndroidData.push(item);
            });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 0, "c1": "d_lne", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "1" });

            PrintAndroidData.push({ "rn": rowNumber++, "cms": 1, "c1": "Total", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 3, "c1": "Expected", "c2": "Actual", "c3": "Difference", "bold": "0,0,0", "fs": "24", "alg": "0,1,2" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 3, "c1": finaltotal.toFixed(2), "c2": finalactual.toFixed(2), "c3": parseFloat(_totalActual - _totalExpected).toFixed(2), "bold": "0,0,0", "fs": "24", "alg": "0,1,2" });

            PrintAndroidData.push({ "rn": rowNumber++, "cms": 1, "c1": "Notes", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 0, "c1": "d_lne", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "1" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 1, "c1": "Description:", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 1, "c1": this.state.enterNote, "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0" });

            //Revenue
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 1, "c1": "Revenue:", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 0, "c1": "d_lne", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "1" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 1, "c1": "Total", "c2": (toaltRevenue).toFixed(2), "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0,2" });

            // PrintAndroidData.push({ "rn": rowNumber++, "cms": 2, "c1": "Excluding Expenses", "c2": "0.00", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0,2" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 2, "c1": "Tip", "c2": "0.00", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0,2" });

            _manualTransac && _manualTransac.length > 0 && _manualTransac.map(item => {
                item["rn"] = rowNumber++
                PrintAndroidData.push(item);
            });


            //Staff
            // PrintAndroidData.push({"rn": rowNumber++,"cms":1,"c1":"Staff:","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
            // PrintAndroidData.push({"rn": rowNumber++,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
            // PrintAndroidData.push({"rn": rowNumber++,"cms":2,"c1":"Name","c2":closePersonName,"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"});
            // PrintAndroidData.push({"rn": rowNumber++,"cms":2,"c1":"Amount","c2":_closeRegister && _closeRegister.Expected,"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"});
            //Tax
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 1, "c1": "Tax:", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 0, "c1": "d_lne", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "1" });

            _taxDetail && _taxDetail.length > 0 && _taxDetail.map(item => {
                PrintAndroidData.push(item);
            });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 0, "c1": "d_lne", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "1" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 1, "c1": "Total", "c2": _closeRegister.Actual, "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0,2" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 3, "c1": taxGrossAmount.toFixed(2), "c2": taxNetAmount.toFixed(2), "c3": totalTax.toFixed(2), "bold": "0,0,0", "fs": "24", "alg": "0,1,2" });

            //Voided/Cancelled/Refunded
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 1, "c1": "Voided/Cancelled/Refunded", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 0, "c1": "d_lne", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "1" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 3, "c1": "Reason", "c2": "Num.", "c3": "Amount", "bold": "0,0,0", "fs": "24", "alg": "0,1,2" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 3, "c1": "Voided", "c2": "0.00", "c3": totalCanceled, "bold": "0,0,0", "fs": "24", "alg": "0,1,2" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 3, "c1": "Refunded", "c2": totalCanceledCount, "c3": totalRefund.toFixed(2), "bold": "0,0,0", "fs": "24", "alg": "0,1,2" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 0, "c1": "d_lne", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "1" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 3, "c1": "Total", "c2": totalCanceledCount, "c3": totalRefund.toFixed(2), "bold": "0,0,0", "fs": "24", "alg": "0,1,2" });

            //Discount
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 1, "c1": "Discount", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 0, "c1": "d_lne", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "1" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 3, "c1": "Reason", "c2": "Num.", "c3": "Amount", "bold": "0,0,0", "fs": "24", "alg": "0,1,2" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 2, "c1": "Discount", "c2": totallDiscount.toFixed(2), "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0,2" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 0, "c1": "d_lne", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "1" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 2, "c1": "Total", "c2": totallDiscount.toFixed(2), "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0,2" });

            //Total # of Transactions

            PrintAndroidData.push({ "rn": rowNumber++, "cms": 2, "c1": "Total # of Transactions", "c2": _closeRegister.Actual, "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0,2" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 0, "c1": "d_lne", "c2": "", "c3": "", "bold": "0,0,0", "fs": "24", "alg": "1" });
            PrintAndroidData.push({ "rn": rowNumber++, "cms": 2, "c1": "Total", "c2": _closeRegister.CashRegisterlog.length, "c3": "", "bold": "0,0,0", "fs": "24", "alg": "0,2" });
            PrintAndroidReceiptData["data"] = PrintAndroidData;
        }
        {/* <tr>
                <td colspan="2">Total # of Transactions: ${ _closeRegister.CashRegisterlog.length}</td>
            </tr> */}
        var html = (`
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>End of Day / Z report</title>
                <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
                body {
                    font-family: 'Poppins', sans-serif;
                    font-size: 14px;
                    line-height: 19px;
                }
                body, h1,h2,h3,h4,h5,h6 {
                    margin: 0;
                    padding: 0;
                }
                .table-common {
                    margin-bottom: 30px;
                }
                .table-common td {
                    padding-top: 5px;
                    padding-bottom: 5px;
                }
                .table-common tr:first-child td {
                    padding-top: 6px;
                }
                .table-common thead th{
                    border-bottom: 1px solid #050505;
                    padding-bottom: 10px;
                }
                .table-common tr:last-child td {
                    padding-bottom: 8px;
                    border-bottom: 1px solid #050505;
                }
                .font-bold {
                    font-weight: 600;
                }
                
                .section-heading{
                    font-weight: 500;
                    border-bottom: 1px solid #050505;
                    padding-bottom: 10px;
                    font-size: 14px;
                }
                /* .table-common2 thead tr:first-child th{
                    font-weight: 500;
                    border-bottom: 1px solid #050505;
                    padding-bottom: 10px;
                    font-size: 14px;
                } */
                .category-list tfoot tr:last-child td {
                    border-bottom: 0;
                }
                .pagesize{
                    width:${pageSize.width}; overflow:hidden;
                      margin: 0 auto;
                  }
                </style>
            </head>
    <body>
    <div style='padding:${pageSize.width == '80mm' ? "20px" : (pageSize.width == '52mm' || pageSize.width == '58mm') ? "10px" : "40px"};'   class='pagesize'>
    <div style="text-align: center; padding-bottom: 30px;">
        <h4 style="margin-bottom: 8px;">End of Day / Z report</h4>
        <address>
            ${shopaddress}
           
        </address>
    </div>
    <table class="table-common" style="width: 100%;text-align: left;border-collapse: collapse;">
        <thead>
            <th>End of Day Z Report #</th>
            <th style="text-align: right;">${_closeRegister && _closeRegister.CashManagementId}</th>
        </thead>
        <tbody>
            <tr>
                <td colspan="2">Report From: ${openingDateTime} </td>
            </tr>
            <tr>
                <td colspan="2">Opened by: ${SalePersonName} </td>
            </tr>
            <tr>
                <td colspan="2">Report Until:  ${closingDateTime}</td>
            </tr>
            <tr>
                <td colspan="2">Closed by: ${closePersonName} </td>
            </tr>
            <tr>
                <td colspan="2">Duration: ${hours} hr</td>
            </tr>
            <tr>
                <td colspan="2">Register: ${registerName} </td>
            </tr>        
            
        </tbody>
    </table>
    <div>
        <h1 class="section-heading">
            Tender summary
        </h1>
        <div class="category-list">
            <table class="table-common" style="width: 100%;text-align: left;border-collapse: collapse;">
                <tbody>
                    <tr>
                        <td class="font-bold" colspan="2">Cash In Till</td>
                    </tr>
                    <tr>
                        <td>Expected </td>
                        <td>Actual </td>
                        <td style="text-align: right;">Difference </td>
                    </tr>
    
                    <tr>
                    <td>${_closeRegister && parseFloat(_closeRegister.Expected).toFixed(2)}</td>
                    <td>${_closeRegister && parseFloat(_closeRegister.Actual).toFixed(2)}</td>
                    <td style="text-align: right;"> ${parseFloat(_closeRegister && (_closeRegister.Actual - _closeRegister.Expected)) < 0 ? "" : "+"}${parseFloat(_closeRegister && (_closeRegister.Actual - _closeRegister.Expected)).toFixed(2)}</td>
                    </tr>
                    
                    ${otherPayments}
                   
                  
               
                    <tr style="border-top: 1px solid;">
                        <td class="font-bold" colspan="3">Total</td>
                    </tr>
                    <tr>
                        <td> Expected </td>
                        <td> Actual  </td>
                        <td style="text-align: right;"> Difference</td>
                    <tr>
                        <td>${finaltotal.toFixed(2)} </td>
                        <td>${finalactual.toFixed(2)} </td>
                        <td style="text-align: right;">${parseFloat(_totalActual - _totalExpected).toFixed(2)} </td>
                    </tr>
                 </tbody>
              
            </table>
           
        </div>
    </div>
    
    <div>
        <h1 class="section-heading">
            Revenue
        </h1>
        <div class="category-list">
            <table class="table-common" style="width: 100%;text-align: left;border-collapse: collapse;">
                <tbody>
                    <tr>
                        <td>Total</td>
                        <td style="text-align: right;">  ${(toaltRevenue).toFixed(2)} </td>
                    </tr>
                   
                   ${_tip ? `<tr>
                        <td>Tips</td>
                        <td style="text-align: right;">0.00</td>
                    </tr>`: ''}
                </tbody>
            </table>
        </div>
    </div>
    ${manualTransac}
    <div>
        <h1 class="section-heading">
            Tax
        </h1>
        <div class="category-list">
            <table class="table-common" style="width: 100%;text-align: left;border-collapse: collapse;">
                <tbody>                
                    ${taxDetail}
               
                    <tr style="border-top: 1px solid;">
                        <td class="font-bold" colspan="3">Total</td>
                    </tr>
                    <tr>
                        <td>Gross </td>
                        <td>Net </td>
                        <td style="text-align: right;">Tax </td>
                    </tr>
                        <td>${taxGrossAmount.toFixed(2)} </td>
                        <td>${(taxGrossAmount - totalTax).toFixed(2)} </td>
                        <td style="text-align: right;">${totalTax.toFixed(2)}</td>
                    </tr> 
                </tbody>
               
            </table>
           
        </div>
    </div>
    
    
    <div>
        <h1 class="section-heading">
        Voided/Cancelled/Refunded
        </h1>
        <div class="category-list">
            <table class="table-common" style="width: 100%;text-align: left;border-collapse: collapse;">
                <tbody>               
                    <tr>
                        <td>Reason </td>
                        <td>Num </td>
                        <td style="text-align: right;">Amount </td>
                    </tr>
                    <tr>
                        <td>Voided</td>
                        <td>${totalCanceledCount}</td>
                        <td style="text-align: right;">${totalCanceled}</td>
                    </tr>
                    <tr>
                    <td>Refunded</td>
                    <td>${totalRefundCount}</td>
                    <td style="text-align: right;">${totalRefund.toFixed(2)}</td>
                </tr>
                
                     <tr>
                        <td class="font-bold" style="border-top: 1px solid;">Total</td>
                        <td style="border-top: 1px solid;">${(totalCanceledCount + totalRefundCount)}</td>
                        <td style="text-align: right;border-top: 1px solid;">${(totalRefund + totalCanceled).toFixed(2)}</td>
                    </tr>
                </tbody>
              
            </table>
           
        </div>
    </div>
    <div>
        <h1 class="section-heading">
            Discount
        </h1>
        <div class="category-list">
            <table class="table-common" style="width: 100%;text-align: left;border-collapse: collapse;">
                <tbody>
                    <tr>
                        <td>Reason</td>
                        <td>Num</td>
                        <td style="text-align: right;">Amount</td>
                    </tr>
                    <tr>
                        <td> Discount</td>
                        <td></td>
                        <td style="text-align: right;">${totallDiscount.toFixed(2)}</td>
                    </tr>
              
                    <tr style="border-top: 1px solid;">
                        <td>Total</td>
                        <td></td>
                        <td style="text-align: right;">${totallDiscount.toFixed(2)}</td>
                    </tr>
                 </tbody>
              
            </table>
        </div>
    </div>
    <div>
        <h1 class="section-heading">
            Total # of Transactions
        </h1>
        <div class="category-list">
            <table class="table-common" style="width: 100%;text-align: left;border-collapse: collapse;">
               
                    <tr>
                        <td>Total</td>
                        <td style="text-align: right;">${_closeRegister.CashRegisterlog.length}</td>
                    </tr>
                
            </table>
        </div>
    </div>
    ${_closeRegister.OpeningNotes && _closeRegister.OpeningNotes !== "" &&
            `<div>
        <h1 class="section-heading">
            Opening Notes
        </h1>
        <div class="category-list">
            <div class="category-list">
            <br> ${_closeRegister.OpeningNotes} </br></br>
            </div>
           
        </div>
    </div>`
            }
    ${enterNotes && enterNotes !== "" &&
            `<div>
        <h1 class="section-heading">
            Closing Notes
        </h1>
        <div class="category-list">
          <br> ${enterNotes} </br></br>
        </div>
    </div>`
            }
    
    </div>`
        );

        //this is staff name and amount section removed now
        /*
        <div>
            <h1 class="section-heading">
                Staff
            </h1>
            <div class="category-list">
                <table class="table-common" style="width: 100%;text-align: left;border-collapse: collapse;">
                    <tbody>
                    <tr>
                    <td>Name</td>
                    <td  style="text-align: right;">Amount</td>
                  </tr>
                  <tr>
                    <td>${closePersonName}</td>
                    <td  style="text-align: right;">${ _closeRegister && _closeRegister.Expected}</td>
                  </tr>
                    
                    </tbody>
                </table>
            </div>
        </div>
        */

        // <td class="align-right">
        //     Print Date: <span class="font-italic">${closingDateTime}</span>
        // </td> 
        html += '</body ></html>'
        console.log(html)
        console.log("----PrintAndroidReceiptData--->" + JSON.stringify(PrintAndroidReceiptData))
        if ((typeof window.Android !== "undefined" && window.Android !== null) && (window.Android.getDatafromDevice("isWrapper") == true)) {
            showAndroidReceipt("", PrintAndroidReceiptData);
        }
        else {
            var a = window.open('#', '', 'width=400', 'A2');
            a && a.document && a.document.write(html);
            a && a.print();
            a && a.close();
            return true;
        }
    }


    var closeRegister = props.closeregisterPaymentDetail;
    console.log("closeRegister", closeRegister)
    var _closeRegister = null;
    if (closeRegister && closeRegister)
        _closeRegister = closeRegister && closeRegister;
    var _totalDiff = _closeRegister && _closeRegister.Actual - _closeRegister.Expected
    _closeRegister && _closeRegister.PaymentSummery && _closeRegister.PaymentSummery.map(item => {
        // _totalDiff = _totalDiff + (item.DiffrenceAmount);
        _totalDiff = _totalDiff + (item.Actual - item.Expected);
        // console.log("_totalDiff",_totalDiff)
    })
    var cashRegisterLog = closeRegister ? closeRegister.CashRegisterlog : [];


    return (
        <>  <p className="style1">Close Register</p>
            <p className="style2">
                <b>Logged-in user:</b> Freddy Mercury
            </p>
            <label>Estimated Cash and Transaction Totals</label>
            <div className="closing-totals">
                <p className="style1">Estimated Totals</p>
                <div className="tablet-row">
                    <p>Payment</p>
                    <p>Expected</p>
                    <p>Actual</p>
                    <p>Difference</p>
                </div>
                <div className="col">
                    <p className="style2">Cash in Till</p>
                    <div className="divider" />
                    <div className="row">
                        <p className="style3">Expected:</p>
                        <p className="style3">{_closeRegister && _closeRegister.Expected}</p>
                    </div>
                    <div className="row">
                        <p className="style3">Actual:</p>
                        <p className="style3">{_closeRegister && _closeRegister.Actual}</p>
                    </div>
                    <div className="row">
                        <p className="style3">Difference:</p>
                        <p className="style3">{_closeRegister && (_closeRegister.Actual - _closeRegister.Expected).toFixed(2)} </p>
                    </div>
                </div>
                {_closeRegister && _closeRegister.PaymentSummery && _closeRegister.PaymentSummery.map((item, index) => {
                    return (<div className="col">
                        <p className="style2">{item.Name}</p>
                        <div className="divider" />
                        <div className="row">
                            <p className="style3">Expected:</p>
                            <p className="style3">{item.Expected}</p>
                        </div>
                        <div className="row">
                            <p className="style3">Actual:</p>
                            <p className="style3">{item.Actual}</p>
                        </div>
                        <div className="row">
                            <p className="style3">Difference:</p>
                            <p className="style3">{(item.Actual - item.Expected).toFixed(2)}</p>
                        </div>
                    </div>);
                })
                }

                <div className="tablet-divider" />
                <div className="col total">
                    <p className="style2">Total Difference</p>
                    <div className="divider" />
                    <div className="row">
                        <p className="style3">{_totalDiff.toFixed(2)}</p>
                    </div>
                </div>
            </div>
            <label htmlFor="closingNote">Add Note</label>
            <textarea
                name="closingNote"
                id="closingNote"
                placeholder="Please add a note here"
                defaultValue={""}
                onChange={(e) => enterNote(e)}
            />
            <button id="printReport" onClick={() => printHtml(_closeRegister)}  >Print Report</button>
            <button id="closeRegister" onClick={() => CloseRegister()} >Close Register</button></>
    )
}

export default Closeregistertwo