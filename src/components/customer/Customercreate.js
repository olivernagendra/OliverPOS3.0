import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const Customercreate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // state
    const initialValues = { fName: "", lName: "", tel: "", website: "", billingAddress1: "", billingAddress2: "", billingZipPostal: "", billingCity: "", billingCountry: "", shippingAddress1: "", shippingAddress2: "", shippingCity: "", shippingCountry: "",email:"" };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
  
    const errors = {};
    // hundle change 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
        //  setFormErrors(validate(formValues));
        // const errors = {};
        // const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        // const numberregex = /^([1-9]|10)$/
        // const alphregex = /^[A-Za-z]+$/
        // switch (name) {
        //     case 'email':
        //         // alert("email")
        //         // emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ? true : false;
        //         // emailValid === true && (value.length <= 60) ? this.setState({ emailValid: '' }) : this.setState({ emailValid: LocalizedLanguage.emailErr });
        //         break;
        //     case 'billingZipPostal':
        //         // alert("billingZipPostal")
        //         // custmerPin = value[0];
        //         // pin = value.match(/^([1-9]|10)$/)
        //         break;
        //     case 'tel':
        //         // alert("tel")
        //         // value = value.match(/^[0-9]*$/) ? value : this.state.PhoneNumber
        //         // this.setState({ isContactValid: value && value != "" ? value.match(/^[0-9]*$/) ? true : false : true })


        //         break;
        //     case 'fName':
               
        //         if (!value) {
        //             errors.fName = "Name is required!";
        //         }else if (!alphregex.test(value)) {
        //             errors.fName = "Only alphabets allowed!";
        //         } 

        //         // if(value!==''){
        //         //     nameValid = value.match('^[a-zA-Z ]+$') ? true : false;
        //         //     nameValid === true && (value.length <= 60) ? this.setState({ nameValid: '' }) : this.setState({ nameValid: LocalizedLanguage.nameErr });
        //         //     }
               
        //         break;
        //     case 'lName':
               
        //         if (!value) {
        //             errors.lName = "Last is required!";
        //         }else if (!alphregex.test(value)) {
        //             errors.lName = "Only alphabets allowed!";
        //         } else {
                    
        //         }
                
        //         break;
        //     default:
        //         break;
                
        // }
        // console.log("errors",errors)
        // return errors;
     

    };




      const validate = (values,) => {
      const errors = {};
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
      const numberregex = /^([1-9]|10)$/
      const alphregex = /^[A-Za-z]+$/
      //----Name
        if (!values.fName) {
          errors.fName = "Name is required!";
        }
      //----lastName
        if (!values.lName) {
            errors.lName = "last Name is required!";
          }

      //----Email
        if (!values.email) {
          errors.email = "Email is required!";
        } else if (!regex.test(values.email)) {
          errors.email = "This is not a valid email format!";
        }
        return errors;
      };



      const handleSubmit = (e) => {
        var UDID = localStorage.getItem('UDID'); 
        e.preventDefault();
        setFormErrors(validate(formValues));
        console.log("formValues------",formValues)
        console.log("formErrors----",formErrors)

        if (formValues.email && formValues.email !== "") {
            const save = {
                WPId: "",
                FirstName: formValues.fName,
                LastName: formValues.lName,
                Contact: formValues.tel,
                startAmount: 0,
                Email: formValues.email,
                udid: UDID,
                // notes: Notes,
                StreetAddress: formValues.billingAddress1,
                Pincode: formValues.billingZipPostal,
                City: formValues.billingCity,
                Country: formValues.billingCountry,
                // State: state_name,
                StreetAddress2: formValues.billingAddress2,
            }
            console.log("save",save)
            // this.setState({ create: 'create', activeFilter: false, search: '', Details: '' })
            // setTimeout(() => {
            //     dispatch(customerActions.save(save, 'create', this.state.backUrl));
            // }, 500);
            // updaterefreshwebManu();
            // this.setState({ activeCreateEditDiv: false })
            // if (window.location.pathname !== '/checkout') {
            //     $(".close").click();
            // }
        }

        



       
      };

    return (
        <>

            <div className="subwindow create-customer">
                <div className="subwindow-header">
                    <p>Create Customer</p>
                    <button className="close-subwindow">
                        <img src="../Assets/Images/SVG/X-Icon-DarkBlue.svg" alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <section id="contactInfoSection">
                        <p>Contact Information</p>
                        <div className="input-row">
                            <div className="input-col">
                                <label htmlFor="email">Email*</label>
                                <input type="email" id="email" placeholder="Enter Email" name='email' value={formValues.email} onChange={(e) => handleChange(e)} />
                            </div>
                            <p>{formErrors.email}</p>
                            <div className="input-col">
                                <label htmlFor="tel">Phone Number</label>
                                <input id="tel" type="text" pattern='[0-9]{0,5}' autoComplete='off' maxLength={13} placeholder="Enter Phone Number" name='tel' value={formValues.tel} onChange={(e) => handleChange(e)} />
                            </div>
                        </div>
                        <div className="input-row">
                            <div className="input-col">
                                <label htmlFor="fName">First Name</label>
                                <input type="text" id="fName" value={formValues.fName} placeholder="Enter First Name" name='fName' onChange={(e) => handleChange(e)} />
                            </div>
                            <p>{formErrors.fName}</p>
                            <div className="input-col">
                                <label htmlFor="lName">Last Name</label>
                                <input type="text" id="lName" placeholder="Enter Last Name" name='lName' onChange={(e) => handleChange(e)} value={errors.lName} />

                            </div>
                            <p>{formErrors.lName}</p>
                            <div className="input-col">
                                <label htmlFor="website">Website</label>
                                <input type="url" id="website" placeholder="Enter URL" name='website' value={formValues.website} onChange={(e) => handleChange(e)} />
                            </div>
                        </div>
                    </section>
                    <section id="billingAddress">
                        <p>Billing Address</p>
                        <div className="input-row">
                            <div className="input-col">
                                <label htmlFor="billingAddress1">Address 1</label>
                                <input type="text" id="billingAddress1" placeholder="Enter Address 1" name="billingAddress1" value={formValues.address1} onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="input-col">
                                <label htmlFor="billingAddress2">Address 2</label>
                                <input type="text" id="billingAddress2" placeholder="Enter Address 2" name="billingAddress2" value={formValues.address2} onChange={(e) => handleChange(e)} />
                            </div>
                        </div>
                        <div className="input-row">
                            <div className="input-col">
                                <label htmlFor="billingZipPostal">Zip/Postal Code</label>
                                <input type="text" id="billingZipPostal" placeholder="Enter Zip/Postal Code" name="billingZipPostal" value={formValues.billingZipPostal} onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="input-col">
                                <label htmlFor="billingCity">City</label>
                                <input type="text" id="billingCity" name="billingCity" placeholder="Enter City" value={formValues.billingCity} onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="input-col">
                                <label htmlFor="billingCountry">Country</label>
                                <input type="text" id="billingCountry" name="billingCountry" placeholder="Enter Country" value={formValues.billingCountry} onChange={(e) => handleChange(e)} />
                            </div>
                        </div>
                    </section>
                    <section id="shippingAddress">
                        <div className="title-row">
                            <p>Shipping Address</p>
                            <label className="custom-checkbox-wrapper">
                                <input type="checkbox" id="sameAsBillingCheckbox" name="sameAsBillingCheckbox" onChange={(e) => handleChange(e)} />
                                <div className="custom-checkbox">
                                    <img src="../Assets/Images/SVG/Checkmark.svg" alt="" />
                                </div>
                                Same as billing
                            </label>
                        </div>
                        <div className="input-row">
                            <div className="input-col">
                                <label htmlFor="shippingAddress1">Address 1</label>
                                <input type="text" id="shippingAddress1" placeholder="Enter Address 1" value={formValues.shippingAddress1} name='shippingAddress1' onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="input-col">
                                <label htmlFor="shippingAddress2">Address 2</label>
                                <input type="text" id="shippingAddress2" name="shippingAddress2" value={formValues.shippingAddress2} placeholder="Enter Address 2" onChange={(e) => handleChange(e)} />
                            </div>
                        </div>
                        <div className="input-row">
                            <div className="input-col">
                                <label htmlFor="shippingZipPostal">Zip/Postal Code</label>
                                <input type="text" id="shippingZipPostal" name='shippingZipPostal' value={formValues.shippingZipPostal} placeholder="Enter Zip/Postal Code" onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="input-col">
                                <label htmlFor="shippingCity">City</label>
                                <input type="text" id="shippingCity" placeholder="Enter City" name="shippingCity" value={formValues.shippingCity} onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="input-col">
                                <label htmlFor="shippingCountry">Country</label>
                                <input type="text" id="shippingCountry" placeholder="Select Country" name="shippingCountry" value={formValues.shippingCountry} onChange={(e) => handleChange(e)} />
                            </div>
                        </div>
                    </section>
                    <button onClick={handleSubmit}>Create Customer</button>
                </div>
            </div>
        </>
    )
}

export default Customercreate