import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import AngledBracket_Left_Blue from '../../assets/images/svg/AngledBracket-Left-Blue.svg'
import AngledBracket_Right_Grey from '../../assets/images/svg/AngledBracket-Right-Grey.svg'
import Register_Icon_White from '../../assets/images/svg/Register-Icon-White.svg'
import Kiosk_Icon_White from '../../assets/images/svg/Kiosk-Icon-White.svg'
import X_Icon_DarkBlue from '../../assets/images/svg/X-Icon-DarkBlue.svg'
import LocalizedLanguage from '../../settings/LocalizedLanguage';

import STATUSES from "../../constants/apiStatus";
import { register } from "./registerSlice";
import { firebaseRegister } from "./firebaseRegisterSlice";
import { useNavigate } from 'react-router-dom';
import { get_locName, get_UDid, get_userName } from "../common/localSettings";
import { toggleSubwindow } from "../common/EventFunctions";
import { LoadingModal } from "../common/commonComponents/LoadingModal";
import { GetOpenRegister, closeRegister } from '../cashmanagement/CashmanagementSlice'
const Register = () => {
    const [selRegister, setSelRegister] = useState(null);
    const [isShowTakeOver, setisShowTakeOver] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    var registers = [];
    var self_registers = [];
    var firebase_registers = [];

    const toggleShowTakeOver = () => {
        setisShowTakeOver(!isShowTakeOver)
    }

    const [respRegister, respFirebaseRegisters] = useSelector((state) => [state.register, state.firebaseRegister])

    if (respRegister.status === STATUSES.error) {
        console.log(respRegister.error)
    }
    if (respRegister.status == STATUSES.IDLE && respRegister.is_success) {
        const data = respRegister.data;
        registers = data && data.content && data.content.filter(a => a.IsSelfCheckout == false);
        self_registers = data && data.content && data.content.filter(a => a.IsSelfCheckout == true);
    }

    if (respFirebaseRegisters.status == STATUSES.IDLE && respFirebaseRegisters.is_success) {
        firebase_registers = respFirebaseRegisters.data && respFirebaseRegisters.data.content;
    }

    const openRegister = () => {
        var result = false;
        var selectedRegister = localStorage.getItem('selectedRegister') ? JSON.parse(localStorage.getItem("selectedRegister")) : '';
        var isDrawerOpen = localStorage.getItem("IsCashDrawerOpen") ? localStorage.getItem("IsCashDrawerOpen") : "false";
        var client = localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")) : '';
        if (isDrawerOpen == "false" && (client && client.subscription_permission && client.subscription_permission.AllowCashManagement == true && selectedRegister && selectedRegister.EnableCashManagement == true)) {
            result = true;
        }
        return result;
    }

    const { status, dataone, error, is_success } = useSelector((state) => state.GetOpenRegister)
    console.log("status", status, "dataone", dataone, "error", error, "is_success", is_success)
    useEffect(() => {
        if (status === STATUSES.IDLE && is_success==true /*&& error == ""*/) {
            //if (dataone && dataone.content && dataone.content !== undefined) {
            if (dataone && dataone.message === "Success" && loading === true) {
                // if (dataone.content && dataone.content !== '' && dataone.content !== 0) {
                //     localStorage.setItem("IsCashDrawerOpen", "true");
                //     localStorage.setItem("Cash_Management_ID", dataone.content.Id);
                // } else {
                //     localStorage.setItem("IsCashDrawerOpen", "false");
                //     localStorage.removeItem("Cash_Management_ID");
                // }
                setLoading(false)
                if (openRegister() == true) {
                    navigate('/openregister')
                }
                else {
                    navigate('/pin');
                }
            }
        }
        else if (status === STATUSES.IDLE && error !== "") {
            if(loading===true)
           { setLoading(false)}
        }
    }, [dataone]);
    
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => { //calling multiple api
        var loc_id = localStorage.getItem('Location');
        dispatch(register({ "id": loc_id }));
        dispatch(firebaseRegister());

    }
    const handleSubmit = (item, isTakeOver = false) => {
        var arry = [];
        arry.push(item)
        localStorage.setItem('pdf_format', JSON.stringify(arry))
        localStorage.setItem('register', item.id);
        localStorage.setItem('registerName', item.name);
        var getudid = get_UDid('UDID');
        localStorage.setItem(`last_login_register_id_${getudid}`, item.id);
        localStorage.setItem(`last_login_register_name_${getudid}`, item.name);
        localStorage.setItem('selectedRegister', JSON.stringify(item))

        setSelRegister(item);
        if (isTakeOver == false) {
            fetchRegisterData(item.id)
            // if (openRegister() == true) {
            //     navigate('/openregister')
            // }
            // else {
            //     navigate('/pin');
            // }
        }
        else {
            toggleShowTakeOver();
        }
        //toggleSubwindow("takeover-register");
    }
    const fetchRegisterData = (register_Id) => {

        var client = localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")) : '';
        var selectedRegister = localStorage.getItem('selectedRegister') ? JSON.parse(localStorage.getItem("selectedRegister")) : '';
        if (client && client.subscription_permission && client.subscription_permission.AllowCashManagement == true && selectedRegister && selectedRegister.EnableCashManagement == true) {
            dispatch(GetOpenRegister(register_Id));
            setLoading(true);

        }
        else {
            localStorage.setItem("IsCashDrawerOpen", "false");
            navigate('/pin')
        }
    }

    const takeOver = () => {
        selRegister && fetchRegisterData(selRegister.id);
        // if (openRegister() == true) {
        //     navigate('/openregister')
        // }
        // else
        //     navigate('/pin');
    }

    // if (respRegister.status == STATUSES.LOADING) {
    //     return <div> Loading... </div>
    // }
    return (
        <React.Fragment>
            {respRegister.status == STATUSES.LOADING || loading===true ? <LoadingModal></LoadingModal> : null}
            {
                <div className="choose-wrapper">
                    <div className="choose-header">
                        <button id="backButton" onClick={() => navigate('/location')} >
                            <img src={AngledBracket_Left_Blue} alt="" />
                            {LocalizedLanguage.back}
                        </button>
                        <p>{get_locName()}</p>
                        {/* get_userName() + " - " +  */}
                    </div>
                    <div className="choose-body-default">
                        <p>{LocalizedLanguage.registerdevice}</p>
                        <div className="divider"></div>
                        <div className="button-container">
                            <p>Registers</p>
                            <div className="divider"></div>
                            <div className="button-group col">
                                {
                                    registers.map((item, index) => {
                                        var inr = true;
                                        {
                                            firebase_registers && firebase_registers.length > 0 && firebase_registers.map((firebaseItem, indx) => {
                                                if (inr == true) {
                                                    if (firebaseItem.RegisterId == item.id && firebaseItem.Status !== "available") {
                                                        inr = false
                                                    }
                                                }
                                            })
                                        }
                                        return <button key={index} className={inr == true ? "option" : "option assigned"} onClick={() => handleSubmit(item, inr == true ? false : true)}>
                                            <div className="img-container background-blue">
                                                <img src={Register_Icon_White} alt="" className="register-icon" />
                                            </div>
                                            <div className="col">
                                                <p className="style1">{item.name}</p>
                                                <p className="style2">{inr == true ? <>{LocalizedLanguage.available}</> : <> {<>{LocalizedLanguage.assigned}</>} </>}</p>
                                            </div>
                                            {inr === true ?
                                                <React.Fragment><img src={AngledBracket_Right_Grey} alt="" />
                                                    <div className="fake-button background-blue">{LocalizedLanguage.select}</div></React.Fragment>
                                                : <React.Fragment>
                                                    <img src={AngledBracket_Right_Grey} alt="" onClick={() => toggleShowTakeOver()} />
                                                    <div className="fake-button background-blue">{LocalizedLanguage.takeover}</div></React.Fragment>}
                                        </button>

                                    })}

                            </div>
                            {self_registers && self_registers.length > 0 && <>
                                <p>Kiosks</p>
                                <div className="divider"></div>
                                <div className="button-group">
                                    {self_registers.map((item, index) => {
                                        return <button key={index} className="option" onClick={() => handleSubmit(item)}>
                                            <div className="img-container background-violet">
                                                <img src={Kiosk_Icon_White} alt="" className="kiosk-icon" />
                                            </div>
                                            <div className="col">
                                                <p className="style1">{item.name}</p>
                                                <p className="style2">{LocalizedLanguage.available}</p>
                                            </div>
                                            <img src={AngledBracket_Right_Grey} alt="" />
                                            <div className="fake-button background-violet">{LocalizedLanguage.select}</div>
                                        </button>
                                    })}
                                </div>
                            </>
                            }
                        </div>
                    </div>
                </div>
            }
            <div className={isShowTakeOver ? "subwindow-wrapper" : "subwindow-wrapper hidden"}>
                <div className={isShowTakeOver ? "subwindow takeover-register current" : "subwindow takeover-register"}>
                    <div className="subwindow-header">
                        <p>Take Over Register</p>
                        <button className="close-subwindow" onClick={() => toggleShowTakeOver()}>
                            {/* onClick={() => toggleSubwindow()} */}
                            <img src={X_Icon_DarkBlue} alt="" />
                        </button>
                    </div>
                    <div className="subwindow-body">
                        <div className="auto-margin-top"></div>
                        <p>
                            Are you sure you <br />
                            want to take over <b>{selRegister && selRegister.name}</b>? <br /><br />
                            This action will kick out the current user.
                        </p>
                        <button id="takeoverRegister" onClick={() => takeOver()}>Take Over</button>
                        <button id="cancelTakeover" onClick={() => toggleShowTakeOver()}>Cancel</button>
                        {/* onClick={() => toggleSubwindow()} */}
                        <div className="auto-margin-bottom"></div>
                    </div>
                </div>
            </div>
        </React.Fragment>)
}
export default Register