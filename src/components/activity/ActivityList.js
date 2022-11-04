import React, { useEffect, useState ,useRef} from "react";
import { useDispatch, useSelector } from 'react-redux';
import FilterArrowDown from '../../assets/images/svg/FilterArrowDown.svg'
import FilterArrowUp from '../../assets/images/svg/FilterArrowUp.svg'
import OnlineSale from '../../assets/images/svg/OnlineSale.svg'
import InStoreSale from '../../assets/images/svg/InStoreSale.svg'
import moment from 'moment';
import Config from '../../Config'
import STATUSES from "../../constants/apiStatus";
import { FormateDateAndTime } from '../../settings/FormateDateAndTime';
import { LoadingSmallModal } from "../common/commonComponents/LoadingSmallModal";
const ActivityList = (props) => {
    const myRef = useRef();
    const [isSortWrapper, setSortWrapper] = useState(false)
    const [SelectedTypes, setSelectedTypes] = useState('')
    const [AllActivityList, setAllActivityList] = useState([])
    
    var current_date = moment().format(Config.key.DATE_FORMAT);
    var customer_to_OrderId = (typeof localStorage.getItem("CUSTOMER_TO_OrderId") !== 'undefined' && localStorage.getItem("CUSTOMER_TO_OrderId") !== null) ? localStorage.getItem("CUSTOMER_TO_OrderId") : '';
    var id = `activity-order-${customer_to_OrderId}`
    var elmnt = document.getElementById(`${id}`);
    var ordersDate = new Array();
    var orders = props.orders;
    var custId = localStorage.getItem("CUSTOMER_TO_ACTVITY") !== 'undefined' && localStorage.getItem("CUSTOMER_TO_ACTVITY") !== null ? localStorage.getItem("CUSTOMER_TO_ACTVITY") : ""
    var ids = `activity-order-${custId}`
    var elmnts = document.getElementById(`${ids}`);

    if (typeof props.orders !== 'undefined') {
        for (const key in orders) {
            if (orders.hasOwnProperty(key)) {
                ordersDate.push(key)
            }
        }
        if (ordersDate.length > 0) {
            ordersDate.sort(function (a, b) {
                var keyA = new Date(a),
                    keyB = new Date(b);
                // Compare the 2 dates
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });
            ordersDate.reverse();
        }
    }

      const onScroll = (e) => {
        const bottom = Number((e.target.scrollHeight - e.target.scrollTop).toFixed(0)) - e.target.clientHeight < 50;
       // let page = this.state.page;
        if (bottom) {
            props.updateSomething()
        }
    };

    const [activityAllDetails] = useSelector((state) => [state.activityRecords])
    

    return (
        <div ref={myRef} onScroll={onScroll} className="body">
             {activityAllDetails.status == STATUSES.LOADING ? <LoadingSmallModal></LoadingSmallModal> : null}
            {((!ordersDate) || ordersDate.length == 0) ?
                <div class="no-results">
                    <p class="style1">No results found.</p>
                    <p class="style2">Sorry, you search did not <br /> match any results.</p>
                </div>
                :
                orders && ordersDate && ordersDate.map((getDate, index) => {
                    return (
                        <>
                            <div className="filter-name" key={"orderDatedv" + index}>
                                <p key={"date" + index}> {current_date == getDate ? 'Today' : getDate}</p>
                            </div>
                            {
                                getDate && orders && orders[getDate] && orders[getDate].map((order, index) => {
                                    var time = FormateDateAndTime.formatDateWithTime(order.date_time, order.time_zone);
                                    return (
                                        <button  className={props.updateActivityId == order.order_id ? "transaction-card no-transform selected" : "transaction-card no-transform"} onClick={() => props.click(order, order.order_id)}>
                                            <div className="col">
                                                <p className="style1">Order# {order.order_id}</p>
                                                <p className="style2">{order.CustFullName}</p>
                                                <div className="row">
                                                    {
                                                        (order.OliverReciptId !== '') ? <img src={InStoreSale} alt="" /> : <img src={OnlineSale} alt="" />

                                                    }
                                                    <p>{order.order_status}</p>
                                                </div>
                                            </div>
                                            <div className="col">
                                                {
                                                    (order.refunded_amount > 0) ?
                                                        <p className="style3"> {parseFloat(order.total - order.refunded_amount).toFixed(2)}
                                                            &nbsp;<del>{parseFloat(order.total).toFixed(2)}</del>
                                                        </p>
                                                        :
                                                        <p className="style3"> {parseFloat(order.total).toFixed(2)}</p>
                                                }
                                                <p className="style4">{order.time}</p>
                                            </div>
                                            {props.updateActivityId == order.order_id ? <div className="selected-indicator"></div> : ''}
                                        </button>
                                    )
                                })
                            }
                          
                        </>
                    )
                })
            }



        </div>
    )
}

export default ActivityList