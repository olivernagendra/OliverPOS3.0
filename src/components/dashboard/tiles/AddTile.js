import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useIndexedDB } from 'react-indexed-db';
import X_Icon_DarkBlue from '../../../assets/images/svg/X-Icon-DarkBlue.svg';
import { AddItemType } from "../../common/EventFunctions";
import { addTile, tile } from '../tiles/tileSlice';
import { get_regId, get_UDid, get_userId } from "../../common/localSettings";
import STATUSES from "../../../constants/apiStatus";
// import { initDropDown } from "../../common/commonFunctions/tileFn";
import { LoadingModal } from "../../common/commonComponents/LoadingModal";
import { popupMessage } from "../../common/commonAPIs/messageSlice";
import Search_Icon_Blue from '../../../assets/images/svg/Search-Icon-Blue.svg';
import AdvancedSearchCancelIcon from '../../../assets/images/svg/AdvancedSearchCancelIcon.svg';
function encodeHtml(txt) {
    //return $('<textarea />').html(txt).text();
}
const AddTile = (props) => {
    // const { status, data, error, is_success } = useSelector((state) => state.tile)
    // const [respAddTile] = useSelector((state) => [state.AddTile])
    const { getAll } = useIndexedDB("products");
    const [categoryList, setcategoryList] = useState([]);
    const [attributeList, setattributeList] = useState([]);
    // const [allProductList, setAllProductList] = useState([])
    // const [parentProductList, setParentProductList] = useState([])
    // const [product_List, setProduct_List] = useState([])
    const [filterList, setfilterList] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [tileList, settileList] = useState([]);
    const [tileColor, setTileColor] = useState('');
    const [serachString, setSerachString] = useState('');
    const [tileToAdd, settileToAdd] = useState('');
    const [isShowCanelBtn, setisShowCanelBtn] = useState(false);
    const [respAttribute, respCategory, respTile] = useSelector((state) => [state.attribute, state.category, state.tile])

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
        if (respTile.is_success === true && respTile.data && respTile.data.content != null) {
            var _tileList = respTile.data.content;
            settileList(_tileList)
        }
    }
    // It is refreshing the tile list from server when a new tile is added
    const [resAddTile] = useSelector((state) => [state.addTile])
    useEffect(() => {
        if (isLoading === true && resAddTile && resAddTile.status == STATUSES.IDLE && (resAddTile.is_success === true || resAddTile.is_success === false)) {
            setIsLoading(false);
            setSerachString('');
            props.toggleAddTitle();
        }
    }, [resAddTile]);

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
                    // console.log("found ", keyValue);
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

    const AddTile = (item, index) => {
        switch (item.type) {
            case "product":
                setSerachString(item.Title);
                break;
            case "category":
                setSerachString(item.Value);
                break;
            case "attribute":
                setSerachString(item.Description);
                break;
            default:
                break;
        }
        setfilterList([]);
        settileToAdd(item);
    }
    const filterProduct = (e) => {

        // console.log(e.target.value)
        var value = e.target.value.trim().toLowerCase();
        setSerachString(value);
        var _filteredData = [];
        if (value != "") {
            setisShowCanelBtn(true);
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
                var fPList = rows.filter(a => a.Title && a.Title.toLowerCase().includes(value) && a.ParentId === 0);
                if (fPList && fPList.length > 0) {
                    fPList = AddItemType(fPList, "product");
                    // _filteredData.concat(fPList);
                    _filteredData = [...new Set([..._filteredData, ...fPList])];
                    { _filteredData = _filteredData.slice(0, 10); }
                }
                setfilterList(_filteredData);
                // console.log("---search data----" + JSON.stringify(_filteredData))
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
        var param = { "UserID": get_userId(), "RegisterId": get_regId(), "udid": get_UDid(), "ItemId": id, "ItemType": type, "ItemSlug": slug, "order": 0, "Color": tileColor }
        dispatch(addTile(param));
    }

    const addToFavourite = (item, pos) => {
        // console.log(JSON.stringify(item));
        // return;
        var favList = tileList;
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
            setfilterList([]);
            // console.log("-----new favv--" + id, type, slug);
            setIsLoading(true);
            submitChanges(id, type, slug)

        } else {
            if (isExist == true) { //apply check to protect msg display if no item selected and click on save button
                // alert("alreadyExsist");
                var data = { title: "", msg: "Item already exist", is_success: true }
                dispatch(popupMessage(data));
            }
        }

    }

    // console.log("---respAttribute----"+respAttribute)

    // const getProductFromIDB = () => {
    //     getAll().then((rows) => {
    //         setProduct_List(rows ? rows : []);
    //     });

    // }
    // let useCancelled = false;
    // useEffect(() => {
    //     if (useCancelled == false) {
    //         getProductFromIDB()
    //     }
    //     return () => {
    //         useCancelled = true;
    //     }
    // }, []);

    const outerClick = (e) => {
        if (e && e.target && e.target.className && e.target.className === "subwindow-wrapper") {
            setSerachString('');
            props.toggleAddTitle();
        }
    }
    const clearSearch = () => {
        setSerachString('');
        setTileColor('');
        setfilterList([]);
        settileToAdd('');
        setisShowCanelBtn(false);
    }
    const showCancelButton = () => {
        if (serachString != "") {
            setisShowCanelBtn(true);
        }
    }
    const hideCancelButton = () => {
        //setisShowCanelBtn(false);
    }
    const closePopUp = () => {
        setSerachString('');
        props.toggleAddTitle();
    }
    return (
        <React.Fragment>

            <div className={props.isShow === true ? "subwindow-wrapper" : "subwindow-wrapper hidden"} onClick={(e) => outerClick(e)}>
                <div className={props.isShow === true ? "subwindow add-tile current" : "subwindow add-tile"}>
                    <div className="subwindow-header">
                        <p>Add Tile</p>
                        <button className="close-subwindow" onClick={() => closePopUp()}>
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
                        <div className={filterList && filterList.length > 0 ? "dropdown-search open" : "dropdown-search"}>
                            <img className="search" src={Search_Icon_Blue} alt="" />
                            <button id="cancelDropdownSearch" onClick={() => clearSearch()} className={isShowCanelBtn === true ? "display-flex" : ""}>
                                <img src={AdvancedSearchCancelIcon} alt="" />
                            </button>
                            <input type="text" id="tileLink" placeholder="Search for Tag/Category/Attributes/Product" value={serachString} onChange={filterProduct} autoComplete="off" onFocus={() => showCancelButton()} onBlur={() => hideCancelButton()} />
                            <div className="option-container">
                                {filterList && filterList.length > 0 && filterList.map(item => {
                                    switch (item.type) {
                                        case "product":
                                            return <div className="dropdown-option" onClick={() => AddTile(item, 0)}>{item.type + " : " + item.Title}</div>
                                        case "category":
                                            return <div className="dropdown-option" onClick={() => AddTile(item, 0)}>{item.type + " : " + item.Value}</div>
                                        case "attribute":
                                            return <div className="dropdown-option" onClick={() => AddTile(item, 0)}>{item.type + " : " + item.Description}</div>
                                        default:
                                            return ''
                                    }

                                })}
                            </div></div>
                        {/* <ul>
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

                    })}</ul> */}
                        <p>Select the tile color</p>
                        <div className="radio-group">
                            {/* {
                    props.categoryList && props.categoryList.map(c=>
                        {
                            <p>{c.name}</p>
                        })
                } */}
                            <label onClick={() => setTileColor('violet')}>
                                <input type="radio" id="violet" name="tile-color" value="violet" />
                                <div className="custom-radio-button background-violet"></div>
                            </label>
                            <label onClick={() => setTileColor('blue')}>
                                <input type="radio" id="blue" name="tile-color" value="blue" />
                                <div className="custom-radio-button background-blue"></div>
                            </label>
                            <label onClick={() => setTileColor('cyan')}>
                                <input type="radio" id="cyan" name="tile-color" value="cyan" />
                                <div className="custom-radio-button background-cyan"></div>
                            </label>
                            <label onClick={() => setTileColor('teal')}>
                                <input type="radio" id="teal" name="tile-color" value="teal" />
                                <div className="custom-radio-button background-teal"></div>
                            </label>
                            <label onClick={() => setTileColor('lime')}>
                                <input type="radio" id="lime" name="tile-color" value="lime" />
                                <div className="custom-radio-button background-lime"></div>
                            </label>
                            <label onClick={() => setTileColor('yellow')}>
                                <input type="radio" id="yellow" name="tile-color" value="yellow" />
                                <div className="custom-radio-button background-yellow"></div>
                            </label>
                            <label onClick={() => setTileColor('coral')}>
                                <input type="radio" id="coral" name="tile-color" value="coral" />
                                <div className="custom-radio-button background-coral"></div>
                            </label>
                            <label onClick={() => setTileColor('red')}>
                                <input type="radio" id="red" name="tile-color" value="red" />
                                <div className="custom-radio-button background-red"></div>
                            </label>
                        </div>
                        <button onClick={() => addToFavourite(tileToAdd, 0)}>Add Tile</button>
                        <div className="auto-margin-bottom"></div>
                    </div>
                </div></div>{isLoading === true ? <LoadingModal></LoadingModal> : null}</React.Fragment>)
}

export default AddTile 