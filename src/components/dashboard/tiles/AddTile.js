import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useIndexedDB } from 'react-indexed-db';
import X_Icon_DarkBlue from '../../../images/svg/X-Icon-DarkBlue.svg';
import { AddItemType } from "../../common/EventFunctions";
import { addTile, tile } from '../tiles/tileSlice';
import { get_regId, get_UDid, get_userId } from "../../common/localSettings";
// import { initDropDown } from "../../common/commonFunctions/tileFn";
function encodeHtml(txt) {
    //return $('<textarea />').html(txt).text();
}
const AddTile = (props) => {
    const { status, data, error, is_success } = useSelector((state) => state.tile)
    // const [respAddTile] = useSelector((state) => [state.AddTile])
    const { add, update, getByID, getAll, deleteRecord } = useIndexedDB("products");
    const [categoryList, setcategoryList] = useState([]);
    const [attributeList, setattributeList] = useState([]);
    // const [allProductList, setAllProductList] = useState([])
    // const [parentProductList, setParentProductList] = useState([])
    const [product_List, setProduct_List] = useState([])
    const [filterList, setfilterList] = useState([])
    const [respAttribute, respCategory] = useSelector((state) => [state.attribute, state.category])
    const dispatch = useDispatch();

    useEffect(() => {
        fillData()
    }, [respAttribute, respCategory]);
    const fillData = () => {
        if (respAttribute.is_success === true && respAttribute.data && respAttribute.data.content != null) {
            var _attributeList = respAttribute.data.content;
            setattributeList(_attributeList);
        }
        if (respCategory.is_success === true && respCategory.data && respCategory.data.content != null) {
            var _categoryList = respCategory.data.content;
            setcategoryList(_categoryList)
        }
    }
    // if(respAddTile && respAddTile.is_success==true)
    // {
    //     var regId = localStorage.getItem('register');
    //     if (typeof regId != "undefined" && regId != null) {
    //         dispatch(tile({ "id": regId }));
    //     }
    // }

    const recursivelyFindKeyValue = (key, keyValue, list, depth = 0) => {
        //console.log("Searching list: ", list);
        let results = [];
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            for (const key of Object.keys(item)) {
                //console.log("item[key]--- ", item[key]);
                //check if its not an array
                if (Array.isArray(item[key])) {
                    //console.log("child array found, searching", item);
                    let res = recursivelyFindKeyValue(key, keyValue, item[key], depth + 1);
                    results = results.concat(res);
                }
                //we have found it
                // else if (item[key] === keyValue) {
                else if (item[key] && typeof item[key] == "string" && item[key].toLowerCase().includes(keyValue)) {
                    //found, return the list
                    console.log("found ", keyValue);
                    //   results.push({
                    //     found: true,
                    //     containingArray: list,
                    //     depth: depth,
                    //     object: item
                    //   });
                    results.push(item);
                }
            }
        }

        return results;
    };

    const filterProduct = (e) => {
        console.log(e.target.value)
        var value = e.target.value.trim().toLowerCase();
        var _filteredData = [];
        if (value != "") {
            var fCList = recursivelyFindKeyValue('', value, categoryList, 0);
            var fAList = recursivelyFindKeyValue('', value, attributeList, 0);
            if (fCList && fCList.length > 0) {
                fCList = AddItemType(fCList, "category");
                // _filteredData.concat(fCList);
                _filteredData = [...new Set([..._filteredData, ...fCList])];
            }
            if (fAList && fAList.length > 0) {
                fAList = AddItemType(fAList, "attribute");
                // _filteredData.concat(fAList);
                _filteredData = [...new Set([..._filteredData, ...fAList])];
            }
            //   var fPList=  recursivelyFindKeyValue('',e.target.value,product_List,0)
            getAll().then((rows) => {
                var fPList = rows.filter(a => a.Title && a.Title.toLowerCase().includes(value));
                if (fPList && fPList.length > 0) {
                    fPList = AddItemType(fPList, "product");
                    // _filteredData.concat(fPList);
                    _filteredData = [...new Set([..._filteredData, ...fPList])];
                }
                setfilterList(_filteredData);
                console.log("---search data----" + JSON.stringify(_filteredData))
            });
        }
        else {
            setfilterList(_filteredData);
        }
        //   console.log("---fList--" +JSON.stringify(fCList) );
        //   console.log("---fList--" +JSON.stringify(fAList) );
        //   console.log("---fList--" +JSON.stringify(fPList) );
        // var input = document.getElementById("product_search_field_pro").value;
        // var value = true;//getSearchInputLength(input.length)

        // if (value == true || input.length == 0) {
        //     //this.filterProductByTile("product-search",input);
        // }
    }
    const submitChanges = (id, type, slug) => {
        var param = { "UserID": get_userId(), "RegisterId": get_regId(), "udid": get_UDid(), "ItemId": id, "ItemType": type, "ItemSlug": slug, "order": 0 }
        dispatch(addTile(param));
    }
    const addToFavourite = (item, pos) => {
        // console.log(JSON.stringify(item));
        // return;
        var favList = data && data.content;
        var type = item.type;
        var id = '';
        var slug = '';
        if (type && type === "product") {
            id = item.WPID;
            slug = item.Title && item.Title;
        }
        else if (type && type === "category") {
            id = item.id;
            slug = item.Code && item.Code;
        }
        else if (type && type === "attribute") {
            id = item.Id;
            slug = item.Code && item.Code;
        }

        var isExist = false;
        var positionIndex = pos;
        if (type == "product") {
            favList && favList.FavProduct && favList.FavProduct.map(prod => {
                if (prod.Product_Id == id) {
                    isExist = true;
                }
            })
        } else if (type == "attribute" || type == "sub-attribute") {
            favList && favList.FavAttribute && favList.FavAttribute.map(attr => {
                if (attr.attribute_id == id) {
                    isExist = true;
                }
            })
        } else if (type == "category" || type == "sub-category") {
            favList && favList.FavCategory && favList.FavCategory.map(cat => {
                if (cat.category_id == id) {
                    isExist = true;
                }
            })
        } else if (type == "sub-attribute") {
            favList && favList.FavSubAttribute && favList.FavSubAttribute.map(suatt => {
                if (suatt.attribute_id == id) {
                    isExist = true;
                }
            })
        } else if (type == "sub-category") {
            favList && favList.FavSubCategory && favList.FavSubCategory.map(subcat => {
                if (subcat.category_id == id) {
                    isExist = true;
                }
            })
        }

        if (id && type && isExist == false) {
            console.log("-----new favv--" + id, type, slug);
            submitChanges(id, type, slug)
            //this.props.status(true, type, id, slug, positionIndex)

        } else {
            if (item.type) { //apply check to protect msg display if no item selected and click on save button
                alert("alreadyExsist");

            }
        }

    }

    // console.log("---respAttribute----"+respAttribute)

    const getProductFromIDB = () => {
        getAll().then((rows) => {
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

    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            props.toggleAddTitle();
        }
        else {
            e.stopPropagation();
        }
        console.log(e.target.className)
        //
    }
    return (<div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
        <div className={props.isShow === true ? "subwindow add-tile current" : "subwindow add-tile"}>
            <div className="subwindow-header">
                <p>Add Tile</p>
                <button className="close-subwindow" onClick={() => props.toggleAddTitle()}>
                    <img src={X_Icon_DarkBlue} alt="" />
                </button>
            </div>
            <div className="subwindow-body">
                <div className="auto-margin-top"></div>
                <label htmlFor="tileLink">Select Tile Link</label>
                {/* <div className="search-dropdown">
                    <input type="search" id="product_search_field_pro" className=""  name="search" onChange={() => filterProduct()}
                        autoComplete="off"  placeholder="Search for Tag/Category/Attributes/Product"/>
</div> */}
                <input type="text" id="tileLink" placeholder="Search for Tag/Category/Attributes/Product" onChange={filterProduct} />
                <ul>
                    {filterList && filterList.length > 0 && filterList.map(item => {
                        switch (item.type) {
                            case "product":
                                return <li onClick={() => addToFavourite(item, 0)}>{item.type + " : " + item.Title}</li>
                            case "category":
                                return <li onClick={() => addToFavourite(item, 0)}>{item.type + " : " + item.Value}</li>
                            case "attribute":
                                return <li onClick={() => addToFavourite(item, 0)}>{item.type + " : " + item.Description}</li>
                            default:
                                return ''
                        }

                    })}</ul>
                <p>Select the tile color</p>
                <div className="radio-group">
                    {/* {
                    props.categoryList && props.categoryList.map(c=>
                        {
                            <p>{c.name}</p>
                        })
                } */}
                    <label>
                        <input type="radio" id="violet" name="tile-color" value="violet" />
                        <div className="custom-radio-button background-violet"></div>
                    </label>
                    <label>
                        <input type="radio" id="blue" name="tile-color" value="blue" />
                        <div className="custom-radio-button background-blue"></div>
                    </label>
                    <label>
                        <input type="radio" id="cyan" name="tile-color" value="cyan" />
                        <div className="custom-radio-button background-cyan"></div>
                    </label>
                    <label>
                        <input type="radio" id="teal" name="tile-color" value="teal" />
                        <div className="custom-radio-button background-teal"></div>
                    </label>
                    <label>
                        <input type="radio" id="lime" name="tile-color" value="lime" />
                        <div className="custom-radio-button background-lime"></div>
                    </label>
                    <label>
                        <input type="radio" id="yellow" name="tile-color" value="yellow" />
                        <div className="custom-radio-button background-yellow"></div>
                    </label>
                    <label>
                        <input type="radio" id="coral" name="tile-color" value="coral" />
                        <div className="custom-radio-button background-coral"></div>
                    </label>
                    <label>
                        <input type="radio" id="red" name="tile-color" value="red" />
                        <div className="custom-radio-button background-red"></div>
                    </label>
                </div>
                <button>Add Tile</button>
                <div className="auto-margin-bottom"></div>
            </div>
        </div></div>)
}

export default AddTile 