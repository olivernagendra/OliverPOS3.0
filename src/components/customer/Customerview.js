import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import LeftNavBar from "../common/commonComponents/LeftNavBar";
import ClearCart from '../../assets/images/svg/ClearCart-Icon.svg'
import OliverIconBaseBlue from '../../assets/images/svg/Oliver-Icon-BaseBlue.svg'
import SearchBaseBlue from '../../assets/images/svg/SearchBaseBlue.svg'
import FilterArrowDown from '../../assets/images/svg/FilterArrowDown.svg'
import FilterArrowUp from '../../assets/images/svg/FilterArrowUp.svg'
import FilterCollapseIcon from '../../assets/images/svg/FilterCollapseIcon.svg'
import AngledBracketBlueleft from '../../assets/images/svg/AngledBracket-Left-Blue.svg'
import AvatarIcon from '../../assets/images/svg/AvatarIcon.svg'
import PlusSign from '../../assets/images/svg/PlusSign.svg'
import { useNavigate } from 'react-router-dom';
import { customergetPage, customergetDetail, getAllEvents } from './CustomerSlice'
import { get_UDid } from '../common/localSettings';
import moment from 'moment';
import Config from '../../Config'
import STATUSES from "../../constants/apiStatus";
import Customerlist from "./Customerlist";
import { LoadingSmallModal } from '../common/commonComponents/LoadingSmallModal'
import { useIndexedDB } from 'react-indexed-db';
import AddCustomersNotepoup from "./AddCustomersNotepoup";
import AdjustCreditpopup from "./AdjustCreditpopup";
import Cusomercreate from './Customercreate';
import LocalizedLanguage from "../../settings/LocalizedLanguage";
const CustomerView = () => {
  var orderCount = ''
  var OrderAmount = 0;
  var UID = get_UDid('UDID')
  var pageSize = Config.key.CUSTOMER_PAGE_SIZE;
  const dispatch = useDispatch();
  const { add, update, getByID, getAll, deleteRecord } = useIndexedDB("customers");
  const [isShowAppLauncher, setisShowAppLauncher] = useState(false);
  const [isShowLinkLauncher, setisShowLinkLauncher] = useState(false);
  const [isShowiFrameWindow, setisShowiFrameWindow] = useState(false);
  const [isShowMobLeftNav, setisShowMobLeftNav] = useState(false);
  const [isShowNoteModel, setisShowNoteModel] = useState(false)
  const [isShowcreatecustomerToggle, setisShowcreatecustomerToggle] = useState(false)
  const [isShowCreateCustomerModel, setisShowCreateCustomerModel] = useState(false)
  const [isShowCreditModel, setisShowCreditModel] = useState(false)
  const [customerlistdata, setcustomerlist] = useState([]);
  const [isCustomerListLoaded, setisCustomerListLoaded] = useState(true)
  const [customerDetailData, setcustomerDetailData] = useState([])
  const [AllEvant, setcustomerAllEvant] = useState([])
  const [updateCustomerId, setupdateCustomerId] = useState('')
  const [CustomerAddress, setCustomerAddress] = useState([])
  const [isMobileNav, setisMobileNav] = useState(false);
  const navigate = useNavigate()
  const toggleAppLauncher = () => {
    setisShowAppLauncher(!isShowAppLauncher)
    setisShowLinkLauncher(false)
  }
  const toggleLinkLauncher = () => {
    setisShowLinkLauncher(!isShowLinkLauncher)
    setisShowAppLauncher(false)
  }

  const toggleiFrameWindow = () => {
    setisShowiFrameWindow(!isShowiFrameWindow)
  }
  const toggleNoteModel = () => {
    setisShowNoteModel(!isShowNoteModel)
  }
  const toggleCreditModel = () => [
    setisShowCreditModel(!isShowCreditModel)
  ]
  const closeNotemodel = () => {
    setisShowNoteModel(false)
    // setisShowNoteModel(!isShowNoteModel)
    setisShowCreditModel(false)
  }
  const toggleCreateCustomer = () => {
    setisShowcreatecustomerToggle(!isShowcreatecustomerToggle)
  }

  if (!localStorage.getItem('user')) {
    navigate('/pin')
  }
  var eventCollection = [];


  /// Customer Page Data form  IndexDB
  const getCustomerFromIDB = () => {
    getAll().then((rows) => {
      //  console.log("rows", rows)
      setcustomerlist(rows ? rows : []);
      sessionStorage.setItem("CUSTOMER_ID", rows[0].WPId ? rows[0].WPId : 0);
      // setcustomerDetailData(rows[0] ?rows[0]:[])
    });
    setisCustomerListLoaded(false)
  }

  let useCancelledTwo = false;
  useEffect(() => {
    if (useCancelledTwo == false) {
      getCustomerFromIDB()
    }
    return () => {
      useCancelledTwo = true;
    }
  }, []);








  // First Time GetAllEvant and CustomerDetails API Call
  let useCancelled1 = false;
  useEffect(() => {
    var UID = get_UDid('UDID');
    var CUSTOMER_ID = sessionStorage.getItem("CUSTOMER_ID");
    setupdateCustomerId(CUSTOMER_ID)
    if (useCancelled1 == false) {
      dispatch(customergetDetail(CUSTOMER_ID, UID));
      dispatch(getAllEvents(CUSTOMER_ID, UID));
    }
    return () => {
      useCancelled1 = true;
    }
  }, []);
  // // Response from customer getDetails
  const [customerAllDetails] = useSelector((state) => [state.customergetDetail])
  useEffect(() => {
    if (customerAllDetails && customerAllDetails.custsiglestatus == STATUSES.IDLE && customerAllDetails.custsigleis_success && customerAllDetails.custsigledata) {
      setcustomerDetailData(customerAllDetails.custsigledata.content.customerDetails);
      setCustomerAddress(customerAllDetails.custsigledata.content.customerDetails.customerAddress)
    }
  }, [customerAllDetails]);



  // Response ---Customer  getAllEvant 
  const { status, data, error, is_success } = useSelector((state) => state.getAllEvents)
  //console.log("status", status, "data", data, "error", error, "is_success", is_success)
  const [customerAllEvant] = useSelector((state) => [state.getAllEvents])
  useEffect(() => {
    if (customerAllEvant && customerAllEvant.status == STATUSES.IDLE && customerAllEvant.is_success && customerAllEvant.data) {
      setcustomerAllEvant(customerAllEvant.data.content);
    }
  }, [customerAllEvant]);
  if (AllEvant && AllEvant.length > 0) {
    AllEvant.map((event, index) => {
      var collectionItem = {
        eventtype: '', Id: '', amount: '', oliverPOSReciptId: '', datetime: '', status: '',
        Description: '', ShortDescription: '', location: ''
      };
      var jsonData = event.JsonData && JSON.parse(event.JsonData)
      collectionItem['eventtype'] = event.EventName;
      collectionItem['Id'] = event.Id;
      collectionItem['amount'] = jsonData && jsonData.AddPoint ? jsonData.AddPoint : event.Amount;
      collectionItem['DeductPoint'] = jsonData && jsonData.DeductPoint ? jsonData.DeductPoint : event.Amount;
      collectionItem['oliverPOSReciptId'] = '';
      collectionItem['datetime'] = moment.utc(event.CreateDateUtc).local().format(Config.key.TIMEDATE_FORMAT);//event.CreateDateUtc;
      collectionItem['status'] = event ? event.Status : '';
      collectionItem['Description'] = jsonData ? jsonData.Notes : event.Description;
      collectionItem['ShortDescription'] = event.ShortDescription;
      collectionItem['location'] = event ? event.Location : '';
      eventCollection.push(collectionItem)
    })
    orderCount = eventCollection.filter(x => x.eventtype == "New Order")
    //Order Total Amount 
    for (let index = 0; index < orderCount.length; index++) {
      if (orderCount[index].amount && orderCount[index].amount != 0) {
        OrderAmount += parseInt(orderCount[index].amount++);
      }
    }
    // console.log("orderCount", orderCount)
    // console.log("OrderAmount", OrderAmount)
  }







  const activeClass = (item, index) => {
    var UID = get_UDid('UDID');
    if (item && item.WPId !== '') {
      setupdateCustomerId(item.WPId)
      dispatch(customergetDetail(item.WPId, UID));
      dispatch(getAllEvents(item.WPId, UID));
    }
  }

  // console.log("AllEvant", AllEvant)
  // console.log("eventCollection", eventCollection)

  const toggleMobileNav = () => {
    setisMobileNav(!isMobileNav)
    // props.toggleShowMobLeftNav();
    setisShowMobLeftNav(!isShowMobLeftNav)
  }

  return (
    <React.Fragment>
      <div className="customer-view-wrapper">
        <LeftNavBar isShowMobLeftNav={isShowMobLeftNav} toggleLinkLauncher={toggleLinkLauncher} toggleAppLauncher={toggleAppLauncher} toggleiFrameWindow={toggleiFrameWindow} isShow={isShowAppLauncher}></LeftNavBar>

        <div id="navCover" className="nav-cover"></div>
        <div className="mobile-cv-header">
          <button id="mobileNavToggle" onClick={() => toggleMobileNav()} className={isMobileNav === true ? "opened" : ""} >
            <img src="" alt="" />
          </button>
          <p>{LocalizedLanguage.customers}</p>
          <button id="mobileCVSearchButton">
            <img src={SearchBaseBlue} alt="" />
          </button>
          <button id="mobileAppsButton" onClick={() => toggleAppLauncher()}>
            <img src={OliverIconBaseBlue}
              alt="" />
          </button>
        </div>
        <div id="CVSearch" className="cv-search">
          <div className="header">
            <p>{LocalizedLanguage.customers}</p>
            <button id="cvAddCustomer" onClick={toggleCreateCustomer}>
              <img src={PlusSign} alt="" />
            </button>
            <button id="mobileCVExitSearch">
              <img src="../assets/images/SVG/AngledBracket-Left-Blue.svg" alt="" />
              Go Back
            </button>
            <p className="mobile-only">Search for Customer</p>
          </div>
          <div className="body">
            <label for="fName">{LocalizedLanguage.firstName}</label>
            <input type="text" id="fName" placeholder="Enter First Name" />
            <label for="lName">{LocalizedLanguage.lastName}</label>
            <input type="text" id="lName" placeholder="Enter Last Name" />
            <label for="email">{LocalizedLanguage.email}</label>
            <input type="email" id="email" placeholder="Enter Email" />
            <label for="tel">{LocalizedLanguage.phoneNumber}</label>
            <input type="tel" id="tel" placeholder="Enter Phone Number" />
            <button id="searchCustomersButton">{LocalizedLanguage.searchactivity}</button>
          </div>
        </div>
        <div className="cv-list">
          <div className="header">
            <p>Sort by:</p>
            <div id="customerListSort" className="sort-wrapper">
              <input type="text" id="filterType" />
              <img src={FilterCollapseIcon} alt="" />
              <div id="sortCurrent" className="sort-current">
                <img src={FilterArrowUp} alt="" />
                <p>Last Name</p>
              </div>
              <div className="sort-option" data-value="lastNameAsc">
                <img src={FilterArrowUp} alt="" />
                <p>Last Name</p>
              </div>
              <div className="sort-option" data-value="lastNameDesc">
                <img src={FilterArrowDown} alt="" />
                <p>Last Name</p>
              </div>
              <div className="sort-option" data-value="emailAsc">
                <img src={FilterArrowUp} alt="" />
                <p>Email</p>
              </div>
              <div className="sort-option" data-value="emailDesc">
                <img src={FilterArrowDown} alt="" />
                <p>Email</p>
              </div>
            </div>
          </div>

          <div className="body">
            {isCustomerListLoaded == true ? <LoadingSmallModal /> : customerlistdata && customerlistdata.length > 0 ? customerlistdata.map((item, index) => {
              return (
                <Customerlist
                  onClick={() => activeClass(item, index)}
                  key={index}
                  FirstName={item.FirstName}
                  LastName={item.LastName}
                  PhoneNumber={item.Contact}
                  Email={item.Email}
                />
              )
            }) : ""}
          </div>

          <div className="mobile-footer">
            <button id="mobileAddCustomerButton">Create New</button>
          </div>
        </div>
        <div id="CVDetailed" className="cv-detailed open">
          <div className="mobile-back">
            <button id="exitCVDetailed">
              <img src="../assets/images/SVG/AngledBracket-Left-Blue.svg" alt="" />
              Go Back
            </button>
          </div>
          <div className="quick-info">
            <div className="avatar">
              <img src={AvatarIcon} alt="" />
            </div>
            <div className="group-merge">
              <div className="text-group">
                <p className="style1">{customerDetailData && customerDetailData.FirstName}</p>
                <p className="style2">{customerDetailData && customerDetailData.Email}</p>
              </div>
              <div className="text-group">
                <p className="style2">Phone #:</p>
                <p className="style2">{customerDetailData && customerDetailData.Contact}</p>
              </div>
            </div>
          </div>
          <div className="cust-totals">
            <div className="col">
              <p className="style1">{OrderAmount ? OrderAmount : 0}</p>
              <p className="style2">Total Spent</p>
            </div>
            <div className="col">
              <p className="style1">{orderCount && orderCount.length}</p>
              <p className="style2">Orders</p>
            </div>
            <div className="col">
              <p className="style1">{customerDetailData && customerDetailData.store_credit}</p>
              <p className="style2">Store Credit</p>
              <button onClick={toggleCreditModel}>Adjust Credit</button>
            </div>
          </div>
          <div className="bill-ship-info">
            {CustomerAddress && CustomerAddress.map(item => {
              if (item.TypeName.toLowerCase() == "billing") {
                return (
                  <div className="col">
                    <p className="style1">Billing Information</p>
                    <p className="style2">
                     {item.Address1} <br />
                     {item.Address2} <br />
                     {item.City} <br />
                     {item.PostCode} <br/>
                     {item.Country}
                    </p>
                  </div>
                )
              } else if (item.TypeName.toLowerCase() == "shipping") {
                return (
                  <div className="col">
                    <p className="style1">Shipping Information</p>
                    <p className="style2">
                    {item.Address1} <br />
                     {item.Address2} <br />
                     {item.City} <br />
                     {item.PostCode} <br/>
                     {item.Country}
                    </p>
                  </div>
                )
              }
            })}



          </div>

          <div className="cust-notes">
            <div className="header-row">
              <p>Customer Notes</p>
              <button id="addCustNoteButton" onClick={toggleNoteModel} >Add Note</button>
            </div>
            {eventCollection && eventCollection.length > 0 ? eventCollection.map((item, index) => {
              return (
                item.eventtype.toLowerCase() == 'add new note' && item.Description !== null && item.Description !== "" ?
                  <div className="customer-note">
                    <div className="row">
                      <p className="style1">July 27, 2021</p>
                      <p className="style2">12:50PM</p>
                      <button>
                        <img src={ClearCart} alt="" />
                      </button>
                    </div>
                    <p>{item.Description}</p>
                  </div>
                  : ""
              )
            }) : <div>Record not found</div>}
          </div>
          <AddCustomersNotepoup isShow={isShowNoteModel} UID={UID} customerId={updateCustomerId} toggleNoteModel={toggleNoteModel} />
          <AdjustCreditpopup isShow={isShowCreditModel} toggleCreditModel={toggleCreditModel} details={customerDetailData} UID={UID} />
          <Cusomercreate isShow={isShowcreatecustomerToggle} toggleCreateCustomer={toggleCreateCustomer} />
          <div className="footer">
            <button id="customerToTransactions">View Transactions</button>
            <button id="addCustToSaleButton">Add To Sale</button>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default CustomerView