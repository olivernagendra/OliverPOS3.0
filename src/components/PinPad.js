import React, { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { chunkArray, get_locName, get_regName } from './common/localSettings'
// import imgOpenReg from '../images/svg/OpenSign.svg'
import imgBackSpace from '../images/svg/Backspace-BaseBlue.svg'

import { createPin, validatePin } from "./pinPage/pinSlice"
import { useNavigate } from "react-router-dom";
import { get_UDid } from "./common/localSettings";
import STATUSES from "../constants/apiStatus";
import { openRegister } from '../components/cashmanagement/CashmanagementSlice'
import moment from 'moment';
import LocalizedLanguage from "../settings/LocalizedLanguage";
import $ from "jquery";

const PinPad = React.memo(props => {
    // console.log("props",props)
    const inputElement = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [totalSize, setTotalSize] = useState(0)
    const [txtValue, setTxtValue] = useState("")
    const [isloading, setIsloading] = useState(false)
    const { status, data, error, is_success } = useSelector((state) => state.pin)
    // console.log("status", status, "data", data, "error", error, "is_success", is_success)
    var hasPin = localStorage.getItem('hasPin')
    var isDrawerOpen = localStorage.getItem("IsCashDrawerOpen");
    var client = localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")) : '';
    var isDrawerOpen = localStorage.getItem("IsCashDrawerOpen");
    var client = localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")) : '';


    useEffect(() => {
        // console.log("useEffect")
        if (isDrawerOpen == "false" && client && client.subscription_permission && client.subscription_permission.AllowCashManagement == true) {
            navigate('/openregister')
        }
        if (isloading == true) {
            pinSuccessful()
        }

        focusInput()
    }, [data])



    const pinSuccessful = () => {
        if (status === STATUSES.error) {
            //  console.log(error)
        }

        if (is_success === true) {
            //   console.log("iss success",is_success)
            //  openRegisterhundle()
        }

        if (status === STATUSES.IDLE && is_success) {

            localStorage.setItem('user', JSON.stringify(data.content));
            if (typeof (Storage) !== "undefined") {
                localStorage.setItem("check_subscription_status_datetime", new Date());
            }

            if (localStorage.getItem("PRODUCT_REFRESH_DATE") == null) {
                localStorage.setItem("PRODUCT_REFRESH_DATE", moment.utc(new Date()).format('YYYY-MM-DD HH:mm:ss'))
            }
            var _lang = localStorage.getItem("LANG");

            var user = JSON.parse(localStorage.getItem("user"))
            var lang = user && user.language ? user.language : 'en';
            localStorage.setItem("LANG", lang);

            //Reloading the component if new language set for the login user.                  
            if (_lang && _lang !== lang) {
                // window.location = '/';

            }
            if (isDrawerOpen == "false" && client && client.subscription_permission && client.subscription_permission.AllowCashManagement == true) {
                navigate('/openregister')
            } else {
                if (props.doAction) {
                    props.doAction()
                } else {
                    if(props.toggleSwitchUser && props.switchUser==true)
                    {
                        props.toggleSwitchUser();
                    }
                    else
                    {
                        navigate('/productloader')
                    }
                }
            }
        }


    }



    const pinNumberList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", " ", "0", "c"];
    const trshPin = ['txt1', 'txt2', 'txt3', 'txt4']

    const NumInput = props =>
        chunkArray(props.numbers, 3).map((num, index) => (
            <div key={index} className="pin-button-row">
                {num.map((nm, i) => {
                    if (nm === " ") { return "" }
                    return (
                        <button key={"input" + i} type="button" id={props.id}
                            onClick={() => { addToScreen(nm) }}
                            className={nm === 'c' ? "backspace" : ""}>
                            {nm === 'c' ? <img src={imgBackSpace} /> : nm}
                        </button>
                    )
                })
                }
            </div>
        ))

    // display dot pin
    const TrashPin = () =>
        trshPin.map((pinId, ind) => {
            // console.log("totalSize",totalSize)
            return (
                <div key={ind} className={"pin-entry " + (totalSize >= ind + 1 && "entered")}></div>

            )
        })
    // show entered number for create pin
    const ShowCreatePin = props =>
        trshPin.map((pinId, ind) => {
            return (
                <input key={ind} type="number" id={pinId + 1} onChange={(e) => handle(e)} />
                //   className={props.className}
            )
        })
    const resetScreen = () => {
        var str = txtValue;
        if (totalSize > 0) {
            setTotalSize(totalSize - 1);
            setTxtValue(str.substring(0, str.length - 1));
        } else {
            setTotalSize(0);
            setTxtValue("");
        }
        fillPass();
    }
    const addToScreen = (inputNo) => {
        // if (inputNo === " ") { return }
        var lenght_is = inputNo.length - 1
        var newString = inputNo[lenght_is];//e[lenght_is];
        if (inputNo === "c") {
            if (totalSize > 0) {
                resetScreen();
            } else {
                setTotalSize(0);
                setTxtValue('');
            }
            return;
        }
        if (totalSize < 4) {
            var value = txtValue + newString
            var size = totalSize + 1
            setTxtValue(value);
            setTotalSize(size);
            console.log(value, size)
            setTimeout(() => {
                fillPass(value);
            }, 100);

        }

        // $('#whichkey').focus()
        var _envType = localStorage.getItem('env_type');
        // if (_envType && _envType !== "") {
        //     // $('#whichkey').attr('readonly', true);
        // } else {
        $('#whichkey').focus();
        // }
    }



    const fillPass = (enteredPin) => {
        if (enteredPin && enteredPin.length >= 4) {
            //const { dispatch } = this.props;
            if (isloading === false) {
                setIsloading(true)
                localStorage.removeItem('logoutclick'); //For webview            
                setTimeout(function () {    //Need delay for reaset text
                    var userID = "";

                    if (localStorage.getItem("userId")) {
                        userID = localStorage.getItem("userId");
                    } else {
                        userID = localStorage.getItem('clientDetail') ? JSON.parse(localStorage.getItem('clientDetail')).user_id : "";
                        localStorage.setItem("userId", userID)
                    }

                    if (enteredPin !== null && enteredPin !== '' && userID && userID !== '') {


                        console.log(typeof (enteredPin), enteredPin, txtValue,);
                        if (hasPin !== 'false') {
                            dispatch(validatePin({ "pin": enteredPin, "userid": userID, "UDID": get_UDid('UDID') }));

                        } else {
                            dispatch(createPin({ "pin": enteredPin, "id": userID }));
                        }
                    }

                    setTxtValue("");
                    setTotalSize(0);
                }, 100)
            }
        }

    }

    const handle = (e) => {
        const { value } = e.target;
        const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
        if (value === '' || re.test(value)) {
            addToScreen(value)
        }
    }

    const handleBack = (e) => {
        if (e.keyCode == 76 && e.ctrlKey) {
            this.log_out()
        }
        if (e.keyCode == 86 && e.ctrlKey) {
            //$('#PinPagebackButton').focus();
        }
        var key = e.which || e.keyCode;
        if (key === 8) {
            addToScreen('c')
            e.preventDefault();
        }
        if (key === 13) {
            e.preventDefault();
        }
    }

    const focusInput = () => {
        inputElement.current.focus();
        $('#whichkey').focus();
    };


    if (props.onClick == true) {
        // console.log("outer click")
        focusInput()
    }


    if (status === STATUSES.ERROR) {
        inputElement.current.focus();
        focusInput()
        console.log(status)
        // setTotalSize(0)
        // setTxtValue("")
        // addToScreen('c')
        isloading == true && setIsloading(false)

    }
    return <React.Fragment>

        <p>{LocalizedLanguage.enteryouruserid}</p>

        <input id="whichkey" ref={inputElement} autoFocus={true} maxLength="4" type="text" style={{ backgroundColor: 'transparent', color: 'transparent', border: "blue" }} onChange={handle} onKeyDown={handleBack} className="border-0 color-4b text-center w-100 p-0 no-outline enter-order-amount placeholder-color" autoComplete="off" />
        <div className="pinpad">

            {hasPin !== "true" && <ShowCreatePin />}
            <div className="pin-entries">
                <TrashPin />
            </div>
            <NumInput id="keyss" type="button" numbers={pinNumberList} onClick={addToScreen} readOnly={false} classNameNameName2="fill-dotted-clear" />

        </div>
        {(status === STATUSES.ERROR && <p className="error border-0 color-4b text-center w-100 p-0 no-outline enter-order-amount placeholder-color" >{error} </p>)}
    </React.Fragment>
})

export default PinPad