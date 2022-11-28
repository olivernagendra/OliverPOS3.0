
import X_Icon_DarkBlue from '../../../assets/images/svg/X-Icon-DarkBlue.svg';
import KeyOrderStatus from '../../../settings/KeysOrderStaus';
const UpdateOrderStatus = (props) => {
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleUpdateOrderStatus();
        }
    }
    const statusUpdate = (status) => {
        props.updateStatus && props.updateStatus(status);
    }
    var _orderkyes = KeyOrderStatus.key;
    return (
        <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
            <div className={props.isShow === true ? "subwindow update-transaction-status current" : "subwindow update-transaction-status"}>
                <div className="subwindow-header">
                    <p>Update Status</p>
                    <button className="close-subwindow" onClick={() => props.toggleUpdateOrderStatus()}>
                        <img src={X_Icon_DarkBlue} alt="" />
                    </button>
                </div>
                <div className="subwindow-body">
                    <div className="auto-margin-top"></div>
                    <p>Select a status for this order:</p>
                    {
                        Object.keys(_orderkyes).filter(item => item.toLowerCase() !== "refunded").map((item, index) => {
                            var _disabled = (item == 'void_sale' || item == 'refunded') ? 'disabled' : '';
                            return (<label>
                                <input disabled={_disabled} type="radio" id="transactionStatusCompleted" name="transaction_status" checked />
                                <div onClick={()=>statusUpdate(item)} className="custom-radio">{_orderkyes[item]}</div>
                            </label>)
                        })
                    }
                    {/* <label>
                        <input type="radio" id="transactionStatusCompleted" name="transaction_status" checked />
                        <div className="custom-radio">Completed</div>
                    </label>
                    <label>
                        <input type="radio" id="transactionStatusOnHold" name="transaction_status" disabled />
                        <div className="custom-radio">On Hold</div>
                    </label>
                    <label>
                        <input type="radio" id="transactionStatusPending" name="transaction_status" />
                        <div className="custom-radio">Pending</div>
                    </label>
                    <label>
                        <input type="radio" id="transactionStatusPark" name="transaction_status" />
                        <div className="custom-radio">Park</div>
                    </label>
                    <label>
                        <input type="radio" id="transactionStatusCancelled" name="transaction_status" />
                        <div className="custom-radio">Cancelled</div>
                    </label>
                    <label>
                        <input type="radio" id="transactionStatusProcessing" name="transaction_status" />
                        <div className="custom-radio">Processing</div>
                    </label> */}
                    <button>Update</button>
                    <div className="auto-margin-bottom"></div>
                </div>
            </div></div>)
}
export default UpdateOrderStatus 