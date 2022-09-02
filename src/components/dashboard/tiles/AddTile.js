import React, { useState,useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useIndexedDB } from 'react-indexed-db';
import X_Icon_DarkBlue from '../../../images/svg/X-Icon-DarkBlue.svg';
// import { initDropDown } from "../../common/commonFunctions/tileFn";
function encodeHtml(txt)
{
    //return $('<textarea />').html(txt).text();
}
const AddTile = (props) => {
    const { add, update, getByID, getAll, deleteRecord } = useIndexedDB("products");


   const filterProduct=()=> {
        var input = document.getElementById("product_search_field_pro").value;
        var value = true;//getSearchInputLength(input.length)

        if (value == true || input.length == 0) {
            //this.filterProductByTile("product-search",input);
        }
    }
    const [allProductList, setAllProductList] = useState([])
    const [parentProductList, setParentProductList] = useState([])
    const [product_List, setProduct_List] = useState([])

     const [respAttribute, respCategory] = useSelector((state) => [state.attribute.data.content, state.category.data.content])
    // console.log("---respAttribute----"+respAttribute)

    const getProductFromIDB = () => {
        getAll().then((rows) => {
            setAllProductList(rows)
            setParentProductList(rows)
            //For temporary
            setProduct_List(rows ? rows : []);
            //  let searchData = [
            //         "Plant 1",
            //         "Plant 2",
            //         "Plant 3",
            //         "Plant 4",
            //         "Plant 5",
            //         "Plant 6",
            //         "Ice",
            //         "Fire",
            //         "Air",
            //         "Earth",
            //         "Dragon",
            //         "Simpsons",
            //         "Covid Cure",
            //     ];
            // initDropDown(rows);
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
    return (
        <div className="subwindow add-tile">
        <div className="subwindow-header">
            <p>Add Tile</p>
            <button className="close-subwindow">
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
            <input type="text" id="tileLink" placeholder="Search for Tag/Category/Attributes/Product" />
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
    </div>)
}

export default AddTile 