import React, { useEffect, useLayoutEffect } from "react";
import X_Icon_DarkBlue from '../../images/svg/X-Icon-DarkBlue.svg';
import Checkmark from '../../images/svg/Checkmark.svg';
const CreateCustomer = () => {
    return (
        <div className="subwindow create-customer">
        <div className="subwindow-header">
            <p>Create Customer</p>
            <button className="close-subwindow">
                <img src={X_Icon_DarkBlue} alt="" />
            </button>
        </div>
        <div className="subwindow-body">
            <section id="contactInfoSection">
                <p>Contact Information</p>
                <div className="input-row">
                    <div className="input-col">
                        <label htmlFor="email">Email*</label>
                        <input type="email" id="email" placeholder="Enter Email" />
                    </div>
                    <div className="input-col">
                        <label htmlFor="tel">Phone Number</label>
                        <input type="tel" id="tel" placeholder="Enter Phone Number" />
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-col">
                        <label htmlFor="fName">First Name</label>
                        <input type="text" id="fName" placeholder="Enter First Name" />
                    </div>
                    <div className="input-col">
                        <label htmlFor="lName">Last Name</label>
                        <input type="text" id="lName" placeholder="Enter Last Name" />
                    </div>
                    <div className="input-col">
                        <label htmlFor="website">Website</label>
                        <input type="url" id="website" placeholder="Enter URL" />
                    </div>
                </div>
            </section>
            <section id="billingAddress">
                <p>Billing Address</p>
                <div className="input-row">
                    <div className="input-col">
                        <label htmlFor="billingAddress1">Address 1</label>
                        <input type="text" id="billingAddress1" placeholder="Enter Address 1" />
                    </div>
                    <div className="input-col">
                        <label htmlFor="billingAddress2">Address 2</label>
                        <input type="text" id="billingAddress2" placeholder="Enter Address 2" />
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-col">
                        <label htmlFor="billingZipPostal">Zip/Postal Code</label>
                        <input type="text" id="billingZipPostal" placeholder="Enter Zip/Postal Code" />
                    </div>
                    <div className="input-col">
                        <label htmlFor="billingCity">City</label>
                        <input type="text" id="billingCity" placeholder="Enter City" />
                    </div>
                    <div className="input-col">
                        <label htmlFor="billingCountry">Country</label>
                        <input type="text" id="billingCountry" placeholder="Select Country" />
                    </div>
                </div>
            </section>
            <section id="shippingAddress">
                <div className="title-row">
                    <p>Shipping Address</p>
                    <label className="custom-checkbox-wrapper">
                        <input type="checkbox" id="sameAsBillingCheckbox" />
                        <div className="custom-checkbox">
                            <img src={Checkmark} alt="" />
                        </div>
                        Same as billing
                    </label>
                </div>
                <div className="input-row">
                    <div className="input-col">
                        <label htmlFor="shippingAddress1">Address 1</label>
                        <input type="text" id="shippingAddress1" placeholder="Enter Address 1" />
                    </div>
                    <div className="input-col">
                        <label htmlFor="shippingAddress2">Address 2</label>
                        <input type="text" id="shippingAddress2" placeholder="Enter Address 2" />
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-col">
                        <label htmlFor="shippingZipPostal">Zip/Postal Code</label>
                        <input type="text" id="shippingZipPostal" placeholder="Enter Zip/Postal Code" />
                    </div>
                    <div className="input-col">
                        <label htmlFor="shippingCity">City</label>
                        <input type="text" id="shippingCity" placeholder="Enter City" />
                    </div>
                    <div className="input-col">
                        <label htmlFor="shippingCountry">Country</label>
                        <input type="text" id="shippingCountry" placeholder="Select Country" />
                    </div>
                </div>
            </section>
            <button>Create Customer</button>
        </div>
    </div>)
}

export default CreateCustomer 