import { current } from "@reduxjs/toolkit";
// import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { store } from "../../../app/store";
import { postMeta } from "../commonAPIs/postMetaSlice";

export const CheckAppDisplayInView = (viewManagement, view = null) => {
    // const [page, setPage] = useState('ShopView');
    const location = useLocation();
    var page = "";

    const setPage = (currnetPage) => {
        page = currnetPage;
    }
    //useEffect(() => {
    var _route = location.pathname;
    if (view && view === "Product View") {
        _route = "/product";
    }

    switch (_route) {
        case '/home':
            setPage('home');
            //setPage('Checkout');//for testting
            break;
        case '/customers':
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
        case '/salecomplete':
            setPage('Checkout Complete');

            break;
        default:
            break;
    }
    // }, [page]);

    //console.log("page", page, viewManagement)
    var returnRes = false;
    viewManagement && viewManagement !== [] && viewManagement.map((type, ind) => {
        // isUrlImg = ext.logo ? (ext.logo.match(/\.(jpeg|jpg|gif|png|svg|TIFF|PSD|AI)$/) != null) : false // check if logo url is full imge url
        // ext_logo = ext.logo && isUrlImg ? ext.logo : ext_default_logo // set default ulogo in case logo not exist
        if (type && type.ViewSlug.toLowerCase() == page.toLowerCase())
            returnRes = true
    })
    return returnRes;
}

export function UpdateRecentUsedApp(_exApp, isPing = false, IsUsed = false) {

    var recentApps = localStorage.getItem("recent_apps") ? JSON.parse(localStorage.getItem("recent_apps")) : []
    var _crrApp = null
    if (recentApps && recentApps.length > 0) {
        _crrApp = recentApps.find(app => { return app.app_id == _exApp.Id })
    }
    if (_crrApp) {
        recentApps.map(app => {
            if (app.app_id == _crrApp.app_id) {
                if (isPing == true) { app["view_count"] = app.view_count + 1; }
                if (IsUsed == true) { app["used_count"] = app.used_count + 1; }
            }
        })
    } else {
        recentApps.push({
            "view_name": _exApp.viewManagement && _exApp.ViewSlug,
            "app_name": _exApp.Name,
            "used_count": IsUsed == true ? 1 : 0,
            "app_id": _exApp.Id,
            "last_used_timestamp": Date.now(),
            "view_count": isPing == true ? 1 : 0,
            // "extra_field_1" : "",
            // "extra_field_2" : "",
            // "extra_field_3" : ""
        })
    }
    localStorage.setItem("recent_apps", JSON.stringify(recentApps))

    var parma = { "Slug": "recent_apps", "Value": JSON.stringify(recentApps), "Id": 0, "IsDeleted": 0 };
    store.dispatch(postMeta(parma))

}