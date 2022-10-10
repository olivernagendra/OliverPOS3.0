import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { cashRecords, getDetails } from './CashmanagementSlice'
import moment from 'moment';
import Config from '../../Config'
import { FormateDateAndTime } from '../../settings/FormateDateAndTime';
import LeftNavBar from "../common/commonComponents/LeftNavBar";
import STATUSES from "../../constants/apiStatus";
import CashDrawerPaymentDetailList from './CashDrawerPaymentDetailList'
import { LoadingSmallModal } from "../common/commonComponents/LoadingSmallModal";
import AddRemoveCashPopup from './AddRemoveCashPopup'
import { useNavigate } from "react-router-dom";
import Oliver_Icon_BaseBlue from '../../images/svg/Oliver-Icon-BaseBlue.svg';
import AngledBracket_Left_Blue from '../../images/svg/AngledBracket-Left-Blue.svg';
import AppLauncher from "../common/commonComponents/AppLauncher";
function Cashmanagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  var registerId = localStorage.getItem('register');
  var current_date = moment().format(Config.key.DATE_FORMAT);

  const [isShowAppLauncher, setisShowAppLauncher] = useState(false);
  const [isShowLinkLauncher, setisShowLinkLauncher] = useState(false);
  const [isShowiFrameWindow, setisShowiFrameWindow] = useState(false);
  const [isShowMobLeftNav, setisShowMobLeftNav] = useState(false);
  const [isMobileNav, setisMobileNav] = useState(false);
  const [cashPopUpOpen, setcashPopUpOpen] = useState(false)
  const [popupstatus, setpopupstatus] = useState('')
  const [addremoveCash, setaddremoveCash] = useState(true)
  //var callSecondApi = true;
  var firstRecordId = "";
  const [callDetailApiOnLoad, setCallDetailApiOnLoad] = useState(true);

  const HundleCashPopup = (status) => {
    setcashPopUpOpen(true)
    setpopupstatus(status)
  }
  const HundlePOpupClose = () => {
    setcashPopUpOpen(false)
  }


  const toggleMobileNav = () => {
    setisMobileNav(!isMobileNav)
    setisShowMobLeftNav(!isShowMobLeftNav)
  }
  const toggleLinkLauncher = () => {
    setisShowLinkLauncher(!isShowLinkLauncher)
    setisShowAppLauncher(false)
  }

  const toggleAppLauncher = () => {
    setisShowAppLauncher(!isShowAppLauncher)
    setisShowLinkLauncher(false)
  }
  const toggleiFrameWindow = () => {
    setisShowiFrameWindow(!isShowiFrameWindow)
  }



  if (!localStorage.getItem('user')) {
    navigate('/pin')
  }
  const getCashDrawerPaymentDetail = (OrderId, index) => {
    dispatch(getDetails(OrderId));
  }

  const { status, data, error, is_success } = useSelector((state) => state.cashmanagement)
  // console.log("status", status, "data", data, "error", error, "is_success", is_success)
  if (status === STATUSES.IDLE && is_success) {
    if (data && data.content && data.content !== undefined) {
      var _RecordArray = data && data.content && data.content.Records ? data.content.Records : [];
      var array = [];
      if (_RecordArray.length > 0) {
        array = _RecordArray.slice().sort((a, b) => b.LogDate - a.LogDate)
        array.reverse();
        var openingCashDrawerRecord = array ? array.find(Items => Items.ClosedTimeUtc == null) : null;
        if (openingCashDrawerRecord && openingCashDrawerRecord.Id) {
          // console.log("cashmangement  openingCashDrawerRecord.Id", openingCashDrawerRecord.Id)
          localStorage.setItem("Cash_Management_ID", openingCashDrawerRecord.Id)
          localStorage.setItem("IsCashDrawerOpen", "true");
        }
        firstRecordId = array && array.length > 0 ? array[0].Id : '';
      }

    }
  }

 
  
  




  let useCancelled = false;
  useEffect(() => {
    console.log("useEfffect")
    if (useCancelled == false) {
      dispatch(cashRecords({ "registerId": registerId, "pageSize": "1000", "pageNumber": "1" }));
    }
   
    return () => {
      useCancelled = true;
    }
  }, []);


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



  const { statusgetdetail, getdetail, errorgetdetail, is_successgetdetail } = useSelector((state) => state.cashmanagementgetdetail)
  if (statusgetdetail === STATUSES.IDLE && is_successgetdetail) {
    var CashDrawerPaymentDetail = getdetail && getdetail.content
  }

  if (callDetailApiOnLoad === true && firstRecordId !== "") {
    setCallDetailApiOnLoad(false)
    getCashDrawerPaymentDetail(firstRecordId);
    firstRecordId = ""

  }

  var _balance = 0;
  if (CashDrawerPaymentDetail) {
    if (CashDrawerPaymentDetail.Status == "Close")
      _balance = CashDrawerPaymentDetail.Actual;
    else
      _balance = CashDrawerPaymentDetail.Expected;
  }
  var closeDateTime = CashDrawerPaymentDetail ? CashDrawerPaymentDetail.UtcClosedDateTime : "";
  var _closeDateTime = moment.utc(closeDateTime).local().format(Config.key.TIMEDATE_FORMAT);
  var openDateTime = CashDrawerPaymentDetail && CashDrawerPaymentDetail ? CashDrawerPaymentDetail.UtcOpenDateTime : "";
  var _openDateTime = moment.utc(openDateTime).local().format(Config.key.TIMEDATE_FORMAT);
  var Status = CashDrawerPaymentDetail && CashDrawerPaymentDetail.Status





  return (
    <>
    <React.Fragment>
      <div className="cash-management-wrapper">
      <LeftNavBar isShowMobLeftNav={isShowMobLeftNav} toggleLinkLauncher={toggleLinkLauncher} toggleAppLauncher={toggleAppLauncher} toggleiFrameWindow={toggleiFrameWindow} ></LeftNavBar>
        <AppLauncher isShow={isShowAppLauncher} toggleAppLauncher={toggleAppLauncher} toggleiFrameWindow={toggleiFrameWindow}></AppLauncher>

        <div class="mobile-cm-header">
        <button id="mobileNavToggle" onClick={() => toggleMobileNav()} className={isMobileNav === true ? "opened" : ""} >
            <img src="" alt="" />
          </button>
          <p>Cash Management</p>
          <button id="mobileAppsButton" onClick={() => toggleAppLauncher()}>
            <img src={Oliver_Icon_BaseBlue} alt="" />
          </button>
        </div>

        {/* <div className="cm-header">
          <button id="mobileNavToggle">
            <img src="" alt="" />
          </button>
          <p>Cash Management</p>
        </div> */}
        <div className="cm-list">
          <div className="cm-list-header">
            <p className="desktop">Cash Management</p>
            <p className="mobile">Transaction History</p>
          </div>
          <div className="cm-list-body">
            {((!allCashRecords) || allCashRecords.length == 0) ? <>
              {/* <div>loading...</div> */}
              <LoadingSmallModal></LoadingSmallModal>
            </> :
              <>
                <button className="current-register no-transform selected">
                  <p className="style1"> {CashDrawerPaymentDetail && !CashDrawerPaymentDetail.ClosedTime ? "Currently Active" : "Currently  Closed "}  </p>
                  <div className="text-row">
                    <p>{CashDrawerPaymentDetail && CashDrawerPaymentDetail.RegisterName}</p>
                    <p className="open">OPEN</p>
                    {/* <p className="smobile-fake-button">OPEN</p> */}
                  </div>
                  <p className="style2">User: {CashDrawerPaymentDetail && CashDrawerPaymentDetail.SalePersonName}</p>
                  <div className="mobile-fake-button">OPEN</div>
                </button>
                {/* <div className="prev-registers"> */}

                {
                  orders && ordersDate && ordersDate.map((getDate, index) => {
                    return (<React.Fragment> <div className="date"><p>{current_date == getDate ? 'Today' : getDate} </p></div>
                      {getDate && orders && orders[getDate] && orders[getDate].map((order, index) => {
                        return (
                          <button className="other-register no-transform" onClick={() => getCashDrawerPaymentDetail(order.Id, index)} >
                            <div className="row">
                              <p className="style1">{order.RegisterName}</p>

                              <p className="style2">{!order.ClosedTime ? " OPEN " : "  CLOSED  " + order.ClosedTime}  </p>
                            </div>
                            <div className="row">
                              <p className="style2">User:   {order.SalePersonName}</p>
                              <p className="style2">{order.OpenTime}</p>
                            </div>
                          </button>
                        )
                      })
                      }

                    </React.Fragment>)
                  })}
                {/* </div> */}
              </>
            }
          </div>
        </div>
      
        <div className="cm-detailed">
          <div className="detailed-header-mobile">
            <div id="mobileDetailedExit">
              <img src={AngledBracket_Left_Blue} alt="" />
              Go Back
            </div>
          </div>
          <div className="cm-detailed-header">
            <p>Transaction History</p>
            <div className="row">
              <div className="col">
                <div className="text-row">
                  <p>{CashDrawerPaymentDetail && CashDrawerPaymentDetail.RegisterName}</p>
                  <p className="open">{CashDrawerPaymentDetail && CashDrawerPaymentDetail.Status}</p>
                </div>
                <p className="style1">{Status === "Open"
                  ? _openDateTime : _openDateTime + " to " + _closeDateTime} </p>
              </div>
              <div className="col">
                <p className="style1 mobile-difference">Cash Drawer Ending Balance</p>
                <p className="style2">{_balance}</p>
              </div>
              <button>Print History</button>
            </div>
          </div>
          <div className="cm-detailed-body">
            <CashDrawerPaymentDetailList />

          </div>
          <div className="cm-detailed-footer">
            <button onClick={() => HundleCashPopup('remove')}> Remove Cash</button>
            <button onClick={() => HundleCashPopup('add')}  >Add Cash  </button>
          </div>
        
        </div>
      </div>
          <AddRemoveCashPopup popupstatus={popupstatus} isShow={cashPopUpOpen} drawerBalance={_balance} HundlePOpupClose={HundlePOpupClose}   /> 
      </React.Fragment>
    </>
  )
}

export default Cashmanagement