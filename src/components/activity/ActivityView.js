import React, { useState } from "react"
import LeftNavBar from "../common/commonComponents/LeftNavBar";
const ActivityView = () => {

    const [isShowAppLauncher, setisShowAppLauncher] = useState(false);
    const [isShowLinkLauncher, setisShowLinkLauncher] = useState(false);
    const [isShowiFrameWindow, setisShowiFrameWindow] = useState(false);

    const [isShowMobLeftNav, setisShowMobLeftNav] = useState(false);

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
    // const toggleOptionPage = () => {
    //     setisShowOptionPage(!isShowOptionPage)
    // }
    // const toggleOutOfStock = () => {
    //     setisOutOfStock(!isOutOfStock)
    // }
    // const toggleCreateCustomer = () => {
    //     setisShowCreateCustomer(!isShowCreateCustomer)
    // }
    // const toggleShowMobLeftNav = () => {
    //     setisShowMobLeftNav(!isShowMobLeftNav)
    // }
    // const toggleSelectDiscountBtn = () => {
    //     setisSelectDiscountBtn(!isSelectDiscountBtn)
    // }
    // const toggleMsgPopup = () => {
    //     setisShowMsg(!isShowMsg)
    // }
    return <>
        <div className="transactions-wrapper">
            <LeftNavBar isShowMobLeftNav={isShowMobLeftNav} toggleLinkLauncher={toggleLinkLauncher} toggleAppLauncher={toggleAppLauncher} toggleiFrameWindow={toggleiFrameWindow} ></LeftNavBar>
            {/* <div className="navbar">
                <div className="header-row">
                    <img src="../assets/images/svg/Oliver-Icon-Color.svg" alt="" className="oliver-logo" />
                    <img src="../assets/images/svg/Oliver-Type.svg" alt="" className="oliver-text" />
                </div>
                <button id="registerButton" className="page-link">
                    <div className="img-container">
                        <img src="../assets/images/svg/Register-Icon.svg" alt="" />
                    </div>
                    <p>Register</p>
                    <div className="f-key">F1</div>
                </button>
                <button id="customersButton" className="page-link selected" disabled>
                    <div className="img-container">
                        <img src="../assets/images/svg/Customers-Icon.svg" alt="" />
                    </div>
                    <p>Customers</p>
                    <div className="f-key">F2</div>
                </button>
                <button id="transactionsButton" className="page-link">
                    <div className="img-container">
                        <img src="../assets/images/svg/Transactions-Icon.svg" alt="" />
                    </div>
                    <p>Transactions</p>
                    <div className="f-key">F3</div>
                </button>
                <button id="cashManagementButton" className="page-link">
                    <div className="img-container">
                        <img src="../assets/images/svg/CashManagement-Icon.svg" alt="" />
                    </div>
                    <p>Cash Management</p>
                    <div className="f-key">F4</div>
                </button>
                <button id="linkLauncherButton" className="launcher">
                    <div className="img-container">
                        <img src="../assets/images/svg/LinkLauncher-Icon.svg" alt="" />
                    </div>
                    <p>Link Launcher</p>
                </button>
                <div className="divider"></div>
                <button id="appLauncherButton" className="launcher">
                    <div className="img-container">
                        <img src="../assets/images/svg/Oliver-Icon-BaseBlue.svg" alt="" />
                    </div>
                    <p>App Launcher</p>
                </button>
                <button id="navApp1" className="launcher app">
                    <div className="img-container">
                        <img src="../Assets/Images/Temp/ClockIn_Icon.png" alt="" />
                    </div>
                    <p>Clock-in App</p>
                </button>
                <button id="navApp2" className="launcher app">
                    <div className="img-container">
                        <img src="../Assets/Images/Temp/MC_Logo 1.png" alt="" />
                    </div>
                    <p>MailChimp</p>
                </button>
                <button id="navApp3" className="launcher app">
                    <div className="img-container">
                        <img src="../Assets/Images/Temp/Quickbooks 1.png" alt="" />
                    </div>
                    <p>Quickbooks Sync</p>
                </button>
                <button id="navToggle" className="toggle-nav">
                    <div className="img-container">
                        <img src="../assets/images/svg/ToggleNavbar-Icon.svg" alt="" />
                    </div>
                    <p>Minimize Sidebar</p>
                </button>
            </div> */}
            <div id="appLauncherWrapper" className="app-launcher-wrapper hidden">
                <div className="app-launcher">
                    <div className="header">
                        <button id="appLauncherExit">
                            <img src="../assets/images/svg/AngledBracket-Left-BaseBlue.svg" alt="" />
                        </button>
                        <p>App Launcher</p>
                    </div>
                    <div className="body">
                        {/* <!-- IMAGE WILL SHOW IF NO APPS --> */}
                        <img src="../assets/images/svg/NoApps-Message.svg" alt="" />
                        <button>
                            <div className="img-container">
                                <img src="../Assets/Images/Temp/ClockIn_Icon.png" alt="" />
                            </div>
                            <p>Clock-in App</p>
                        </button>
                        <button>
                            <div className="img-container">
                                <img src="../Assets/Images/Temp/Stripe Icon.png" alt="" />
                            </div>
                            <p>Stripe Payments</p>
                        </button>
                        <button>
                            <div className="img-container">
                                <img src="../Assets/Images/Temp/QRCode_Icon.png" alt="" />
                            </div>
                            <p>QR Code App</p>
                        </button>
                        <button>
                            <div className="img-container">
                                <img src="../Assets/Images/Temp/DYMO-Icon.png" alt="" />
                            </div>
                            <p>DYMO Label Printing</p>
                        </button>
                        <button>
                            <div className="img-container">
                                <img src="../Assets/Images/Temp/Fortis-Icon.png" alt="" />
                            </div>
                            <p>Fortis Payments</p>
                        </button>
                        <button>
                            <div className="img-container">
                                <img src="../Assets/Images/Temp/QuoteApp_Icon.png" alt="" />
                            </div>
                            <p>Quote Printer</p>
                        </button>
                        <button>
                            <div className="img-container">
                                <img src="../Assets/Images/Temp/GiftCard_Icon.png" alt="" />
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
                            <img src="../assets/images/svg/AngledBracket-Left-BaseBlue.svg" alt="" />
                        </button>
                        <p>Link Launcher</p>
                    </div>
                    <div className="body">
                        {/* <!-- IMAGE WILL SHOW IF NO Link --> */}
                        <img src="../assets/images/svg/NoLink-Image.svg" alt="" />
                        <button>
                            <div className="img-container">
                                <img src="../Assets/Images/Temp/OliverKnowledge-Icon.png" alt="" />
                            </div>
                            <div className="col">
                                <p className="style1">Oliver Knowledge Base</p>
                                <p className="style2">https://help.oliverpos.com/</p>
                            </div>
                        </button>
                        <button>
                            <div className="img-container">
                                <img src="../Assets/Images/Temp/FB-Icon.png" alt="" />
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
                                <img src="../Assets/Images/Temp/Etsy-Icon.png" alt="" />
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
            <div className="mobile-transactions-header">
                <button id="mobileNavToggle">
                    <img src="" alt="" />
                </button>
                <p>Transactions</p>
                <button id="mobileTransactionsSearchButton">
                    <img src="../assets/images/svg/SearchBaseBlue.svg" alt="" />
                </button>
                <button id="mobileAppsButton">
                    <img src="../assets/images/svg/Oliver-Icon-BaseBlue.svg" alt="" />
                </button>
            </div>
            <div id="transactionsSearch" className="transactions-search">
                <div className="search-header">
                    <p>Transactions</p>
                    <button id="clearSearchFields">Clear</button>
                </div>
                <div className="search-header-mobile">
                    <button id="mobileSearchExit">
                        <img src="../assets/images/svg/AngledBracket-Left-Blue.svg" alt="" />
                        Go Back
                    </button>
                    <button id="mobileSearchFieldClear">Clear</button>
                </div>
                <div className="search-body">
                    <p className="mobile-only">Search for Order</p>
                    <label for="orderID">Order ID</label>
                    <input type="text" id="orderID" placeholder="Order ID" />
                    <p>You can scan the order id anytime</p>
                    <div className="divider"></div>
                    <label for="custInfo">Customer Info</label>
                    <input type="text" id="custInfo" placeholder="Customer Name / Email / Phone #" />
                    <label for="orderStatus">Order Status</label>
                    <div className="dropdown-wrapper">
                        <img src="../assets/images/svg/DropdownArrow.svg" alt="" />
                        <input type="text" id="orderStatus" placeholder="Select Status" readonly />
                        <div className="option-list">
                            <div className="option">
                                <p>Complete</p>
                            </div>
                            <div className="option">
                                <p>On Hold</p>
                            </div>
                            <div className="option">
                                <p>In Progress</p>
                            </div>
                        </div>
                    </div>
                    <div className="input-row">
                        <div className="input-col">
                            <label for="dateFrom">Date From</label>
                            <div className="date-selector-placeholder"></div>
                        </div>
                        <div className="input-col">
                            <label for="dateTo">Date To</label>
                            <div className="date-selector-placeholder"></div>
                        </div>
                    </div>
                    <label for="salesPlatform">Sales Platform</label>
                    <div className="dropdown-wrapper">
                        <img src="../assets/images/svg/DropdownArrow.svg" alt="" />
                        <input type="text" id="salesPlatform" placeholder="All Platforms" readonly />
                        <div className="option-list">
                            <div className="option">
                                <p>Online</p>
                            </div>
                            <div className="option">
                                <p>In Store</p>
                            </div>
                        </div>
                    </div>
                    <label for="employee">Employee</label>
                    <div className="dropdown-wrapper">
                        <img src="../assets/images/svg/DropdownArrow.svg" alt="" />
                        <input type="text" id="employee" placeholder="Select Employee" readonly />
                        <div className="option-list">
                            <div className="option">
                                <p>Tyson</p>
                            </div>
                            <div className="option">
                                <p>Shravan</p>
                            </div>
                            <div className="option">
                                <p>Fahad</p>
                            </div>
                            <div className="option">
                                <p>Sam</p>
                            </div>
                            <div className="option">
                                <p>Francois</p>
                            </div>
                            <div className="option">
                                <p>Jagier</p>
                            </div>
                        </div>
                    </div>
                    <div className="input-row">
                        <div className="input-col">
                            <label for="priceFrom">Price From</label>
                            <input type="text" id="priceFrom" placeholder="Price" />
                        </div>
                        <div className="input-col">
                            <label for="priceTo">Price To</label>
                            <input type="text" id="priceTo" placeholder="Price" />
                        </div>
                    </div>
                    <button id="searchTransactionButton">Search</button>
                </div>
            </div>
            <div className="transactions-list">
                <div className="header">
                    <p>Sort by:</p>
                    <div id="customerListSort" className="sort-wrapper">
                        {/* <!-- Hidden Input can be used to know what filter type to use (Other elements are purely visual) --> */}
                        <input type="text" id="filterType" />
                        <img src="../assets/images/svg/FilterCollapseIcon.svg" alt="" />
                        <div id="sortCurrent" className="sort-current">
                            <img src="../assets/images/svg/FilterArrowUp.svg" alt="" />
                            <p>Date</p>
                        </div>
                        <div className="sort-option" data-value="dateAsc">
                            <img src="../assets/images/svg/FilterArrowUp.svg" alt="" />
                            <p>Date</p>
                        </div>
                        <div className="sort-option" data-value="dateDesc">
                            <img src="../assets/images/svg/FilterArrowDown.svg" alt="" />
                            <p>Date</p>
                        </div>
                        <div className="sort-option" data-value="amountAsc">
                            <img src="../assets/images/svg/FilterArrowUp.svg" alt="" />
                            <p>Amount</p>
                        </div>
                        <div className="sort-option" data-value="amountDesc">
                            <img src="../assets/images/svg/FilterArrowDown.svg" alt="" />
                            <p>Amount</p>
                        </div>
                    </div>
                </div>
                <div className="body">
                    <div className="filter-name">
                        <p>July 19, 2022</p>
                    </div>
                    <button className="transaction-card no-transform selected">
                        <div className="col">
                            <p className="style1">Order #483719</p>
                            <p className="style2">Steven Segal</p>
                            <div className="row">
                                <img src="../assets/images/svg/InStoreSale.svg" alt="" />
                                <p>Completed</p>
                            </div>
                        </div>
                        <div className="col">
                            <p className="style3">$23.82</p>
                            <p className="style4">12:35pm</p>
                        </div>
                        <div className="selected-indicator"></div>
                    </button>
                    <button className="transaction-card no-transform">
                        <div className="col">
                            <p className="style1">Order #483718</p>
                            <p className="style2">Sean Connery</p>
                            <div className="row">
                                <img src="../assets/images/svg/OnlineSale.svg" alt="" />
                                <p>Completed</p>
                            </div>
                        </div>
                        <div className="col">
                            <p className="style3">$235.99</p>
                            <p className="style4">12:35pm</p>
                        </div>
                        <div className="selected-indicator"></div>
                    </button>
                    <div className="filter-name">
                        <p>July 18, 2022</p>
                    </div>
                    <button className="transaction-card no-transform">
                        <div className="col">
                            <p className="style1">Order #483717</p>
                            <p className="style2">Jet Li</p>
                            <div className="row">
                                <img src="../assets/images/svg/OnlineSale.svg" alt="" />
                                <p>Refunded</p>
                            </div>
                        </div>
                        <div className="col">
                            <p className="style3">$19.35</p>
                            <p className="style4">2:35pm</p>
                        </div>
                        <div className="selected-indicator"></div>
                    </button>
                </div>
            </div>
            <div id="transactionsDetailed" className="transactions-detailed">
                <div className="detailed-header-mobile">
                    <button id="mobileDetailedExit">
                        <img src="../assets/images/svg/AngledBracket-Left-Blue.svg" alt="" />
                        Go Back
                    </button>
                </div>
                <div className="quick-info">
                    <div className="col">
                        <p className="style1">Order #483719</p>
                        <p className="style2">Total: <b>$235.99</b></p>
                        <p className="style3">July 19, 2022</p>
                    </div>
                    <div className="col right">
                        <div className="row">
                            <img src="../assets/images/svg/OnlineSale.svg" alt="" />
                            <p>Completed</p>
                        </div>
                        <p className="style2">Served by: <b>Sean Connery</b></p>
                        <p className="style3">12:35pm</p>
                    </div>
                </div>
                <div className="customer-info">
                    <div className="col">
                        <p className="style1">Customer Information</p>
                        <p className="style2">Earnst S. Blofeld</p>
                        <p className="style2">esb@spectra.com</p>
                        <p className="style2">+709 425 007</p>
                    </div>
                    <button>Open Customer</button>
                </div>
                <div className="order-details">
                    <p>Order Details</p>
                    <div className="item">
                        <div className="img-container">
                            <div className="quantity">
                                <p>3</p>
                            </div>
                            <img src="../Assets/Images/Temp/shirt.png" alt="" />
                        </div>
                        <div className="col">
                            <div className="main-row">
                                <p>T-shirt</p>
                                <p>$24.99</p>
                            </div>
                            <div className="item-fields">
                                <p>SKU: ACE2349801</p>
                                <p>Black</p>
                                <p>Medium</p>
                            </div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="img-container">
                            <div className="quantity">
                                <p>1</p>
                            </div>
                            <img src="../Assets/Images/Temp/Sweater.png" alt="" />
                        </div>
                        <div className="col">
                            <div className="main-row">
                                <p>Hoodie</p>
                                <p>$178.99</p>
                            </div>
                            <div className="item-fields">
                                <p>SKU: ACE2349801</p>
                                <p>Blue</p>
                                <p>Medium</p>
                                <p>
                                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi voluptas aut accusamus perferendis reiciendis a
                                    explicabo quidem aliquam cumque corrupti minima nobis, voluptatum vel expedita facilis, aliquid officia.
                                    Voluptatum, ratione!
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="custom-fields">
                        <p className="style1">Custom Fields</p>
                        <p className="style2">Sizing Chart ID: HIOK23498979</p>
                        <p className="style2">Employee Compensation: 20%</p>
                    </div>
                </div>
                <div className="footer">
                    <button id="refundButton">Refund</button>
                    <button id="receiptButton">Receipt</button>
                    <button id="openSaleButton">Open Sale</button>
                </div>
            </div>
        </div>
        <div className="subwindow-wrapper hidden"></div>
    </>
}

export default ActivityView