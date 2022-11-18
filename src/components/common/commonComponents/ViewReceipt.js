import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import LocalizedLanguage from "../../../settings/LocalizedLanguage";
import X_Icon_DarkBlue from '../../../assets/images/svg/X-Icon-DarkBlue.svg';
import STATUSES from "../../../constants/apiStatus";
import { get_UDid } from "../localSettings";
import { sendMail } from "../commonAPIs/sendMailSlice";
import { LoadingModal } from "./LoadingModal";
const ViewReceipt = (props) => {
    const dispatch = useDispatch();
    const [hasCustomer, setHasCustomer] = useState(null);
    const [orderid, setOrderid] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSendEmail, setisSendEmail] = useState(false);
    const [msg, setMsg] = useState('');
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleViewReceipt() && props.toggleViewReceipt();
        }
    }
    const [activitygetdetails] = useSelector((state) => [state.activityGetDetail])
    useEffect(() => {
        if (activitygetdetails && activitygetdetails.status == STATUSES.IDLE && activitygetdetails.is_success && activitygetdetails.data) {
            if (activitygetdetails.data.content && activitygetdetails.data.content.orderCustomerInfo) {
                setHasCustomer(activitygetdetails.data.content.orderCustomerInfo);
            }
            setOrderid(activitygetdetails.data.content.order_id);

        }

    }, [activitygetdetails]);

    const [respSendMail] = useSelector((state) => [state.sendMail])
    useEffect(() => {
        if (respSendMail && respSendMail.status == STATUSES.IDLE && respSendMail.is_success && loading==true) {
            console.log('respSendMail---' + JSON.stringify(respSendMail));
            setMsg("Mail sent");
            setLoading(false);
        }
        else if (respSendMail && respSendMail.status == STATUSES.IDLE && respSendMail.is_success == false && loading==true) {
            setMsg("Something went wrong");
            setLoading(false);
        }

    }, [respSendMail]);

    const sendReceiptByMail = () => {
        var email = hasCustomer.customer_email;
        var UID = get_UDid('UDID');
        var requestData = {
            "OrderNo": orderid,
            "EmailTo": email,
            "Udid": UID,
        }
        setLoading(true);
        dispatch(sendMail(requestData));
    }
    return (
        <React.Fragment>
            {loading === true ? <LoadingModal></LoadingModal> : null}
            <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
                <div className={props.isShow === true ? "subwindow receipt current" : "subwindow receipt"}>
                    <div className="subwindow-header">
                        <p>Receipt</p>
                        <button className="close-subwindow" onClick={() => props.toggleViewReceipt()}>
                            <img src={X_Icon_DarkBlue} alt="" />
                        </button>
                    </div>
                    {/* <div className="subwindow-body">
                        <div className="auto-margin-top"></div>
                        <p>Select how you would like to view receipt:</p>
                        <button onClick={() => props.PrintClick()}>Print</button>
                        <button disabled={hasCustomer == null ? true : false} style={{ opacity: hasCustomer == null ? 0.5 : 1 }} onClick={() => sendReceiptByMail()}>Email</button>
                        <div className="auto-margin-bottom"></div>
                        <p>{msg}</p>
                    </div> */}
                    <div className="subwindow-body">
					<div className="auto-margin-top"></div>
					<div  className={isSendEmail==false?"receipt-options": "receipt-options hidden"}>
						<p>Select how you would like to view receipt:</p>
						<button onClick={() => props.PrintClick()}>Print</button>
						<button disabled={hasCustomer == null ? true : false} style={{ opacity: hasCustomer == null ? 0.5 : 1 }} onClick={()=>setisSendEmail(true)} id="receiptChooseEmail">Email</button>
					</div>
					<div className={isSendEmail==true?"receipt-email": "receipt-email hidden"}>
						<label for="receiptEmail">Email Address</label>
						<input type="email" id="receiptEmail" placeholder="Enter email address" />
						{/* <button>Send Receipt</button> */}
                        <button disabled={hasCustomer == null ? true : false} style={{ opacity: hasCustomer == null ? 0.5 : 1 }} onClick={() => sendReceiptByMail()}>Send Receipt</button>
					</div>
					<div className="auto-margin-bottom"></div>
                    <p>{msg}</p>
				</div>
                </div></div></React.Fragment>
    )
}

export default ViewReceipt 