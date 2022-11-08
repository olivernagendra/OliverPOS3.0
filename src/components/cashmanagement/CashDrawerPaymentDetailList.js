import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import STATUSES from "../../constants/apiStatus";
import moment from 'moment';
import Config from '../../Config'
import { LoadingModal } from "../common/commonComponents/LoadingModal";
import { NumericFormat } from "react-number-format";

const CashDrawerPaymentDetailList = () => {
    const { statusgetdetail, getdetail, errorgetdetail, is_successgetdetail } = useSelector((state) => state.cashmanagementgetdetail)
    var paymentList = [];
    if (statusgetdetail == STATUSES.IDLE && is_successgetdetail) {
        var CashDrawerPaymentDetail = getdetail && getdetail.content
        var _paymentList = CashDrawerPaymentDetail && CashDrawerPaymentDetail.CashRegisterlog ? CashDrawerPaymentDetail.CashRegisterlog : [];

        if (_paymentList && _paymentList.length > 0) {
            paymentList = [..._paymentList].reverse()

        }

    }

    var userName = CashDrawerPaymentDetail && CashDrawerPaymentDetail ? CashDrawerPaymentDetail.SalePersonName : '';
    var openingNote = CashDrawerPaymentDetail && CashDrawerPaymentDetail ? CashDrawerPaymentDetail.OpeningNotes : '';
    var openDateTime = CashDrawerPaymentDetail && CashDrawerPaymentDetail ? CashDrawerPaymentDetail.UtcOpenDateTime : "";
    var _openDateTime = moment.utc(openDateTime).local().format(Config.key.ONLY_TIME);
    var openingBal = CashDrawerPaymentDetail && CashDrawerPaymentDetail ? CashDrawerPaymentDetail.OpeningBalance : 0.00;
    var iscashDrawerClosed = CashDrawerPaymentDetail ? CashDrawerPaymentDetail.isClosed : false;
    var closeDateTime = CashDrawerPaymentDetail ? CashDrawerPaymentDetail.UtcClosedDateTime : "";
    var _closeDateTime = moment.utc(closeDateTime).local().format(Config.key.ONLY_TIME);
    var closingActualBal = CashDrawerPaymentDetail ? CashDrawerPaymentDetail.Actual : 0.00;
    var closingNote = CashDrawerPaymentDetail ? CashDrawerPaymentDetail.ClosingNotes : '';
    var closingExpectedBal = CashDrawerPaymentDetail ? CashDrawerPaymentDetail.Expected : 0.00;

    return (
        <>
            {statusgetdetail == STATUSES.LOADING ? <LoadingModal></LoadingModal> : null}
            {(iscashDrawerClosed == true) ? <>
                <div className="register-action">
                    <div className="col fill left">
                        <div className="group">
                            <p className="style1">Closing Float</p>
                            <p className="style2">{_closeDateTime}</p>
                        </div>
                        <p className="style2">
                            <b>User:</b> {userName}
                        </p>
                        <p className="style2">
                            <b>Notes: </b>{closingNote}
                        </p>
                    </div>
                    <div className="col fill right">
                        <p className="style2">
                            <b>Expected Balance:</b> <NumericFormat value={closingExpectedBal} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                        </p>
                        <p className="style2">
                            <b>Actual Balance:</b> <NumericFormat value={closingActualBal} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                        </p>
                    </div>
                </div>
            </> : null
            }
            <> {paymentList.filter(i => i.Description.toLowerCase() == "cash").map((item, index) => {
                return (
                    <>
                        <div className="register-action">
                            <div className="col fill left">
                                <div className="group">
                                    <p className={item.IsManual == true ? "style1 green" : item.IsManual == false && item.Expected < 0 ? "style1" : "style1 blue"}> {item.IsManual == true ? "Manual Transaction" : item.IsManual == false && item.Expected < 0 ? "Refund" : "Cash"}</p>
                                    <p className="style2">{moment.utc(item.TransactionDateOffset).local().format(Config.key.ONLY_TIME)}</p>
                                </div> </div>

                            <div className="col">
                                <p className="style2 mobile-adjustment">{(item.Expected < 0 ? "" : "+")}<NumericFormat value={item.Expected} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></p>
                            </div>
                            <div className="col fill right">
                                <p className="style2"><b>Balance:</b> <NumericFormat value={item.RemainingBalance} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> </p>
                            </div>

                            {/* <div className="col">
                                    <p className="style2 mobile-adjustment">
                                        <b>User:</b> {item.SalePersonName}
                                    </p>
                                </div>
                                <div className="col fill right"></div>
                                <p className="style2">
                                    <b>Notes: </b>{item.Notes}
                                </p> */}

                            {/* <div className="group3">
                                <p className="style2">
                                    <b>Expected Balance:</b> {item.Expected}
                                </p>
                                <p className="style2">
                                    <b>Actual Balance:</b> {item.RemainingBalance}
                                </p>
                            </div> */}
                        </div>
                    </>)
            })
            }</>

            <div className="register-action">
                <div className="col fill left">
                    <div className="group">
                        <p className="style1">Opening Float</p>
                        <p className="style2">{_openDateTime}</p>
                    </div>
                    <div className="group2">
                        <p className="style2">
                            <b>User:</b> {userName}
                        </p>
                        <p className="style2">
                            <b>Notes: </b>{openingNote}
                        </p>
                    </div>
                </div>
                <div className="col fill right">
                    <p className="style2">
                        {/* <b>Expected Balance:</b> 300.00 */}
                    </p>
                    <p className="style2">
                        <b>Open Balance:</b> <NumericFormat value={openingBal} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                    </p>
                </div>
            </div>
        </>
    )
}

export default CashDrawerPaymentDetailList