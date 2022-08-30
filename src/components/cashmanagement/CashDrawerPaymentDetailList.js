import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Config from '../../Config'

const CashDrawerPaymentDetailList = () => {
    const { statusgetdetail, getdetail, errorgetdetail, is_successgetdetail } = useSelector((state) => state.cashmanagementgetdetail)
    var CashDrawerPaymentDetail = getdetail && getdetail.content
    var _paymentList = CashDrawerPaymentDetail && CashDrawerPaymentDetail.CashRegisterlog ? CashDrawerPaymentDetail.CashRegisterlog : [];
    var paymentList = [];
    if (_paymentList && _paymentList.length > 0) {
        paymentList = [..._paymentList].reverse()

    }



    var userName = CashDrawerPaymentDetail && CashDrawerPaymentDetail ? CashDrawerPaymentDetail.SalePersonName : '';
    var openingNote = CashDrawerPaymentDetail && CashDrawerPaymentDetail ? CashDrawerPaymentDetail.OpeningNotes : '';
    var openDateTime = CashDrawerPaymentDetail && CashDrawerPaymentDetail ? CashDrawerPaymentDetail.UtcOpenDateTime : "";
    var _openDateTime = moment.utc(openDateTime).local().format(Config.key.TIMEDATE_FORMAT);
    var openingBal = CashDrawerPaymentDetail && CashDrawerPaymentDetail ? CashDrawerPaymentDetail.OpeningBalance : 0.00;
    var iscashDrawerClosed = CashDrawerPaymentDetail ? CashDrawerPaymentDetail.isClosed : false;
    var closeDateTime = CashDrawerPaymentDetail ? CashDrawerPaymentDetail.UtcClosedDateTime : "";
    var _closeDateTime = moment.utc(closeDateTime).local().format(Config.key.TIMEDATE_FORMAT);
    var closingActualBal =  CashDrawerPaymentDetail ? CashDrawerPaymentDetail.Actual : 0.00;
    var closingNote =  CashDrawerPaymentDetail ? CashDrawerPaymentDetail.ClosingNotes : '';
    var closingExpectedBal = CashDrawerPaymentDetail ? CashDrawerPaymentDetail.Expected : 0.00;

    return (
        <>

            {(iscashDrawerClosed == true) ? <>
                <div className="register-event">
                    <div className="outer-group">
                        <div className="group1">
                            <p className="style1">Closing Float</p>
                            <p className="style2">{_closeDateTime}</p>
                        </div>
                        <div className="group2">
                            <p className="style2">
                                <b>User:</b> {userName}
                            </p>
                            <p className="style2">
                                <b>Notes: </b>{closingNote}
                            </p>
                        </div>
                    </div>
                    <div className="group3">
                        <p className="style2">
                            <b>Expected Balance:</b> {closingExpectedBal}
                        </p>
                        <p className="style2">
                            <b>Actual Balance:</b> {closingActualBal}
                        </p>
                    </div>
                </div>
            </> : null
            }
            <> {paymentList.filter(i => i.Description.toLowerCase() == "cash").map((item, index) => {
                return (
                    <>
                        <div className="register-event">
                            <div className="outer-group">
                                <div className="group1">
                                    <p className="style1"> {item.IsManual == true ? "Manual Transaction" : item.IsManual == false && item.Expected < 0 ? "Refund" : "Cash"}</p>
                                    <p className="style2">{moment.utc(item.TransactionDateOffset).local().format(Config.key.TIMEDATE_FORMAT)}</p>
                                </div>
                                <div className="group2">
                                    <p className="style2">
                                        <b>User:</b> {item.SalePersonName}
                                    </p>
                                    <p className="style2">
                                        <b>Notes: </b>{item.Notes}
                                    </p>
                                </div>
                            </div>
                            <div className="group3">
                                <p className="style2">
                                    <b>Expected Balance:</b> {item.Expected}
                                </p>
                                <p className="style2">
                                    <b>Actual Balance:</b> 300.00
                                </p>
                            </div>
                        </div>
                    </>)
            })
            }</>

            <div className="register-event">
                <div className="outer-group">
                    <div className="group1">
                        <p className="style1">Initial Float</p>
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
                <div className="group3">
                    <p className="style2">
                        {/* <b>Expected Balance:</b> 300.00 */}
                    </p>
                    <p className="style2">
                        <b>Open Balance:</b> {openingBal}
                    </p>
                </div>
            </div>
        </>
    )
}

export default CashDrawerPaymentDetailList