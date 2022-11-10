import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import LeftNavBar from "../common/commonComponents/LeftNavBar";
import ClearCart from '../../assets/images/svg/ClearCart-Icon.svg'
import CircledX_Grey from '../../assets/images/svg/CircledX-Grey.svg'
import OliverIconBaseBlue from '../../assets/images/svg/Oliver-Icon-BaseBlue.svg'
import SearchBaseBlue from '../../assets/images/svg/SearchBaseBlue.svg'
import FilterArrowDown from '../../assets/images/svg/FilterArrowDown.svg'
import FilterArrowUp from '../../assets/images/svg/FilterArrowUp.svg'
import DownArrowBlue from '../../assets/images/svg/DownArrowBlue.svg'
import AngledBracketBlueleft from '../../assets/images/svg/AngledBracket-Left-Blue.svg'
import AvatarIcon from '../../assets/images/svg/AvatarIcon.svg'
import PlusSign from '../../assets/images/svg/PlusSign.svg'
import Pencil from '../../assets/images/svg/Pencil-Outline-Blue.svg'
import CircledPlus_Icon_Blue from '../../assets/images/svg/CircledPlus-Icon-Blue.svg'
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
import Customercreate from './Customercreate';
import AppLauncher from "../common/commonComponents/AppLauncher";
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { FormateDateAndTime } from '../../settings/FormateDateAndTime';
import { LoadingModal } from "../common/commonComponents/LoadingModal";
import { cashRecords } from "../cashmanagement/CashmanagementSlice";
import { activityRecords } from "../activity/ActivitySlice";
import { NumericFormat } from 'react-number-format';
const CustomerView = () => {

  var orderCount = ''
  var OrderAmount = 0;
  var UID = get_UDid('UDID')
  var pageSize = Config.key.CUSTOMER_PAGE_SIZE;
  const dispatch = useDispatch();
  const { add, update, getByID, getAll, deleteRecord } = useIndexedDB("customers");
  const [isSortWrapper, setSortWrapper] = useState(false)
  const [isCvmobile, setCvmobile] = useState(false)
  const [isShowAppLauncher, setisShowAppLauncher] = useState(false);
  const [isShowLinkLauncher, setisShowLinkLauncher] = useState(false);
  const [isShowiFrameWindow, setisShowiFrameWindow] = useState(false);
  const [isShowMobLeftNav, setisShowMobLeftNav] = useState(false);
  const [isShowNoteModel, setisShowNoteModel] = useState(false)
  const [isShowcreatecustomerToggle, setisShowcreatecustomerToggle] = useState(false)
  const [isShowEditcustomer, setisShowEditcustomer] = useState(false)
  const [isShowCreateCustomerModel, setisShowCreateCustomerModel] = useState(false)
  const [isShowCreditModel, setisShowCreditModel] = useState(false)
  const [customerlistdata, setcustomerlist] = useState([]);
  const [isCustomerListLoaded, setisCustomerListLoaded] = useState(true)
  const [customerDetailData, setcustomerDetailData] = useState([])
  const [AllEvant, setcustomerAllEvant] = useState([])
  const [updateCustomerId, setupdateCustomerId] = useState('')
  const [CustomerAddress, setCustomerAddress] = useState([])
  const [isMobileNav, setisMobileNav] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('')
  const [Email, setEmail] = useState('')
  const [PhoneNumber, setPhoneNumber] = useState('')
  const [filteredCustomer, setFilteredCustomer] = useState([]);
  const [toggleList, setToggleList] = useState(false)
  const [sortbyvaluename, SetSortByValueName] = useState('FirstName')
  const [editcustomerparam, seteditcustomerparam] = useState('')
  const navigate = useNavigate()
  const toggleAppLauncher = () => {
    setisShowAppLauncher(!isShowAppLauncher)
    setisShowLinkLauncher(false)
  }
  const toggleClickList = () => {
    setToggleList(!toggleList)
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
    seteditcustomerparam('')
  }
  const toggleEditcustomer =(param)=>{
    ///console.log("param",param)
    seteditcustomerparam(param)
    setisShowcreatecustomerToggle(!isShowcreatecustomerToggle)
    
  }

  const toggleMobileNav = () => {
    setisMobileNav(!isMobileNav)
    // props.toggleShowMobLeftNav();
    setisShowMobLeftNav(!isShowMobLeftNav)
  }
  const toggleSortWrapp = () => {
    setSortWrapper(!isSortWrapper)
  }
  const CustomerSearchMobi = () => {
    setCvmobile(!isCvmobile)
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
      setupdateCustomerId(rows[0].WPId ? rows[0].WPId : 0)
    });
    setisCustomerListLoaded(false)
  }

  let useCancelledTwo = false;
  useEffect(() => {
    if (useCancelledTwo == false) {
      getCustomerFromIDB()
      dispatch(cashRecords(null));
      dispatch(activityRecords(null));
    }
    return () => {
      useCancelledTwo = true;
    }
  }, []);








  // First Time GetAllEvant and CustomerDetails API Call
  let useCancelled1 = false;
  useEffect(() => {
    var UID = get_UDid('UDID');
    var Customerredirection = sessionStorage.getItem("Cusredirection") ? sessionStorage.getItem("Cusredirection") : '';
    if (Customerredirection && Customerredirection.length > 0) {
      var CUSTOMER_ID = sessionStorage.getItem("Cusredirection") ? sessionStorage.getItem("Cusredirection") : '';
      setupdateCustomerId(CUSTOMER_ID)
    } else {
      var CUSTOMER_ID = sessionStorage.getItem("CUSTOMER_ID") ? sessionStorage.getItem("CUSTOMER_ID") : '';
      setupdateCustomerId(CUSTOMER_ID)
    }

    if (useCancelled1 == false) {
      dispatch(customergetDetail(CUSTOMER_ID, UID));
      dispatch(getAllEvents(CUSTOMER_ID, UID));
    }
    //  Remove saved data from sessionStorage
    sessionStorage.removeItem('Cusredirection');
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
  // console.log("customerAllEvant",customerAllEvant)
  if (AllEvant && AllEvant.length > 0) {
    AllEvant.map((event, index) => {
      var collectionItem = {
        eventtype: '', Id: '', amount: '', oliverPOSReciptId: '', datetime: '', status: '',
        Description: '', ShortDescription: '', location: ''
      };
      var time = FormateDateAndTime.formatDateWithTime(event.CreateDateUtc, event.time_zone);
      var jsonData = event.JsonData && JSON.parse(event.JsonData)

      var gmtDateTime = FormateDateAndTime.formatDateAndTime(event.CreateDateUtc, event.time_zone)
      var time = FormateDateAndTime.formatDateWithTime(event.CreateDateUtc, event.time_zone);
      collectionItem['eventtype'] = event.EventName;
      collectionItem['Id'] = event.Id;
      collectionItem['amount'] = jsonData && jsonData.AddPoint ? jsonData.AddPoint : event.Amount;
      collectionItem['DeductPoint'] = jsonData && jsonData.DeductPoint ? jsonData.DeductPoint : event.Amount;
      collectionItem['oliverPOSReciptId'] = '';
      collectionItem['datetime'] = gmtDateTime
      // moment.utc(event.CreateDateUtc).local().format(Config.key.TIMEDATE_FORMAT);//event.CreateDateUtc;
      collectionItem['status'] = event ? event.Status : '';
      collectionItem['Description'] = jsonData ? jsonData.Notes : event.Description;
      collectionItem['ShortDescription'] = event.ShortDescription;
      collectionItem['location'] = event ? event.Location : '';
      collectionItem['time'] = time ? time : '';
      eventCollection.push(collectionItem)
    })
    orderCount = eventCollection.filter(x => x.eventtype == "New Order")
    //Order Total Amount 
    // console.log("eventCollection",eventCollection)
    for (let index = 0; index < orderCount.length; index++) {
      if (orderCount[index].amount && orderCount[index].amount != 0) {
        OrderAmount += parseInt(orderCount[index].amount++);
      }
    }
  }






  /// Customer render List Click Function
  const activeClass = (item, index) => {
    var UID = get_UDid('UDID');
    if (item && item.WPId !== '') {
      setupdateCustomerId(item.WPId)
      dispatch(customergetDetail(item.WPId, UID));
      dispatch(getAllEvents(item.WPId, UID));
      toggleClickList()
    }

  }

  const sortByList = (filterType, FilterValue) => {
    setFilterType(filterType);
    SetSortByValueName(FilterValue)
  }





  useEffect(() => {
    productDataSearch();
  }, [filterType, customerlistdata]);

  const productDataSearch = () => {
    CustomerSearchMobi()
    var scount = 0;
    var _filteredCustomer = customerlistdata
    ///Sort By Customer 

    if (filterType == 'newestforward') {
      alert("newest")
      // _filteredCustomer = _filteredCustomer.sort(function (a, b) {
      //   if (a.Email < b.Email) { return -1; }
      //   if (a.Email > b.Email) { return 1; }
      //   return 0;
      // })
    }
    if (filterType == 'oldestbackward') {
      alert("oldest")
      // _filteredCustomer = _filteredCustomer.sort(function (a, b) {
      //   if (a.Email < b.Email) { return -1; }
      //   if (a.Email > b.Email) { return 1; }
      //   return 0;
      // })
    }

    if (filterType == 'emailforward') {
      _filteredCustomer = _filteredCustomer.sort(function (a, b) {
        if (a.Email < b.Email) { return -1; }
        if (a.Email > b.Email) { return 1; }
        return 0;
      })
    }
    if (filterType.toLowerCase() == 'emailbackward') {
      _filteredCustomer = _filteredCustomer.sort((a, b) => {
        if (a.Email > b.Email)
          return -1;
        if (a.Email < b.Email)
          return 1;
        return 0;
      });
    }


    if (filterType == 'firstnameforward') {
      _filteredCustomer = _filteredCustomer.sort(function (a, b) {
        if (a.FirstName < b.FirstName) { return -1; }
        if (a.FirstName > b.FirstName) { return 1; }
        return 0;
      })
    }
    if (filterType.toLowerCase() == 'firstnamebackward') {
      _filteredCustomer = _filteredCustomer.sort((a, b) => {
        if (a.FirstName > b.FirstName)
          return -1;
        if (a.FirstName < b.FirstName)
          return 1;
        return 0;
      });
    }

    if (filterType == 'lastnameforward') {
      _filteredCustomer = _filteredCustomer.sort(function (a, b) {
        if (a.LastName < b.LastName) { return -1; }
        if (a.LastName > b.LastName) { return 1; }
        return 0;
      })
    }
    if (filterType.toLowerCase() == 'lastnamebackward') {
      _filteredCustomer = _filteredCustomer.sort((a, b) => {
        if (a.LastName > b.LastName)
          return -1;
        if (a.LastName < b.LastName)
          return 1;
        return 0;
      });
    }



    // Search in Customer
    if (FirstName !== '') {
      _filteredCustomer = _filteredCustomer.filter((item) => (
        (item.FirstName && item.FirstName.toLowerCase().includes(FirstName.toLowerCase()))
      ))
    }
    if (PhoneNumber !== '') {
      _filteredCustomer = _filteredCustomer.filter((item) => (
        (item.Contact && item.Contact.toLowerCase().includes(PhoneNumber.toLowerCase()))
      ))
    }
    if (LastName !== '') {
      _filteredCustomer = _filteredCustomer.filter((item) => (
        (item.LastName && item.LastName.toLowerCase().includes(LastName.toLowerCase()))
      ))
    }
    if (Email !== '') {
      _filteredCustomer = _filteredCustomer.filter((item) => (
        (item.Email && item.Email.toLowerCase().includes(Email.toLowerCase()))
      ))
    }
    setFilteredCustomer(_filteredCustomer);
    scount += _filteredCustomer.length;
    // console.log("_filteredCustomer", _filteredCustomer)
    // console.log("customer count", scount)
  }

  const updateSomething = (customer_Id) => {
    var UID = get_UDid('UDID');
    dispatch(customergetDetail(customer_Id, UID));
    dispatch(getAllEvents(customer_Id, UID));
  }




  const addCustomerToSale = (cutomer_data) => {
    var data = cutomer_data;
    localStorage.setItem('AdCusDetail', JSON.stringify(data))
    var list = localStorage.getItem('CHECKLIST') !== null ? (typeof localStorage.getItem('CHECKLIST') !== 'undefined') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null : null;
    if (list != null) {
      const CheckoutList = {
        ListItem: list.ListItem,
        customerDetail: data ? data : [],
        totalPrice: list.totalPrice,
        discountCalculated: list.discountCalculated,
        tax: list.tax,
        subTotal: list.subTotal,
        TaxId: list.TaxId,
        TaxRate: list.TaxRate,
        oliver_pos_receipt_id: list.oliver_pos_receipt_id,
        order_date: list.order_date,
        order_id: list.order_id,
        status: list.status,
        showTaxStaus: list.showTaxStaus,
        _wc_points_redeemed: list._wc_points_redeemed,
        _wc_amount_redeemed: list._wc_amount_redeemed,
        _wc_points_logged_redemption: list._wc_points_logged_redemption
      }
      localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList))
    }
    navigate('/home')
  }

  const OpenTransactions = (customerDetailData) => {
    //console.log("customerDetailData",customerDetailData.Email)
    if (customerDetailData.Email !== '') {
      sessionStorage.setItem("transactionredirect", customerDetailData.Email ? customerDetailData.Email : 0);
      navigate('/transactions')
    }
  }

  const clearSearch = () => {
    if (FirstName !== '' || LastName !== '' || Email !== '' || PhoneNumber !== '') {
      getCustomerFromIDB()
      setFirstName("")
      setLastName("")
      setEmail("")
      setPhoneNumber("")
    }
  }


    // Customer Edit  API response
    const [customereditsucc] = useSelector((state) => [state.customerupdate])
    useEffect(() => {
      if (customereditsucc && customereditsucc.status == STATUSES.IDLE && customereditsucc.is_success && customereditsucc.data) {
      //console.log("customereditsucc",customereditsucc)
      }
    }, [customereditsucc]);
  

  return (
    <React.Fragment>
      {customerAllEvant.status == STATUSES.LOADING ? <LoadingModal></LoadingModal> : null}
      {customereditsucc.status == STATUSES.LOADING ? <LoadingModal></LoadingModal> : null}
      <div className="customer-view-wrapper">
        <LeftNavBar isShowMobLeftNav={isShowMobLeftNav} toggleLinkLauncher={toggleLinkLauncher} toggleAppLauncher={toggleAppLauncher} toggleiFrameWindow={toggleiFrameWindow} ></LeftNavBar>
        <AppLauncher isShow={isShowAppLauncher} toggleAppLauncher={toggleAppLauncher} toggleiFrameWindow={toggleiFrameWindow}></AppLauncher>

        <div id="navCover" className="nav-cover"></div>
        <div className="mobile-cv-header">
          <button id="mobileNavToggle" onClick={() => toggleMobileNav()} className={isMobileNav === true ? "opened" : ""} >
            <img src="" alt="" />
          </button>
          <p>Customers</p>
          <button id="mobileCVSearchButton" onClick={CustomerSearchMobi}>
            <img src={SearchBaseBlue} alt="" />
          </button>
          <button id="mobileAppsButton" onClick={() => toggleAppLauncher()}>
            <img src={OliverIconBaseBlue}
              alt="" />
          </button>
        </div>
        <div id="CVSearch" className={isCvmobile === true ? "cv-search open" : "cv-search"}   >
          <div className="header">
            <p>{LocalizedLanguage.customers}</p>
            <button id="cvAddCustomer" onClick={()=>toggleCreateCustomer()}>
              <img src={CircledPlus_Icon_Blue} alt="" />Add New
            </button>
            <button id="mobileCVExitSearch" onClick={CustomerSearchMobi}>
              <img src={AngledBracketBlueleft} alt="" />
              Go Back
            </button>
            <p className="mobile-only">Search for Customer</p>
          </div>
          <div className="body">
            <div class="row">
              <img src={SearchBaseBlue} alt="" />
              <p>Search</p>
              <button id="customersClearSearch" onClick={clearSearch}>Clear Search</button>

            </div>
            <label for="fName">First Name</label>
            <input type="text" id="FirstName" placeholder="Enter First Name" value={FirstName} onChange={e => setFirstName(e.target.value)} />
            <label for="lName">Last Name</label>
            <input type="text" id="LastName" placeholder="Enter Last Name" value={LastName} onChange={e => setLastName(e.target.value)} />
            <label for="email">Email</label>
            <input type="email" id="Email" placeholder="Enter Email" value={Email} onChange={e => setEmail(e.target.value)} />
            <label for="tel">Phone Number</label>
            <input type="number" id="PhoneNumber" placeholder="Enter Phone Number" value={PhoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
            <button id="searchCustomersButton" onClick={productDataSearch}>Search</button>
          </div>
        </div>
        <div className="cv-list" >
          <div className="header" onClick={toggleSortWrapp}>
            <p>Sort by:</p>
            <div id="customerListSort" className={isSortWrapper === true ? "sort-wrapper open " : "sort-wrapper"}>
              <input type="text" id="filterType" />
              <img className="dropdown-arrow" src={DownArrowBlue} alt="" />
              <div id="sortCurrent" className="sort-current">
                <img src={filterType != "" && filterType.includes("forward") ? FilterArrowUp : FilterArrowDown} alt="" />
                <p>{sortbyvaluename}</p>
              </div>


              <div onClick={(e) => sortByList("newestforward", "Newest")} className="sort-option" >
                <img src={FilterArrowUp} alt="" />
                <p>Newest</p>
              </div>
              <div onClick={(e) => sortByList("oldestbackward", "Oldest")} className="sort-option" >
                <img src={FilterArrowDown} alt="" />
                <p>Oldest</p>
              </div>

              <div onClick={(e) => sortByList("firstnameforward", "FirstName")} className="sort-option" >
                <img src={FilterArrowUp} alt="" />
                <p>FirstName</p>
              </div>
              <div onClick={(e) => sortByList("firstnamebackward", "FirstName")} className="sort-option" >
                <img src={FilterArrowDown} alt="" />
                <p>FirstName</p>
              </div>
              <div onClick={(e) => sortByList("emailforward", "Email")} className="sort-option" >
                <img src={FilterArrowUp} alt="" />
                <p>Email</p>
              </div>
              <div onClick={(e) => sortByList("emailbackward", "Email")} className="sort-option">
                <img src={FilterArrowDown} alt="" />
                <p>Email</p>
              </div>
              <div onClick={(e) => sortByList("lastnameforward", "LastName")} className="sort-option" data-value="emailAsc">
                <img src={FilterArrowUp} alt="" />
                <p>LastName</p>
              </div>
              <div onClick={(e) => sortByList("lastnamebackward", "LastName")} className="sort-option">
                <img src={FilterArrowDown} alt="" />
                <p>lastName</p>
              </div>

            </div>
          </div>

          <div className="body">


            {isCustomerListLoaded == true ? <LoadingSmallModal /> : <>
              {filteredCustomer && filteredCustomer.length > 0 ? filteredCustomer.map((item, index) => {
                return (
                  <Customerlist
                    onClick={() => activeClass(item, index)}
                    key={index}
                    CustomerId={item.WPId}
                    FirstName={item.FirstName}
                    LastName={item.LastName}
                    PhoneNumber={item.Contact}
                    Email={item.Email}
                    updateCustomerId={updateCustomerId}
                  // className={active == index ? 'selected-indicator' : ''} 
                  />
                )
              }) : <div style={{ textAlign: "center", margin: "auto" }}> <h3>Record not found</h3></div>}
            </>}

          </div>

          <div className="mobile-footer">
            <button id="mobileAddCustomerButton">Create New</button>
          </div>
        </div>
        <div id="CVDetailed" className={toggleList === true ? "cv-detailed open " : "cv-detailed"}>
          <div className="mobile-back">
            <button id="exitCVDetailed" onClick={toggleClickList}>
              <img src={AngledBracketBlueleft} alt="" />
              Go Back
            </button>
          </div>
         


          <div className="quick-info">
              <div className="avatar">
                <img src={AvatarIcon} alt="" />
              </div>
              <div className="text-group">
              <p className="style1">{customerDetailData && customerDetailData.FirstName}</p>
                <p className="style2">{customerDetailData && customerDetailData.Email}</p>
                <p className="style2">Phone #: {customerDetailData && customerDetailData.Contact}</p>
              </div>
              <button id="editCustomerButton" onClick={()=>toggleEditcustomer("editcustomer") }>
                <img src={Pencil} alt="" />
                Edit
              </button>
            </div>




          
          <div className="cust-totals">
            <div className="col">
              <p className="style1">$<NumericFormat value={OrderAmount ? OrderAmount : 0} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></p>
              <p className="style2">Total Spent</p>
            </div>
            <div className="col">
              <p className="style1">{orderCount && orderCount.length ? orderCount.length : 0}</p>
              <p className="style2">Orders</p>
            </div>
            <div className="col">
              <p className="style1">${customerDetailData && <NumericFormat value={customerDetailData.store_credit} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</p>
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
                      {item.PostCode} <br />
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
                      {item.PostCode} <br />
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
                      <p className="style1">{item.datetime}</p>
                      <p className="style2">{item.time}</p>
                      <button>
                        <img src={CircledX_Grey} alt="" />
                      </button>
                    </div>
                    <p>{item.Description}</p>
                  </div>
                  : ""
              )
            }) : <div>Record not found</div>}
          </div>
          <AddCustomersNotepoup updateSomething={updateSomething} isShow={isShowNoteModel} UID={UID} customerId={updateCustomerId} toggleNoteModel={toggleNoteModel} />
          <AdjustCreditpopup updateSomething={updateSomething} isShow={isShowCreditModel} toggleCreditModel={toggleCreditModel} details={customerDetailData} UID={UID} />
          <Customercreate 
          isShow={isShowcreatecustomerToggle} 
          toggleCreateCustomer={toggleCreateCustomer}
          toggleEditcustomer={toggleEditcustomer}
          editcustomerparam={editcustomerparam}
          customerDetailData={customerDetailData ? customerDetailData:""} 
          CustomerAddress={CustomerAddress}
          
         
           />

        
          <div className="footer">
            <button id="customerToTransactions" onClick={() => OpenTransactions(customerDetailData)}>View Transactions</button>
            <button id="addCustToSaleButton" onClick={() => addCustomerToSale(customerDetailData)}>Add To Sale</button>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default CustomerView