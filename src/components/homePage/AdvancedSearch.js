import React, { useEffect, useLayoutEffect, useState } from "react";
import X_Icon_DarkBlue from '../../images/svg/X-Icon-DarkBlue.svg';
import down_angled_bracket from '../../images/svg/down-angled-bracket.svg';
import BlueDot from '../../images/svg/BlueDot.svg';
import ViewIcon from '../../images/svg/ViewIcon.svg';
import Add_Icon_White from '../../images/svg/Add-Icon-White.svg';
import Transactions_Icon_White from '../../images/svg/Transactions-Icon-White.svg';
import CircledPlus_Icon_Blue from '../../images/svg/CircledPlus-Icon-Blue.svg';
import { useRoutes } from "react-router-dom";
import FetchIndexDB from "../../settings/FetchIndexDB";
const AdvancedSearch = () => {
    const [allProductList, setAllProductList] = useState([])
    const [totalRecords, setTotalRecords] = useState(0)
    const [parentProductList, setParentProductList] = useState([])
    const [product_List, setProduct_List] = useState([])


    const getProductFromIDB = () => {
        var allData = [];
        var idbKeyval = FetchIndexDB.fetchIndexDb();
        idbKeyval.get('ProductList').then(val => {
            if (!val || val.length == 0 || val == null || val == "") {
                setAllProductList([]);
            }
            else {
                setAllProductList(val); //getTaxAllProduct(val);
                val.map(item => {
                    if (item.ParentId == 0 && (item.ManagingStock == false || (item.ManagingStock == true && item.StockQuantity > -1))) {
                        allData.push(item);
                    }
                })

                if (allData.length == 0) {
                }
                setParentProductList(allData)
                setTotalRecords(allData ? allData.length : 0);
                //For temporary
                setProduct_List(allData ? allData : []);

                // this.loadingData();
                // this.setState({ isLoading: false });
            }
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


    // console.log(allProductList)
    // console.log(totalRecords)
    // console.log(parentProductList)


    return <div className="subwindow advanced-search">
        <div className="subwindow-header">
            <p>Advanced Search</p>
            <button className="close-subwindow">
                <img src={X_Icon_DarkBlue} alt="" />
            </button>
            <input type="text" id="advancedSearchBar" placeholder="Start typing to search..." />
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
                    <p><b>Results</b> (23 search results)</p>
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
                    </div>

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
                    <div className="search-result group">
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
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default AdvancedSearch 