import React, { useEffect, useState } from 'react';
import { get_UDid } from '../common/localSettings'
import { openDB ,unwrap} from 'idb';
import Config from '../../Config';
import { receiptSetting } from '../serverSetting/receiptSettingSlice';
import ActiveUser from '../../settings/ActiveUser';
import { useDispatch, useSelector } from 'react-redux';
import { taxSetting } from '../serverSetting/taxSettingSlice';
import STATUSES from '../../constants/apiStatus';
//import LoaderOnboarding from '../onboarding/components/LoaderOnboarding'
const ProductLoader =()=>{
 
   const dispatch =useDispatch()
    //Getting the receipt and tax setting--------------------    
    const [respReceiptSetting,respTaxSetting]= useSelector((state) => [state.receiptsetting,state.taxsetting])
    console.log("respReceiptSetting",respReceiptSetting,respTaxSetting)
   
    if ( respReceiptSetting && respReceiptSetting.status == STATUSES.IDLE && respReceiptSetting.is_success) {
        localStorage.setItem('orderreciept', JSON.stringify(respReceiptSetting.data.content))
    } 
    if ( respTaxSetting && respTaxSetting.status == STATUSES.IDLE && respTaxSetting.is_success) {
        localStorage.setItem('TAX_SETTING', JSON.stringify(respTaxSetting.data.content))
    }     
        useEffect(() => {
            fetchData()
        }, []);
     
     const fetchData = async () => { //calling multiple api
        dispatch(receiptSetting());
        dispatch(taxSetting());
     }
     //------------------------------------------------- 


     
//     const getProductList=(pn, pz, pl, trc)=> {
//         if (trc != 0) {
//             var _perc=((pl.length*100)/trc).toFixed(0);
//            // this.setState({ loadingProducts: "Synched " + pl.length + " Products, Out of " + trc + "",loadPerc: _perc });          
//         }

//         var self = this;
//         if (!localStorage.getItem('user') || !sessionStorage.getItem("issuccess")) {
//             //redirectToURL()
//             // history.push('/loginpin');
//         }
//         var RedirectUrl = ActiveUser.key.isSelfcheckout && ActiveUser.key.isSelfcheckout == true ? '/selfcheckout' : '/shopview';

//         var udid = get_UDid(localStorage.getItem("UDID"));
//         var reloadCount = localStorage.getItem("ReloadCount") ? localStorage.getItem("ReloadCount") : 0;
//         var WarehouseId = localStorage.getItem("WarehouseId") ? parseInt(localStorage.getItem("WarehouseId")) : 0;

//         var pageNumber = pn;
//         var PageSize = Config.key.FETCH_PRODUCTS_PAGESIZE;
//         var ProductArray = pl;
//         var TotaltotalRecord = trc;
//         const requestOptions = {
//             method: 'GET',
//             headers: {
//                 "access-control-allow-origin": "*",
//                 "access-control-allow-credentials": "true",
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'Authorization': 'Basic ' + btoa(sessionStorage.getItem("AUTH_KEY")),
//             }
//             , mode: 'cors'
//         };
//         var isDemoUser =localStorage.getItem('demoUser') == 'true' && localStorage.getItem('DemoGuid');
//         if (isDemoUser==true) {
//             requestOptions.headers['demoauth'] = localStorage.getItem('DemoGuid') && localStorage.getItem('DemoGuid')
//         }
//         if (TotaltotalRecord == 0 && isDemoUser==false) {
//             // window.location = RedirectUrl ;  
//             self.UpdateIndexDB(udid, ProductArray, RedirectUrl);
//         }
//         // call firstTime------------------
//         //  call common service
//         //  serverRequest.clientServiceRequest('GET', `/ShopData/GetProductPageUpdatedWithCount?udid=${udid}&pageNumber=${pageNumber}&pageSize=${PageSize}`, '')

//         fetch(`${Config.key.OP_API_URL}/v1/Product/Records?pageNumber=${pageNumber}&pageSize=${PageSize}&WarehouseId=${WarehouseId}`, requestOptions)
//             .then(response => {
//                 if (response.ok) { return response.json(); }
//                 throw new Error(response.statusText)  // throw an error if there's something wrong with the response
//             })
//             .then(function handleData(data) {
//                 var reloadCount = localStorage.getItem("ReloadCount");
//                 ProductArray = [...new Set([...ProductArray, ...data.content.Records])];
               
//                 //check dataExist into indexdb-------------------------
//                 var isExist = false;
                      
//                 console.log("--------------Total Products count--------" + TotaltotalRecord);               
               
//                 console.log("Test", TotaltotalRecord, ProductArray.length)
//                 if (isDemoUser==false && (TotaltotalRecord > ProductArray.length) && ((TotaltotalRecord != ProductArray.length) || pageNumber <= (TotaltotalRecord / PageSize * 1.0))) {
//                     console.log("--------------Product list request time--------" + new Date());
//                     // self.UpdateIndexDB(udid,ProductArray);
//                     pageNumber++;
//                     //console.log("ProductArray1",ProductArray.length)                   
//                     self.getProductList(pageNumber, PageSize, ProductArray, TotaltotalRecord);
//                 }
//                 else {
//                     console.log("--------------all records are done-----------");
//                     //console.log("ProductArray2",ProductArray.length)                        
             
//                     self.UpdateIndexDB(udid, ProductArray, RedirectUrl);
//                     //history.push('/shopview');

//                 }
//             })
//             .catch(function handleError(error) {
//                 console.error('Console.save: No data ' + error + " " + JSON.stringify(error));
//                 var reloadCount = localStorage.getItem("ReloadCount");
//                 // handle errors here
//                 if (reloadCount < 3) {
//                     localStorage.setItem("ReloadCount", (parseInt(reloadCount) + 1));
//                     setTimeout(function () {
//                         window.location = '/'; //Reload to get product
//                         // window.location = '/shopview'
//                     }, 1000)
//                     //history.push('/')
//                 }
//             })
//     }
  const  updateIndexDB=(udid, ProductArray, RedirectUrl)=> {
        var TotaltotalRecord = localStorage.getItem('productcount');        
        var _perc=0;
        if(ProductArray && ProductArray.length>0 && TotaltotalRecord && TotaltotalRecord>0)
        {_perc= ((ProductArray.length*100)/TotaltotalRecord).toFixed(0);
        }
       // this.setState({ loadPerc: _perc });    
        
        // const dbPromise = openDB('ProductDB', 1, upgradeDB => {
        //     upgradeDB.createObjectStore(udid);
        // });
        const dbPromise =  openDB("ProductDB", 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                db.createObjectStore(udid);
            },
            blocked() {
              // …
            },
            blocking() {
              // …
            },
            terminated() {
              // …
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
                    //     history.push('/selfcheckout')
                    // }else{
                      //  window.location = '/selfcheckout';
                    //}
                   
                }
                else {
                    // if(isMobileOnly == true){
                    //     history.push('/shopview')
                    // }else{
                    //     window.location = '/shopview';
                    // }
                }
            }
        })

        //------------------------------------------


    }


     //To Clear indexDB----------------------------
     var isDemoUser = localStorage.getItem('demoUser') ? localStorage.getItem('demoUser') : false;
     var RedirectUrl = ActiveUser.key.isSelfcheckout && ActiveUser.key.isSelfcheckout == true ? '/selfcheckout' : '/shopview';
     var udid = get_UDid(localStorage.getItem("UDID"));
     var pcount = localStorage.getItem('productcount');
     if(isDemoUser ==false){
         if (pcount == null || typeof (pcount) == 'undefined' || pcount == 0) {
            // window.location = RedirectUrl;
         }
        //  const db =  openDB("ProductDB1", 1, {
        //     upgrade(db, oldVersion, newVersion, transaction) {
        //         db.createObjectStore(udid);
        //     },
        //     blocked() {
        //       // …
        //     },
        //     blocking() {
        //       // …
        //     },
        //     terminated() {
        //       // …
        //     },
        //   });
          
         
         updateIndexDB(udid, [], RedirectUrl);
     }
     //------------------------------------------------
     localStorage.setItem("ProductLoad", "true");
     console.log("--------------Product list request First time--------" + new Date());

   //  this.getProductList(1, Config.key.FETCH_PRODUCTS_PAGESIZE, [], pcount);
    return <div>
        Product Loading...
    </div>
}

export default ProductLoader