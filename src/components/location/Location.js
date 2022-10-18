import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import AngledBracket_Left_Blue from '../../assets/images/svg/AngledBracket-Left-Blue.svg'
import AngledBracket_Right_Grey from '../../assets/images/svg/AngledBracket-Right-Grey.svg'
import Store_Icon_White from '../../assets/images/svg/Store-Icon-White.svg'
import { location } from './locationSlice';

import { get_UDid, get_userName } from '../common/localSettings';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import STATUSES from "../../constants/apiStatus";
import { useNavigate } from 'react-router-dom';
import { LoadingModal } from "../common/commonComponents/LoadingModal";
import { register } from "../register/registerSlice";
const Location = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isNoRegister, setisNoRegister] = useState(false);
    const [isLoading ,setisLoading] = useState(false);
    var decodedString = localStorage.getItem('UDID');
    var decod = decodedString ? atob(decodedString) : '';
    var UDID = decod;
    var userId = localStorage.getItem('userId') ? localStorage.getItem('userId') : 0;

    const { status, data, error, is_success } = useSelector((state) => state.location);

    const [respRegister] = useSelector((state) => [state.register]);
    // console.log("status", status, "data", data, "error", error, "is_success", is_success)

    useEffect(() => {
        if (respRegister.status == STATUSES.error) {
            console.log(error)
        }
        if (respRegister.status == STATUSES.IDLE && respRegister.is_success && respRegister.data && isLoading===true) {
            setisLoading(false);
            if (respRegister.data.content && respRegister.data.content.length > 0) {
                setisNoRegister(false)
                dispatch(register(null));
                navigate('/register')
            }
            else if (respRegister.data.content && respRegister.data.content.length == 0 && isNoRegister === false) {
                setisNoRegister(true)
                console.log("data----->" + JSON.stringify(respRegister.data))
            }

        }
    }, [respRegister]);
    useEffect(() => {
        dispatch(location({ "udid": UDID, "userId": userId }));
    }, []);

    const handleSubmit = (item) => {
        localStorage.setItem('Location', item.id);
        localStorage.setItem('LocationName', item.name);
        var getudid = get_UDid('UDID');
        localStorage.setItem(`last_login_location_id_${getudid}`, item.id);
        localStorage.setItem(`last_login_location_name_${getudid}`, item.name);
        localStorage.setItem('WarehouseId', item.warehouse_id);
        setisLoading(true);
        dispatch(register({ "id": item.id }));
        // if (item.id) {
        //     navigate('/register')
        // }
    }
    // if (status == STATUSES.LOADING) {
    //     return <div> Loading... </div>
    // }
    return <React.Fragment>{status == STATUSES.LOADING || respRegister.status == STATUSES.LOADING ? <LoadingModal></LoadingModal> : null}<div className="choose-wrapper">
        <div className="choose-header">
            <button id="backButton" onClick={() => navigate('/site')}>
                <img src={AngledBracket_Left_Blue} alt="" />
                {LocalizedLanguage.back}
            </button>
            <p>{get_userName()}</p>
        </div>
        <div className="choose-body-default">
            <p>{LocalizedLanguage.chooseLocation}</p>
            <div className="divider"></div>
            <div className="button-container">

                {data !== null && data.content !== undefined &&
                    data.content.map((item, index) => {
                        return (

                            <button key={index} className="option" onClick={() => handleSubmit(item)}>
                                <div className="img-container background-blue">
                                    <img src={Store_Icon_White} alt="" className="store-icon" />
                                </div>
                                <div className="col">
                                    <p className="style1">{item.name}</p>
                                </div>
                                <img src={AngledBracket_Right_Grey} alt="" />
                                <div className="fake-button background-blue">{LocalizedLanguage.select}</div>
                            </button>
                        )
                    })}
                {/* <button className="option">
                    <div className="img-container background-blue">
                        <img src={Store_Icon_White} alt="" className="store-icon" />
                    </div>
                    <div className="col">
                        <p className="style1">139 Water Street</p>
                    </div>
                    <img src={AngledBracket_Right_Grey} alt="" />
                    <div className="fake-button background-blue">Select</div>
                </button>
                <button className="option">
                    <div className="img-container background-blue">
                        <img src={Store_Icon_White} alt="" className="store-icon" />
                    </div>
                    <div className="col">
                        <p className="style1">75 Moncston Rd.</p>
                    </div>
                    <img src={AngledBracket_Right_Grey} alt="" />
                    <div className="fake-button background-blue">Select</div>
                </button>
                <button className="option">
                    <div className="img-container background-blue">
                        <img src={Store_Icon_White} alt="" className="store-icon" />
                    </div>
                    <div className="col">
                        <p className="style1">Pop-up Location</p>
                    </div>
                    <img src={AngledBracket_Right_Grey} alt="" />
                    <div className="fake-button background-blue">Select</div>
                </button> */}
            </div> {isNoRegister === true && <p className="error" style={{ fontSize: "unset" }} >{"No register found for selected location"} </p>}
        </div>
    </div>
    </React.Fragment>
}
export default Location