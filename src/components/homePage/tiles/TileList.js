import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import CircledPlus_Icon_Border from '../../../images/svg/CircledPlus-Icon-Border.svg';
import STATUSES from "../../../constants/apiStatus";

// var AllProduct = [];
// var ParentProductList = [];
// var filtered = [];

const TileList = () => {
    const [AllProduct, setAllProduct] = useState([]);
    const [filtered, setfiltered] = useState([]);
    const [ParentProductList, setParentProductList] = useState([]);
    const [favArrayList, setfavArrayList] = useState([]);
    const [categoryList, setcategoryList] = useState([]);
    const [attributeList, setattributeList] = useState([]);
    const [cat_breadcrumb, setCat_breadcrumb] = useState([]);
    const [sel_item, setSel_item] = useState([]);


    const [respAttribute, respCategory] = useSelector((state) => [state.attribute, state.category])
    // var categoryList=[];
    // var attributeList=[];

    // var favArrayList = [];
    // const dispatch = useDispatch();

    const AddTileType = (arr, n) => {
        const newArry = arr.map((item) => {
            return { ...item, type: n };
        });
        return newArry
    }
    // const getSubAttribute = (item, id) => {


    // }
    // const getSubCategory = (item, id) => {

    // }
    const filterProductForAttribute = (item) => {
        var subAtt = [];
        if (respAttribute.is_success === true && respAttribute.data && respAttribute.data.content != null) {
            var _attributeList = respAttribute.data.content;
            setattributeList(_attributeList);
            subAtt = _attributeList.find(function (element) {
                return element.Id === item.attribute_id
            })
        }
        if (subAtt && subAtt.SubAttributes && subAtt.SubAttributes.length > 0) {
            var _SubAttributes = AddTileType(subAtt.SubAttributes, 'sub-attribute');
            _SubAttributes = _SubAttributes && _SubAttributes.map(element => { if (element["attribute_slug"] = element.Description) return element });
            // favArrayList=_SubAttributes;
            if (_SubAttributes && _SubAttributes.length > 0)
                setfavArrayList(_SubAttributes);
            else
                setfavArrayList([]);
            // console.log("---att -> _SubAttributes----" + JSON.stringify(_SubAttributes))
        }
        else
            setfavArrayList([]);
        productDataSearch(item.attribute_slug, 1)
    }

    const filterProductForSubAttribute = (item) => {
        if (item.SubAttributes && item.SubAttributes.length > 0) {
            var _SubAttributes = AddTileType(item.SubAttributes, 'sub-attribute');
            if (_SubAttributes && _SubAttributes.length > 0)
                setfavArrayList(_SubAttributes);
            else
                setfavArrayList([]);
            // console.log("---sub att -> _SubAttributes----" + JSON.stringify(_SubAttributes))
        }
        else
            setfavArrayList([]);
        productDataSearch(item, 3, item.parent_attribute ? item.parent_attribute.replace("pa_", "") : '');
    }

    const filterProductForCateGory = (item) => {
        var subCat = [];
        if (respCategory.is_success === true && respCategory.data && respCategory.data.content != null) {
            var _categoryList = respCategory.data.content;
            setcategoryList(_categoryList)
            subCat = _categoryList.find(function (element) {
                return element.id === item.category_id
            })
        }

        if (subCat && subCat.Subcategories && subCat.Subcategories.length > 0) {
            var _Subcategories = AddTileType(subCat.Subcategories, 'sub-category');
            // favArrayList=_Subcategories;
            _Subcategories = _Subcategories.map(element => { if (element["name"] = element.Value) return element });
            if (_Subcategories && _Subcategories.length > 0)
                setfavArrayList(_Subcategories);
            else
                setfavArrayList([]);
            // console.log("---cat -> _Subcategories----" + JSON.stringify(_Subcategories))
        }
        else
            setfavArrayList([]);
        productDataSearch(item.category_slug, 2)
    }

    const filterProductForSubCateGory = (item) => {
        if (item.Subcategories && item.Subcategories.length > 0) {
            var _Subcategories = AddTileType(item.Subcategories, 'sub-category');
            // console.log("---subcat -> _Subcategories----" + JSON.stringify(_Subcategories))

            if (_Subcategories && _Subcategories.length > 0)
                setfavArrayList(_Subcategories);
            else
                setfavArrayList([]);

        }
        else
            setfavArrayList([]);
        productDataSearch(item.category_slug ? item.category_slug : item.Code, 2)
    }
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

    const productDataSearch = (item1, index, parent) => {
        console.log("---clicked tiles type--" +JSON.stringify(item1) );
        console.log("---clicked tiles index--" +index);
        setfiltered([]);
        var _filtered = [];
        // const { AllProduct, ParentProductList } = this.state;
        //         this.setState({ isLoading: true });

        var value = item1;
        var parentAttribute = parent;
        // this.state.product_List = [];
        // this.setState({
        //     search: value,
        //     pageNumber: 0
        // })
        // call loadingData when searchInput length 0
        if (value === '' || value === null) {
            index = null
            // this.loadingData()
        }
        if (index === 0) {//product
            var serchFromAll = AllProduct.filter((item) => (
                (item.Title && item.Title.toLowerCase().includes(value.toLowerCase()))
                || (item.Barcode && item.Barcode.toString().toLowerCase().includes(value.toLowerCase()))
                || (item.Sku && item.Sku.toString().toLowerCase().includes(value.toLowerCase()))
            ))
            //-------//Filter child and parent-------------
            var parentArr = [];
            serchFromAll && serchFromAll.map(item => {
                if (item.ParentId !== 0) {
                    var parrentofChild = AllProduct.find(function (element) {
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

            // this.setState({
            //     filteredProuctList: filtered,
            //     totalRecords: filtered.length,
            //     product_List: filtered,

            // })
            // this.state.filteredProuctList = filtered;
            // this.state.totalRecords = filtered.length;
            // this.loadingFilterData()
        }
        if (index === 1) { //attribute
            ParentProductList && ParentProductList.map((item) => {
                item.ProductAttributes && item.ProductAttributes.map(attri => {
                    if (String(attri.Slug).toLowerCase().toString().indexOf(String(value).toLowerCase()) !== -1 ||
                        String(attri.Name).toLowerCase().toString().indexOf(String(value).toLowerCase()) !== -1) {
                        _filtered.push(item)
                    }
                })
            })

            // this.setState({
            //     filteredProuctList: filtered,
            //     totalRecords: filtered.length
            // })
            // this.state.filteredProuctList = filtered;
            // this.state.totalRecords = filtered.length;
            // this.state.product_List = filtered;
            // this.loadingFilterData()
        }
        else if (index === 2) {


            // category
            ///------Get Subcategory Code------------------------------------------------ 
            var filterCategoryCode = []
            filterCategoryCode.push(value)
            // var categoryList = [];
            // if (localStorage.getItem("categorieslist"))
            //     categoryList = JSON.parse(localStorage.getItem("categorieslist"))

            var _categoryList = [];
            if (respCategory.is_success === true && respCategory.data && respCategory.data.content != null) {
                var _categoryList = respCategory.data.content;
                setcategoryList(_categoryList)

            }

            if (_categoryList) {
                var category_list = _categoryList;
                var found;
                var setSubCategory = localStorage.getItem("setSubCategory") ? JSON.parse(localStorage.getItem("setSubCategory")) : [];
                if (category_list && category_list !== undefined && category_list.length > 0) {
                    found = category_list.find(item => value && item.Code && item.Code.replace(/-/g, "").toLowerCase() === value.replace(/-/g, "").toLowerCase());
                    if (!found && setSubCategory) {
                        found = setSubCategory && setSubCategory.find(item => value && item.Code && item.Code.replace(/-/g, "").toLowerCase() === value.replace(/-/g, "").toLowerCase());
                    }
                    if (found) {
                        filterCategoryCode = retrunItrateLoop(found, filterCategoryCode)
                    }
                }
            }
            ParentProductList && ParentProductList.map((item) => {
                item.Categories && item.Categories !== undefined && item.Categories.split(",").map(category => {
                    filterCategoryCode && filterCategoryCode !== undefined && filterCategoryCode.map(filterCode => {
                        var prod_Code = filterCode && filterCode.replace(/-/g, "");
                        category = category && category.replace(/-/g, "");
                        if (category && prod_Code && category.toUpperCase().toString() === prod_Code.toUpperCase()) {
                            if (_filtered.indexOf(item) === -1) {
                                _filtered.push(item)
                            }
                        }
                    })
                })
            })
            // this.setState({
            //     filteredProuctList: filtered,
            //     totalRecords: filtered.length
            // })
            // this.state.filteredProuctList = filtered;
            // this.state.totalRecords = filtered.length;
            // this.state.product_List = filtered
            // this.loadingFilterData();
        } else if (index === 3) {
            ///------Get attribute Code------------------------------------------------ 
            var filterAttribyteCode = []
            filterAttribyteCode.push(value.Value);
            // var attributeList = [];
            // if (localStorage.getItem("attributeList") && Array.isArray(JSON.parse(localStorage.getItem("attributeList"))) === true)
            //     attributeList = JSON.parse(localStorage.getItem("attributeList"))
            if (item1 && item1.SubAttributes !== undefined && item1.SubAttributes.length > 0) {
                var found1 = item1.SubAttributes.find(function (element) {
                    return (element.Code.replace(/-/g, "").toLowerCase() === value.Value.replace(/-/g, "").toLowerCase())
                });
                if (found1) {
                    found1.SubAttributes.map(item => {
                        filterAttribyteCode.push(item.Code);
                    })
                }
            }
            ParentProductList && ParentProductList.map((item) => {
                item.ProductAttributes && item.ProductAttributes.map(proAtt => {
                    var dataSplitArycomma = proAtt.Option.split(',');
                    dataSplitArycomma && dataSplitArycomma !== undefined && dataSplitArycomma.map(opt => {
                        filterAttribyteCode !== undefined && filterAttribyteCode.map(filterAttribute => {
                            opt = opt && opt.replace(/-/g, "");
                            value = filterAttribute && filterAttribute.replace(/-/g, ""); // value.replace(/-/g, ""); 
                            if (opt.toString().toUpperCase() === String(value).toUpperCase() && String(proAtt.Slug).toUpperCase() === String(parentAttribute).toUpperCase()) {
                                if (_filtered.indexOf(item) === -1) {
                                    _filtered.push(item)
                                }
                            }
                        })
                    })
                })
            })
            // this.setState({
            //     filteredProuctList: filtered,
            //     totalRecords: filtered.length
            // })
            // this.state.product_List = filtered
            // this.state.filteredProuctList = filtered;
            // this.state.totalRecords = filtered.length;
            //this.loadingFilterData();
        } else if (index === 4) {
            ParentProductList && ParentProductList !== undefined && ParentProductList.map((item) => {
                item.ProductAttributes && item.ProductAttributes !== undefined && item.ProductAttributes.map(Opt => {
                    var dataSplitArycomma = Opt.Option.split(',');
                    dataSplitArycomma && dataSplitArycomma !== undefined && dataSplitArycomma.map(optValve => {
                        var itemCode = this.getAttributeCode(optValve, parent);
                        if (itemCode !== null && itemCode !== undefined && itemCode.toString().toUpperCase() === String(value).toUpperCase()) {
                            _filtered.push(item)
                        }
                    })
                })
            })
            // this.setState({
            //     filteredProuctList: filtered,
            //     totalRecords: filtered.length
            // })
            // this.state.product_List = filtered
            // this.state.filteredProuctList = filtered;
            // this.state.totalRecords = filtered.length;
            // this.loadingFilterData()

        }
        _filtered = _filtered.filter(item => {
            return (item.ParentId === 0)
        })
        console.log("----filtered---" + JSON.stringify(_filtered.length));
        setfiltered(_filtered);

        //this.setState({ isLoading: false });

    }
    const filterProductByTile = (type, item, parent) => {
        if(type!=="product")
        fillCategorySelection(item)
        //this.setState({ pageNumber: 0 })
        switch (type) {
            case "attribute":
                filterProductForAttribute(item);
                break;
            case "sub-attribute":
                filterProductForSubAttribute(item);
                break;
            case "category":
                filterProductForCateGory(item);
                break;
            case "sub-category":
                filterProductForSubCateGory(item);
                break;
            // case "inner-sub-attribute":
            //     this.productDataSearch(item, 4, parent)
            //     break;
            // case "inner-sub-category":
            //     this.productDataSearch(item, 2)
            //     break;
            // case "product-search":
            //     this.productDataSearch(item, 0)
            //     break;
            case "product":
                productDataSearch(item.Title, 0, null)
                //this.loadingData()
                break;
            default:
                break;

        }
    }

    const fillFavourite = () => {
        var favTiles = [];
        var _favArrayList = [];
        favTiles = data && data.content;
        var FavProduct = favTiles.FavProduct;
        var FavAttribute = favTiles.FavAttribute;
        var FavSubAttribute = favTiles.FavSubAttribute;
        var FavCategory = favTiles.FavCategory;
        var FavSubCategory = favTiles.FavSubCategory;

        FavProduct = AddTileType(favTiles.FavProduct, 'product');
        FavAttribute = AddTileType(favTiles.FavAttribute, 'attribute');
        FavSubAttribute = AddTileType(favTiles.FavSubAttribute, 'sub-attribute');
        FavCategory = AddTileType(favTiles.FavCategory, 'category');
        FavSubCategory = AddTileType(favTiles.FavSubCategory, 'sub-category');

        _favArrayList = [...FavProduct, ...FavAttribute, ...FavSubAttribute, ...FavCategory, ...FavSubCategory];
        _favArrayList = [..._favArrayList].sort((a, b) => a.Order - b.Order);

        setfavArrayList(_favArrayList);
    }
    const { status, data, error, is_success } = useSelector((state) => state.tile)
    useEffect(() => {
        //var regId = localStorage.getItem('register');
        var pList = localStorage.getItem('Product_List') ? JSON.parse(localStorage.getItem('Product_List')) : [];
        // AllProduct = pList;
        // ParentProductList = pList;
        setAllProduct(pList);
        setParentProductList(pList);
        // if (typeof regId != "undefined" && regId != null) {
        //     dispatch(tile({ "id": regId }));
        // }
        if (status === STATUSES.error) {
            console.log(error)
        }
        if (status === STATUSES.IDLE && is_success && data != "") {
            fillFavourite();
        }
    }, [data]);

    const fillCategorySelection = (item) => {
        if (sel_item == null) {
            setCat_breadcrumb([]);
        }
        var catList = cat_breadcrumb;
        if (item) {
            catList.push(item)
            setCat_breadcrumb(catList);
        }
        console.log("---cat_breadcrumb--" + JSON.stringify(cat_breadcrumb))
    }
    const RemoveCategorySelection = () => {
        var tempItem = null;
        if (sel_item == null) {
            setCat_breadcrumb([]);
        }
        var catList = cat_breadcrumb;
        if (catList.length > 0) {
            catList.splice(-1)
            if (catList.length > 0) {
                tempItem = catList[catList.length - 1];
                //filterProductByTile(tempItem,catList.length==1?"category":"sub-category" );
                if (sel_item.hasOwnProperty("id")) {
                    filterProductByTile(tempItem, catList.length == 1 ? "category" : "sub-category");
                }
                else if (sel_item.hasOwnProperty("Id")) {
                    filterProductByTile(tempItem, catList.length == 1 ? "attribute" : "sub-attribute");
                }
            }
            else {
                //this.props.tileFilterData(null, "product", null)
                //filterProductByTile(null, "product", null)
            }
            setCat_breadcrumb(catList);
            setSel_item(tempItem);
        }
        else {
            //this.props.tileFilterData(null, "product", null)
        }
    }
    const BreadCumCategorySelection = (item) => {
        var tempItem = [];
        var index = -1;
        if (item == null) {
            setCat_breadcrumb([]);
        }
        var catList = cat_breadcrumb;
        if (catList.length > 0) {
            if (item.hasOwnProperty("id")) {
                index = catList.findIndex(a => a.id === item.id);
            }
            else if (item.hasOwnProperty("Id")) {
                index = catList.findIndex(a => a.Id === item.Id);
            }

            console.log("---index--" + index);

            // catList.splice(-1)
            if (catList.length > 0) {
                tempItem = catList.slice(0, index + 1);
                filterProductByTile(item.type, item);
                //filterProductByTile(tempItem,catList.length==1?"category":"sub-category" );
                // if (item.hasOwnProperty("id")) {
                //     filterProductByTile(item, catList.length == 1 ? "category" : "sub-category");
                // }
                // else if (item.hasOwnProperty("Id")) {
                //     filterProductByTile(item, catList.length == 1 ? "attribute" : "sub-attribute");
                // }
            }
            else {
                //this.props.tileFilterData(null, "product", null)
            }
            setCat_breadcrumb(tempItem);
            setSel_item(item);
        }
        else {
            //this.props.tileFilterData(null, "product", null)
        }
        showCategorySelection();
    }
    const showCategorySelection = () => {
        //var displayCat = "";
        var _cat = [];
        var newStatuses = [];
        if (cat_breadcrumb && cat_breadcrumb.length > 0) {
            var _isCat = 0;
            _cat = cat_breadcrumb.map(cat => {
                _isCat++;
                //displayCat += cat.Value?cat.Value:cat.attribute_code + " > "
                return <button onClick={() => BreadCumCategorySelection(cat)}>{(cat.Value ? cat.Value.replace("&amp;", "&"): cat.attribute_slug?cat.attribute_slug.replace("&amp;", "&"):cat.name?cat.name.replace("&amp;", "&"):'') + " > "}</button>
            })
            newStatuses = [<button onClick={() => goMainMenu()}>{"All Categories > "}</button>, ..._cat]
            // console.log(newStatuses)
        }
        //displayCat = displayCat != "" ? displayCat.replace("&amp;", "&") : displayCat;
        return newStatuses;
    }
    const goMainMenu = () => {
        setCat_breadcrumb([]);
        setSel_item(null);

        showCategorySelection();
        fillFavourite();
        setfiltered([]);
        // this.props.tileFilterData(null, "product", null);

    }

    return (
        <div className="products">
            <div className="mod-product">
                <div className="category-row">
                    {showCategorySelection()}
                </div>
            </div>

            {
                favArrayList && favArrayList.map((item, index) => {
                    switch (item.type) {
                        case "product":
                            return <button className="product" key={index} onClick={() => filterProductByTile(item.type, item, null)} >
                                <div className="body">
                                    <img src={item.Image} alt="" />
                                </div>
                                <div className="footer">
                                    <p>
                                        {item.Title}
                                    </p>
                                </div>
                            </button>
                        case "attribute":
                        case "sub-attribute":
                            return <button className="category" key={index} onClick={() => filterProductByTile(item.type, item, null)} >
                                <p>
                                    {item.attribute_slug}
                                </p>
                            </button>
                        case "category":
                        case "sub-category":
                            return <button className="category" key={index} onClick={() => filterProductByTile(item.type, item, null)}>
                                <p>
                                    {item.name ? item.name : item.Value}
                                </p>
                            </button>
                        default:
                            return ''
                    }
                })
            }
            {
                filtered && filtered.map((item, index) => {
                    return <button className="product" key={index} /*onClick={() => filterProductByTile(item.type, item, null)}*/ >
                        <div className="body">
                            <img src={item.ProductImage} alt="" />
                        </div>
                        <div className="footer">
                            <p>
                                {item.Title}
                            </p>
                        </div>
                    </button>
                })
            }

            {/* <button className="product">
                <div className="body background-teal">
                    <img src="../Assets/Images/Temp/Hanged-Tshirt.png" alt="" />
                </div>
                <div className="footer">
                    <p>Graphic T-Shirt</p>
                </div>
            </button>
            <button className="category">
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit minima labore quos totam, possimus facere aliquam reiciendis
                    maxime dignissimos eaque adipisci quo modi voluptas aut laboriosam vitae incidunt ullam facilis.
                </p>
            </button>
            <button className="category background-violet">
                <p>Clothing</p>
            </button> */}
            <button className="add-tile">
                <img src={CircledPlus_Icon_Border} alt="" />
                Add Tile
            </button>
        </div>)
}

export default TileList 