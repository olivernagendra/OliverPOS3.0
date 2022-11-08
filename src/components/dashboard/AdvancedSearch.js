import React, { useEffect, useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import X_Icon_DarkBlue from '../../assets/images/svg/X-Icon-DarkBlue.svg';
import down_angled_bracket from '../../assets/images/svg/down-angled-bracket.svg';
import BlueDot from '../../assets/images/svg/BlueDot.svg';
import ViewIcon from '../../assets/images/svg/ViewIcon.svg';
import Add_Icon_White from '../../assets/images/svg/Add-Icon-White.svg';
import Transactions_Icon_White from '../../assets/images/svg/Transactions-Icon-White.svg';
import CircledPlus_Icon_Blue from '../../assets/images/svg/CircledPlus-Icon-Blue.svg';
import Search_Icon_Blue from '../../assets/images/svg/Search-Icon-Blue.svg';
import AdvancedSearchCancelIcon from '../../assets/images/svg/AdvancedSearchCancelIcon.svg';

import { useIndexedDB } from 'react-indexed-db';
import { AddItemType } from "../common/EventFunctions";
// import { toggleSubwindow } from "../common/EventFunctions";
import { getTaxAllProduct } from '../common/TaxSetting'
import { addSimpleProducttoCart } from "./product/productLogic";
import { product } from "./product/productSlice";
import { getInventory } from "./slices/inventorySlice";
import CommonModuleJS from "../../settings/CommonModuleJS";
import LocalizedLanguage from "../../settings/LocalizedLanguage";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
=======
import { postMeta, getPostMeta } from "../common/commonAPIs/postMetaSlice";
>>>>>>> devPraveen
const AdvancedSearch = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { getAll } = useIndexedDB("products");

    const [allProductList, setAllProductList] = useState([]);
    const [allCustomerList, setAllCustomerList] = useState([]);
    const [allGroupList, setAllGroupList] = useState([]);

    const [filteredProductList, setFilteredProductList] = useState([]);
    const [filteredCustomer, setFilteredCustomer] = useState([]);
    const [filteredGroup, setFilteredGroup] = useState([]);

    const [filterType, setFilterType] = useState('all');
    const [serachString, setSerachString] = useState('');
    const [serachCount, setSerachCount] = useState(0);
    const [isShowDDNSearch, setisShowDDNSearch] = useState(false)
    const [searchHistory, setSearchHistory] = useState([])
    const [allowGroup, setAllowGroup] = useState(false)
    const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : "");
    const [respGroup] = useSelector((state) => [state.group])

    const limitArrayByNum = (arr, num) => {
        let _arr = arr;
        if (_arr && _arr.length > 10) { _arr = _arr.slice(0, num); }
        return _arr;
    }
    const toggleDDNSearch = () => {
        setisShowDDNSearch(!isShowDDNSearch)
    }
    const getProductFromIDB = () => {
        getAll().then((rows) => {
            var allProdcuts = getTaxAllProduct(rows);
            allProdcuts = allProdcuts.filter(a => a.ParentId == 0);
            let _allp = allProdcuts;
            // if (_allp && _allp.length > 10) { _allp = _allp.slice(0, 10); }
            setAllProductList(_allp);
            //setFilteredProductList(_allp ? _allp : []);
            setSerachCount(_allp.length);
            setSerachCount(_allp.length + allCustomerList.length + filteredGroup.length);
        });
    }
    const handleSearch = (event) => {
        let value = event.target.value;
        if (value === "") {
            setFilteredCustomer([]);
            setFilteredProductList([]);
            setFilteredGroup([]);
        }
        setSerachString(value)
    }
    const SetFilter = (ftype) => {
        setisShowDDNSearch(false)
        setFilterType(ftype);
    }
    const GetCustomerFromIDB = () => {
        useIndexedDB("customers").getAll().then((rows) => {
            let _allc = rows;
            //if (_allc && _allc.length > 10) { _allc = _allc.slice(0, 10); }
            setAllCustomerList(_allc);
            setSerachCount(_allc.length + allProductList.length + filteredGroup.length);
        });

    }
    const resGetPostMeta = useSelector((state) => state.getPostMeta)
    if (resGetPostMeta && resGetPostMeta.is_success == true) {
        if (resGetPostMeta.data && resGetPostMeta.data.content && resGetPostMeta.data.content.Slug == user.user_id + "_searchHistory") {
            localStorage.setItem(user.user_id + "_searchHistory", resGetPostMeta.data.content.Value)
            setTimeout(() => {
                Search_History('');
            }, 100);
            //console.log("----resGetPostMeta.data.content--"+JSON.stringify(resGetPostMeta.data.content))
        }
    }

    let useCancelled = false;
    useEffect(() => {
        if (useCancelled == false) {
            getProductFromIDB()
            GetCustomerFromIDB()

            //var user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : "";
            //user.user_id
            if (user != "") {
                var parma = user.user_id + "_searchHistory";
                dispatch(getPostMeta(parma));
            }


            if (user.group_sales && user.group_sales !== null && user.group_sales !== "" && user.group_sales !== "undefined" && user.group_sales === true) {
                setAllowGroup(true);
            }
            else {
                setAllowGroup(false);
            }
        }
        return () => {
            useCancelled = true;
        }
    }, []);

    useEffect(() => {
        if (respGroup && respGroup.data && respGroup.data.content) {
            if (respGroup.data.is_success == true) {
                var _allg = respGroup.data.content;
                // if (_allg && _allg.length > 10) { _allg = _allg.slice(0, 10); }
                setAllGroupList(_allg);
                setSerachCount(allProductList.length + allCustomerList.length + _allg.length);
            }
        }
    }, [respGroup])

    var _SubCategory = [];
    const retrunItrateLoop = (found, filterCategoryCode) => {
        var setSubCategory = _SubCategory;// localStorage.getItem("setSubCategory") ? JSON.parse(localStorage.getItem("setSubCategory")) : [];
        filterCategoryCode.push(found.Code)
        if (found && found.Subcategories && found.Subcategories.length > 0) {
            found.Subcategories.map(element => {
                setSubCategory.push(element)
                filterCategoryCode.push(element.Code)
                if (element && element.Subcategories && element.Subcategories.length > 0) {
                    retrunItrateLoop(element, filterCategoryCode)
                }
            })
            // const arrayUniqueByKey = [...new Map(setSubCategory.map(item =>
            //     [item['Code'], item])).values()];
            const arrayUniqueByKeyArray = [...new Map(filterCategoryCode.map(item =>
                [item, item])).values()];
            _SubCategory = arrayUniqueByKeyArray;
            //localStorage.setItem("setSubCategory", JSON.stringify(arrayUniqueByKey))
            return arrayUniqueByKeyArray
        }
        return filterCategoryCode
    }

    useEffect(() => {
        productDataSearch(serachString);
    }, [filterType]);

    useEffect(() => {
        productDataSearch(serachString);
    }, [serachString]);


    const Search_History = (e) => {
        //var user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : "";
        var sArray = [];
        if (e != "" && e.target.value.trim() != "") {
            let _sValue = e.target.value.trim();
            if (localStorage.getItem(user.user_id + "_searchHistory")) {
                sArray = JSON.parse(localStorage.getItem(user.user_id + "_searchHistory"));
                let result = sArray.some(item => _sValue === item);
                if (result == false) {
                    if (sArray && sArray.length >= 10) {
                        sArray.pop();
                    }
                    sArray = [_sValue].concat(sArray)
                }
            }
            else {
                let result = sArray.some(item => _sValue === item);
                if (result == false) {
                    sArray = [_sValue].concat(sArray);
                }
            }

            setSearchHistory(sArray);
            if (user && user.user_id) {
                localStorage.setItem(user.user_id + "_searchHistory", JSON.stringify(sArray));
                var parma = { "Slug": user.user_id + "_searchHistory", "Value": JSON.stringify(sArray), "Id": 0, "IsDeleted": 0 };
                dispatch(postMeta(parma));
            }

        }
        else {
            // if (localStorage.getItem("searchHistory")) {
            //     sArray = JSON.parse(localStorage.getItem("searchHistory"));
            //     setSearchHistory(sArray);
            // }
            if (localStorage.getItem(user.user_id + "_searchHistory")) {
                if (user && user.user_id) {
                    sArray = JSON.parse(localStorage.getItem(user.user_id + "_searchHistory"));
                    setSearchHistory(sArray);
                }
            }
        }
        //setSearchHistory();
    }
    const productDataSearch = (item1) => {
        if (item1 == '') {
            return;
            if (filterType === "product" || filterType === "customer" || filterType === "group" || filterType === "all") {
                if (filterType === "product") {

                    let _allp = limitArrayByNum(allProductList, 10);
                    // let _allp = allProductList;
                    // if (_allp && _allp.length > 10) { _allp = _allp.slice(0, 10); }
                    setFilteredProductList(_allp);
                    setSerachCount(_allp.length);
                    setFilteredCustomer([]);
                    setFilteredGroup([]);
                }
                else if (filterType === "customer") {
                    let _allc = limitArrayByNum(allCustomerList, 10);
                    // let _allc = allCustomerList;
                    // if (_allc && _allc.length > 10) { _allc = _allc.slice(0, 10); }
                    setFilteredCustomer(_allc);
                    setSerachCount(_allc.length);
                    setFilteredProductList([]);
                    setFilteredGroup([]);
                }
                else if (filterType === "group") {
                    let _allg = [];
                    if (respGroup && respGroup.data && respGroup.data.content) {
                        _allg = limitArrayByNum(respGroup.data.content, 10);
                        // _allg = respGroup.data.content;
                        // if (_allg && _allg.length > 10) { _allg = _allg.slice(0, 10); }
                        setFilteredGroup(_allg);
                        setSerachCount(_allg.length);
                        setFilteredProductList([]);
                        setFilteredCustomer([]);
                    }
                }
                else if (filterType === "all") {
                    let _count = 0;
                    // let _allp = allProductList;
                    // if (_allp && _allp.length > 10) { _allp = _allp.slice(0, 10); }
                    let _allp = limitArrayByNum(allProductList, 10);
                    setFilteredProductList(_allp);
                    _count += _allp.length;

                    // let _allc = allCustomerList;
                    // if (_allc && _allc.length > 10) { _allc = _allc.slice(0, 10); }
                    let _allc = limitArrayByNum(allCustomerList, 10);
                    setFilteredCustomer(_allc);
                    _count += _allc.length;

                    if (allowGroup === true) {
                        let _allg = [];
                        if (respGroup && respGroup.data && respGroup.data.content) {
                            // _allg = respGroup.data.content;
                            // if (_allg && _allg.length > 10) { _allg = _allg.slice(0, 10); }
                            _allg = limitArrayByNum(respGroup.data.content, 10);
                            setFilteredGroup(_allg);
                            _count += _allg.length;
                        }
                    }
                    setSerachCount(_count);
                }
            }
            return;
        }
        var _filtered = [];
        var _filteredCustomer = [];
        var _filteredGroup = [];
        var value = item1;
        var scount = 0;
        if (filterType === "product" || filterType === "all") {
            // Search in Products
            var serchFromAll = allProductList.filter((item) => (
                (item.Title && item.Title.toLowerCase().includes(value.toLowerCase()))
                || (item.Barcode && item.Barcode.toString().toLowerCase().includes(value.toLowerCase()))
                || (item.Sku && item.Sku.toString().toLowerCase().includes(value.toLowerCase()))
            ))
            //-------//Filter child and parent-------------
            var parentArr = [];
            serchFromAll && serchFromAll.map(item => {
                if (item.ParentId !== 0) {
                    var parrentofChild = allProductList.find(function (element) {
                        return (element.WPID === item.ParentId)
                    });
                    if (parrentofChild)
                        parentArr.push(parrentofChild);
                }
            })
            serchFromAll = [...new Set([...serchFromAll, ...parentArr])];
            if (!serchFromAll || serchFromAll.length > 0) {
                var parentProduct = serchFromAll.filter(item => {
                    return (item.ParentId === 0)
                })
                parentProduct = parentProduct ? parentProduct : []
                _filtered = [...new Set([..._filtered, ...parentProduct])];

                if (_filtered && _filtered.length > 10) { _filtered = _filtered.slice(0, 10); }
            }
            scount += _filtered.length;
        }
        if (filterType === "customer" || filterType === "all") {
            // Search in Customer
            _filteredCustomer = allCustomerList.filter((item) => (
                (item.FirstName && item.FirstName.toLowerCase().includes(value.toLowerCase()))
                || (item.LastName && item.LastName.toString().toLowerCase().includes(value.toLowerCase()))
                || (item.Contact && item.Contact.toString().toLowerCase().includes(value.toLowerCase()))
                || (item.Email && item.Email.toString().toLowerCase().includes(value.toLowerCase()))
            ))
            if (_filteredCustomer && _filteredCustomer.length > 10) { _filteredCustomer = _filteredCustomer.slice(0, 10); }
            //setFilteredCustomer(_filteredCustomer);
            scount += _filteredCustomer.length;
        }
        if ((filterType === "group" || filterType === "all") && allowGroup === true) {
            //if (respGroup && respGroup.data && respGroup.data.content) {
            _filteredGroup = allGroupList.filter((item) => (
                (item.Label && item.Label.toLowerCase().includes(value.toLowerCase()))))

            scount += _filteredGroup.length;
            //}
        }

        if (_filtered && _filtered.length > 0) {
            _filtered = AddItemType(_filtered, "product");
        }

        setFilteredCustomer(_filteredCustomer);
        setFilteredProductList(_filtered);
        setFilteredGroup(_filteredGroup);
        setSerachCount(scount);
    }
    // updated on 27sep2022: check permission for product x
    const addToCart = (item) => {
        let type = item.Type;
        if ((type !== "simple" && type !== "variable") && (CommonModuleJS.showProductxModal() !== null && CommonModuleJS.showProductxModal() == false)) {
            alert(LocalizedLanguage.productxOutOfStock);
        }
        else {
            var result = addSimpleProducttoCart(item);
            if (result === 'outofstock') {
                props.toggleOutOfStock();
            }
            else {
                dispatch(product());
                setSerachString('');
                props.toggleAdvancedSearch();
            }
        }
    }
    // careated by : 
    // description
    // update by: Nagendra Suryawanshi
    // updated description: call api to get warehouse quantity of the product
    // updated on 27sep2022: check permission for product x
    const viewProduct = (item) => {
        let type = item.Type;
        if ((type !== "simple" && type !== "variable") && (CommonModuleJS.showProductxModal() !== null && CommonModuleJS.showProductxModal() == false)) {
            alert(LocalizedLanguage.productxOutOfStock);
        }
        else {
            if (item.ManagingStock == true) {
                dispatch(getInventory(item.WPID)); //call to get product warehouse quantity
            }
            setTimeout(() => {
                props.openPopUp(item);
                props.fatchUpdateInventory && props.fatchUpdateInventory()
            }, 100);

            setSerachString('');
            props.toggleAdvancedSearch();
        }
    }
    const addCustomerToSale = (cutomer_data) => {
        var data = cutomer_data;
        localStorage.setItem('AdCusDetail', JSON.stringify(data))
        var list = localStorage.getItem('CHECKLIST') !== null ? (typeof localStorage.getItem('CHECKLIST') !== 'undefined') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null : null;
        if (list != null) {
            const CheckoutList = {
                ListItem: list.ListItem,
                customerDetail: data ? data : [],
                totalPrice: list.totalPrice,
                discountCalculated: list.discountCalculated,
                tax: list.tax,
                subTotal: list.subTotal,
                TaxId: list.TaxId,
                TaxRate: list.TaxRate,
                oliver_pos_receipt_id: list.oliver_pos_receipt_id,
                order_date: list.order_date,
                order_id: list.order_id,
                status: list.status,
                showTaxStaus: list.showTaxStaus,
                _wc_points_redeemed: list._wc_points_redeemed,
                _wc_amount_redeemed: list._wc_amount_redeemed,
                _wc_points_logged_redemption: list._wc_points_logged_redemption
            }
            localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList))
        }
        dispatch(product());
        setSerachString('');
        props.toggleAdvancedSearch();
    }
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            setSerachString('');
            props.toggleAdvancedSearch();
        }
    }
    const closePopUp = () => {
        setSerachString('');
        props.toggleAdvancedSearch();
    }
    const clearSearch = () => {
        setSerachString('');
        setFilteredCustomer([]);
        setFilteredProductList([]);
        setFilteredGroup([]);
    }
    const viewCustomertransaction = (email) => {
        sessionStorage.setItem("transactionredirect", email);
        navigate('/transactions')
    }
    return <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}><div className={props.isShow === true ? "subwindow advanced-search current" : "subwindow advanced-search"}>
        <div className="subwindow-header">
            <p>Advanced Search</p>
            <button className="close-subwindow" onClick={() => closePopUp()}>
                <img src={X_Icon_DarkBlue} alt="" />
            </button>
            <div className="input-wrapper" id="advSearchInputWrapper">
<<<<<<< HEAD
                <input type="text" id="advancedSearchBar" value={serachString} placeholder="Start typing to search..." onChange={e => handleSearch(e)} onBlur={e => Search_History(e)} autocomplete="off" />
=======
                <input type="text" id="advancedSearchBar" value={serachString} placeholder="Start typing to search..." onChange={e => handleSearch(e)} onBlur={e => Search_History(e)} autoComplete="off" />
>>>>>>> devPraveen
                <img src={Search_Icon_Blue} alt="" id="advSearchInputIcon" />
                <button id="advSearchInputCancel" onClick={() => clearSearch()}>
                    <img src={AdvancedSearchCancelIcon} alt="" />
                </button>
            </div>
        </div>
        <div className="subwindow-body">
            <div className="left-col">
                <p>Search by</p>
                <div className="radio-group">
                    <div id="mobileSearchModToggle" className={isShowDDNSearch === true ? "dropdown-input open" : "dropdown-input"} onClick={() => toggleDDNSearch()}>
                        <p><b>Search for:</b> All Results</p>
                        <img src={down_angled_bracket} alt="" />
                    </div>
                    <label onClick={() => SetFilter('all')}>
                        <input type="radio" id="allResults" name="search_modifier" value="allResults" defaultChecked={filterType === 'all' ? true : false} />
                        <div className="custom-radio" >
                            <img src={BlueDot} alt="" />
                        </div>
                        <p>All Results</p>
                    </label>
                    <label onClick={() => SetFilter('product')}>
                        <input type="radio" id="products" name="search_modifier" value="products" defaultChecked={filterType === 'product' ? true : false} />
                        <div className="custom-radio" >
                            <img src={BlueDot} alt="" />
                        </div>
                        <p>Products</p>
                    </label>
                    <label onClick={() => SetFilter('customer')}>
                        <input type="radio" id="customers" name="search_modifier" value="customers" defaultChecked={filterType === 'customer' ? true : false} />
                        <div className="custom-radio" >
                            <img src={BlueDot} alt="" />
                        </div>
                        <p>Customers</p>
                    </label>
                    {allowGroup === true ?
                        <label onClick={() => SetFilter('group')}>
                            <input type="radio" id="groups" name="search_modifier" value="groups" defaultChecked={filterType === 'group' ? true : false} />
                            <div className="custom-radio" >
                                <img src={BlueDot} alt="" />
                            </div>
                            <p>Groups</p>
                        </label> : null}
                </div>
                <p>Recent Searches</p>
                <div className="recent-searches">
                    {searchHistory && searchHistory.map(s => {
                        return (<a key={s} href="#" onClick={() => setSerachString(s)}>{s}</a>)
                    })}

                </div>
            </div>
            <div className="right-col">
                {/* Will only appear if right col is empty besides start-searching element  */}
                {filteredCustomer.length === 0 && filteredGroup.length === 0 && filteredProductList.length === 0 && serachString === "" ?
                    <div className="start-searching display-flex">
                        <img src={Search_Icon_Blue} alt="" />
                        <p className="style1">Start searching to display results.</p>
                        <p className="style2">Search for any product, customer <br /> or group to display results.</p>
                    </div> :
                    <React.Fragment>
                        <div className="header">
                            <p><b>Results</b> ({serachCount} search results)</p>
                        </div>
                        <div className="body">
                            <div className="no-results">
                                <p className="style1">No results found.</p>
                                <p className="style2">
                                    Sorry, your search did not match any results. <br />
                                    Try double checking your spelling or <br />
                                    searching for a similar product.
                                </p>
                                <div className="divider"></div>
                                <p className="style2">Customer not found? Try creating a new customer:</p>
                                <button onClick={() => props.toggleCreateCustomer(serachString)}  >
                                    <img src={CircledPlus_Icon_Blue} alt="" />
                                    Create New Customer
                                </button>
                            </div>


                            {
                                filteredProductList && filteredProductList.map((item, index) => {
                                    return <div className="search-result product" key={item.WPID}>
                                        <div className="col">

                                            <p className="style1">Product</p>
                                            <p className="style2">{item.Title}</p>
                                            {/* <p className="style3">Funky Shoe Co.</p> */}
                                            <p className="style3">${item.Price}</p>
                                            <p className="style3">SKU# {item.Sku}</p>
                                        </div>
                                        <div className="row">
                                            <button className="search-view" onClick={() => viewProduct(item)}>
                                                <img src={ViewIcon} alt="" />
                                                View
                                            </button>
                                            <button className="search-add-to-sale" onClick={() => item.Type != "simple" ? viewProduct(item) : addToCart(item)}>
                                                <img src={Add_Icon_White} alt="" />
                                                Add to Sale
                                            </button>
                                        </div>
                                    </div>
                                })
                            }
                            {
                                filteredCustomer && filteredCustomer.map((item, index) => {
                                    return <div className="search-result customer" key={item.Email + "_" + index}>
                                        <div className="col">
                                            <p className="style1">Customer</p>
                                            <p className="style2">{item.FirstName + " " + item.LastName}</p>
                                            <p className="style3">{item.Email}</p>
                                            <p className="style3">{item.Contact}</p>
                                        </div>
                                        <div className="row">
                                            <button className="search-view">
                                                <img src={ViewIcon} alt="" />
                                                View
                                            </button>
                                            <button className="search-transactions" onClick={() => viewCustomertransaction(item.Email)} >
                                                <img src={Transactions_Icon_White} alt="" />
                                                Transactions
                                            </button>
                                            <button className="search-add-to-sale" onClick={() => addCustomerToSale(item)}>
                                                <img src={Add_Icon_White} alt="" />
                                                Add to Sale
                                            </button>
                                        </div>
                                    </div>
                                })}
                            {
                                filteredGroup && filteredGroup.map((item, index) => {
                                    return <div className="search-result group">
                                        <div className="col">
                                            <p className="style1">{item.GroupName}</p>
                                            <p className="style2">{item.Label}</p>
                                            <p className="style3">Party of 6</p>
                                            <p className="style3">Server: Freddy Mercury</p>
                                            <p className="style3">Order total: $223.45</p>
                                        </div>
                                        <div className="row">
                                            <button className="search-view">
                                                <img src={ViewIcon} alt="" />
                                                View
                                            </button>
                                            <button className="search-transactions">
                                                <img src={Transactions_Icon_White} alt="" />
                                                Transactions
                                            </button>
                                            <button className="search-add-to-sale">
                                                <img src={Add_Icon_White} alt="" />
                                                Add to Sale
                                            </button>
                                        </div>
                                    </div>
                                })}
                            {/* <div className="search-result group">
                        <div className="col">
                            <p className="style1">Group</p>
                            <p className="style2">Moss Party (Table 5)</p>
                            <p className="style3">Party of 6</p>
                            <p className="style3">Server: Freddy Mercury</p>
                            <p className="style3">Order total: $223.45</p>
                        </div>
                        <div className="row">
                            <button className="search-view">
                                <img src={ViewIcon} alt="" />
                                View
                            </button>
                            <button className="search-transactions">
                                <img src={Transactions_Icon_White} alt="" />
                                Transactions
                            </button>
                            <button className="search-add-to-sale">
                                <img src={Add_Icon_White} alt="" />
                                Add to Sale
                            </button>
                        </div>
                    </div>
                    <div className="search-result customer">
                        <div className="col">
                            <p className="style1">Customer</p>
                            <p className="style2">Freddy Mercury</p>
                            <p className="style3">queen_of_rock@gmail.com</p>
                            <p className="style3">1 (709) 123-4567</p>
                        </div>
                        <div className="row">
                            <button className="search-view">
                                <img src={ViewIcon} alt="" />
                                View
                            </button>
                            <button className="search-transactions">
                                <img src={Transactions_Icon_White} alt="" />
                                Transactions
                            </button>
                            <button className="search-add-to-sale">
                                <img src={Add_Icon_White} alt="" />
                                Add to Sale
                            </button>
                        </div>
                    </div> */}
                        </div>
                    </React.Fragment>}
            </div>
        </div>
    </div></div >
}

export default AdvancedSearch 