import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import LeftNavBar from "../common/commonComponents/LeftNavBar";
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
const CustomerView = () => {
  var billingAddress = '';
  var shippingAddres = ''
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
  const toggleCreditModel=()=>[
    setisShowCreditModel(true)
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


  // First Api Call ----------------------
  // const loadMore = (number) => {
  //   var UID = get_UDid('UDID');
  //   dispatch(customergetPage({ "registerId": UID, "pageSize": pageSize, "pageNumber": number }));
  // }

  // let useCancelled = false;
  // useEffect(() => {
  //   if (useCancelled == false) {
  //   }
  //   loadMore(1)
  //   return () => {
  //     useCancelled = true;
  //   }
  // }, []);
  //Response ---Customer  GetPage 
  //const { status, data, error, is_success } = useSelector((state) => state.customergetPage)
  //console.log("status", status, "data", data, "error", error, "is_success", is_success)
  // const [rescustomerlist] = useSelector((state) => [state.customergetPage])
  // useEffect(() => {
  //   if (rescustomerlist && rescustomerlist.status == STATUSES.IDLE && rescustomerlist.is_success && rescustomerlist.data) {
  //     setcustomerlist(rescustomerlist.data.content.Records);
  //     setisCustomerListLoaded(false)
  //   }
  // }, [rescustomerlist]);




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
  // Response from customer getDetails
  const { custsiglestatus, custsigledata, custsigleerror, custsigleis_success } = useSelector((state) => state.customergetDetail)
  if (custsiglestatus === STATUSES.IDLE && custsigleis_success) {
    var customerDetails = custsigledata && custsigledata.content.customerDetails
    billingAddress = customerDetails && customerDetails.customerAddress.find(Items => Items.TypeName.toLowerCase() == "billing");
    shippingAddres = customerDetails && customerDetails.customerAddress.find(Items => Items.TypeName.toLowerCase() == "shipping");

  }

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
    // console.log("item", item)
    // console.log("index", index)

    var UID = get_UDid('UDID');
    if (item && item.WPId !== '') {
      setupdateCustomerId(item.WPId)
      dispatch(customergetDetail(item.WPId, UID));
      dispatch(getAllEvents(item.WPId, UID));
    }
  }

  // console.log("AllEvant", AllEvant)
  console.log("eventCollection", eventCollection)

  return (
    <React.Fragment>
    <div className="customer-view-wrapper">
      <LeftNavBar isShowMobLeftNav={isShowMobLeftNav} toggleLinkLauncher={toggleLinkLauncher} toggleAppLauncher={toggleAppLauncher} toggleiFrameWindow={toggleiFrameWindow} ></LeftNavBar>
      <div id="appLauncherWrapper" className="app-launcher-wrapper hidden">
        <div className="app-launcher">
          <div className="header">
            <button id="appLauncherExit">
              <img src={AngledBracketBlueleft} alt="" />
            </button>
            <p>App Launcher</p>
          </div>
          <div className="body">
            {/* <!-- IMAGE WILL SHOW IF NO APPS --> */}
            <img src="../assets/images/SVG/NoApps-Message.svg" alt="" />
            <button>
              <div className="img-container">
                <img src="../assets/images/Temp/ClockIn_Icon.png" alt="" />
              </div>
              <p>Clock-in App</p>
            </button>
            <button>
              <div className="img-container">
                <img src="../assets/images/Temp/Stripe Icon.png" alt="" />
              </div>
              <p>Stripe Payments</p>
            </button>
            <button>
              <div className="img-container">
                <img src="../assets/images/Temp/QRCode_Icon.png" alt="" />
              </div>
              <p>QR Code App</p>
            </button>
            <button>../assets/images/
              <div className="img-container">
                <img src="../assets/images/Temp/DYMO-Icon.png" alt="" />
              </div>
              <p>DYMO Label Printing</p>
            </button>
            <button>
              <div className="img-container">
                <img src="../assets/images/Temp/Fortis-Icon.png" alt="" />
              </div>
              <p>Fortis Payments</p>
            </button>
            <button>
              <div className="img-container">
                <img src="../assets/images/Temp/QuoteApp_Icon.png" alt="" />
              </div>
              <p>Quote Printer</p>
            </button>
            <button>
              <div className="img-container">
                <img src="../assets/images/Temp/GiftCard_Icon.png" alt="" />
              </div>
              <p>Giftcards</p>
            </button>
          </div>
        </div>
      </div>
      <div id="linkLauncherWrapper" className="link-launcher-wrapper hidden">
        <div className="link-launcher">
          <div className="header">
            <button id="linkLauncherExit">
              <img src={AngledBracketBlueleft} alt="" />
            </button>
            <p>Link Launcher</p>
          </div>
          <div className="body">
            {/* <!-- IMAGE WILL SHOW IF NO Link --> */}
            <img src="../assets/images/SVG/NoLink-Image.svg" alt="" />
            <button>
              <div className="img-container">
                <img src="../assets/images/Temp/OliverKnowledge-Icon.png" alt="" />
              </div>
              <div className="col">
                <p className="style1">Oliver Knowledge Base</p>
                <p className="style2">https://help.oliverpos.com/</p>
              </div>
            </button>
            <button>
              <div className="img-container">
                <img src="../assets/images/Temp/FB-Icon.png" alt="" />
              </div>
              <div className="col">
                <p className="style1">Facebook Site</p>
                <p className="style2">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Expedita animi ipsam quia hic tempora obcaecati enim
                  quibusdam ratione assumenda, laboriosam quo fugiat perspiciatis itaque culpa provident, aliquid vitae, id quidem?
                </p>
              </div>
            </button>
            <button>
              <div className="img-container">
                <img src="../assets/images/Temp/Etsy-Icon.png" alt="" />
              </div>
              <div className="col">
                <p className="style1">Etsy Site</p>
                <p className="style2">www.etsy.com</p>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div id="navCover" className="nav-cover"></div>
      <div className="mobile-cv-header">
        <button id="mobileNavToggle">
          <img src="" alt="" />
        </button>
        <p>Customers</p>
        <button id="mobileCVSearchButton">
          <img src="../assets/images/SVG/SearchBaseBlue.svg" alt="" />
        </button>
        <button id="mobileAppsButton">
          <img src="../assets/images/SVG/Oliver-Icon-BaseBlue.svg" alt="" />
        </button>
      </div>
      <div id="CVSearch" className="cv-search">
        <div className="header">
          <p>Customers</p>
          <button id="cvAddCustomer"  onClick={toggleCreateCustomer}>
            <img src={PlusSign} alt="" />
          </button>
          <button id="mobileCVExitSearch">
            <img src="../assets/images/SVG/AngledBracket-Left-Blue.svg" alt="" />
            Go Back
          </button>
          <p className="mobile-only">Search for Customer</p>
        </div>
        <div className="body">
          <label for="fName">First Name</label>
          <input type="text" id="fName" placeholder="Enter First Name" />
          <label for="lName">Last Name</label>
          <input type="text" id="lName" placeholder="Enter Last Name" />
          <label for="email">Email</label>
          <input type="email" id="email" placeholder="Enter Email" />
          <label for="tel">Phone Number</label>
          <input type="tel" id="tel" placeholder="Enter Phone Number" />
          <button id="searchCustomersButton">Search</button>
        </div>
      </div>
      <div className="cv-list">
        <div className="header">
          <p>Sort by:</p>
          <div id="customerListSort" className="sort-wrapper">
            {/* <!-- Hidden Input can be used to know what filter type to use (Other elements are purely visual) --> */}
            <input type="text" id="filterType" />
            <img src="../assets/images/SVG/FilterCollapseIcon.svg" alt="" />
            <div id="sortCurrent" className="sort-current">
              <img src="../assets/images/SVG/FilterArrowUp.svg" alt="" />
              <p>Last Name</p>
            </div>
            <div className="sort-option" data-value="lastNameAsc">
              <img src="../assets/images/SVG/FilterArrowUp.svg" alt="" />
              <p>Last Name</p>
            </div>
            <div className="sort-option" data-value="lastNameDesc">
              <img src="../assets/images/SVG/FilterArrowDown.svg" alt="" />
              <p>Last Name</p>
            </div>
            <div className="sort-option" data-value="emailAsc">
              <img src="../assets/images/SVG/FilterArrowUp.svg" alt="" />
              <p>Email</p>
            </div>
            <div className="sort-option" data-value="emailDesc">
              <img src="../assets/images/SVG/FilterArrowDown.svg" alt="" />
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
              <p className="style1">{customerDetails && customerDetails.FirstName}</p>
              <p className="style2">{customerDetails && customerDetails.Email}</p>
            </div>
            <div className="text-group">
              <p className="style2">Phone #:</p>
              <p className="style2">{customerDetails && customerDetails.Contact}</p>
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
            <p className="style1">{customerDetails && customerDetails.store_credit}</p>
            <p className="style2">Store Credit</p>
            <button onClick={toggleCreditModel}>Adjust Credit</button>
          </div>
        </div>

        <div className="bill-ship-info">
          <div className="col">
            <p className="style1">Billing Information</p>
            <p className="style2">
              {billingAddress.Address1}{billingAddress.Address2} <br />
              {billingAddress.Country}, {billingAddress.City} <br />
              {billingAddress.PostCode}
            </p>
          </div>
          <div className="col">
            <p className="style1">Shipping Information</p>
            <p className="style2">

              {shippingAddres.Address1}{shippingAddres.Address2} <br />
              {shippingAddres.Country}, {shippingAddres.City} <br />
              {shippingAddres.PostCode}
            </p>
          </div>
        </div>

        <div className="cust-notes">
          <div className="header-row">
            <p>Customer Notes</p>
            <button id="addCustNoteButton" onClick={toggleNoteModel} >Add Note</button>
          </div>
          {eventCollection && eventCollection.length > 0 ? eventCollection.map((item, index) => {
            return (
              item.eventtype.toLowerCase() == 'add new note' && item.Description !==null && item.Description !=="" ? 
                <div className="customer-note">
                  <div className="row">
                    <p className="style1">July 27, 2021</p>
                    <p className="style2">12:50PM</p>
                    <button>
                      <img src="../assets/images/SVG/ClearCart-Icon.svg" alt="" />
                    </button>
                  </div>
                  <p>{item.Description}</p>
                </div>
                : ""
            )
          }) : <div>Record not found</div>}
        </div>
         <AddCustomersNotepoup  isShow={isShowNoteModel} UID={UID} customerId={updateCustomerId}   toggleNoteModel={toggleNoteModel} /> 
        <AdjustCreditpopup isShow={isShowCreditModel}  /> 
         <Cusomercreate  isShow={isShowcreatecustomerToggle} toggleCreateCustomer={toggleCreateCustomer} />
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