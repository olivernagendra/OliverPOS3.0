import React, { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from 'react-redux';
import X_Icon_DarkBlue from '../../images/svg/X-Icon-DarkBlue.svg';
import down_angled_bracket from '../../images/svg/down-angled-bracket.svg';
import BlueDot from '../../images/svg/BlueDot.svg';
import ViewIcon from '../../images/svg/ViewIcon.svg';
import Add_Icon_White from '../../images/svg/Add-Icon-White.svg';
import Transactions_Icon_White from '../../images/svg/Transactions-Icon-White.svg';
import CircledPlus_Icon_Blue from '../../images/svg/CircledPlus-Icon-Blue.svg';
import { useRoutes } from "react-router-dom";
import FetchIndexDB from "../../settings/FetchIndexDB";
import { useIndexedDB } from 'react-indexed-db';
const AdvancedSearch = () => {
    const { add, update, getByID, getAll, deleteRecord } = useIndexedDB("products");

    const [allProductList, setAllProductList] = useState([])
    const [totalRecords, setTotalRecords] = useState(0)
    const [parentProductList, setParentProductList] = useState([])
    const [product_List, setProduct_List] = useState([])

    const [filtered, setfiltered] = useState([]);
    const [allCustomerList, setAllCustomerList] = useState([])

    const getProductFromIDB = () => {
        var allData = [];
        getAll().then((rows) => {
            setAllProductList(rows)
            setParentProductList(rows)
            setTotalRecords(rows ? rows.length : 0);
            //For temporary
            setProduct_List(rows ? rows : []);
        });


    }
    let useCancelled = false;
    useEffect(() => {
        if (useCancelled == false) {
            getProductFromIDB()
            console.log(product_List)
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

    const productDataSearch = (event) => {
        console.log("event" + event.target.value)
        var item1 = event.target.value;
        setfiltered([]);
        if (item1 == '') {
            setProduct_List(allProductList);
            return;
        }
        var _filtered = [];
        var value = item1;

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
        }

        // Search in Customer
        var filteredCustomer = allCustomerList.filter((item) => (
            (item.FirstName && item.FirstName.toLowerCase().includes(value.toLowerCase()))
            || (item.LastName && item.LastName.toString().toLowerCase().includes(value.toLowerCase()))
            || (item.Contact && item.Contact.toString().toLowerCase().includes(value.toLowerCase()))
            || (item.Email && item.Email.toString().toLowerCase().includes(value.toLowerCase()))
        ))
        console.log("---filteredCustomer---" + JSON.stringify(filteredCustomer));

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
        setProduct_List(_filtered);
        setfiltered(_filtered);

    }
    // console.log(allProductList)
    // console.log(totalRecords)
    // console.log(parentProductList)


    return <div className="subwindow advanced-search">
        <div className="subwindow-header">
            <p>Advanced Search</p>
            <button className="close-subwindow">
                <img src={X_Icon_DarkBlue} alt="" />
            </button>
            <input type="text" id="advancedSearchBar" placeholder="Start typing to search..." onChange={e => productDataSearch(e)} />
        </div>
        <div className="subwindow-body">
            <div className="left-col">
                <p>Search by</p>
                <div className="radio-group">
                    <div id="mobileSearchModToggle" className="dropdown-input">
                        <p><b>Search for:</b> All Results</p>
                        <img src={down_angled_bracket} alt="" />
                    </div>
                    <label>
                        <input type="radio" id="allResults" name="search_modifier" value="allResults" checked />
                        <div className="custom-radio">
                            <img src={BlueDot} alt="" />
                        </div>
                        <p>All Results</p>
                    </label>
                    <label>
                        <input type="radio" id="products" name="search_modifier" value="products" />
                        <div className="custom-radio">
                            <img src={BlueDot} alt="" />
                        </div>
                        <p>Products</p>
                    </label>
                    <label>
                        <input type="radio" id="customers" name="search_modifier" value="customers" />
                        <div className="custom-radio">
                            <img src={BlueDot} alt="" />
                        </div>
                        <p>Customers</p>
                    </label>
                    <label>
                        <input type="radio" id="groups" name="search_modifier" value="groups" />
                        <div className="custom-radio">
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
                        <button>
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
                            return <div className="search-result product">
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
                                    <button className="search-view">
                                        <img src={ViewIcon} alt="" />
                                        View
                                    </button>
                                    <button className="search-add-to-sale">
                                        <img src={Add_Icon_White} alt="" />
                                        Add to Sale
                                    </button>
                                </div>
                            </div>
                        })
                    }
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
    </div>
}

export default AdvancedSearch 