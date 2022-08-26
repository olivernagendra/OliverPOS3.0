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

//import LoaderOnboarding from '../onboarding/components/LoaderOnboarding'
const ProductLoader = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [loadingProducts, setLoadingProducts] = useState(0)
    const [loadPerc, setLoadPerc] = useState(0)


    const UpdateIndexDB = (udid, ProductArray, RedirectUrl) => {
        var TotaltotalRecord = localStorage.getItem('productcount');
        var _perc = 0;
        if (ProductArray && ProductArray.length > 0 && TotaltotalRecord && TotaltotalRecord > 0) {
            _perc = ((ProductArray.length * 100) / TotaltotalRecord).toFixed(0);
        }
        // this.setState({ loadPerc: _perc });    
        // const dbPromise = openDB("ProductDB", 1, {
        //     upgrade(db, oldVersion, newVersion, transaction) {
        //         db.createObjectStore(udid);
        //     },
        //     blocked() {
        //         // …
        //     },
        //     blocking() {
        //         // …
        //     },
        //     terminated() {
        //         // …
        //     },
        // });
        const dbPromise = openDB('POSDB', 1, {
            upgrade(db) {
                db.createObjectStore(udid);
            },
        });


        const idbKeyval = {
            async get(key) {
                const db = await dbPromise;
                return db.transaction(udid).objectStore(udid).get(key);
            },
            async set(key, val) {
                const db = await dbPromise;
                const tx = db.transaction(udid, 'readwrite');
                tx.objectStore(udid).put(val, key);
                return tx.complete;
            },
        };
        // for unique array----------------------
        const arrayUniqueByKey = [...new Map(ProductArray.map(item =>
            [item['WPID'], item])).values()];
        idbKeyval.set('ProductList', arrayUniqueByKey);

        idbKeyval.get('ProductList').then(val => {
            if (ProductArray.length == 0 || !val || val.length == 0 || val == null || val == "") {
                console.log("wait...");
            } else {
                if (ActiveUser.key.isSelfcheckout == true) {
                    // if(isMobileOnly == true){
                    //     navigate('/selfcheckout')
                    // }else{
                    //  navigate( '/selfcheckout');
                    //}

                }
                else {
                    // if(isMobileOnly == true){
                    //     navigate('/home')
                    // }else{
                    //     navigate( '/home');
                    // }
                }
            }
        })

        //------------------------------------------


    }
    const getProductList = (pn, pz, pl, trc) => {
        if (trc != 0) {
            var _perc = ((pl.length * 100) / trc).toFixed(0);
            setLoadingProducts("Synched " + pl.length + " Products, Out of " + trc + "");
            setLoadPerc(_perc);
            // this.setState({ loadingProducts: "Synched " + pl.length + " Products, Out of " + trc + "",loadPerc: _perc });          
        }

        var self = this;
        if (!localStorage.getItem('user') || !sessionStorage.getItem("issuccess")) {
            //redirectToURL()
            // navigate('/loginpin');
        }
        var RedirectUrl = ActiveUser.key.isSelfcheckout && ActiveUser.key.isSelfcheckout == true ? '/selfcheckout' : '/dashboard';

        var udid = get_UDid(localStorage.getItem("UDID"));
        var reloadCount = localStorage.getItem("ReloadCount") ? localStorage.getItem("ReloadCount") : 0;
        var WarehouseId = localStorage.getItem("WarehouseId") ? parseInt(localStorage.getItem("WarehouseId")) : 0;

        var pageNumber = pn;
        var pageSize = Config.key.FETCH_PRODUCTS_PAGESIZE;
        var PageSize = Config.key.FETCH_PRODUCTS_PAGESIZE;
        var ProductArray = pl;
        var TotaltotalRecord = trc;
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
        if (TotaltotalRecord == 0 && isDemoUser == false) {
            // navigate( RedirectUrl) ;  
            UpdateIndexDB(udid, ProductArray, RedirectUrl);
        }
        // call firstTime------------------
        //  call common service
        //  serverRequest.clientServiceRequest('GET', `/ShopData/GetProductPageUpdatedWithCount?udid=${udid}&pageNumber=${pageNumber}&pageSize=${PageSize}`, '')
        //dispatch(productLoader({ pageNumber, pageSize, WarehouseId }))
        //console.log("resData", resData)
        fetch(`${Config.key.OP_API_URL}/v1/Product/Records?pageNumber=${pageNumber}&pageSize=${PageSize}&WarehouseId=${WarehouseId}`, requestOptions)
            .then(response => {
                if (response.ok) { return response.json(); }
                throw new Error(response.statusText)  // throw an error if there's something wrong with the response
            })
            .then(function handleData(data) {
                var reloadCount = localStorage.getItem("ReloadCount");
                ProductArray = [...new Set([...ProductArray, ...data.content.Records])];

                //check dataExist into indexdb-------------------------
                var isExist = false;

                console.log("--------------Total Products count--------" + TotaltotalRecord);

                console.log("Test", TotaltotalRecord, ProductArray.length)
                if (isDemoUser == false && (TotaltotalRecord > ProductArray.length) && ((TotaltotalRecord != ProductArray.length) || pageNumber <= (TotaltotalRecord / PageSize * 1.0))) {
                    console.log("--------------Product list request time--------" + new Date());
                    // self.UpdateIndexDB(udid,ProductArray);
                    pageNumber++;
                    //console.log("ProductArray1",ProductArray.length)                   
                    getProductList(pageNumber, PageSize, ProductArray, TotaltotalRecord);
                }
                else {
                    console.log("--------------all records are done-----------");
                    //console.log("ProductArray2",ProductArray.length)                        

                    UpdateIndexDB(udid, ProductArray, RedirectUrl);
                    navigate('/dashboard');

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
                    navigate('/dashboard')
                }
            })
    }
    const UpdateCustomerInIndexDB = (udid, ProductArray) => {
        
        const dbPromise = openDB('POSDB', 1, {
            upgrade(db) {
                db.createObjectStore(udid);
            },
        });


        const idbKeyval = {
            async get(key) {
                const db = await dbPromise;
                return db.transaction(udid).objectStore(udid).get(key);
            },
            async set(key, val) {
                const db = await dbPromise;
                const tx = db.transaction(udid, 'readwrite');
                tx.objectStore(udid).put(val, key);
                return tx.complete;
            },
        };
        // for unique array----------------------
        const arrayUniqueByKey = [...new Map(ProductArray.map(item =>
            [item['WPId'], item])).values()];
        idbKeyval.set('CustomerList', arrayUniqueByKey);

        
        //------------------------------------------


    }
    const getCustomerList = (pn,  pl, trc) => {
        var udid = get_UDid(localStorage.getItem("UDID"));
        var pageNumber = pn;
        var PageSize = Config.key.FETCH_PRODUCTS_PAGESIZE;
        var CustomerArray = pl;
        var TotalRecord = trc;
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
        if (TotalRecord == 0 ) {
            UpdateCustomerInIndexDB(udid, CustomerArray);
        }
        // call firstTime------------------
        //  call common service
        fetch(`${Config.key.OP_API_URL}/v1/customers/GetPage?pageSize=${PageSize}&pageNumber=${pageNumber}`, requestOptions)
            .then(response => {
                if (response.ok) { return response.json(); }
                throw new Error(response.statusText)  // throw an error if there's something wrong with the response
            })
            .then(function handleData(data) {
                TotalRecord = data.content.Records.length;
                CustomerArray = [...new Set([...CustomerArray, ...data.content.Records])];
                //check dataExist into indexdb-------------------------
                if (isDemoUser == false && (TotalRecord >= PageSize) ) {
                    pageNumber++;
                    getCustomerList(pageNumber, CustomerArray, TotalRecord);
                }
                else {
                    console.log("--------------all customer records are done-----------"+CustomerArray.length);
                    UpdateCustomerInIndexDB(udid, CustomerArray);

                }
            })
            .catch(function handleError(error) {
                console.error('Console.save: No data ' + error + " " + JSON.stringify(error));
            })
    }


    //Getting the receipt and tax setting--------------------    
    // const [resProductLoad] = useSelector((state) => [state.productloader])
    // console.log("resProductLoad", resProductLoad)

    const [respReceiptSetting, respTaxSetting, resProlductCount] = useSelector((state) => [state.receiptsetting, state.taxsetting, state.productcount])
    // console.log("respReceiptSetting", respTaxSetting)

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



    const fetchData = async () => { //calling multiple api
        var isDemoUser = localStorage.getItem('demoUser') == 'true' && localStorage.getItem('DemoGuid');
        var RedirectUrl = ActiveUser.key.isSelfcheckout && ActiveUser.key.isSelfcheckout == true ? '/selfcheckout' : '/dashboard';
        var udid = get_UDid(localStorage.getItem("UDID"));
        var pcount = localStorage.getItem('productcount');
        if (isDemoUser == false) {
            if (pcount == null || typeof (pcount) == 'undefined' || pcount == 0) {
                //navigate(RedirectUrl);
            }
            UpdateIndexDB(udid, [], RedirectUrl);
        }


        dispatch(productCount(udid));
        dispatch(receiptSetting());
        dispatch(taxSetting());

        //------------------------------------------------
        localStorage.setItem("ProductLoad", "true");
        console.log("--------------Product list request First time--------" + new Date());

        getProductList(1, Config.key.FETCH_PRODUCTS_PAGESIZE, [], pcount);
        getCustomerList(1,  [], 0);
        //------------------------------------------------- 
    }


    // if (respReceiptSetting && respReceiptSetting.is_success
    //     && respTaxSetting && respTaxSetting.is_success
    //     && resProlductCount && resProlductCount.is_success) {
    //To Clear indexDB----------------------------


    //}


    // const createIndexDB=(udid, ProductArray, RedirectUrl)=>{
    //     (async () => {
    //         if (!('indexedDB' in window)) {
    //             console.warn('IndexedDB not supported')
    //             return
    //           }

    //           const dbName = 'POSdb'
    //           const storeName = 'product_'+udid
    //           const version = 1 //versions start at 1

    //           //delete Database
    //           await deleteDB(dbName)


    //           const db = await openDB(dbName, version, {
    //             upgrade(db, oldVersion, newVersion, transaction) {
    //               const store = db.createObjectStore(storeName,{ autoIncrement: true })   //  "id"         
    //             }
    //           })
    //           const tx = db.transaction(storeName, 'readwrite')
    //           const store = await tx.objectStore(storeName)

    //           const val = 'hey!'
    //           const key = 'Hello again'
    //           ProductArray.forEach(element => {
    //              const value =  store.put(element)
    //           });

    //           await tx.done

    //         })()
    // }


    //  this.getProductList(1, Config.key.FETCH_PRODUCTS_PAGESIZE, [], pcount);
    return <div>
        <h1>Product Loading...</h1>
        <h2> {loadingProducts} ( {loadPerc})% </h2>;
        ;
    </div>
}

export default ProductLoader