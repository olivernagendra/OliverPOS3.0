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
import { customergetPage, customergetDetail, getAllEvents, deleteCustomerNote } from './CustomerSlice'
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
import { activityRecords, getDetail } from "../activity/ActivitySlice";
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
  const [Email, setEmail] = useState(sessionStorage.getItem("customerredirect") ? sessionStorage.getItem("customerredirect") : '')
  const [PhoneNumber, setPhoneNumber] = useState('')
  const [filteredCustomer, setFilteredCustomer] = useState([]);
  const [toggleList, setToggleList] = useState(false)
  const [sortbyvaluename, SetSortByValueName] = useState('Last Name (A-Z)')
  const [editcustomerparam, seteditcustomerparam] = useState('')
  const [customerupdatedetails, setcustomerupdatedetails] = useState(false)
  const [updateCustomerState, setupdateCustomerState] = useState(false)
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
  const toggleCreditModel = () => {
    setisShowCreditModel(!isShowCreditModel)
    if (isShowCreditModel == true) {
      document.getElementById("addCreditInput").focus()
    }
  }
  const closeNotemodel = () => {
    setisShowNoteModel(false)
    setisShowCreditModel(false)
  }
  const toggleCreateCustomer = () => {
    setisShowcreatecustomerToggle(!isShowcreatecustomerToggle)
    seteditcustomerparam('')
  }
  const toggleEditcustomer = (param) => {
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
      var customerList = [];
      customerList = rows ? rows : [];
      customerList = customerList.sort(function (a, b) {
        return b.WPId - a.WPId;
      })
      setcustomerlist(customerList);
      // setcustomerlist(rows ? rows : []);
      sessionStorage.setItem("CUSTOMER_ID", customerList[0].WPId ? customerList[0].WPId : 0);
      setupdateCustomerId(customerList[0].WPId ? customerList[0].WPId : 0)
    });
    setisCustomerListLoaded(false)
  }

  let useCancelledTwo = false;
  useEffect(() => {
    if (useCancelledTwo == false) {
      getCustomerFromIDB()
      dispatch(getDetail(null));
      dispatch(cashRecords(null));
      dispatch(activityRecords(null));
    }
    return () => {
      useCancelledTwo = true;
    }
  }, [updateCustomerState]);








  // First Time GetAllEvant and CustomerDetails API Call
  let useCancelled1 = false;
  useEffect(() => {
    //  console.log(" customergetDetail useEffect work",)
    var UID = get_UDid('UDID');
    var CUSTOMER_ID = sessionStorage.getItem("CUSTOMER_ID") ? sessionStorage.getItem("CUSTOMER_ID") : '';
    setupdateCustomerId(CUSTOMER_ID)
    if (useCancelled1 == false) {
      dispatch(customergetDetail(CUSTOMER_ID, UID));
      dispatch(getAllEvents(CUSTOMER_ID, UID));
    }
    return () => {
      useCancelled1 = true;
    }
  }, [customerupdatedetails]);
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
    // console.log("activeClass work",)

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

    // latest list
    if (filterType == 'newestforward') {
      _filteredCustomer = _filteredCustomer.sort(function (a, b) {
        return b.WPId - a.WPId;
      })
    }
    // oldest list
    if (filterType == 'oldestbackward') {
      _filteredCustomer = _filteredCustomer.sort(function (a, b) {
        return a.WPId - b.WPId;
      })
    }

    if (filterType == 'emailforward') {
      _filteredCustomer = _filteredCustomer.sort(function (a, b) {
        if (a.Email.toLowerCase() < b.Email.toLowerCase()) { return -1; }
        if (a.Email.toLowerCase() > b.Email.toLowerCase()) { return 1; }
        return 0;
      })
    }
    if (filterType.toLowerCase() == 'emailbackward') {
      _filteredCustomer = _filteredCustomer.sort((a, b) => {
        if (a.Email.toLowerCase() > b.Email.toLowerCase())
          return -1;
        if (a.Email.toLowerCase() < b.Email.toLowerCase())
          return 1;
        return 0;
      });
    }


    if (filterType == 'firstnameforward') {
      _filteredCustomer = _filteredCustomer.sort(function (a, b) {
        if (a.FirstName.toLowerCase() < b.FirstName.toLowerCase()) { return -1; }
        if (a.FirstName.toLowerCase() > b.FirstName.toLowerCase()) { return 1; }
        return 0;
      })
    }
    if (filterType.toLowerCase() == 'firstnamebackward') {
      _filteredCustomer = _filteredCustomer.sort((a, b) => {
        if (a.FirstName.toLowerCase() > b.FirstName.toLowerCase())
          return -1;
        if (a.FirstName.toLowerCase() < b.FirstName.toLowerCase())
          return 1;
        return 0;
      });
    }

    if (filterType == 'lastnameforward') {
      _filteredCustomer = _filteredCustomer.sort(function (a, b) {
        if (a.LastName.toLowerCase() < b.LastName.toLowerCase()) { return -1; }
        if (a.LastName.toLowerCase() > b.LastName.toLowerCase()) { return 1; }
        return 0;
      })
    }
    if (filterType.toLowerCase() == 'lastnamebackward') {
      _filteredCustomer = _filteredCustomer.sort((a, b) => {
        if (a.LastName.toLowerCase() > b.LastName.toLowerCase())
          return -1;
        if (a.LastName.toLowerCase() < b.LastName.toLowerCase())
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
    if (_filteredCustomer.length == 1) {
      setupdateCustomerId(_filteredCustomer[0].WPId)
    }
    setFilteredCustomer(_filteredCustomer);
    scount += _filteredCustomer.length;
    // console.log("_filteredCustomer", _filteredCustomer)
    // console.log("customer count", scount)
  }

  const updateSomething = (customer_Id) => {
    //  console.log("updateSomething work",)
    var UID = get_UDid('UDID');
    setTimeout(() => {
      dispatch(customergetDetail(customer_Id, UID));
      dispatch(getAllEvents(customer_Id, UID));
    }, 300);

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
      sessionStorage.setItem("transactionredirect", customerDetailData.Email ? customerDetailData.Email : "");
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
      sessionStorage.removeItem('customerredirect');
    }
  }


  // Customer Edit  API response
  const [customereditsucc] = useSelector((state) => [state.customerupdate])
  useEffect(() => {
    if (customereditsucc && customereditsucc.status == STATUSES.IDLE && customereditsucc.is_success && customereditsucc.data) {
      // console.log("customereditsucc.data",customereditsucc.data)
      setcustomerupdatedetails(true)
      updateSomething(updateCustomerId);
    }
  }, [customereditsucc]);


  const deleteNotes = (Id) => {
    if (Id !== "") {
      dispatch(deleteCustomerNote(Id))
      updateSomething(updateCustomerId);
    }
  }

  const [respDeleteCustomerNote] = useSelector((state) => [state.deleteCustomerNote])
  useEffect(() => {
    if (respDeleteCustomerNote && respDeleteCustomerNote.status == STATUSES.IDLE && respDeleteCustomerNote.is_success && respDeleteCustomerNote.data) {
      updateSomething(updateCustomerId);
    }
  }, [respDeleteCustomerNote]);

  const [respUpdateCustomerNote] = useSelector((state) => [state.updateCustomerNote])
  useEffect(() => {
    if (respUpdateCustomerNote && respUpdateCustomerNote.status == STATUSES.IDLE && respUpdateCustomerNote.is_success && respUpdateCustomerNote.data) {
      updateSomething(updateCustomerId);
    }
  }, [respUpdateCustomerNote]);



  const [customerres] = useSelector((state) => [state.customersave])
  useEffect(() => {
    if (customerres && customerres.status == STATUSES.IDLE && customerres.is_success && customerres.data) {
      // console.log("customerres.data",customerres.data)
      setupdateCustomerState(true)
    }
  }, [customerres]);


  const handleKeyUp = (e) => {
    // console.log("e", e.keyCode)
    if (e.keyCode == 13) {
      productDataSearch();
    }
  }




  var noteslength = eventCollection && eventCollection.filter(i => i.eventtype.toLowerCase() == 'add new note')
  // console.log("noteslength", noteslength.length)
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
            <button id="cvAddCustomer" onClick={() => toggleCreateCustomer()}>
              <img src={CircledPlus_Icon_Blue} alt="" />Add New
            </button>
            <button id="mobileCVExitSearch" onClick={CustomerSearchMobi}>
              <img src={AngledBracketBlueleft} alt="" />
              Go Back
            </button>
            <p className="mobile-only">Search for Customer</p>
          </div>
          <div className="body">
            <div className="row">
              <img src={SearchBaseBlue} alt="" />
              <p>Search</p>
              <button id="customersClearSearch" onClick={clearSearch}>Clear Search</button>

            </div>
            <label htmlFor="fName">First Name</label>
            <input type="text" id="FirstName" placeholder="Enter First Name" value={FirstName} onChange={e => setFirstName(e.target.value)} onKeyUp={(e) => handleKeyUp(e)} />
            <label htmlFor="lName">Last Name</label>
            <input type="text" id="LastName" placeholder="Enter Last Name" value={LastName} onChange={e => setLastName(e.target.value)} onKeyUp={(e) => handleKeyUp(e)} />
            <label htmlFor="email">Email</label>
            <input type="email" id="Email" placeholder="Enter Email" value={Email} onChange={e => setEmail(e.target.value)} onKeyUp={(e) => handleKeyUp(e)} />
            <label htmlFor="tel">Phone Number</label>
            <input type="number" id="PhoneNumber" placeholder="Enter Phone Number" value={PhoneNumber} onChange={e => setPhoneNumber(e.target.value)} onKeyUp={(e) => handleKeyUp(e)} />
            <button id="searchCustomersButton" onClick={productDataSearch}>Search</button>
          </div>
        </div>
        <div className="cv-list" >
          <div className="header">
            <p>Sort by:</p>
            <div onClick={toggleSortWrapp} id="customerListSort" className={isSortWrapper === true ? "sort-wrapper open " : "sort-wrapper"}>
              <img src={DownArrowBlue} alt="" />
              <input type="text" id="filterType" value={sortbyvaluename} readOnly />
              {/* <img className="dropdown-arrow" src={DownArrowBlue} alt="" />
              <div id="sortCurrent" className="sort-current">
                <img src={filterType != "" && filterType.includes("forward") ? FilterArrowUp : FilterArrowDown} alt="" />
                <p>{sortbyvaluename}</p>
              </div> */}
              <div className="option-container" id="customerListSortOptionsContainer">
                <div className="option" onClick={(e) => sortByList("firstnameforward", "First Name (A-Z)")}>First Name (A-Z)</div>
                <div className="option" onClick={(e) => sortByList("firstnamebackward", "First Name (Z-A)")}>First Name (Z-A)</div>
                <div className="option" onClick={(e) => sortByList("lastnameforward", "Last Name (A-Z)")}>Last Name (A-Z)</div>
                <div className="option" onClick={(e) => sortByList("lastnamebackward", "Last Name (Z-A)")}>Last Name (Z-A)</div>
                <div className="option" onClick={(e) => sortByList("emailforward", "Email (A-Z)")}>Email (A-Z)</div>
                <div className="option" onClick={(e) => sortByList("emailbackward", "Email (Z-A)")} >Email (Z-A)</div>
              </div>
              {/* <div onClick={(e) => sortByList("newestforward", "Newest")} className="sort-option" >
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
              </div> */}

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
                    userName={item.UserName}
                    updateCustomerId={updateCustomerId}
                  // className={active == index ? 'selected-indicator' : ''} 
                  />
                )
              }) : <div className="no-results">
                <p className="style1">No results found.</p>
                <p className="style2">Sorry, you search did not <br /> match any results.</p>
              </div>}
            </>}

          </div>

          <div className="mobile-footer">
            <button id="mobileAddCustomerButton">Create New</button>
          </div>
        </div>
        {filteredCustomer && filteredCustomer.length > 0 ? <div id="CVDetailed" className={toggleList === true ? "cv-detailed open " : "cv-detailed"}>
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
            <button id="editCustomerButton" onClick={() => toggleEditcustomer("editcustomer")}>
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
                      <button onClick={() => deleteNotes(item.Id)}>
                        <img src={CircledX_Grey} alt="" />
                      </button>
                    </div>
                    <p>{item.Description}</p>
                  </div>
                  : ""
              )
            }) : noteslength.length > 0 ? <div>Record not found</div> : ''}

            {noteslength.length == 0 ? <p style={{ color: "gray" }}>Record not found</p> : ''}





          </div>




          <AddCustomersNotepoup updateSomething={updateSomething} isShow={isShowNoteModel} UID={UID} customerId={updateCustomerId} toggleNoteModel={toggleNoteModel} />
          <AdjustCreditpopup updateSomething={updateSomething} isShow={isShowCreditModel} toggleCreditModel={toggleCreditModel} details={customerDetailData} UID={UID} />
          <Customercreate
            isShow={isShowcreatecustomerToggle}
            toggleCreateCustomer={toggleCreateCustomer}
            toggleEditcustomer={toggleEditcustomer}
            editcustomerparam={editcustomerparam}
            customerDetailData={customerDetailData ? customerDetailData : ""}
            CustomerAddress={CustomerAddress}
            getCustomerFromIDB={getCustomerFromIDB}
            updateSomething={updateSomething}

          />
          <div className="footer">
            <button id="customerToTransactions" onClick={() => OpenTransactions(customerDetailData)}>View Transactions</button>
            <button id="addCustToSaleButton" onClick={() => addCustomerToSale(customerDetailData)}>Add To Sale</button>
          </div>
        </div> : <><div id="CVDetailed" className="cv-detailed">
				<div className="no-search-results-detailed">
					<p className="style1">No customer to display.</p>
					<p className="style2">Try searching for an customer or <br /> select from list to view.</p>
				</div></div></>   }
      </div>
    </React.Fragment>
  )
}

export default CustomerView






{/* {eventCollection && eventCollection.length > 0 ? eventCollection.map((item, index) => {
              return (
                item.eventtype.toLowerCase() == 'new order' ?
                  <div className="customer-note" key={index}>
                    <div className="row">
                      <p className="style1"> {item.datetime ? item.datetime : ''}</p>
                      <p className="style2"> {item.time ? item.time : ''}</p>
                     
                    </div>
                    <strong>{item.status == 'refunded' ? LocalizedLanguage.refundissued
                      : LocalizedLanguage.newOrder
                    }</strong>
                    <p style={{ inlineSize: "min-content" }}>{LocalizedLanguage.totalOrderAmount}</p>
                    <p style={{ display: 'grid', justifyContent: 'center' }} >{(item.amount ? item.amount : 0)}</p>
                  </div> : item.eventtype.toLowerCase() == 'add new note' ? <>
                    <div className="customer-note">
                      <div className="row">
                      <p className="style1"> {item.datetime ? item.datetime : ''}</p>
                      <p className="style2"> {item.time ? item.time : ''}</p>
                        <button onClick={()=>deleteNotes(item.Id)}>
                          <img src={CircledX_Grey} alt="" />
                        </button>
                      </div>
                      <p style={{ inlineSize: "min-content" }}>{item.Description}</p>
                     
                    </div>
                  </> : <div className="customer-note">
                    <div className="row">
                    <p className="style1"> {item.datetime ? item.datetime : ''}</p>
                      <p className="style2"> {item.time ? item.time : ''}</p>
                     
                    </div>
                    <strong> {LocalizedLanguage.updatecustomer}</strong>
                    {item.Description ?
                     <p style={{ inlineSize: "min-content" }}>{item.Description}</p>
                    :null}
                 
                  </div>
              )

            })
              : <div>No record found</div>
            } */}