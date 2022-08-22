import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import AngledBracket_Left_Blue from '../../images/svg/AngledBracket-Left-Blue.svg'
import AngledBracket_Right_Grey from '../../images/svg/AngledBracket-Right-Grey.svg'
import Store_Icon_White from '../../images/svg/Store-Icon-White.svg'
import { get_UDid } from '../../components/common/localSettings';
import STATUSES from "../../constants/apiStatus";
import { register } from "./registerSlice";
const Register = () => {
    const dispatch = useDispatch();

    const { status, data, error, is_success } = useSelector((state) => state.register)
    console.log("status", status, "data", data, "error", error, "is_success", is_success)

    if (status == STATUSES.error) {
        console.log(error)
    }
    if (status == STATUSES.IDLE && is_success) {
        console.log("data----->" + data)
    }

    useEffect(() => {
        var loc_id = localStorage.getItem('Location');
        dispatch(register({ "id": loc_id }));
    }, []);

    const handleSubmit = (item) => {
        localStorage.setItem('Register', item.id);
        localStorage.setItem('LocationName', item.name);
        var getudid = get_UDid('UDID');
        localStorage.setItem(`last_login_location_id_${getudid}`, item.id);
        localStorage.setItem(`last_login_location_name_${getudid}`, item.name);
        localStorage.setItem('WarehouseId', item.warehouse_id);
        //Check IndexDb Exists-------------
        //----------------------------------  
        //this.setState({ loading: true })
        if (item.id) {

            // const { dispatch } = this.props;
            // dispatch(registerActions.getAll());
        }
        // history.push('/choose_registration');
    }

    return
    <React.Fragment>
        <div class="choose-wrapper">
            <div class="choose-header">
                <button id="backButton">
                    <img src={AngledBracket_Left_Blue} alt="" />
                    Back
                </button>
                <p>Sushi Sun - 139 Water Street</p>
            </div>
            <div class="choose-body-default">
                <p>Choose Register/Device</p>
                <div class="divider"></div>
                <div class="button-container">
                    <p>Registers</p>
                    <div class="divider"></div>
                    <div class="button-group col">
                        <button class="option assigned">
                            <div class="img-container background-blue">
                                <img src="../Assets/Images/SVG/Register-Icon-White.svg" alt="" class="register-icon" />
                            </div>
                            <div class="col">
                                <p class="style1">Register 1</p>
                                <p class="style2">Assigned</p>
                            </div>
                            <img src="../Assets/Images/SVG/AngledBracket-Right-Grey.svg" alt="" />
                            <div class="fake-button background-blue">Take Over</div>
                        </button>
                        <button class="option">
                            <div class="img-container background-blue">
                                <img src="../Assets/Images/SVG/Register-Icon-White.svg" alt="" class="register-icon" />
                            </div>
                            <div class="col">
                                <p class="style1">Register 2</p>
                                <p class="style2">Available</p>
                            </div>
                            <img src="../Assets/Images/SVG/AngledBracket-Right-Grey.svg" alt="" />
                            <div class="fake-button background-blue">Select</div>
                        </button>
                    </div>
                    <p>Kiosks</p>
                    <div class="divider"></div>
                    <div class="button-group">
                        <button class="option">
                            <div class="img-container background-violet">
                                <img src="../Assets/Images/SVG/Kiosk-Icon-White.svg" alt="" class="kiosk-icon" />
                            </div>
                            <div class="col">
                                <p class="style1">Kiosk 1</p>
                                <p class="style2">Available</p>
                            </div>
                            <img src="../Assets/Images/SVG/AngledBracket-Right-Grey.svg" alt="" />
                            <div class="fake-button background-violet">Select</div>
                        </button>
                        <button class="option assigned">
                            <div class="img-container background-violet">
                                <img src="../Assets/Images/SVG/Kiosk-Icon-White.svg" alt="" class="kiosk-icon" />
                            </div>
                            <div class="col">
                                <p class="style1">Kiosk 2</p>
                                <p class="style2">Assigned</p>
                            </div>
                            <img src="../Assets/Images/SVG/AngledBracket-Right-Grey.svg" alt="" />
                            <div class="fake-button background-violet">Take Over</div>
                        </button>
                        <button class="option">
                            <div class="img-container background-violet">
                                <img src="../Assets/Images/SVG/Kiosk-Icon-White.svg" alt="" class="kiosk-icon" />
                            </div>
                            <div class="col">
                                <p class="style1">Kiosk 3</p>
                                <p class="style2">Available</p>
                            </div>
                            <img src="../Assets/Images/SVG/AngledBracket-Right-Grey.svg" alt="" />
                            <div class="fake-button background-violet">Select</div>
                        </button>
                        <button class="option">
                            <div class="img-container background-violet">
                                <img src="../Assets/Images/SVG/Kiosk-Icon-White.svg" alt="" class="kiosk-icon" />
                            </div>
                            <div class="col">
                                <p class="style1">Kiosk 4</p>
                                <p class="style2">Available</p>
                            </div>
                            <img src="../Assets/Images/SVG/AngledBracket-Right-Grey.svg" alt="" />
                            <div class="fake-button background-violet">Select</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="subwindow-wrapper hidden">
            <div class="subwindow takeover-register">
                <div class="subwindow-header">
                    <p>Take Over Register</p>
                    <button class="close-subwindow">
                        <img src="../Assets/Images/SVG/X-Icon-DarkBlue.svg" alt="" />
                    </button>
                </div>
                <div class="subwindow-body">
                    <div class="auto-margin-top"></div>
                    <p>
                        Are you sure you <br />
                        want to take over <b>Register 1</b>? <br /><br />
                        This action will kick out the current user.
                    </p>
                    <button id="takeoverRegister">Take Over</button>
                    <button id="cancelTakeover">Cancel</button>
                    <div class="auto-margin-bottom"></div>
                </div>
            </div>
        </div>
    </React.Fragment>
}
export default Register