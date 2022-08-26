import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { cashRecords, getDetails } from './CashmanagementSlice'
import moment from 'moment';
import Config from '../../Config'
import { FormateDateAndTime } from '../../settings/FormateDateAndTime';
import LeftNavBar from '../common/LeftNavBar'
import ClockIn_Icon from '../../images/Temp/ClockIn_Icon.png'


function Cashmanagement() {

  const dispatch = useDispatch();
  var registerId = localStorage.getItem('register');
  var current_date = moment().format(Config.key.DATE_FORMAT);



  const { status, data, error, is_success } = useSelector((state) => state.cashmanagement)
  //console.log("status", status, "data", data, "error", error, "is_success", is_success)


  // if (status == STATUSES.error) {
  //     console.log(error)
  // }
  // if (status == STATUSES.IDLE && is_success) {
  //     // console.log("data----->" + data)
  // }


  useEffect(() => {
    dispatch(cashRecords({ "registerId": registerId, "pageSize": "1000", "pageNumber": "1" }));
    console.log("cashrecord----")
  }, [])



  //======Cash ReCords API Data Store 
  var allCashRecords = data && data.content && data.content.Records
  var current_date = moment().format(Config.key.DATE_FORMAT);
  var _newActivities = allCashRecords;

  /// Find Dates and And filter list with dates----------------------
  var getDistinctActivity = {};
  var _activity = allCashRecords
  _activity && _activity.map(item => {
    var dateKey = FormateDateAndTime.formatDateAndTime(item.LogDate && item.LogDate !== undefined ? item.LogDate : item.LogDateUtc, item.TimeZoneType);
    if (!getDistinctActivity.hasOwnProperty(dateKey)) {
      getDistinctActivity[dateKey] = new Array(item);
    } else {
      if (typeof getDistinctActivity[dateKey] !== 'undefined' && getDistinctActivity[dateKey].length > 0) {
        getDistinctActivity[dateKey].push(item)
      }
    }
  })

  var ordersDate = new Array();
  var orders = getDistinctActivity;

  if (typeof orders !== 'undefined') {
    for (const key in orders) {
      if (orders.hasOwnProperty(key)) {
        ordersDate.push(key)
      }
    }
    if (ordersDate.length > 0) {
      ordersDate.sort(function (a, b) {
        var keyA = new Date(a),
          keyB = new Date(b);
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
      ordersDate.reverse();
    }
  }

  const getCashDrawerPaymentDetail = (Id, index) => {
    dispatch(getDetails(Id));
  }

  const { statusgetdetail, getdetail, errorgetdetail, is_successgetdetail } = useSelector((state) => state.cashmanagementgetdetail)

  var CashDrawerPaymentDetail = getdetail && getdetail.content
  var _paymentList = CashDrawerPaymentDetail && CashDrawerPaymentDetail.CashRegisterlog ? CashDrawerPaymentDetail.CashRegisterlog : [];
  var paymentList = [];
  if (_paymentList && _paymentList.length > 0) {
    paymentList = [..._paymentList].reverse();
  }

  var _balance = 0;
  if (CashDrawerPaymentDetail) {
    if (CashDrawerPaymentDetail.Status == "Close")
      _balance = CashDrawerPaymentDetail.Actual;
    else
      _balance = CashDrawerPaymentDetail.Expected;
  }

  var userName = CashDrawerPaymentDetail && CashDrawerPaymentDetail  ? CashDrawerPaymentDetail.SalePersonName : '';
  var openingNote = CashDrawerPaymentDetail &&  CashDrawerPaymentDetail ? CashDrawerPaymentDetail.OpeningNotes : '';
  var openDateTime = CashDrawerPaymentDetail &&  CashDrawerPaymentDetail ? CashDrawerPaymentDetail.UtcOpenDateTime : "";
  var _openDateTime = moment.utc(openDateTime).local().format(Config.key.TIMEDATE_FORMAT);
  var openingBal = CashDrawerPaymentDetail  && CashDrawerPaymentDetail ? CashDrawerPaymentDetail.OpeningBalance : 0.00;



  return (
    <>
      <div className="cash-management-wrapper">
        <LeftNavBar></LeftNavBar>
        <div className="cm-header">
          <button id="mobileNavToggle">
            <img src="" alt="" />
          </button>
          <p>Cash Management</p>
        </div>
        <div className="cm-register-view">
          {((!allCashRecords) || allCashRecords.length == 0) ? <>
            <h1>LOADING</h1>
          </> :
            <>
              <button className="no-transform">
                <p className="style1">Currently Active</p>
                <div className="row">
                  <p className="style2">Register 1</p>
                  <p className="style3 green">OPEN</p>
                </div>
                <p className="style4">User: Freddy Mercury</p>
              </button>
              <div className="prev-registers">
                {orders && ordersDate && ordersDate.map((getDate, index) => {
                  return (<> <div className="category">   {current_date == getDate ? 'Today' : getDate} </div>
                    {getDate && orders && orders[getDate] && orders[getDate].map((order, index) => {
                      return (


                        <button className="no-transform" onClick={() => getCashDrawerPaymentDetail(order.Id, index)} >
                          <div className="row">
                            <p className="style1"> {order.RegisterName}</p>
                            <p className="style2">  {!order.ClosedTime ? "OPEN" : "Closed " + order.ClosedTime}</p>
                          </div>
                          <div className="row">
                            <p className="style2">User: {order.SalePersonName}</p>
                            <p className="style2">{order.OpenTime}</p>
                          </div>
                        </button>
                      )
                    })
                    }

                  </>)
                })}
              </div>
            </>
          }
        </div>

        <div className="cm-detailed-view">
          <div className="detailed-header">
            <p>Transaction History</p>
            <div className="outer-group">
              <div className="inner-group">
                <div className="row">
                <p className="style1">{CashDrawerPaymentDetail&&CashDrawerPaymentDetail.RegisterName}</p>
                  <p className="style2 green">{CashDrawerPaymentDetail&&CashDrawerPaymentDetail.Status}</p>
                </div>
                <p className="style3">March 31, 2022 6:15pm</p>
              </div>
              <div className="inner-group">
                <p className="style1">Cash Drawer Ending Balance</p>
                <p className="style4">{_balance}</p>
              </div>
              <button>Print History</button>
            </div>
          </div>






          <div className="detailed-body">
            <div className="register-event">
              <div className="outer-group">
                <div className="group1">
                  <p className="style1">Closing Float</p>
                  <p className="style2">10:30 AM</p>
                </div>
                <div className="group2">
                  <p className="style2">
                    <b>User:</b> Peter Johnson
                  </p>
                  <p className="style2">
                    <b>Notes: </b>Miscalculated by 5 cents
                  </p>
                </div>
              </div>
              <div className="group3">
                <p className="style2">
                  <b>Expected Balance:</b> 300.00
                </p>
                <p className="style2">
                  <b>Actual Balance:</b> 300.00
                </p>
              </div>
            </div>
            <div className="register-event">
              <div className="outer-group" />
            </div>
          </div>




          
{/* 
          <div className="detailed-body">
            <div className="register-event">
              <div className="outer-group">
                <div className="group1">
                  <p className="style1">cash</p>
                  <p className="style2">10:30 AM</p>
                </div>
                <div className="group2">
                  <p className="style2">
                    <b>User:</b> Peter Johnson
                  </p>
                  <p className="style2">
                    <b>Notes: </b>Miscalculated by 5 cents
                  </p>
                </div>
              </div>
              <div className="group3">
                <p className="style2">
                  <b>Expected Balance:</b> 300.00
                </p>
                <p className="style2">
                  <b>Actual Balance:</b> 300.00
                </p>
              </div>
            </div>
            <div className="register-event">
              <div className="outer-group" />
            </div>
          </div> */}













{
            paymentList.filter(i => i.Description.toLowerCase() == "cash").map((item, index) => {

              return (
                <>
                 <div className="all_detailed_body">
                  

                  <div className="detailed-body">
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
                    <div className="register-event">
                      <div className="outer-group"></div>
                    </div>
                  </div>
                  </div>

                </>)
            })
          }


          

          <div className="detailed-body">
            <div className="register-event">
              <div className="outer-group">
                <div className="group1">
                  <p className="style1">initial Float</p>
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
            <div className="register-event">
              <div className="outer-group" />
            </div>
          </div>







          <div className="detailed-footer">
            <button>Remove Cash</button>
            <button>Add Cash</button>
          </div>
        </div>


        





        {/* <div className="cm-detailed-view">
          <div className="detailed-header">
            <p>Transaction History</p>
            <div className="outer-group">
              <div className="inner-group">
                <div className="row">
                  <p className="style1">{CashDrawerPaymentDetail&&CashDrawerPaymentDetail.RegisterName}</p>
                  <p className="style2 green">{CashDrawerPaymentDetail&&CashDrawerPaymentDetail.Status}</p>
                </div>
                <p className="style3">March 31, 2022 6:15pm</p>
              </div>
              <div className="inner-group">
                <p className="style1">Cash Drawer Ending Balance</p>
                <p className="style4">{_balance}</p>
              </div>
              <button>Print History</button>
            </div>
          </div>


          {
            paymentList.filter(i => i.Description.toLowerCase() == "cash").map((item, index) => {

              return (
                <>
                 <div className="all_detailed_body">
                  

                  <div className="detailed-body">
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
                    <div className="register-event">
                      <div className="outer-group"></div>
                    </div>
                  </div>
                  </div>

                </>)
            })
          }
          <div className="detailed-footer">
            <button>Remove Cash</button>
            <button>Add Cash</button>
          </div>
        </div> */}
      </div>



    </>
  )
}

export default Cashmanagement