import React, { useState } from 'react'
import LeftNavBar from "../common/commonComponents/LeftNavBar";
import AngledBracketBlueleft from '../../assets/images/svg/AngledBracket-Left-Blue.svg'
import AvatarIcon from '../../assets/images/svg/AvatarIcon.svg'

const CustomerView = () => {
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
  return (
    <div class="customer-view-wrapper">
      <LeftNavBar isShowMobLeftNav={isShowMobLeftNav} toggleLinkLauncher={toggleLinkLauncher} toggleAppLauncher={toggleAppLauncher} toggleiFrameWindow={toggleiFrameWindow} ></LeftNavBar>
      <div id="appLauncherWrapper" class="app-launcher-wrapper hidden">
        <div class="app-launcher">
          <div class="header">
            <button id="appLauncherExit">
              <img src={AngledBracketBlueleft} alt="" />
            </button>
            <p>App Launcher</p>
          </div>
          <div class="body">
            {/* <!-- IMAGE WILL SHOW IF NO APPS --> */}
            <img src="../assets/images/SVG/NoApps-Message.svg" alt="" />
            <button>
              <div class="img-container">
                <img src="../assets/images/Temp/ClockIn_Icon.png" alt="" />
              </div>
              <p>Clock-in App</p>
            </button>
            <button>
              <div class="img-container">
                <img src="../assets/images/Temp/Stripe Icon.png" alt="" />
              </div>
              <p>Stripe Payments</p>
            </button>
            <button>
              <div class="img-container">
                <img src="../assets/images/Temp/QRCode_Icon.png" alt="" />
              </div>
              <p>QR Code App</p>
            </button>
            <button>../assets/images/
              <div class="img-container">
                <img src="../assets/images/Temp/DYMO-Icon.png" alt="" />
              </div>
              <p>DYMO Label Printing</p>
            </button>
            <button>
              <div class="img-container">
                <img src="../assets/images/Temp/Fortis-Icon.png" alt="" />
              </div>
              <p>Fortis Payments</p>
            </button>
            <button>
              <div class="img-container">
                <img src="../assets/images/Temp/QuoteApp_Icon.png" alt="" />
              </div>
              <p>Quote Printer</p>
            </button>
            <button>
              <div class="img-container">
                <img src="../assets/images/Temp/GiftCard_Icon.png" alt="" />
              </div>
              <p>Giftcards</p>
            </button>
          </div>
        </div>
      </div>
      <div id="linkLauncherWrapper" class="link-launcher-wrapper hidden">
        <div class="link-launcher">
          <div class="header">
            <button id="linkLauncherExit">
              <img src={AngledBracketBlueleft} alt="" />
            </button>
            <p>Link Launcher</p>
          </div>
          <div class="body">
            {/* <!-- IMAGE WILL SHOW IF NO Link --> */}
            <img src="../assets/images/SVG/NoLink-Image.svg" alt="" />
            <button>
              <div class="img-container">
                <img src="../assets/images/Temp/OliverKnowledge-Icon.png" alt="" />
              </div>
              <div class="col">
                <p class="style1">Oliver Knowledge Base</p>
                <p class="style2">https://help.oliverpos.com/</p>
              </div>
            </button>
            <button>
              <div class="img-container">
                <img src="../assets/images/Temp/FB-Icon.png" alt="" />
              </div>
              <div class="col">
                <p class="style1">Facebook Site</p>
                <p class="style2">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Expedita animi ipsam quia hic tempora obcaecati enim
                  quibusdam ratione assumenda, laboriosam quo fugiat perspiciatis itaque culpa provident, aliquid vitae, id quidem?
                </p>
              </div>
            </button>
            <button>
              <div class="img-container">
                <img src="../assets/images/Temp/Etsy-Icon.png" alt="" />
              </div>
              <div class="col">
                <p class="style1">Etsy Site</p>
                <p class="style2">www.etsy.com</p>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div id="navCover" class="nav-cover"></div>
      <div class="mobile-cv-header">
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
      <div id="CVSearch" class="cv-search">
        <div class="header">
          <p>Customers</p>
          <button id="cvAddCustomer">
            <img src="../assets/images/SVG/PlusSign.svg" alt="" />
          </button>
          <button id="mobileCVExitSearch">
            <img src="../assets/images/SVG/AngledBracket-Left-Blue.svg" alt="" />
            Go Back
          </button>
          <p class="mobile-only">Search for Customer</p>
        </div>
        <div class="body">
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
      <div class="cv-list">
        <div class="header">
          <p>Sort by:</p>
          <div id="customerListSort" class="sort-wrapper">
            {/* <!-- Hidden Input can be used to know what filter type to use (Other elements are purely visual) --> */}
            <input type="text" id="filterType" />
            <img src="../assets/images/SVG/FilterCollapseIcon.svg" alt="" />
            <div id="sortCurrent" class="sort-current">
              <img src="../assets/images/SVG/FilterArrowUp.svg" alt="" />
              <p>Last Name</p>
            </div>
            <div class="sort-option" data-value="lastNameAsc">
              <img src="../assets/images/SVG/FilterArrowUp.svg" alt="" />
              <p>Last Name</p>
            </div>
            <div class="sort-option" data-value="lastNameDesc">
              <img src="../assets/images/SVG/FilterArrowDown.svg" alt="" />
              <p>Last Name</p>
            </div>
            <div class="sort-option" data-value="emailAsc">
              <img src="../assets/images/SVG/FilterArrowUp.svg" alt="" />
              <p>Email</p>
            </div>
            <div class="sort-option" data-value="emailDesc">
              <img src="../assets/images/SVG/FilterArrowDown.svg" alt="" />
              <p>Email</p>
            </div>
          </div>
        </div>
        <div class="body">
          <div class="filter-name">
            <p>A</p>
          </div>
          <button class="customer-card no-transform selected">
            <div class="avatar">
              <img src={AvatarIcon} alt="" />
            </div>
            <div class="text-group">
              <p class="style1">Marvel Annihilus</p>
              <p class="style2">annihilus@marvel.com</p>
            </div>
            <div class="selected-indicator"></div>
          </button>
          <button class="customer-card no-transform">
            <div class="avatar">
              <img src={AvatarIcon} alt="" />
            </div>
            <div class="text-group">
              <p class="style1">Lavaman Ajaxis</p>
              <p class="style2">ajaxis@gmail.com</p>
            </div>
            <div class="selected-indicator"></div>
          </button>
          <div class="filter-name">
            <p>B</p>
          </div>
          <button class="customer-card no-transform">
            <div class="avatar">
              <img src={AvatarIcon} alt="" />
            </div>
            <div class="text-group">
              <p class="style1">Earnst S. Blofeld</p>
              <p class="style2">esb@spectra.com</p>
            </div>
            <div class="selected-indicator"></div>
          </button>
          <button class="customer-card no-transform">
            <div class="avatar">
              <img src={AvatarIcon} alt="" />
            </div>
            <div class="text-group">
              <p class="style1">Joe Johnson</p>
              <p class="style2">jojo@gmail.com</p>
            </div>
            <div class="selected-indicator"></div>
          </button>
        </div>
        <div class="mobile-footer">
          <button id="mobileAddCustomerButton">Create New</button>
        </div>
      </div>
      <div id="CVDetailed" class="cv-detailed open">
        <div class="mobile-back">
          <button id="exitCVDetailed">
            <img src="../assets/images/SVG/AngledBracket-Left-Blue.svg" alt="" />
            Go Back
          </button>
        </div>
        <div class="quick-info">
          <div class="avatar">
            <img src={AvatarIcon} alt="" />
          </div>
          <div class="group-merge">
            <div class="text-group">
              <p class="style1">Earnst S. Blofeld</p>
              <p class="style2">esb@spectra.com</p>
            </div>
            <div class="text-group">
              <p class="style2">Phone #:</p>
              <p class="style2">709 425 007</p>
            </div>
          </div>
        </div>
        <div class="cust-totals">
          <div class="col">
            <p class="style1">$913.75</p>
            <p class="style2">Total Spent</p>
          </div>
          <div class="col">
            <p class="style1">14</p>
            <p class="style2">Orders</p>
          </div>
          <div class="col">
            <p class="style1">$24.75</p>
            <p class="style2">Store Credit</p>
            <button>Adjust Credit</button>
          </div>
        </div>
        <div class="bill-ship-info">
          <div class="col">
            <p class="style1">Billing Information</p>
            <p class="style2">
              Gara Medouar Crater <br />
              Rissani, Morocco <br />
              52450
            </p>
          </div>
          <div class="col">
            <p class="style1">Shipping Information</p>
            <p class="style2">
              Gara Medouar Crater <br />
              Rissani, Morocco <br />
              52450
            </p>
          </div>
        </div>
        <div class="cust-notes">
          <div class="header-row">
            <p>Customer Notes</p>
            <button id="addCustNoteButton">Add Note</button>
          </div>
          <div class="customer-note">
            <div class="row">
              <p class="style1">July 27, 2021</p>
              <p class="style2">12:50PM</p>
              <button>
                <img src="../assets/images/SVG/ClearCart-Icon.svg" alt="" />
              </button>
            </div>
            <p>Customer came into store looking for a t-shirt but out of stock</p>
          </div>
          <div class="customer-note">
            <div class="row">
              <p class="style1">July 21, 2021</p>
              <p class="style2">2:50PM</p>
              <button>
                <img src="../assets/images/SVG/ClearCart-Icon.svg" alt="" />
              </button>
            </div>
            <p>Customer preferred to be named just Blofeld</p>
          </div>
        </div>
        <div class="footer">
          <button id="customerToTransactions">View Transactions</button>
          <button id="addCustToSaleButton">Add To Sale</button>
        </div>
      </div>
    </div>
  )
}

export default CustomerView