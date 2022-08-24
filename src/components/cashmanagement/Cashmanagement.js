import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { cashRecords } from './CashmanagementSlice'
import moment from 'moment';
import Config from '../../Config'
import CashManagementIcon from '../../images/svg/CashManagement-Icon.svg'
import TransactionsIcon from '../../images/svg/Transactions-Icon.svg'
import CustomersIcon from '../../images/svg/Customers-Icon.svg'
import RegisterIcon from '../../images/svg/Register-Icon.svg'
import OliverType from '../../images/svg/Oliver-Type.svg'
import oliverIcon from '../../images/svg/Oliver-Icon-Color.svg' 
import LinkLauncherIcon from '../../images/svg/LinkLauncher-Icon.svg'
import OliverIconBaseBlue from '../../images/svg/Oliver-Icon-BaseBlue.svg'
 //import ClockIn_Icon from '../../Images/Temp/MC_Logo 1.png'
 //import MC_Logo from '../../images/Temp/MC_Logo 1.svg'
 import MC_LogQuickbooks1 from '../../images/Temp/Quickbooks 1.png'
// import MC_LogQuickbooks1 from '../../images/svg/Quickbooks 1.svg'
//import ToggleNavbarIcon from '../../images/svg/ToggleNavbar-Icon.svg.svg'



function Cashmanagement() {

  const dispatch = useDispatch();
  var registerId = localStorage.getItem('register');

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

  }, []);






  return (
    <>
      <div className="cash-management-wrapper">
        <div className="navbar">
          <div className="header-row">
            <img
              src={oliverIcon}
              alt=""
              className="oliver-logo"
            />
            <img
              src={OliverType}
              alt=""
              className="oliver-text"
            />
          </div>
          <button id="registerButton" className="page-link" disabled="">
            <div className="img-container">
              <img src={RegisterIcon} alt="" />
            </div>
            <p>Register</p>
            <div className="f-key">F1</div>
          </button>
          <button id="customersButton" className="page-link">
            <div className="img-container">
              <img src={CustomersIcon} alt="" />
            </div>
            <p>Customers</p>
            <div className="f-key">F2</div>
          </button>
          <button id="transactionsButton" className="page-link">
            <div className="img-container">
              <img src={TransactionsIcon} alt="" />
            </div>
            <p>Transactions</p>
            <div className="f-key">F3</div>
          </button>
          <button
            id="cashManagementButton"
            className="page-link selected"
            disabled=""
          >
            <div className="img-container">
              <img src={CashManagementIcon} alt="" />
            </div>
            <p>Cash Management</p>
            <div className="f-key">F4</div>
          </button>
          <button id="linkLauncherButton" className="launcher">
            <div className="img-container">
              <img src={LinkLauncherIcon} alt="" />
            </div>
            <p>Link Launcher</p>
          </button>
          <div className="divider" />
          <button id="appLauncherButton" className="launcher">
            <div className="img-container">
              <img src={OliverIconBaseBlue} alt="" />
            </div>
            <p>App Launcher</p>
          </button>
          <button id="navApp1" className="launcher app">
            <div className="img-container">
              {/* <img src={ClockIn_Icon} alt="" /> */}
            </div>
            <p>Clock-in App</p>
          </button>
          <button id="navApp2" className="launcher app">
            <div className="img-container">
              {/* <img src={MC_Logo} alt="" /> */}
            </div>
            <p>MailChimp</p>
          </button>
          <button id="navApp3" className="launcher app">
            <div className="img-container">
              <img src={MC_LogQuickbooks1} alt="" />
            </div>
            <p>Quickbooks Sync</p>
          </button>
          <button id="navToggle" className="toggle-nav">
            <div className="img-container">
              {/* <img src={ToggleNavbarIcon} alt="" /> */}
            </div>
            <p>Minimize Sidebar</p>
          </button>
        </div>







        <div className="cm-header">
          <button id="mobileNavToggle">
            <img src="" alt="" />
          </button>
          <p>Cash Management</p>
        </div>
        <div className="cm-register-view">



          

          <button className="no-transform">
            <p className="style1">Currently Active</p>
            <div className="row">
              <p className="style2">Register 1</p>
              <p className="style3 green">OPEN</p>
            </div>
            <p className="style4">User: Freddy Mercury</p>
          </button>

          <div className="prev-registers">
            <div className="category">Today</div>
            {data !== null && data.content !== undefined &&
            data.content.Records.map((item, index) => {
              var current_date = moment().format(Config.key.DATE_FORMAT);
              var time = moment.utc(!item.ClosedTime ? item.LogDate : item.ModifyDateTimeUtc).local().format(Config.key.DATE_FORMAT);
              return (
                <button className="no-transform">
                <div className="row">
                  <p className="style1">{item.RegisterName}</p>
                  <p className="style2"> {!item.ClosedTime ? "OPEN" : "Closed " + item.ClosedTime}</p>
                </div>
                <div className="row">
                  <p className="style2">User: {item.SalePersonName}</p>
                  <p className="style2">{time == current_date ? "Today" : time}</p>
                </div>
              </button>

              )
            })}
{/*             
            <button className="no-transform">
              <div className="row">
                <p className="style1">Register 1</p>
                <p className="style2">Closed</p>
              </div>
              <div className="row">
                <p className="style2">User: Freddy Mercury</p>
                <p className="style2">6:15pm</p>
              </div>
            </button>
            <button className="no-transform">
              <div className="row">
                <p className="style1">Register 2</p>
                <p className="style2">Closed</p>
              </div>
              <div className="row">
                <p className="style2">User: David Bowie</p>
                <p className="style2">4:15pm</p>
              </div>
            </button>
            <div className="category">August 10, 2022</div>
            <button className="no-transform">
              <div className="row">
                <p className="style1">Register 1</p>
                <p className="style2">Closed</p>
              </div>
              <div className="row">
                <p className="style2">User: Stevie Nicks</p>
                <p className="style2">6:30pm</p>
              </div>
            </button>
            <button className="no-transform">
              <div className="row">
                <p className="style1">Register 2</p>
                <p className="style2">Closed</p>
              </div>
              <div className="row">
                <p className="style2">User: Ozzy Osborne</p>
                <p className="style2">2:00pm</p>
              </div>
            </button> */}
          </div>
        </div>











        <div className="cm-detailed-view">
          <div className="detailed-header">
            <p>Transaction History</p>
            <div className="outer-group">
              <div className="inner-group">
                <div className="row">
                  <p className="style1">Register 1</p>
                  <p className="style2 green">OPEN</p>
                </div>
                <p className="style3">March 31, 2022 6:15pm</p>
              </div>
              <div className="inner-group">
                <p className="style1">Cash Drawer Ending Balance</p>
                <p className="style4">535.00</p>
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
          <div className="detailed-footer">
            <button>Remove Cash</button>
            <button>Add Cash</button>
          </div>
        </div>
        <div id="appLauncherWrapper" className="app-launcher-wrapper hidden">
          <div className="app-launcher">
            <div className="header">
              <button id="appLauncherExit">
                <img
                  src="../Assets/Images/SVG/AngledBracket-Left-BaseBlue.svg"
                  alt=""
                />
              </button>
              <p>App Launcher</p>
            </div>
            <div className="body">
              {/* IMAGE WILL SHOW IF NO APPS */}
              <img src="../Assets/Images/SVG/NoApps-Message.svg" alt="" />
              <button>
                <div className="img-container">
                  {/* <img src={ClockIn_Icon} alt="" /> */}
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
                <img
                  src="../Assets/Images/SVG/AngledBracket-Left-BaseBlue.svg"
                  alt=""
                />
              </button>
              <p>Link Launcher</p>
            </div>
            <div className="body">
              {/* IMAGE WILL SHOW IF NO Link */}
              <img src="../Assets/Images/SVG/NoLink-Image.svg" alt="" />
              {/* <button>
                  <div class="img-container">
                      <img src="../Assets/Images/Temp/OliverKnowledge-Icon.png" alt="" />
                  </div>
                  <div class="col">
                      <p class="style1">Oliver Knowledge Base</p>
                      <p class="style2">https://help.oliverpos.com/</p>
                  </div>
              </button>
              <button>
                  <div class="img-container">
                      <img src="../Assets/Images/Temp/FB-Icon.png" alt="" />
                  </div>
                  <div class="col">
                      <p class="style1">Facebook Site</p>
                      <p class="style2">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Expedita animi ipsam quia hic tempora obcaecati enim quibusdam ratione assumenda, laboriosam quo fugiat perspiciatis itaque culpa provident, aliquid vitae, id quidem?</p>
                  </div>
              </button>
              <button>
                  <div class="img-container">
                      <img src="../Assets/Images/Temp/Etsy-Icon.png" alt="" />
                  </div>
                  <div class="col">
                      <p class="style1">Etsy Site</p>
                      <p class="style2">www.etsy.com</p>
                  </div>
              </button> */}
            </div>
          </div>
        </div>
        {/* <div id="notificationsWrapper" class="notifications-wrapper hidden">
      <div id="notificationsContent" class="notifications">
          <div id="soundNotificationsWrapper" class="sound-notifications-wrapper hidden">
              <div class="sound-notifications">
                  <div class="header">
                      <img src="../Assets/Images/SVG/VolumeIcon.svg" alt="" />
                      <p>Sound Notifications</p>
                  </div>
                  <div class="body">
                      <p>Sound Options</p>
                      <div class="row">
                          <p>POS Order</p>
                          <label class="toggle-wrapper">
                              <input type="checkbox" id="posOrder" />
                              <div class="custom-toggle">
                                  <div class="knob"></div>
                              </div>
                          </label>
                      </div>
                      <div class="row">
                          <p>Web Order</p>
                          <label class="toggle-wrapper">
                              <input type="checkbox" id="webOrder" />
                              <div class="custom-toggle">
                                  <div class="knob"></div>
                              </div>
                          </label>
                      </div>
                  </div>
              </div>
          </div>
          <div class="header">
              <p>Notifications</p>
              <div class="dropdown-options"></div>
              <button id="notiSoundOptions">
                  <img src="../Assets/Images/SVG/NotificationsSounds.svg" alt="" />
              </button>
              <button id="mobileNotiExit">
                  <img src="../Assets/Images/SVG/X-Icon-DarkBlue.svg" alt="" />
              </button>
          </div>
          <div class="body">
              <p>Today</p>
              <div class="notification approval">
                  <div class="side-color"></div>
                  <div class="main-row">
                      <img src="../Assets/Images/SVG/Approval-Icon.svg" alt="" />
                      <p>Order# 123890083 Created</p>
                  </div>
              </div>
              <div class="notification approval">
                  <div class="side-color"></div>
                  <div class="main-row">
                      <img src="../Assets/Images/SVG/Approval-Icon.svg" alt="" />
                      <p>Order# 123890082 Created</p>
                  </div>
              </div>
              <div class="notification approval">
                  <div class="side-color"></div>
                  <div class="main-row">
                      <img src="../Assets/Images/SVG/Approval-Icon.svg" alt="" />
                      <p>Order# 123890081 Created</p>
                  </div>
              </div>
              <div class="notification error">
                  <div class="side-color"></div>
                  <div class="main-row">
                      <img src="../Assets/Images/SVG/Error-Icon.svg" alt="" />
                      <p>Order# 123890081 not synced</p>
                  </div>
                  <a href="#">Retry</a>
              </div>
              <p>15/02/2022</p>
              <div class="notification info">
                  <div class="side-color"></div>
                  <div class="main-row">
                      <img src="../Assets/Images/SVG/Info-Icon.svg" alt="" />
                      <p>Website Order #4654896</p>
                  </div>
              </div>
              <div class="notification changelog">
                  <div class="side-color"></div>
                  <div class="main-row">
                      <img src="../Assets/Images/SVG/Changelog-Icon.svg" alt="" />
                      <p>Change Log</p>
                  </div>
                  <p>Bug Fixes:</p>
                  <ul>
                      <li>ashd</li>
                      <li>asjdoiasjd</li>
                      <li>sadjklas</li>
                  </ul>
                  <p>Feature Updates:</p>
                  <ul>
                      <li>ashd</li>
                      <li>asjdoiasjd</li>
                      <li>sadjklas</li>
                  </ul>
              </div>
          </div>
      </div>
  </div> */}
        <div id="navCover" className="nav-cover" />
      </div>
      <div className="subwindow-wrapper hidden">
        <div id="iframeSubwindow" className="subwindow iframe-popup">
          <div className="subwindow-header">
            <div className="img-container">
              <img src="" alt="" />
            </div>
            <div className="col">
              <p className="style1">Placeholder</p>
              <p className="style2">Placeholder</p>
            </div>
            <button className="close-subwindow">
              <img src="../Assets/Images/SVG/X-Icon-DarkBlue.svg" alt="" />
            </button>
          </div>
          <div className="subwindow-body">
            <iframe src="" frameBorder={0} />
          </div>
        </div>
        <div className="subwindow product-not-found">
          <div className="subwindow-body">
            <div className="auto-margin-top" />
            <p className="style1">Product cannot be found</p>
            <img src="../Assets/Images/SVG/BarcodeError.svg" alt="" />
            <p className="style2">
              The scanned barcode/SKU was not found. <br />
              <br />
              Please review your inventory <br />
              or double check the SKU number.
            </p>
            <button id="prodNotFoundExit">Go Back</button>
            <div className="auto-margin-bottom" />
          </div>
        </div>
        <div className="subwindow upgrade-to-unlock">
          <div className="subwindow-body">
            <div className="auto-margin-top" />
            <img src="../Assets/Images/SVG/LockedIcon.svg" alt="" />
            <p className="style1">Upgrade to unlock this feature!</p>
            <p className="style2">
              This feature is not included in your plan. <br />
              Please upgrade your plan in Oliver HUB <br />
              to access this feature.
            </p>
            <button id="upgradeToUnlockExit">Go Back</button>
            <div className="auto-margin-bottom" />
          </div>
        </div>
        <div className="subwindow advanced-search">
          <div className="subwindow-header">
            <p>Advanced Search</p>
            <button className="close-subwindow">
              <img src="../Assets/Images/SVG/X-Icon-DarkBlue.svg" alt="" />
            </button>
            <input
              type="text"
              id="advancedSearchBar"
              placeholder="Start typing to search..."
            />
          </div>
          <div className="subwindow-body">
            <div className="left-col">
              <p>Search by</p>
              <div className="radio-group">
                <div id="mobileSearchModToggle" className="dropdown-input">
                  <p>
                    <b>Search for:</b> All Results
                  </p>
                  <img src="../Assets/Images/SVG/down-angled-bracket.svg" alt="" />
                </div>
                <label>
                  <input
                    type="radio"
                    id="allResults"
                    name="search_modifier"
                    defaultValue="allResults"
                    defaultChecked=""
                  />
                  <div className="custom-radio">
                    <img src="../Assets/Images/SVG/BlueDot.svg" alt="" />
                  </div>
                  <p>All Results</p>
                </label>
                <label>
                  <input
                    type="radio"
                    id="products"
                    name="search_modifier"
                    defaultValue="products"
                  />
                  <div className="custom-radio">
                    <img src="../Assets/Images/SVG/BlueDot.svg" alt="" />
                  </div>
                  <p>Products</p>
                </label>
                <label>
                  <input
                    type="radio"
                    id="customers"
                    name="search_modifier"
                    defaultValue="customers"
                  />
                  <div className="custom-radio">
                    <img src="../Assets/Images/SVG/BlueDot.svg" alt="" />
                  </div>
                  <p>Customers</p>
                </label>
                <label>
                  <input
                    type="radio"
                    id="groups"
                    name="search_modifier"
                    defaultValue="groups"
                  />
                  <div className="custom-radio">
                    <img src="../Assets/Images/SVG/BlueDot.svg" alt="" />
                  </div>
                  <p>Groups</p>
                </label>
              </div>
              <p>Recent Searches</p>
              <div className="recent-searches">
                <a href="#">Sam Moss</a>
                <a href="#">Graphic T-Shirts</a>
                <a href="#">Hoodies</a>
                <a href="#">Freddy Mercury</a>
                <a href="#">Espresso Coffee</a>
                <a href="#">Shoes</a>
              </div>
            </div>
            <div className="right-col">
              <div className="header">
                <p>
                  <b>Results</b> (23 search results)
                </p>
              </div>
              <div className="body">
                <div className="no-results">
                  <p className="style1">No results found.</p>
                  <p className="style2">
                    Sorry, your search did not match any results. <br />
                    Try double checking your spelling or <br />
                    searching for a similar product.
                  </p>
                  <div className="divider" />
                  <p className="style2">
                    Customer not found? Try creating a new customer:
                  </p>
                  <button>
                    <img
                      src="../Assets/Images/SVG/CircledPlus-Icon-Blue.svg"
                      alt=""
                    />
                    Create New Customer
                  </button>
                </div>
                <div className="search-result customer">
                  <div className="col">
                    <p className="style1">Customer</p>
                    <p className="style2">Freddy Mercury</p>
                    <p className="style3">queen_of_rock@gmail.com</p>
                    <p className="style3">1 (709) 123-4567</p>
                  </div>
                  <div className="row">
                    <button className="search-view">
                      <img src="../Assets/Images/SVG/ViewIcon.svg" alt="" />
                      View
                    </button>
                    <button className="search-transactions">
                      <img
                        src="../Assets/Images/SVG/Transactions-Icon-White.svg"
                        alt=""
                      />
                      Transactions
                    </button>
                    <button className="search-add-to-sale">
                      <img src="../Assets/Images/SVG/Add-Icon-White.svg" alt="" />
                      Add to Sale
                    </button>
                  </div>
                </div>
                <div className="search-result product">
                  <div className="col">
                    <p className="style1">Product</p>
                    <p className="style2">
                      Funky Fresh White Sneakers long name to get cut off
                    </p>
                    <p className="style3">Funky Shoe Co.</p>
                    <p className="style3">$34.55</p>
                    <p className="style3">SKU# 1386425547424579201546</p>
                  </div>
                  <div className="row">
                    <button className="search-view">
                      <img src="../Assets/Images/SVG/ViewIcon.svg" alt="" />
                      View
                    </button>
                    <button className="search-add-to-sale">
                      <img src="../Assets/Images/SVG/Add-Icon-White.svg" alt="" />
                      Add to Sale
                    </button>
                  </div>
                </div>
                <div className="search-result group">
                  <div className="col">
                    <p className="style1">Group</p>
                    <p className="style2">Moss Party (Table 5)</p>
                    <p className="style3">Party of 6</p>
                    <p className="style3">Server: Freddy Mercury</p>
                    <p className="style3">Order total: $223.45</p>
                  </div>
                  <div className="row">
                    <button className="search-view">
                      <img src="../Assets/Images/SVG/ViewIcon.svg" alt="" />
                      View
                    </button>
                    <button className="search-transactions">
                      <img
                        src="../Assets/Images/SVG/Transactions-Icon-White.svg"
                        alt=""
                      />
                      Transactions
                    </button>
                    <button className="search-add-to-sale">
                      <img src="../Assets/Images/SVG/Add-Icon-White.svg" alt="" />
                      Add to Sale
                    </button>
                  </div>
                </div>
                <div className="search-result customer">
                  <div className="col">
                    <p className="style1">Customer</p>
                    <p className="style2">Freddy Mercury</p>
                    <p className="style3">queen_of_rock@gmail.com</p>
                    <p className="style3">1 (709) 123-4567</p>
                  </div>
                  <div className="row">
                    <button className="search-view">
                      <img src="../Assets/Images/SVG/ViewIcon.svg" alt="" />
                      View
                    </button>
                    <button className="search-transactions">
                      <img
                        src="../Assets/Images/SVG/Transactions-Icon-White.svg"
                        alt=""
                      />
                      Transactions
                    </button>
                    <button className="search-add-to-sale">
                      <img src="../Assets/Images/SVG/Add-Icon-White.svg" alt="" />
                      Add to Sale
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div class="subwindow switch-user">
      <div class="subwindow-header">
          <p>Switch User</p>
          <button class="close-subwindow">
              <img src="../Assets/Images/SVG/X-Icon-DarkBlue.svg" alt="" />
          </button>
      </div>
      <div class="subwindow-body">
          <button class="close-subwindow mobile-close-subwindow">
              <img src="../Assets/Images/SVG/AngledBracket-Left-Blue.svg" alt="" />
              Back
          </button>
          <div class="auto-margin-top"></div>
          <div class="group">
              <img src="../Assets/Images/SVG/SwitchUser-Icon.svg" alt="" />
              <p>Switch Users</p>
          </div>
          <p class="style1">
              Sign-in to this register using your User ID. <br />
              This automatically signs out <br />
              the user currently logged in.
          </p>
          <div class="divider"></div>
          <p class="style2">Enter Your User ID</p>
          <div class="pinpad">
              <div class="pin-entries">
                  <div class="pin-entry"></div>
                  <div class="pin-entry"></div>
                  <div class="pin-entry"></div>
                  <div class="pin-entry"></div>
                  <div class="pin-entry"></div>
                  <div class="pin-entry"></div>
              </div>
              <div class="pin-button-row">
                  <button>1</button>
                  <button>2</button>
                  <button>3</button>
              </div>
              <div class="pin-button-row">
                  <button>4</button>
                  <button>5</button>
                  <button>6</button>
              </div>
              <div class="pin-button-row">
                  <button>7</button>
                  <button>8</button>
                  <button>9</button>
              </div>
              <div class="pin-button-row">
                  <button>0</button>
                  <button class="backspace">
                      <img src="../Assets/Images/SVG/Backspace-BaseBlue.svg" alt="" />
                  </button>
              </div>
          </div>
          <div class="auto-margin-bottom"></div>
      </div>
  </div>
  <div class="subwindow end-session">
      <div class="subwindow-header">
          <p>End Session</p>
          <button class="close-subwindow">
              <img src="../Assets/Images/SVG/X-Icon-DarkBlue.svg" alt="" />
          </button>
      </div>
      <div class="subwindow-body">
          <button class="close-subwindow mobile-close-subwindow">
              <img src="../Assets/Images/SVG/AngledBracket-Left-Blue.svg" alt="" />
              Back
          </button>
          <div class="auto-margin-top"></div>
          <p class="style1">End This Session</p>
          <p class="style2">
              Signs out the current user. <br />
              By ending the session you will be <br />
              brought back to the User ID log-in <br />
              screen.
          </p>
          <button id="logoutButton">End Session</button>
          <div class="auto-margin-bottom"></div>
      </div>
  </div> */}
      </div>


    </>
  )
}

export default Cashmanagement