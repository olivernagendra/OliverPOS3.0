import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import LeftNavBar from "../common/commonComponents/LeftNavBar";
import ClearCart from '../../assets/images/svg/ClearCart-Icon.svg'
import OliverIconBaseBlue from '../../assets/images/svg/Oliver-Icon-BaseBlue.svg'
import DropdownArrow from '../../assets/images/svg/DropdownArrow.svg'
import calendar from '../../assets/images/svg/calendar.svg'
import Select from 'react-select'
import SearchBaseBlue from '../../assets/images/svg/SearchBaseBlue.svg'
import FilterArrowDown from '../../assets/images/svg/FilterArrowDown.svg'
import FilterArrowUp from '../../assets/images/svg/FilterArrowUp.svg'
import FilterCollapseIcon from '../../assets/images/svg/FilterCollapseIcon.svg'
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
import { activityRecords, getDetail, getFilteredActivities } from './ActivitySlice'
import Config from '../../Config'
import ActivityList from "./ActivityList";
import { FormateDateAndTime } from '../../settings/FormateDateAndTime';
import ActivityOrderDetail from "./ActivityOrderDetail";
import ActivityOrderList from "./ActivityOrderList";


const ActivityView = () => {

    const [AllActivityList, setAllActivityList] = useState([])
    const [updateActivityId, setupdateActivityId] = useState('')
    const [SelectedTypes, setSelectedTypes] = useState('')
    const [FilteredActivityList, setFilteredActivityList] = useState('')
    const [selectedOption, setSelectedOption] = useState('')
    const [sortbyvaluename, SetSortByValueName] = useState('Date')
    const [emailnamephone, setEmailNamePhone] = useState('')
    const [pricefrom, setPriceFrom] = useState('')
    const [priceto, setPriceTo] = useState('')
    const [filterByPlatform, setFilterByPlatform] = useState('')
    const [filterByStatus, setFilterByStatus] = useState('')
    const [isloader, setSmallLoader] = useState(true)
  
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


    // -------------------------------------------------------
    const dispatch = useDispatch();







    /// GET ALL PAGE API FIRST TIME CALL___
    let useCancelled = false;
    useEffect(() => {
        if (useCancelled == false) {
            reload()
        }
        return () => {
            useCancelled = true;
        }
    }, []);

    const reload = (pagno) => {
        var UID = get_UDid('UDID')
        var pageSize = Config.key.CUSTOMER_PAGE_SIZE;
        dispatch(activityRecords({ "UID": UID, "pageSize": pageSize, "pageNumber": 1 }));
    }

    // set all Activity List response from record Api
    const [activityAllDetails] = useSelector((state) => [state.activityRecords])
    useEffect(() => {
        if (activityAllDetails && activityAllDetails.data.length > 0) {
            setAllActivityList(activityAllDetails.data);
        }
    }, [activityAllDetails]);


    // --Set Filter response from filter Api
    const [activityfilter] = useSelector((state) => [state.getFilteredActivities])
    useEffect(() => {
      //  console.log("activityfilter", activityfilter)
        if (activityfilter && activityfilter.data.length > 0) {
            setAllActivityList(activityfilter.data);
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
            _filteredActivity = _filteredActivity.slice().sort(function (a, b) {
                return new Date(b.date) - new Date(a.date);
            });
        }
        // // Date Desending Order
        if (SelectedTypes == 'dateDesc') {
            _filteredActivity = _filteredActivity.slice().sort(function (a, b) {
                return new Date(a.date) - new Date(b.date);
            });
        }
        setFilteredActivityList(_filteredActivity);
        scount += _filteredActivity.length;
        // console.log("_filteredActivity", _filteredActivity)
        // console.log("customer count", scount)
    }






    // Filter activity list Accourding To Date
    var getDistinctActivity = {};
    var _activity = FilteredActivityList;
    _activity && _activity.map(item => {
        var dateKey = FormateDateAndTime.formatDateAndTime(item.date_time && item.date_time !== undefined ? item.date_time : item.CreatedDate, item.time_zone);
        if (!getDistinctActivity.hasOwnProperty(dateKey)) {
            getDistinctActivity[dateKey] = new Array(item);
        } else {
            if (typeof getDistinctActivity[dateKey] !== 'undefined' && getDistinctActivity[dateKey].length > 0) {
                getDistinctActivity[dateKey].push(item)
            }
        }
    })
    //  console.log("getDistinctActivity", getDistinctActivity)
    //---------------------------------------------------


    /// Click By Activity List Components
    const activeClass = (item, index, isMobileClicked) => {
        var _item = JSON.stringify(item);
        if ((item.order_id == localStorage.getItem("CUSTOMER_TO_OrderId") || item.order_id == localStorage.getItem("CUSTOMER_TO_ACTVITY"))) {

        } else {
            localStorage.removeItem("CUSTOMER_TO_ACTVITY")
            //  this.setState({ custActive: false, common_Msg: '' })
            localStorage.removeItem("CUSTOMER_TO_OrderId");
            //   $(".activity-order").removeClass("table-primary-label");
            //  $(`#activity-order-${index}`).addClass("table-primary-label");
            var mydate = new Date(item.date);
            var getPdfdate = (mydate.getMonth() + 1) + '/' + mydate.getDate() + '/' + mydate.getFullYear() + ' ' + item.time;
            var itemCreatedDate = FormateDateAndTime.formatDateAndTime(item.date_time, item.time_zone)
            setupdateActivityId(item.order_id)
            // this.setState({
            //     active: index,
            //     CreatedDate: itemCreatedDate,
            //     getPdfdateTime: getPdfdate,
            //     pushInactivityBuffer: false
            // })
            var UID = get_UDid('UDID');
            if (item.order_id) {
                dispatch(getDetail(item.order_id, UID));
            }

            //this.props.dispatch(checkoutActions.getOrderReceipt());
            // $(".button_with_checkbox input").prop("checked", false);
        }
    }


    // First Time  activityDetails API Call
    let useCancelled1 = false;
    useEffect(() => {
        var UID = get_UDid('UDID');
        var customer_to_activity_id = (typeof localStorage.getItem("CUSTOMER_TO_ACTVITY") !== 'undefined' && localStorage.getItem("CUSTOMER_TO_ACTVITY") !== null) ? localStorage.getItem("CUSTOMER_TO_ACTVITY") : null;
        setupdateActivityId(customer_to_activity_id)
        // console.log("customer_to_activity_id",customer_to_activity_id)
        if (useCancelled1 == false) {
            if (customer_to_activity_id) {
                dispatch(getDetail(customer_to_activity_id, UID));
            }
        }
        return () => {
            useCancelled1 = true;
        }
    }, [AllActivityList]);




    const sortByList = (filterType, FilterValue) => {
        SetSortByValueName(FilterValue)
        setSelectedTypes(filterType);
    }

    // filter All Function 
    const SetFilterStatus = (filterType, FilterValue,label) => {
        if (filterType == 'status') {
            setFilterByStatus(FilterValue)
        } 
    }
    const SetFilterPlatform = (filterType, FilterValue,label) => {
        if (filterType == 'platform') {
            setFilterByPlatform(FilterValue)
        }
    }
    const SetFilterUser = (filterType, FilterValue,label) => {
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
        // var fromdate = document.getElementById("txtfromdate");
        // var txttodate = document.getElementById("txttodate");
        //  var txtSearch = $("#search-orders").val();
        // var _startdate = fromdate && fromdate.value !== "" ? new Date(fromdate.value) : "";
        // var _enddate = txttodate && txttodate.value !== "" ? new Date(txttodate.value) : "";
        var s_dd = 0;
        var s_mm = 0;
        var s_yy = 0;
        var e_dd = 0;
        var e_mm = 0;
        var e_yy = 0;
        // if (_startdate && _startdate !== "") {
        //     s_dd = _startdate.getDate();
        //     s_mm = _startdate.getMonth() + 1;
        //     s_yy = _startdate.getFullYear();
        // }
        // if (_enddate && _enddate !== "") {
        //     e_dd = _enddate.getDate();
        //     e_mm = _enddate.getMonth() + 1;
        //     e_yy = _enddate.getFullYear();
        // }

        var _filterParameter = {
            "PageSize": pagesize,
            "PageNumber": 0,
            "isSearch": "true",
            "udid": UID,
            "plateform": filterByPlatform,
            "status": filterByStatus,
            "userId": filterByUser,
            // "SatrtDay": s_dd,
            // "SatrtMonth": s_mm,
            // "SatrtYear": s_yy,
            // "EndDay": e_dd,
            // "EndMonth": e_mm,
            // "EndYear": e_yy,
            "searchVal": emailnamephone,
            //"groupSlug": this.state.filterByGroupList,

        };
        dispatch(getFilteredActivities(_filterParameter));
        //Display List
        // var dvFilter = document.getElementById("activityFilter");
        // if ((dvFilter || (txtSearch && txtSearch !== '')) && isMobileOnly !== true) {
        //     dvFilter.style.display = "none"
        //     this.setState({ filterButtonText: LocalizedLanguage.cancel });
        // }
    }


    const PrintClick = ()=>{

    }

    const clearFilter=()=>{
        setfilterByUser("")
        setFilterByStatus("")
        setFilterByPlatform("")
    }
    
    // console.log("filterByPlatform",filterByPlatform)
    // console.log("filterByStatus",filterByStatus)
    // console.log("filterByUser",filterByUser)



    const handleUserChange = (selectedOption) => {
        // const { name, value } = e.target;
        setSelectedOption(selectedOption)

    }

    const _Useroptions = [];
    _Useroptions.push({ value: "", label: "All"   });
    var _userList = null
    _userList = localStorage.getItem('user_List') && localStorage.getItem('user_List') !== 'undefined' && typeof (localStorage.getItem('user_List')) !== undefined ? JSON.parse(localStorage.getItem('user_List')) : null;
    if (_userList !== null) {
        _userList.map((user) => {
            var option = { value: user.Id, label: user.Name  };
            _Useroptions.push(option);
        })
    }
    var _platform = [{ key: "both", value: "Both" }, { key: "oliver-pos", value: "Oliver POS" }, { key: "web-shop", value: "Webshop" }];
    var _orderstatus = [{ key: "", value: "All" }, { key: "pending", value: "Parked" }, { key: "on-hold", value: "Lay-Away" }, { key: "cancelled", value: "Voided" }, { key: "refunded", value: "Refunded" }, { key: "completed", value: "Closed" }];


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
                    <button id="clearSearchFields" onClick={clearFilter}>Clear</button>
                </div>
                <div className="search-header-mobile">
                    <button id="mobileSearchExit" onClick={mobileTransactionsSearch}>
                        <img src={AngledBracketBlueleft} alt="" />
                        Go Back
                    </button>
                    <button id="mobileSearchFieldClear" onClick={clearFilter} >Clear</button>
                </div>
                <div className="search-body">
                    <p className="mobile-only">Search for Order</p>
                    <label for="orderID">Order ID</label>
                    <input type="text" id="orderID" placeholder="Order ID" onChange={e => setEmailNamePhone(e.target.value)} />
                    <p>You can scan the order id anytime</p>
                    <div className="divider"></div>
                    <label for="custInfo">Customer Info</label>
                    <input type="text" id="custInfo" placeholder="Customer Name / Email / Phone #" onChange={e => setEmailNamePhone(e.target.value)} />
                    <label for="orderStatus">Order Status</label>
                    <div className={isSelectStatus === true ? "dropdown-wrapper open " : "dropdown-wrapper"} onClick={toggleStatus} >
                        <img src={DropdownArrow} alt="" />
                        <input type="text" id="orderStatus" placeholder={filterByStatus==''?"All" : filterByStatus !=="" ? filterByStatus:"Select Status" }   />
                        <div className="option-list">
                            {_orderstatus && _orderstatus.length > 0 && _orderstatus.map((item, index) => {
                                return (
                                    <div className="option" key={"status" + index} onClick={() => SetFilterStatus("status", item.key)}>
                                        <p>{item.value}</p>
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>
                    <div className="input-row">
                        <div className="input-col">
                            <label for="dateFrom">Date From</label>
                            <div className="date-selector-wrapper left ">
                                <input type="text" id="dateFrom" placeholder="Date" />
                                <button className="open-date-selector open">
                                    <img src={calendar} alt="" />
                                </button>
                                <div className="date-selector"></div>
                            </div>
                        </div>
                        <div className="input-col">
                            <label for="dateTo">Date To</label>
                            <div className="date-selector-wrapper right">
                                <input type="text" id="dateTo" placeholder="Date" />
                                <button className="open-date-selector">
                                    <img src={calendar} alt="" />
                                </button>
                                <div className="date-selector"></div>
                            </div>
                        </div>
                    </div>
                    <label for="salesPlatform">Sales Platform</label>
                    <div className={salepersonWrapper === true ? "dropdown-wrapper open " : "dropdown-wrapper"}  onClick={toggleSaleperson} >
                        <img src={DropdownArrow} alt="" />
                        <input type="text" id="salesPlatform" placeholder={filterByPlatform?filterByPlatform :"All Platforms"} />
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

                    <label for="employee">Employee</label>
                    <div className={isEmployeeWrapper === true ? "dropdown-wrapper open " : "dropdown-wrapper"} onClick={toggleEmployee}>
                        <img src={DropdownArrow} alt="" />
                        <input type="text" id="employee" placeholder={ selectuserfilter ? selectuserfilter:"Select Employee"}   />
                        <div className="option-list">
                            {_Useroptions && _Useroptions.length > 0 && _Useroptions.map((item, index) => {
                                return (
                                    <div className="option"  onClick={() => SetFilterUser("user", item.value ,item.label )}>
                                        <p>{item.label}</p>
                                    </div>
                                )
                             })
                            }

                        </div>
                    </div>


                    <div className="input-row">
                        <div className="input-col">
                            <label for="priceFrom">Price From</label>
                            <input type="text" id="priceFrom" placeholder="Price" onChange={e => setPriceFrom(e.target.value)} />
                        </div>
                        <div className="input-col">
                            <label for="priceTo">Price To</label>
                            <input type="text" id="priceTo" placeholder="Price" onChange={e => setPriceTo(e.target.value)} />
                        </div>
                    </div>
                    <button id="searchTransactionButton" onClick={applyServerFilter}>Search</button>
                </div>
            </div>

            <div className="transactions-list">
                <div className="header" onClick={toggleSortWrapp}>
                    <p>Sort by:</p>
                    <div id="customerListSort" className={isSortWrapper === true ? "sort-wrapper open " : "sort-wrapper"}>
                        {/* <!-- Hidden Input can be used to know what filter type to use (Other elements are purely visual) --> */}
                        <input type="text" id="filterType" />
                        <img src="../assets/images/svg/FilterCollapseIcon.svg" alt="" />

                        <div id="sortCurrent" className="sort-current"  >
                            <img src={FilterArrowUp} alt="" />
                            <p>{sortbyvaluename}</p>
                        </div>

                        <div className="sort-option" data-value="dateAsc" onClick={(e) => sortByList("dateAsc", "Date")} >
                            <img src={FilterArrowUp} alt="" />
                            <p>Date</p>
                        </div>
                        <div className="sort-option" data-value="dateDesc" onClick={(e) => sortByList("dateDesc", "Date")}>
                            <img src={FilterArrowDown} alt="" />
                            <p>Date</p>
                        </div>
                        <div className="sort-option" data-value="amountAsc" onClick={(e) => sortByList("amountAsc", "Amount")}>
                            <img src={FilterArrowUp} alt="" />
                            <p>Amount</p>
                        </div>
                        <div className="sort-option" data-value="amountDesc" onClick={(e) => sortByList("amountDesc", "Amount")}>
                            <img src={FilterArrowDown} alt="" />
                            <p>Amount</p>
                        </div>

                    </div>
                </div>
                <ActivityList orders={getDistinctActivity} click={activeClass} updateActivityId={updateActivityId} isloader={isloader} />
            </div>
            <div id="transactionsDetailed" className="transactions-detailed">
                <div className="detailed-header-mobile">
                    <button id="mobileDetailedExit">
                        <img src="../assets/images/svg/AngledBracket-Left-Blue.svg" alt="" />
                        Go Back
                    </button>
                </div>
                <ActivityOrderDetail />
                <div className="order-details">
                    <ActivityOrderList />
                </div>
                <div className="footer">
                    <button id="refundButton">Refund</button>
                    <button id="receiptButton"  onClick={() => PrintClick()}   >Receipt</button>
                    <button id="openSaleButton">Open Sale</button>
                </div>
            </div>
        </div>
        <div className="subwindow-wrapper hidden"></div>
    </>
}

export default ActivityView