import React, { useEffect, useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import X_Icon_DarkBlue from '../../images/svg/X-Icon-DarkBlue.svg';
import down_angled_bracket from '../../images/svg/down-angled-bracket.svg';
import BlueDot from '../../images/svg/BlueDot.svg';
import ViewIcon from '../../images/svg/ViewIcon.svg';
import Add_Icon_White from '../../images/svg/Add-Icon-White.svg';
import Transactions_Icon_White from '../../images/svg/Transactions-Icon-White.svg';
import CircledPlus_Icon_Blue from '../../images/svg/CircledPlus-Icon-Blue.svg';

import { useIndexedDB } from 'react-indexed-db';
import { AddItemType } from "../common/EventFunctions";
import { toggleSubwindow } from "../common/EventFunctions";
import { getTaxAllProduct } from '../common/TaxSetting'
import { addSimpleProducttoCart } from "./product/productLogic";
import { product } from "./product/productSlice";
// const AdvancedSearch = (props) => {
//     const [respGroup] = useSelector((state) => [state.group])


const AdvancedSearch = (props) => {
    const dispatch = useDispatch();
    const [respGroup] = useSelector((state) => [state.group])
    const { add, update, getByID, getAll, deleteRecord } = useIndexedDB("products");
    const [allProductList, setAllProductList] = useState([])
    const [totalRecords, setTotalRecords] = useState(0)
    const [parentProductList, setParentProductList] = useState([])
    const [product_List, setProduct_List] = useState([])

    const [filtered, setfiltered] = useState([]);
    const [filteredCustomer, setfilteredCustomer] = useState([]);
    const [filteredGroup, setfilteredGroup] = useState([]);
    const [allCustomerList, setAllCustomerList] = useState([])
    const [filterType, setFilterType] = useState('all')
    const [serachString, setSerachString] = useState('')
    const getProductFromIDB = () => {
        var allData = [];
        getAll().then((rows) => {
            var allProdcuts = getTaxAllProduct(rows)
            //console.log("allProdcuts", allProdcuts)
            setAllProductList(allProdcuts)
            setParentProductList(allProdcuts)
            setTotalRecords(allProdcuts ? allProdcuts.length : 0);
            //For temporary
            setProduct_List(allProdcuts ? allProdcuts : []);
        });
    }
    const handleSearch=(event)=>
    {
        console.log("event" + event.target.value)
        var item1 = event.target.value;
        setSerachString(item1)
        productDataSearch(item1)
    }
    const SetFilter = (ftype) => {
        setFilterType(ftype);
        productDataSearch(serachString)
    }
    const GetCustomerFromIDB = () => {
        useIndexedDB("customers").getAll().then((rows) => {
            setAllCustomerList(rows);
        });
    }
    let useCancelled = false;
    useEffect(() => {
        if (useCancelled == false) {
            getProductFromIDB()
            GetCustomerFromIDB()
        }
        return () => {
            useCancelled = true;
        }


    }, []);

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

    const productDataSearch = (item1) => {
       
        setfiltered([]);
        if (item1 == '') {
            if (filterType === "product" || filterType === "all") {
                setProduct_List(allProductList);
            }
            return;
        }
        var _filtered = [];
        var value = item1;
        if (filterType === "product" || filterType === "all") {
            if(filterType==="product")
            {
                setfilteredCustomer([]);
            }
            
            // Search in Products
            var serchFromAll = product_List.filter((item) => (
                (item.Title && item.Title.toLowerCase().includes(value.toLowerCase()))
                || (item.Barcode && item.Barcode.toString().toLowerCase().includes(value.toLowerCase()))
                || (item.Sku && item.Sku.toString().toLowerCase().includes(value.toLowerCase()))
            ))
            //-------//Filter child and parent-------------
            var parentArr = [];
            serchFromAll && serchFromAll.map(item => {
                if (item.ParentId !== 0) {
                    var parrentofChild = product_List.find(function (element) {
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

                if(_filtered && _filtered.length>10)
                {_filtered = _filtered.slice(0, 10);}
            }
        }
        if (filterType === "customer" || filterType === "all") {
            if(filterType==="customer")
            {
                setProduct_List([]);
            }
            // Search in Customer
            var _filteredCustomer = allCustomerList.filter((item) => (
                (item.FirstName && item.FirstName.toLowerCase().includes(value.toLowerCase()))
                || (item.LastName && item.LastName.toString().toLowerCase().includes(value.toLowerCase()))
                || (item.Contact && item.Contact.toString().toLowerCase().includes(value.toLowerCase()))
                || (item.Email && item.Email.toString().toLowerCase().includes(value.toLowerCase()))
            ))
            console.log("---filteredCustomer---" + JSON.stringify(_filteredCustomer));
            setfilteredCustomer(_filteredCustomer);
        }
        // if(respGroup && respGroup.data && respGroup.data.content)
        // {
        //     var _filteredGroup = respGroup.data.content.filter((item) => (
        //         (item.Label && item.Label.toLowerCase().includes(value.toLowerCase()))))
        //         //console.log("---_filteredGroup---" + JSON.stringify(_filteredGroup));
        //         setfilteredGroup(_filteredGroup)
        // }

        // Search by Attributes
        parentProductList && parentProductList.map((item) => {
            item.ProductAttributes && item.ProductAttributes.map(attri => {
                if (String(attri.Slug).toLowerCase().toString().indexOf(String(value).toLowerCase()) !== -1 ||
                    String(attri.Name).toLowerCase().toString().indexOf(String(value).toLowerCase()) !== -1) {
                    _filtered.push(item)
                }
            })
        })
        // Search by Categories
        parentProductList && parentProductList.map((item) => {
            item.Categories && item.Categories !== undefined && item.Categories.split(",").map(category => {
                if (String(category).toLowerCase().toString().indexOf(String(value).toLowerCase()) !== -1) {
                    if (_filtered.indexOf(item) === -1) {
                        _filtered.push(item)
                    }
                }
            })
        })
        // Search by Sub Attributes
        parentProductList && parentProductList.map((item) => {
            item.ProductAttributes && item.ProductAttributes.map(proAtt => {
                var dataSplitArycomma = proAtt.Option.split(',');
                dataSplitArycomma && dataSplitArycomma !== undefined && dataSplitArycomma.map(opt => {
                    if (String(opt).toLowerCase().toString().indexOf(String(value).toLowerCase()) !== -1) {
                        if (_filtered.indexOf(item) === -1) {
                            _filtered.push(item)
                        }
                    }
                })
            })
        })

        //}
        // _filtered = [...new Map(_filtered.map(item =>
        //     [item, item])).values()];
        // console.log("----filtered---" + JSON.stringify(_filtered.length));
        //if(_filtered && _filtered.length>0)

        _filtered = _filtered.filter(item => {
            return (item.ParentId === 0)
        })
        console.log("----filtered--->>" + JSON.stringify(_filtered.length));
        _filtered = AddItemType(_filtered, "product");
        setProduct_List(_filtered);
        setfiltered(_filtered);

    }
    // console.log(allProductList)
    // console.log(totalRecords)
    // console.log(parentProductList)
    const addToCart = (item) => {
        var result = addSimpleProducttoCart(item);
        if (result === 'outofstock') {
            props.toggleOutOfStock();
        }
        else {
            dispatch(product());
            props.toggleAdvancedSearch();
        }
    }
    const viewProduct = (item) => {
        props.openPopUp(item);
        props.toggleAdvancedSearch();
        // toggleSubwindow();
    }
    const addCustomerToSale=(cutomer_data)=> {
        var data =cutomer_data;
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
    }
    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleAdvancedSearch();
        }
    }
    return <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}><div className={props.isShow === true ? "subwindow advanced-search current" : "subwindow advanced-search"}>
        <div className="subwindow-header">
            <p>Advanced Search</p>
            <button className="close-subwindow" onClick={() => props.toggleAdvancedSearch()}>
                <img src={X_Icon_DarkBlue} alt="" />
            </button>
            <input type="text" id="advancedSearchBar" placeholder="Start typing to search..." onChange={e => handleSearch(e)} />
        </div>
        <div className="subwindow-body">
            <div className="left-col">
                <p>Search by</p>
                <div className="radio-group">
                    <div id="mobileSearchModToggle" className="dropdown-input">
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
                    <label onClick={() => SetFilter('group')}>
                        <input type="radio" id="groups" name="search_modifier" value="groups" defaultChecked={filterType === 'group' ? true : false} />
                        <div className="custom-radio" >
                            <img src={BlueDot} alt="" />
                        </div>
                        <p>Groups</p>
                    </label>
                </div>
                <p>Recent Searches</p>
                <div className="recent-searches">
                    <a href="#">Sam Moss</a>
                    <a href="#">Graphic T-Shirts</a>
                    <a href="#">Hoodies</a>
                    <a href="#">Freddy Mercury</a>
                    <a href="#">Espresso Coffee</a>
                    <a href="#">Shoes</a>
                </div>
            </div>
            <div className="right-col">
                <div className="header">
                    <p><b>Results</b> ({filtered.length} search results)</p>
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
                        <button onClick={() => props.toggleCreateCustomer()}  >
                            <img src={CircledPlus_Icon_Blue} alt="" />
                            Create New Customer
                        </button>
                    </div>
                    {/* <div className="search-result customer">
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

                    {
                        product_List && product_List.map((item, index) => {
                            return <div className="search-result product" key={item.WPID}>
                                <div className="col">
                                    {/* <p className="style1">Product</p>
                            <p className="style2">Funky Fresh White Sneakers long name to get cut off</p>
                            <p className="style3">Funky Shoe Co.</p>
                            <p className="style3">$34.55</p>
                            <p className="style3">SKU# 1386425547424579201546</p> */}
                                    <p className="style1">Product</p>
                                    <p className="style2">{item.Title}</p>
                                    {/* <p className="style3">Funky Shoe Co.</p> */}
                                    <p className="style3">${item.Price}</p>
                                    <p className="style3">SKU#{item.Sku}</p>
                                </div>
                                <div className="row">
                                    <button className="search-view" onClick={() => viewProduct(item)}>
                                        <img src={ViewIcon} alt="" />
                                        View
                                    </button>
                                    <button className="search-add-to-sale" onClick={() => addToCart(item)}>
                                        <img src={Add_Icon_White} alt="" />
                                        Add to Sale
                                    </button>
                                </div>
                            </div>
                        })
                    }
                    {
                        filteredCustomer && filteredCustomer.map((item, index) => {
                            return <div className="search-result customer" key={item.Email}>
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
                                    <button className="search-transactions">
                                        <img src={Transactions_Icon_White} alt="" />
                                        Transactions
                                    </button>
                                    <button className="search-add-to-sale" onClick={()=>addCustomerToSale(item)}>
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
            </div>
        </div>
    </div></div>
}

export default AdvancedSearch 