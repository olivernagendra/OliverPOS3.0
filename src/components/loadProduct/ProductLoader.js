import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteDB, openDB } from 'idb';

import { get_UDid } from '../common/localSettings'
import Config from '../../Config';
import { receiptSetting } from '../serverSetting/receiptSettingSlice';
import ActiveUser from '../../settings/ActiveUser';
import { taxSetting } from '../serverSetting/taxSettingSlice';
import STATUSES from '../../constants/apiStatus';
import { productCount } from './productCountSlice';
import { productLoader } from './loadProductSlice';
import { useNavigate } from 'react-router-dom';
// import { useIndexedDB } from 'react-indexed-db';

//import LoaderOnboarding from '../onboarding/components/LoaderOnboarding'
const ProductLoader = () => {
    // const { add, update, getByID, getAll, deleteRecord } = useIndexedDB("products");

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [loadingProducts, setLoadingProducts] = useState(0)
    const [loadPerc, setLoadPerc] = useState(0)
    const [productLoading, setProductLoading] = useState(false)

    //........Test--------------------------
    const saveDataIntoIndexDB = (ProductArray) => {
        ProductArray && ProductArray.length > 0 && ProductArray.map((item) => {
            // add(item).then(
            //     (key) => {
            //         // console.log("ID Generated: ", key);
            //         //   let newState = Object.assign({}, state);
            //         //   newState.id = key;
            //         //   setState(newState);
            //         //   history.goBack();
            //     },
            //     (error) => {
            //         console.log(error);
            //     }
            // )
        })

        // var _state = { "WPID": 101, "name": "nagendra", "age": 32 }

    }
    //........................
    const displayProductLoadStatus = (total, Synched) => {
        if (total != 0) {
            var _perc = ((Synched * 100) / total).toFixed(0);
            setLoadingProducts("Synched " + Synched + " Products, Out of " + total + "");
            setLoadPerc(_perc);
        }
    }
    const getProductList = (pn, pz, totalSync) => {
        var totalRecord = localStorage.getItem("productcount") ? localStorage.getItem("productcount") : 0;
        displayProductLoadStatus(totalRecord, totalSync)


        //if (!localStorage.getItem('user') || !sessionStorage.getItem("issuccess")) {
        //redirectToURL()
        // navigate('/loginpin');
        //}
        var RedirectUrl = ActiveUser.key.isSelfcheckout && ActiveUser.key.isSelfcheckout == true ? '/selfcheckout' : '/checkout';

        var udid = get_UDid(localStorage.getItem("UDID"));

        var WarehouseId = localStorage.getItem("WarehouseId") ? parseInt(localStorage.getItem("WarehouseId")) : 0;

        var pageNumber = pn;
        var pageSize = Config.key.FETCH_PRODUCTS_PAGESIZE;
        var PageSize = Config.key.FETCH_PRODUCTS_PAGESIZE;

        //var ProductArray = pl;       
        var totalProductSync = parseInt(totalSync);
        const requestOptions = {
            method: 'GET',
            headers: {
                "access-control-allow-origin": "*",
                "access-control-allow-credentials": "true",
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(sessionStorage.getItem("AUTH_KEY")),
            }
            , mode: 'cors'
        };
        var isDemoUser = localStorage.getItem('demoUser') == 'true' && localStorage.getItem('DemoGuid');
        if (isDemoUser == true) {
            requestOptions.headers['demoauth'] = localStorage.getItem('DemoGuid') && localStorage.getItem('DemoGuid')
        }
        if (totalRecord == 0 && isDemoUser == false) {
            // navigate( RedirectUrl) ;  
            console.log("test4")
            // UpdateIndexDB(udid, ProductArray, RedirectUrl);
        }

        fetch(`${Config.key.OP_API_URL}/v1/Product/Records?pageNumber=${pageNumber}&pageSize=${PageSize}&WarehouseId=${WarehouseId}`, requestOptions)
            .then(response => {
                if (response.ok) { return response.json(); }
                throw new Error(response.statusText)  // throw an error if there's something wrong with the response
            })
            .then(function handleData(data) {
                var reloadCount = localStorage.getItem("ReloadCount");
                //ProductArray = [...new Set([...ProductArray, ...data.content.Records])];
                saveDataIntoIndexDB(data.content.Records)
                //check dataExist into indexdb-------------------------
                var isExist = false;

                console.log("--------------Total Products count--------" + totalRecord);

                totalProductSync += parseInt(data.content.Records.length);

                displayProductLoadStatus(totalRecord, totalProductSync)

                if (isDemoUser == false && (totalRecord > totalProductSync) && ((totalRecord != totalProductSync) || pageNumber <= (totalRecord / PageSize * 1.0))) {
                    console.log("--------------Product list request time--------" + new Date());
                    // self.UpdateIndexDB(udid,ProductArray);
                    pageNumber++;
                    //console.log("ProductArray1",ProductArray.length)     
                    // console.log("test5")
                    getProductList(pageNumber, PageSize, parseInt(totalProductSync));
                    //console.log("test6")
                }
                else {
                    console.log("--------------all records are done-----------");
                    //console.log("ProductArray2",ProductArray.length)                        

                    // UpdateIndexDB(udid, ProductArray, RedirectUrl);
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 100);

                }
            })
            .catch(function handleError(error) {
                console.error('Console.save: No data ' + error + " " + JSON.stringify(error));
                var reloadCount = localStorage.getItem("ReloadCount");
                // handle errors here
                if (reloadCount < 3) {
                    localStorage.setItem("ReloadCount", (parseInt(reloadCount) + 1));
                    setTimeout(function () {
                        navigate('/'); //Reload to get product
                        // navigate( '/home')
                    }, 1000)
                    // navigate('/home')
                }
            })
    }


    //Getting the receipt and tax setting--------------------        

    const [respReceiptSetting, respTaxSetting, resProlductCount] = useSelector((state) => [state.receiptsetting, state.taxsetting, state.productcount])

    if (respReceiptSetting && respReceiptSetting.status == STATUSES.IDLE && respReceiptSetting.is_success) {
        localStorage.setItem('orderreciept', JSON.stringify(respReceiptSetting.data.content))
    }
    if (respTaxSetting && respTaxSetting.status == STATUSES.IDLE && respTaxSetting.is_success) {
        localStorage.setItem('TAX_SETTING', JSON.stringify(respTaxSetting.data.content))
    }
    if (resProlductCount && resProlductCount.status == STATUSES.IDLE && resProlductCount.is_success) {
        localStorage.setItem('productcount', JSON.stringify(resProlductCount.data.content.count))

    }

    let useCancelled = false;
    useEffect(() => {
        if (useCancelled == false) {
            fetchData()
        }
        return () => {
            useCancelled = true;
        }
    }, []);

    let useApiCancelled = false;
    useEffect(() => {
        if (useApiCancelled == false) {
            getProductList(1, Config.key.FETCH_PRODUCTS_PAGESIZE, 0);
        }
        return () => {
            useApiCancelled = true;
        }
    }, [])

    const fetchData = async () => { //calling multiple api

        var udid = get_UDid(localStorage.getItem("UDID"));
        dispatch(productCount(udid));
        dispatch(receiptSetting());
        dispatch(taxSetting());

    }



    //  this.getProductList(1, Config.key.FETCH_PRODUCTS_PAGESIZE, [], pcount);
    return <div>
        <h1>Product Loading...</h1>
        <h2> {loadingProducts} ( {loadPerc})% </h2>;
        ;
    </div>
}

export default ProductLoader