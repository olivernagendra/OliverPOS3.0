import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import LeftNavBar from "../common/commonComponents/LeftNavBar";
import ClearCart from '../../assets/images/svg/ClearCart-Icon.svg'
import OliverIconBaseBlue from '../../assets/images/svg/Oliver-Icon-BaseBlue.svg'
// import DropdownArrow from '../../assets/images/svg/DropdownArrow.svg'
import down_angled_bracket from '../../assets/images/svg/down-angled-bracket.svg';
import calendar from '../../assets/images/svg/calendar.svg'
//import Select from 'react-select'
import SearchBaseBlue from '../../assets/images/svg/SearchBaseBlue.svg'
import FilterArrowDown from '../../assets/images/svg/FilterArrowDown.svg'
import FilterArrowUp from '../../assets/images/svg/FilterArrowUp.svg'
import DownArrowBlue from '../../assets/images/svg/DownArrowBlue.svg'
import AngledBracketBlueleft from '../../assets/images/svg/AngledBracket-Left-Blue.svg'
import AvatarIcon from '../../assets/images/svg/AvatarIcon.svg'
import PlusSign from '../../assets/images/svg/PlusSign.svg'
import { useNavigate } from 'react-router-dom';
import { get_UDid } from '../common/localSettings';
import moment from 'moment';
import STATUSES from "../../constants/apiStatus";
import { LoadingSmallModal } from '../common/commonComponents/LoadingSmallModal'
import AppLauncher from "../common/commonComponents/AppLauncher";
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { LoadingModal } from "../common/commonComponents/LoadingModal";
import { activityRecords, getDetail, getFilteredActivities } from './ActivitySlice'
import Config from '../../Config'
import ActivityList from "./ActivityList";
import { FormateDateAndTime } from '../../settings/FormateDateAndTime';
import ActivityOrderDetail from "./ActivityOrderDetail";
import { ActivityFooter } from "./ActivityFooter";
import { cashRecords } from "../cashmanagement/CashmanagementSlice";
import { calenderInit } from "../common/commonFunctions/homeFn";
const ActivityView = () => {
    const [defauldnumber, setDefauldNumber] = useState(2);
    const [AllActivityList, setAllActivityList] = useState([])
    const [updateActivityId, setupdateActivityId] = useState('')
    const [SelectedTypes, setSelectedTypes] = useState('')
    const [FilteredActivityList, setFilteredActivityList] = useState('')
    const [selectedOption, setSelectedOption] = useState('')
    const [sortbyvaluename, SetSortByValueName] = useState('Date (Newest)')
    const [emailnamephone, setEmailNamePhone] = useState(sessionStorage.getItem("transactionredirect") ? sessionStorage.getItem("transactionredirect") : '')
    const [orderidsearch, setorderId] = useState(sessionStorage.getItem("notificationRedirect") ? sessionStorage.getItem("notificationRedirect") : '')
    const [pricefrom, setPriceFrom] = useState('')
    const [priceto, setPriceTo] = useState('')
    const [filterByPlatform, setFilterByPlatform] = useState('')
    const [filterByStatus, setFilterByStatus] = useState('')
    const [isloader, setSmallLoader] = useState(true)
    const [getPdfdateTime, setGetPdfdateTime] = useState('')
    const [filterByUser, setfilterByUser] = useState('')
    const [selectuserfilter, setSelectuserFilter] = useState('')
    // Toggle State------------
    const [isEmployeeWrapper, setEmployeeToggle] = useState(false)
    const [salepersonWrapper, setSalePersontoggle] = useState(false)
    const [isSelectStatus, setSelectStatus] = useState(false)
    const [isShowAppLauncher, setisShowAppLauncher] = useState(false);
    const [isShowLinkLauncher, setisShowLinkLauncher] = useState(false);
    const [isShowiFrameWindow, setisShowiFrameWindow] = useState(false);
    const [isCvmobile, setCvmobile] = useState(false)
    const [isShowMobLeftNav, setisShowMobLeftNav] = useState(false);
    const [isMobileNav, setisMobileNav] = useState(false);
    const [isSortWrapper, setSortWrapper] = useState(false)
    const [responsiveCusList, setResponsiveCusList] = useState(false)
    const [activityListcount, setactivityListcount] = useState([])
    const [activeDetailApi, setactiveDetailApi] = useState(true)
    const [ActivityOrderDetails, setActivityOrderDetails] = useState([])
    const [isDateFrom, setIsDateFrom] = useState(false)
    const [isDateTo, setIsDateTo] = useState(false)
    const [filterSearchActive, setFilterSearchActive] = useState(false)
    // All TOGGLE 
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
    const toggleMobileNav = () => {
        setisMobileNav(!isMobileNav)
        setisShowMobLeftNav(!isShowMobLeftNav)
    }
    const mobileTransactionsSearch = () => {
        setCvmobile(!isCvmobile)
    }

    const toggleSortWrapp = () => {
        setSortWrapper(!isSortWrapper)
    }

    const toggleStatus = () => {
        setSelectStatus(!isSelectStatus)
    }
    const toggleSaleperson = () => {
        setSalePersontoggle(!salepersonWrapper)
    }
    const toggleEmployee = () => {
        setEmployeeToggle(!isEmployeeWrapper)
    }
    const toggleResponsiveList = () => {
        setResponsiveCusList(!responsiveCusList)
    }
    const handleCalenderFrom = () => {
        setIsDateFrom(!isDateFrom)
        //setIsDateTo(false)
    }
    const handleCalenderTo = () => {
        setIsDateTo(!isDateTo)
        //setIsDateFrom(false)
    }
    // -------------------------------------------------------
    const dispatch = useDispatch();

    setTimeout(() => {
        calenderInit();
    }, 1000);

    const hundleChange = (event) => {
        setEmailNamePhone(event.target.value)
    }
    const hundleChangeID = (event) => {
        setorderId(event.target.value)
    }
    const hundleChangePriceFrom = (e) => {

        setPriceFrom(e.target.value)
    }
    const hundleChangePriceTo = (e) => {
        setPriceTo(e.target.value)
    }




    /// GET ALL PAGE API FIRST TIME CALL___
    let useCancelled = false;
    useEffect(() => {
        if (useCancelled == false) {
            var transactionredirect = sessionStorage.getItem("transactionredirect") ? sessionStorage.getItem("transactionredirect") : '';
            var orderNo = sessionStorage.getItem("notificationRedirect") ? sessionStorage.getItem("notificationRedirect") : '';

            if (transactionredirect !== '') {
                applyServerFilter()
            }
            else if (orderNo != "") {
                setorderId(orderNo);
                applyServerFilter()
            }
            else {
                reload(1)
                dispatch(cashRecords(null));
            }

        }
        return () => {
            useCancelled = true;
        }
    }, []);

    const reload = (pagno) => {
        // console.log("Reload function call")
        var UID = get_UDid('UDID')
        var pageSize = Config.key.CUSTOMER_PAGE_SIZE;
        dispatch(activityRecords({ "UID": UID, "pageSize": pageSize, "pageNumber": pagno }));
    }


    // Getting Response  From Order Details
    const [respActivitygetdetails] = useSelector((state) => [state.activityGetDetail])
    useEffect(() => {
        if (respActivitygetdetails && respActivitygetdetails.status == STATUSES.IDLE && respActivitygetdetails.is_success && respActivitygetdetails.data) {
            setActivityOrderDetails(respActivitygetdetails && respActivitygetdetails.data && respActivitygetdetails.data.content);

        }
    }, [respActivitygetdetails]);

    // set all Activity List response from record Api
    const [activityAllDetails] = useSelector((state) => [state.activityRecords])
    useEffect(() => {
        if (activityAllDetails && activityAllDetails.data && activityAllDetails.data.content && activityAllDetails.data.content.Records.length > 0) {
            var temState = [...AllActivityList, ...activityAllDetails.data && activityAllDetails.data.content && activityAllDetails.data.content.Records]
            setAllActivityList(temState);
            setactivityListcount(activityAllDetails.data && activityAllDetails.data.content && activityAllDetails.data.content.TotalRecords)
           
        }
    }, [activityAllDetails]);


    // --Set Filter response from filter Api
    const [activityfilter] = useSelector((state) => [state.getFilteredActivities])
    useEffect(() => {
        //  console.log("activityfilter", activityfilter)
        if (activityfilter && activityfilter.data.length > 0) {
            setAllActivityList(activityfilter.data);
          
            setSmallLoader(false)
        } else {
            setAllActivityList([]);
            setSmallLoader(false)
        }
    }, [activityfilter]);





    useEffect(() => {
        ActivityDataSearch();
    }, [SelectedTypes, AllActivityList]);

    // Sort By-------
    const ActivityDataSearch = () => {
        var scount = 0;
        var _filteredActivity = AllActivityList
        //Highest to lowest
        if (SelectedTypes == 'amountAsc') {
            _filteredActivity = _filteredActivity.slice().sort((a, b) => b.total - a.total)
        }
        // Lowest to highest
        if (SelectedTypes == 'amountDesc') {
            _filteredActivity = _filteredActivity.slice().sort((a, b) => a.total - b.total)
        }

        // // Date Ascending order
        if (SelectedTypes == 'dateAsc') {
            // _filteredActivity = _filteredActivity.slice().sort(function (a, b) {
            //     return new Date(b.date) - new Date(a.date);
            // });
        }
        // // Date Desending Order
        if (SelectedTypes == 'dateDesc') {
            // _filteredActivity = _filteredActivity.slice().sort(function (a, b) {
            //     return new Date(a.date) - new Date(b.date);
            // });
        }
        // console.log("_filteredActivity",_filteredActivity)
        setFilteredActivityList(_filteredActivity);
        scount += _filteredActivity.length;
        // console.log("customer count", scount)
    }





    // Filter activity list Accourding To Date
    var getDistinctActivity = {};
    var _activity = FilteredActivityList;
    _activity && _activity.map(item => {
        //console.log("item", item)
        var dateKey = FormateDateAndTime.formatDateAndTime(item.date_time && item.date_time !== undefined ? item.date_time : item.CreatedDate, item.time_zone);
        //  console.log("dateKey", dateKey)
        if (!getDistinctActivity.hasOwnProperty(dateKey)) {
            getDistinctActivity[dateKey] = new Array(item);
        } else {
            if (typeof getDistinctActivity[dateKey] !== 'undefined' && getDistinctActivity[dateKey].length > 0) {
                getDistinctActivity[dateKey].push(item)
            }
        }
    })
    //---------------------------------------------------


    /// Click By Activity List Components
    const activeClass = (item, index, isMobileClicked) => {
        var _item = JSON.stringify(item);
        if ((item.order_id == localStorage.getItem("CUSTOMER_TO_OrderId") || item.order_id == localStorage.getItem("CUSTOMER_TO_ACTVITY"))) {

        } else {
            localStorage.removeItem("CUSTOMER_TO_ACTVITY")
            localStorage.removeItem("CUSTOMER_TO_OrderId");
            var mydate = new Date(item.date);
            var getPdfdate = (mydate.getMonth() + 1) + '/' + mydate.getDate() + '/' + mydate.getFullYear() + ' ' + item.time;
            var itemCreatedDate = FormateDateAndTime.formatDateAndTime(item.date_time, item.time_zone)
            setupdateActivityId(item.order_id)
            setGetPdfdateTime(getPdfdate)
            var UID = get_UDid('UDID');
            if (item.order_id) {
                dispatch(getDetail(item.order_id, UID));
            }
            setResponsiveCusList(!responsiveCusList)
        }
    }


    // First Time  activityDetails API Call
    let useCancelled1 = false;
    useEffect(() => {
        var UID = get_UDid('UDID');
        var customer_to_activity_id = (typeof localStorage.getItem("CUSTOMER_TO_ACTVITY") !== 'undefined' && localStorage.getItem("CUSTOMER_TO_ACTVITY") !== null) ? localStorage.getItem("CUSTOMER_TO_ACTVITY") : null;
        setupdateActivityId(customer_to_activity_id)
        if (useCancelled1 == false && activeDetailApi !== false) {
            if (customer_to_activity_id) {
                dispatch(getDetail(customer_to_activity_id, UID));
            }
        }
        if (isCvmobile === true) {
           // clearFilter();
        }
        return () => {
            useCancelled1 = true;
        }


    }, [AllActivityList, isCvmobile]);



    const sortByList = (filterType, FilterValue) => {
        SetSortByValueName(FilterValue)
        setSelectedTypes(filterType);
        setupdateActivityId("")
    }

    // filter All Function 
    const SetFilterStatus = (filterType, FilterValue, label) => {
        if (filterType == 'status') {
            setFilterByStatus(FilterValue)
        }
    }
    const SetFilterPlatform = (filterType, FilterValue, label) => {
        if (filterType == 'platform') {
            setFilterByPlatform(FilterValue)
        }
    }
    const SetFilterUser = (filterType, FilterValue, label) => {
        if (filterType == 'user') {
            if (FilterValue !== "") {
                setfilterByUser(FilterValue)
                setSelectuserFilter(label)
            }
        }
    }
    //-----------------------



    // Filter Submit Btn
    const applyServerFilter = () => {

        var UID = get_UDid('UDID');
        var pagesize = Config.key.ACTIVITY_PAGE_SIZE
        var fromdate = document.getElementById("dateFrom").value;
        var txttodate = document.getElementById("dateTo").value;
        var _startdate = fromdate && fromdate !== "" ? new Date(fromdate) : "";
        var _enddate = txttodate && txttodate !== "" ? new Date(txttodate) : "";
        var s_dd = 0;
        var s_mm = 0;
        var s_yy = 0;
        var e_dd = 0;
        var e_mm = 0;
        var e_yy = 0;
        if (_startdate && _startdate !== "") {
            s_dd = _startdate.getMonth() + 1;
            s_mm = _startdate.getDate();
            s_yy = _startdate.getFullYear();
        }
        if (_enddate && _enddate !== "") {
            e_dd = _enddate.getMonth() + 1;
            e_mm = _enddate.getDate();
            e_yy = _enddate.getFullYear();
        }
        if (filterByUser !== "" || filterByStatus !== "" || filterByPlatform !== "" || emailnamephone !== "" ||
        selectuserfilter !== "" || orderidsearch !== "" || pricefrom !== "" || priceto !== "" || fromdate !== '' || txttodate !== '') {
            
            var _filterParameter = {
                "PageSize": pagesize,
                "PageNumber": 0,
                "isSearch": "true",
                "udid": UID,
                "plateform": filterByPlatform,
                "status": filterByStatus,
                "userId": filterByUser,
                "SatrtDay": s_dd,
                "SatrtMonth": s_mm,
                "SatrtYear": s_yy,
                "EndDay": e_dd,
                "EndMonth": e_mm,
                "EndYear": e_yy,
                "searchVal": emailnamephone ? emailnamephone : orderidsearch,
                //"groupSlug": this.state.filterByGroupList,
                "MinAmount": pricefrom,
                "MaxAmount": priceto,
    
            };
            //console.log("_filterParameter",_filterParameter)
            dispatch(getFilteredActivities(_filterParameter));
           // mobileTransactionsSearch()
            setFilterSearchActive(true)

        }


     

    }

   


    const clearFilter = () => {
        var fromdate = document.getElementById("dateFrom").value;
        var txttodate = document.getElementById("dateTo").value;
      
        if (filterByUser !== "" || filterByStatus !== "" || filterByPlatform !== "" || emailnamephone !== "" ||
            selectuserfilter !== "" || orderidsearch !== "" || pricefrom !== "" || priceto !== "" || fromdate !== '' || txttodate !== '' || AllActivityList !==''   ) {
            setfilterByUser("")
            setFilterByStatus("")
            setFilterByPlatform("")
            setEmailNamePhone("")
            setSelectuserFilter('')
            setorderId('')
            setPriceFrom("")
            setPriceTo("")
            localStorage.removeItem("CUSTOMER_TO_ACTVITY");
            localStorage.removeItem('CUSTOMER_TO_OrderId');
            sessionStorage.removeItem('transactionredirect');
            sessionStorage.removeItem('notificationRedirect');
            document.getElementById('dateFrom').value = '';
            document.getElementById('dateTo').value = '';
            if(filterSearchActive == true){
                reload(1)
               // setAllActivityList("")
                setupdateActivityId('')
            }
        }
    }





    const _Useroptions = [];
    _Useroptions.push({ value: "", label: "All" });
    var _userList = null
    _userList = localStorage.getItem('user_List') && localStorage.getItem('user_List') !== 'undefined' && typeof (localStorage.getItem('user_List')) !== undefined ? JSON.parse(localStorage.getItem('user_List')) : null;
    if (_userList !== null) {
        _userList.map((user) => {
            var option = { value: user.Id, label: user.Name };
            _Useroptions.push(option);
        })
    }
    var _platform = [{ key: "both", value: "Both" }, { key: "oliver-pos", value: "Oliver POS" }, { key: "web-shop", value: "Webshop" }];
    var _orderstatus = [{ key: "", value: "All" }, { key: "pending", value: "Parked" }, { key: "on-hold", value: "Lay-Away" }, { key: "cancelled", value: "Voided" }, { key: "refunded", value: "Refunded" }, { key: "completed", value: "Closed" }];

    /// Scroll  then api call
    const updateSomething = () => {
        var transactionsRedirect = sessionStorage.getItem("transactionredirect") ? sessionStorage.getItem("transredirection") : '';
        setactiveDetailApi(false)
        setDefauldNumber(defauldnumber + 1)
        if (AllActivityList.length == activityListcount) {

        } else if (defauldnumber != 1 && transactionsRedirect == '' &&filterSearchActive !==true ) {
            reload(defauldnumber)
        }
    }

    var subtotal = 0.0;
    if (ActivityOrderDetails) {
        subtotal = parseFloat(
            parseFloat(ActivityOrderDetails.total_amount - ActivityOrderDetails.refunded_amount) -
            parseFloat(ActivityOrderDetails.total_tax - ActivityOrderDetails.tax_refunded)
        ).toFixed(2);
    }

    const handleKeyUp = (e) => {
        if (e.keyCode == 13) {
            applyServerFilter();
        }
      }

      const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "date-selector") {
            handleCalenderFrom() && handleCalenderFrom();
        }
    }



   
    return <>
        <div className="transactions-wrapper">
            <LeftNavBar isShowMobLeftNav={isShowMobLeftNav} toggleLinkLauncher={toggleLinkLauncher} toggleAppLauncher={toggleAppLauncher} toggleiFrameWindow={toggleiFrameWindow} ></LeftNavBar>
            <AppLauncher isShow={isShowAppLauncher} toggleAppLauncher={toggleAppLauncher} toggleiFrameWindow={toggleiFrameWindow}></AppLauncher>
            <div id="navCover" className="nav-cover"></div>
            <div className="mobile-transactions-header">
                <button id="mobileNavToggle" onClick={() => toggleMobileNav()} className={isMobileNav === true ? "opened" : ""}>
                    <img src="" alt="" />
                </button>
                <p>Transactions</p>
                <button id="mobileTransactionsSearchButton" onClick={mobileTransactionsSearch}>
                    <img src={SearchBaseBlue} alt="" />
                </button>
                <button id="mobileAppsButton" onClick={() => toggleAppLauncher()}>
                    <img src={OliverIconBaseBlue} alt="" />
                </button>
            </div>
            <div id="transactionsSearch" className={isCvmobile === true ? "transactions-search open" : "transactions-search"}>
                <div className="search-header">
                    <p>Transactions</p>
                    <button id="clearSearchFields" onClick={() => clearFilter()}>Clear</button>
                </div>
                <div className="search-header-mobile">
                    <button id="mobileSearchExit" onClick={mobileTransactionsSearch}>
                        <img src={AngledBracketBlueleft} alt="" />
                        Go Back
                    </button>
                    <button id="mobileSearchFieldClear" onClick={() => clearFilter()} >Clear</button>
                </div>
                <div className="search-body">
                    <p className="mobile-only">Search for Order</p>
                    <label htmlFor="orderID">Order ID</label>
                    <input type="text" id="orderID" placeholder="Order ID" onKeyUp={(e) => handleKeyUp(e)}  onChange={hundleChangeID} value={orderidsearch} />
                    <p>You can scan the order id anytime</p>
                    <div className="divider"></div>
                    <label htmlFor="custInfo">Customer Info</label>
                    <input type="text" id="custInfo" placeholder="Customer Name / Email / Phone #" onKeyUp={(e) => handleKeyUp(e)} onChange={hundleChange} value={emailnamephone} />
                    <label htmlFor="orderStatus">Order Status</label>
                    <div className={isSelectStatus === true ? "dropdown-wrapper open " : "dropdown-wrapper"} onClick={toggleStatus} >
                        <img src={down_angled_bracket} alt="" />
                        <input type="text" id="orderStatus" placeholder={filterByStatus == '' ? "All" : filterByStatus !== "" ? filterByStatus : "Select Status"} />
                        <div className="option-list">
                            {_orderstatus && _orderstatus.length > 0 && _orderstatus.map((item, index) => {
                                return (
                                    <div className="option" key={"status" + index}  onClick={() => SetFilterStatus("status", item.key)}>
                                        <p>{item.value}</p>
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>
                    <div className="input-row">
                        <div className="input-col">
                            <label htmlFor="dateFrom">Date From</label>
                            <div className="date-selector-wrapper left ">
                                <input type="text" id="dateFrom" placeholder="Date" onChange={() => {handleCalenderFrom()}} />
                                <button className="open-date-selector open" onClick={() => handleCalenderFrom()}>
                                    <img src={calendar} alt="" />
                                </button>
                                <div className={isDateFrom == true ? "date-selector open" : "date-selector"} onClick={(e) => outerClick(e)}></div>
                            </div>
                        </div>
                        <div className="input-col">
                            <label htmlFor="dateTo">Date To</label>
                            <div className="date-selector-wrapper right">
                                <input type="text" id="dateTo" placeholder="Date" onChange={() => {handleCalenderTo()}} />
                                <button className="open-date-selector" onClick={() => handleCalenderTo()}>
                                    <img src={calendar} alt="" />
                                </button>
                                <div className={isDateTo == true ? "date-selector open" : "date-selector"}></div>
                            </div>
                        </div>
                    </div>
                    <label htmlFor="salesPlatform">Sales Platform</label>
                    <div className={salepersonWrapper === true ? "dropdown-wrapper open " : "dropdown-wrapper"} onClick={toggleSaleperson} >
                        <img src={down_angled_bracket} alt="" />
                        <input type="text" id="salesPlatform" placeholder={filterByPlatform ? filterByPlatform : "All Platforms"} />
                        <div className="option-list">
                            {_platform && _platform.length > 0 && _platform.map((item, index) => {
                                return (
                                    <div className="option" key={"Platform" + index} onClick={() => SetFilterPlatform("platform", item.key)}>
                                        <p>{item.value}</p>
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>
                    <label htmlFor="employee">Employee</label>
                    <div className={isEmployeeWrapper === true ? "dropdown-wrapper open " : "dropdown-wrapper"} onClick={toggleEmployee}>
                        <img src={down_angled_bracket} alt="" />
                        <input type="text" id="employee" placeholder={selectuserfilter ? selectuserfilter : "Select Employee"} />
                        <div className="option-list">
                            {_Useroptions && _Useroptions.length > 0 && _Useroptions.map((item, index) => {
                                return (
                                    <div className="option" onClick={() => SetFilterUser("user", item.value, item.label)}>
                                        <p>{item.label}</p>
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>
                    <div className="input-row">
                        <div className="input-col">
                            <label htmlFor="priceFrom">Price From</label>
                            <input type="text" id="priceFrom" placeholder="Price" onKeyUp={(e) => handleKeyUp(e)} onChange={hundleChangePriceFrom} value={pricefrom} />
                        </div>
                        <div className="input-col">
                            <label htmlFor="priceTo">Price To</label>
                            <input type="text" id="priceTo" placeholder="Price" onKeyUp={(e) => handleKeyUp(e)} onChange={hundleChangePriceTo} value={priceto} />
                        </div>
                    </div>
                    <button id="searchTransactionButton" onClick={applyServerFilter }>Search</button>
                </div>
            </div>

            <div className="transactions-list" >
                <div className="header" onClick={toggleSortWrapp}>
                    <p>Sort by:</p>
                    <div id="customerListSort" className={isSortWrapper === true ? "sort-wrapper open " : "sort-wrapper"} > 
                        {/* <!-- Hidden Input can be used to know what filter type to use (Other elements are purely visual) --> */}
                        {/* <input type="text" id="filterType" /> */}
                        <img className="dropdown-arrow" src={DownArrowBlue} alt="" />
                        <input type="text" id="filterType" value={sortbyvaluename} readOnly />
                        {/* <p>{sortbyvaluename}</p> */}
                        {/* <div id="sortCurrent" className="sort-current"  >
                        <img className="dropdown-arrow" src={DownArrowBlue} alt="" />
                            <img src={SelectedTypes != "" && SelectedTypes.includes("Asc") ? FilterArrowUp : FilterArrowDown} alt="" />
                            <p>{sortbyvaluename}</p>
                        </div> */}
                        <div className="option-container" id="transactionsListSortOptionsContainer">
                            <div className="option" onClick={(e) => sortByList("dateAsc", "Date (Newest)")}>Date (Newest)</div>
                            <div className="option" onClick={(e) => sortByList("dateDesc", "Date (Oldest)")}>Date (Oldest)</div>
                            <div className="option" onClick={(e) => sortByList("amountAsc", "Amount (Highest)")}>Amount (Highest)</div>
                            <div className="option" onClick={(e) => sortByList("amountDesc", "Amount (Lowest)")}>Amount (Lowest)</div>
                        </div>


                        {/* <div className="option" data-value="dateAsc" onClick={(e) => sortByList("dateAsc", "Date")} >
                            <img src={FilterArrowUp} alt="" />
                            <p>Date</p>
                        </div>
                        <div className="option" data-value="dateDesc" onClick={(e) => sortByList("dateDesc", "Date")}>
                            <img src={FilterArrowDown} alt="" />
                            <p>Date</p>
                        </div>
                        <div className="option" data-value="amountAsc" onClick={(e) => sortByList("amountAsc", "Amount")}>
                            <img src={FilterArrowUp} alt="" />
                            <p>Amount</p>
                        </div>
                        <div className="option" data-value="amountDesc" onClick={(e) => sortByList("amountDesc", "Amount")}>
                            <img src={FilterArrowDown} alt="" />
                            <p>Amount</p>
                        </div> */}

                    </div>
                </div>
                <ActivityList SelectedTypes={SelectedTypes} orders={getDistinctActivity} click={activeClass} updateActivityId={updateActivityId} isloader={isloader} updateSomething={updateSomething} />
            </div>
            {_activity && _activity.length > 0 ? <div id="transactionsDetailed" className={responsiveCusList === true ? "transactions-detailed open" : " transactions-detailed"} >
                <div className="detailed-header-mobile">
                    <button id="mobileDetailedExit" onClick={toggleResponsiveList}>
                        <img src={AngledBracketBlueleft} alt="" />
                        Go Back
                    </button>
                </div>
                <ActivityOrderDetail
                    Subtotal={subtotal ? subtotal : 0}
                    //  Discount={_discount}
                    TotalTax={ActivityOrderDetails && ActivityOrderDetails.total_tax}
                    tax_refunded={ActivityOrderDetails && ActivityOrderDetails.tax_refunded}
                    TotalAmount={ActivityOrderDetails && ActivityOrderDetails.total_amount}
                    refunded_amount={ActivityOrderDetails && ActivityOrderDetails.refunded_amount}
                    OrderPayment={ActivityOrderDetails && ActivityOrderDetails.order_payments}
                    refundPayments={ActivityOrderDetails && ActivityOrderDetails.order_Refund_payments}
                    cash_round={ActivityOrderDetails && ActivityOrderDetails.cash_rounding_amount}
                    balence={0}
                    TimeZone={ActivityOrderDetails && ActivityOrderDetails.time_zone}
                    refundCashRounding={ActivityOrderDetails && ActivityOrderDetails.refund_cash_rounding_amount}
                    redeemPointsToPrint={ActivityOrderDetails && ActivityOrderDetails.meta_datas ? ActivityOrderDetails && ActivityOrderDetails.meta_datas && ActivityOrderDetails && ActivityOrderDetails.meta_datas[1] ? ActivityOrderDetails && ActivityOrderDetails.meta_datas[1].ItemValue : 0 : 0}
                    orderMetaData={ActivityOrderDetails && ActivityOrderDetails.meta_datas}
                />
                <ActivityFooter getPdfdateTime={getPdfdateTime} />
            </div> : <><div id="CVDetailed" className="cv-detailed">
                <div className="no-search-results-detailed">
                    <p className="style1">No transactions to display.</p>
                    <p className="style2">Try searching for an transactions or <br /> select from list to view.</p>
                </div></div></>}
        </div>
        <div className="subwindow-wrapper hidden"></div>
    </>
}

export default ActivityView