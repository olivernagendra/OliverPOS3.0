import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const CheckAppDisplayInView = (viewManagement, view = null) => {
    const [page, setPage] = useState('ShopView');
    const location = useLocation();
    useEffect(() => {
        var _route = location.pathname;
        if (view && view === "Product View") {
            _route = "/product";
        }

        switch (_route) {
            case '/home':
                // setPage('Shop View');
                setPage('Checkout');//for testting
                break;
            case '/customer':
                setPage('Customer View');
                break;
            case '/transactions':
                setPage('Activity View');
                break;
            case '/checkout':
                setPage('Checkout');
                break;
            case '/product':
                setPage('Product View');
                break;
            default:
                break;
        }
    }, [page]);

    console.log("page", page)
    var returnRes = false;
    viewManagement && viewManagement !== [] && viewManagement.map((type, ind) => {
        // isUrlImg = ext.logo ? (ext.logo.match(/\.(jpeg|jpg|gif|png|svg|TIFF|PSD|AI)$/) != null) : false // check if logo url is full imge url
        // ext_logo = ext.logo && isUrlImg ? ext.logo : ext_default_logo // set default ulogo in case logo not exist
        if (type && type.ViewSlug == page)
            returnRes = true
    })
    return returnRes;
}