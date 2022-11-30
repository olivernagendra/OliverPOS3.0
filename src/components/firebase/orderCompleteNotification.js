import ActiveUser from "../../settings/ActiveUser";
import Config from '../../Config';

export const updateOrderStatus = (notificationData) => {
    var TempOrders = localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`)) : [];
    var notificationLimit = Config.key.NOTIFICATION_LIMIT;
    if (TempOrders && TempOrders.length > 0) {
        if (TempOrders.length > notificationLimit) {
            TempOrders.splice(0, 1);
        }
        TempOrders.map(ele => {
            if (ele.TempOrderID == notificationData.oliver_receipt_id) {
                if (notificationData && notificationData.oliver_receipt_id) {
                    ele.Status = "true";
                    ele.OrderID = notificationData.order_id;
                    ele.Sync_Count = ele.Sync_Count + 1
                }
                else {
                    ele.Sync_Count = ele.Sync_Count + 1
                    if (ele.Sync_Count === Config.key.SYNC_COUNT_LIMIT)
                        ele.Status = "failed";
                    console.log("OrderStatusFailed", ele);
                }
            }
        })
        localStorage.setItem(`TempOrders_${ActiveUser.key.Email}`, JSON.stringify(TempOrders))
    }
}

export const updateOrderStatusNotification = {
    updateOrderStatus
}