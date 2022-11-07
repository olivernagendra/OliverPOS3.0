import { get_UDid } from "../../common/localSettings";
import moment from 'moment';
import { getTaxCartProduct, getInclusiveTax, getExclusiveTax, typeOfTax } from "../../common/TaxSetting";
import LocalizedLanguage from "../../../settings/LocalizedLanguage";
function percentWiseDiscount(price, discount) {
    var discountAmount = (price * discount) / 100.00;
    return discountAmount;
}

function NumberWiseDiscount(price, discount) {
    var discountAmount = (discount * 100.00) / price;
    return discountAmount;
}
function stockUpdateQuantity(cardData, data, product) {
    var qty = 0
    cardData.map(item => {
        if (data.product_id === item.product_id) {
            qty += item.quantity;
        }
    })
    if (product) {
        var quantity = (product.StockStatus == null || product.StockStatus == 'instock') && product.ManagingStock == false ? "Unlimited" : (typeof product.StockQuantity != 'undefined') && product.StockQuantity != '' ? product.StockQuantity - qty : '0';
        localStorage.setItem("CART_QTY", quantity);
    }
}
export const updateProductNote = (note) => {
    var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
    var isExist =false;
    if (cartlist && cartlist.length > 0) {
        cartlist.map(findId => {
            if(findId.hasOwnProperty("pid") && findId.pid===note.pid)
            {
                findId.Title=note.Title;
                isExist=true;
            }
        });
        localStorage.setItem("CARD_PRODUCT_LIST", JSON.stringify(cartlist));
    }
    return isExist;
}
export const addSimpleProducttoCart = (product, ticketFields = null) => {
    //const { dispatch, checkout_list, cartproductlist } = this.props;
    var cartproductlist = [];
    var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
    var single_product = localStorage.getItem("SINGLE_PRODUCT") ? JSON.parse(localStorage.getItem("SINGLE_PRODUCT")) : null;
    if (cartlist.length > 0 && !single_product) {
        cartlist.map(findId => {
            if (findId.product_id === product.WPID) {
                product['after_discount'] = findId ? findId.after_discount : 0;
                product['discount_amount'] = findId ? findId.discount_amount : 0;
                product['product_after_discount'] = findId ? findId.product_after_discount : 0;
                product['product_discount_amount'] = findId ? findId.product_discount_amount : 0;
                product['discount_type'] = findId ? findId.discount_type : "";
                product['new_product_discount_amount'] = findId ? findId.new_product_discount_amount : 0;
            }
        });
    }

    if (cartlist.length > 0 && single_product) {
        cartlist.map(prdId => {
            if (prdId.product_id === product.WPID) {
                product['after_discount'] = single_product.after_discount;
                product['product_discount_amount'] = single_product.product_discount_amount;
                product['product_after_discount'] = single_product.product_after_discount;
                product['new_product_discount_amount'] = single_product.new_product_discount_amount;
                product['discount_amount'] = single_product.discount_amount;
                product['discount_type'] = single_product.discount_type;
                product['cart_after_discount'] = single_product.cart_after_discount;
                product['cart_discount_amount'] = single_product.cart_discount_amount;
            }
        })
    }
    else if(single_product)
    {
            product['after_discount'] = single_product.after_discount;
                product['product_discount_amount'] = single_product.product_discount_amount;
                product['product_after_discount'] = single_product.product_after_discount;
                product['new_product_discount_amount'] = single_product.new_product_discount_amount;
                product['discount_amount'] = single_product.discount_amount;
                product['discount_type'] = single_product.discount_type;
                product['cart_after_discount'] = single_product.cart_after_discount;
                product['cart_discount_amount'] = single_product.cart_discount_amount;
    }
    // var setQunatity = 1;

    var setQunatity = typeof product.quantity != "undefined" ? product.quantity : 1;
    var tick_data = product && product.IsTicket == true && product.TicketInfo != '' ? JSON.parse(product.TicketInfo) : '';
    var availability_to_date = tick_data && tick_data !== 'null' ? moment(tick_data._ticket_availability_to_date).format('YYYY-MM-DD') : ''
    var today_date = moment().format('YYYY-MM-DD')

    if (product && product.IsTicket == true && ticketFields == null) {
        var tick_type = 'simpleadd';
        //this.getTicketFields(product, tick_type)
    }
    if (product !== null && product !== undefined && product.IsTicket == false) {
        var data = {
            line_item_id: 0,
            cart_after_discount: product.cart_after_discount ? product.cart_after_discount : 0,
            cart_discount_amount: product.cart_discount_amount ? product.cart_discount_amount : 0,
            after_discount: product.after_discount ? product.after_discount : 0,
            discount_amount: product.discount_amount ? product.discount_amount : 0,
            product_after_discount: product.product_after_discount ? product.product_after_discount : 0,
            product_discount_amount: product.product_discount_amount ? product.product_discount_amount : 0,
            quantity: setQunatity,
            Title: product.Title,
            Sku: product.Sku,
            Price: setQunatity * parseFloat(product.Price),
            product_id: product.WPID,
            variation_id: 0,
            isTaxable: product.Taxable,
            old_price: product.old_price,
            incl_tax: product.incl_tax,
            excl_tax: product.excl_tax,
            ticket_status: product.IsTicket,
            discount_type: product.discount_type ? product.discount_type : "",
            new_product_discount_amount: product ? product.new_product_discount_amount : 0,
            TaxStatus: product ? product.TaxStatus : "",
            TaxClass: product ? product.TaxClass : '',
            Type: product ? product.Type : '',
        }
        if (product.hasOwnProperty("pid")) {
            data["pid"] = product.pid;
        }
        var qty = 0;
        cartproductlist.map(item => {
            if (product.WPID == item.product_id) {
                qty = item.quantity;
            }
        })
        //  add simple product with below condotions
        var product_is_exist = (product.ManagingStock == false && product.StockStatus == "outofstock") ? "outofstock" :
            (product.StockStatus == null || product.StockStatus == 'instock') && product.ManagingStock == false ? "Unlimited" : (typeof product.StockQuantity != 'undefined') && product.StockQuantity != '' ? qty < product.StockQuantity : '0'
        if (product_is_exist == '0') {
            if (typeof product.Price != "undefined") { return 'outofstock'; }
            else { product_is_exist = true; }
        }
        if (product_is_exist !== 'outofstock' && product_is_exist !== '0' && product_is_exist == true || product_is_exist == 'Unlimited') {
            //Added this code to replace the product at the existing position in the case of edit
            if (product.hasOwnProperty("selectedIndex")) {
                cartlist[product.selectedIndex] = data;
            }
            else
            {
                cartlist.push(data);
            }
         
            //cartlist.push(data);
            //Android Call----------------------------
            var totalPrice = 0.0;
            cartlist && cartlist.map(item => {
                totalPrice += item.Price;
            })
            //androidDisplayScreen(data.Title, data.Price, totalPrice, "cart");
            //-----------------------------------------
            stockUpdateQuantity(cartlist, data, product)
            if ((!localStorage.getItem("APPLY_DEFAULT_TAX")) || localStorage.getItem("APPLY_DEFAULT_TAX") == null) {
                // setTimeout(() => {
                addtoCartProduct(cartlist);
                // }, 400);
            } else {
                addtoCartProduct(cartlist);
            }
        } else {
            return 'outofstock';
        }
    }
    else if (product !== null && product !== undefined && product.IsTicket == true && ticketFields != null) {
        var TicketInfoForSeat = product && product.TicketInfo && JSON.parse(product.TicketInfo);
        var tcForSeating = TicketInfoForSeat ? TicketInfoForSeat : "";
        this.setState({ ticket_Product_status: false })
        var data = {
            line_item_id: 0,
            cart_after_discount: product.cart_after_discount ? product.cart_after_discount : 0,
            cart_discount_amount: product.cart_discount_amount ? product.cart_discount_amount : 0,
            after_discount: product.after_discount ? product.after_discount : 0,
            discount_amount: product.discount_amount ? product.discount_amount : 0,
            product_after_discount: product.product_after_discount ? product.product_after_discount : 0,
            product_discount_amount: product.product_discount_amount ? product.product_discount_amount : 0,
            quantity: setQunatity,
            Title: product.Title,
            Sku: product.Sku,
            Price: setQunatity * parseFloat(product.Price),
            product_id: product.WPID,
            variation_id: 0,
            isTaxable: product.Taxable,
            tick_event_id: tick_data._event_name,
            ticket_status: product.IsTicket,
            product_ticket: ticketFields,
            old_price: product.old_price,
            incl_tax: product.incl_tax,
            excl_tax: product.excl_tax,
            discount_type: product.discount_type ? product.discount_type : "",
            new_product_discount_amount: product ? product.new_product_discount_amount : 0,
            TaxStatus: product ? product.TaxStatus : "",
            tcForSeating: tcForSeating,
            TaxClass: product ? product.TaxClass : '',
        }
        var qty = 0;
        cartproductlist.map(item => {
            if (product.WPID == item.product_id) {
                qty = item.quantity;
            }
        })
        //  add simple product with below condotions
        var product_is_exist = (product.ManagingStock == false && product.StockStatus == "outofstock") ? "outofstock" :
            (product.StockStatus == null || product.StockStatus == 'instock') && product.ManagingStock == false ? "Unlimited" : (typeof product.StockQuantity != 'undefined') && product.StockQuantity != '' ? qty < product.StockQuantity : '0'
        if (product_is_exist == '0') {
            return 'outofstock';
        }
        if (product_is_exist !== 'outofstock' && product_is_exist !== '0' && product_is_exist == true || product_is_exist == 'Unlimited') {
            //Added this code to replace the product at the existing position in the case of edit
            if (product.hasOwnProperty("selectedIndex")) {
                cartlist[product.selectedIndex] = data;
            }
            else
            {
                cartlist.push(data);
            }
            // cartlist.push(data);
            //Android Call----------------------------
            var totalPrice = 0.0;
            cartlist && cartlist.map(item => {
                totalPrice += item.Price;
            })
            //androidDisplayScreen(data.Title, data.Price, totalPrice, "cart");
            //-----------------------------------------
            stockUpdateQuantity(cartlist, data, product)
            addtoCartProduct(cartlist);  // this.state.cartproductlist
        } else {
            return 'outofstock';
        }
    }
}
export const deleteProduct = (item) => {
    var product = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];//
    var productx = localStorage.getItem("PRODUCTX_DATA") ? JSON.parse(localStorage.getItem("PRODUCTX_DATA")) : [];//
    var tikeraSelectedSeats = localStorage.getItem('TIKERA_SELECTED_SEATS') ? JSON.parse(localStorage.getItem('TIKERA_SELECTED_SEATS')) : [];
    if (tikeraSelectedSeats.length > 0) {
        tikeraSelectedSeats.map((items, index) => {
            if (parseInt(items.chart_id) == parseInt(item.product_id)) {
                tikeraSelectedSeats.splice(index, 1);
            }
        })
        localStorage.setItem('TIKERA_SELECTED_SEATS', JSON.stringify(tikeraSelectedSeats))
    }
    var i = 0;
    var index;
    for (i = 0; i < product.length; i++) {
        if ((typeof item.product_id !== 'undefined') && item.product_id !== null) {
            if (item.variation_id !== 0) {
                if (product[i].variation_id == item.variation_id)
                    index = i;
            }
            else {
                if (product[i].product_id == item.product_id && product[i].strProductX == item.strProductX)
                    index = i;
            }

        } else {
            if (product[i].Title == item.Title) {
                index = i;
            }
        }
    }
    product.splice(index, 1);
    //delete productx
    var j = 0;
    var xindex;
    for (j = 0; j < productx.length; j++) {
        if ((typeof item.product_id !== 'undefined') && item.product_id !== null) {
            // we hvae added item.strProductX == undefined condistion for park sale edit case becs we dont have strProductX in cardProductList localstorage 
            if (productx[j].product_id == item.product_id && (productx[j].strProductX == item.strProductX || (item.strProductX == undefined && productx[j].strProductX == ""))) {
                xindex = j;
            }
        }
    }
    xindex !== undefined && productx.splice(xindex, 1);

    if (product.length == 0) {
        var checklist = localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST'))
        if (checklist && (checklist.status == "pending" || checklist.status == "park_sale" || checklist.status == "lay_away" || checklist.status == "on-hold")) {
            var udid = get_UDid('UDID');
            //this.setState({ isLoading: true })
            localStorage.removeItem('PENDING_PAYMENTS');
            // this.props.dispatch(checkoutActions.orderToCancelledSale(checklist.order_id, udid));
        }
        localStorage.removeItem('CHECKLIST');
        localStorage.removeItem("CART");
        localStorage.removeItem("PRODUCT");
        localStorage.removeItem("SINGLE_PRODUCT");
        localStorage.removeItem("CARD_PRODUCT_LIST");
        localStorage.removeItem('TIKERA_SELECTED_SEATS');
        localStorage.removeItem("PRODUCTX_DATA");

        addtoCartProduct(null);

        // const { dispatch } = this.props;
        // if(dispatch){
        // dispatch(cartProductActions.addtoCartProduct(null));
        // dispatch(cartProductActions.singleProductDiscount())
        // dispatch(cartProductActions.showSelectedProduct(null));
        // dispatch(cartProductActions.addInventoryQuantity(null,null));
        // }
    } else {
        addtoCartProduct(product);
        // const { dispatch } = this.props;
        // localStorage.setItem("PRODUCTX_DATA", JSON.stringify(productx));
        // if(dispatch){
        // dispatch(cartProductActions.addtoCartProduct(product));
        // dispatch(cartProductActions.showSelectedProduct(null));
        // dispatch(cartProductActions.addInventoryQuantity(null));
        // }
    }
    //this.props.simpleProductData();

    //Android Call----------------------------
    //androidDisplayScreen(item.Title, 0, 0, "deleteproduct");
    //-----------------------------------------
}

export const removeCheckOutList = () => {
    //const { dispatch } = this.props;

    var checklist = localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST'))
    if (checklist && (checklist.status == "pending" || checklist.status == "park_sale" || checklist.status == "lay_away" || checklist.status == "on-hold")) {
        this.setState({ isLoading: true })
        var udid = get_UDid('UDID');
        //this.props.dispatch(checkoutActions.orderToCancelledSale(checklist.order_id, udid));
        localStorage.removeItem('PENDING_PAYMENTS');
    }
    var status = 'null'
    var item = []
    localStorage.removeItem('CHECKLIST');
    localStorage.removeItem('oliver_order_payments');
    localStorage.removeItem('AdCusDetail');
    localStorage.removeItem('TIKERA_SELECTED_SEATS');
    localStorage.removeItem("CART");
    localStorage.removeItem('CARD_PRODUCT_LIST');
    localStorage.removeItem("PRODUCT");
    localStorage.removeItem("SINGLE_PRODUCT");
    localStorage.removeItem("PRODUCTX_DATA");
    //this.props.ticketDetail(status, item)
    addtoCartProduct(null);
}

export const addtoCartProduct = (cartproductlist) => {

    var TAX_CASE = typeOfTax();
    var udid = get_UDid('UDID')
    var updateProductList = null;
    //-----update quantity and price for multiple product ----------------------------------------
    var newCartList = []
    cartproductlist && cartproductlist.map((item, index) => {
        var isProdAddonsType = "";// CommonJs.checkForProductXAddons(item.product_id);// check for productX is Addons type products
        var _discount_amount = 0.00;
        if (typeof item.product_id == 'undefined') {
            newCartList.push(item);
        }
        const countTypes = cartproductlist.filter(prd => prd.product_id === item.product_id && prd.variation_id == item.variation_id && prd.Title == item.Title
            && (prd.strProductX == undefined || prd.strProductX == item.strProductX)
        );
        var _price = 0.0;
        var _qty = 0;
        var _afterDiscount = 0;
        var new_incl_tax = 0;
        countTypes.map(nitem => {
            _price = _price + nitem.Price;
            _qty = _qty + nitem.quantity;
            // ** get new inclusive tax in case of discount number, when we add number discont on same item that added on cart already...*/
            //new_incl_tax = nitem.isTaxable==true? getInclusiveTax( nitem.discount_amount >0? nitem.after_discount: (nitem.old_price*_qty) , nitem.TaxClass):0;
            new_incl_tax = getInclusiveTax((nitem.old_price * _qty) - (nitem.discount_type == "Number" ? nitem.product_discount_amount : nitem.product_discount_amount * _qty), nitem.TaxClass)

            /// ** minus total price with new total inclusive tax, and discount amount to get final after discount.. */
            _afterDiscount = nitem.discount_type == "Number" && nitem.incl_tax && nitem.after_discount ?
                ((nitem.old_price) * _qty) - nitem.product_discount_amount - new_incl_tax
                : nitem.discount_amount > 0 ? nitem.after_discount : (nitem.old_price * _qty) - (nitem.discount_amount * (nitem.discount_type == "Percentage" ? _qty : 1))

            //  _afterDiscount= nitem.discount_type == "Number" && nitem.incl_tax && nitem.after_discount ?
            //   ((nitem.old_price ) *_qty)- nitem.product_discount_amount  - new_incl_tax
            //     : (nitem.old_price *_qty) - (nitem.product_discount_amount *(nitem.discount_type == "Percentage" ? _qty : 1))  - (nitem.incl_tax ? new_incl_tax : 0)


        })

        if ((item.discount_type == 'Percentage' || !item.discount_type) && item.discount_amount && item.discount_amount !== 0) {
            _discount_amount = item.product_discount_amount * _qty;
            if (isProdAddonsType && isProdAddonsType == true) {
                _discount_amount = item.product_discount_amount; // don not multiply by quantity for addons
            }
        } else if (item.discount_type == 'Number' && item.product_discount_amount !== 0) {
            _discount_amount = item.product_discount_amount;
        }



        var _newITem = {
            Price: _price,
            Sku: item.Sku,
            Title: item.Title,
            isTaxable: item.isTaxable,
            line_item_id: item.line_item_id,
            product_id: item.product_id,
            quantity: _qty,
            after_discount: _afterDiscount, //item.after_discount ? item.after_discount : 0, //
            discount_amount: _discount_amount,
            variation_id: item.variation_id,
            cart_after_discount: item.cart_after_discount ? item.cart_after_discount : 0,
            cart_discount_amount: item.cart_discount_amount ? item.cart_discount_amount : 0,
            product_after_discount: item.product_after_discount ? item.product_after_discount : 0,
            product_discount_amount: item.product_discount_amount ? item.product_discount_amount : 0,
            old_price: item.old_price ? item.old_price : 0,
            incl_tax: item.incl_tax ? item.incl_tax : 0,
            excl_tax: item.excl_tax ? item.excl_tax : 0,
            ticket_status: item.ticket_status,/////ticket
            tick_event_id: item.tick_event_id,
            ticket_info: item.ticket_info ? item.ticket_info : [], /////ticket
            product_ticket: item.product_ticket ? item.product_ticket : '',
            discount_type: item.discount_type ? item.discount_type : "",
            new_product_discount_amount: item ? item.new_product_discount_amount : 0,
            TaxStatus: item ? item.TaxStatus : '',// updateby shakuntala jatav, date:03-06-2019 , description: tax is applicable for per items is yes or not.
            //   ticket_cart_display_status:item.ticket_cart_display_status?item.ticket_cart_display_status:''
            tcForSeating: item.tcForSeating ? item.tcForSeating : "",
            TaxClass: item ? item.TaxClass : '',
            Type: item && item.Type ? item.Type : '', // added product Type in checklist
            strProductX: item.strProductX ? item.strProductX : undefined,
            addons_meta_data: item.addons_meta_data ? item.addons_meta_data : "",
            psummary: item.psummary ? item.psummary : ''
        }
        if (item.hasOwnProperty("pid")) {
            _newITem["pid"] = item.pid;
        }
        // set Price for productX from productX localstorage.
        var prodXData = localStorage.getItem("PRODUCTX_DATA") ? JSON.parse(localStorage.getItem("PRODUCTX_DATA")) : 0
        // cartproductlist && cartproductlist.map(pro => {
        var incr = 1
        var productXSingleData = prodXData && prodXData.map(prodX => {
            if (prodX.product_id == _newITem.product_id && incr && prodX.strProductX == _newITem.strProductX) {
                incr = 0
                var productXItemPrice = prodX && prodX.line_subtotal ? prodX.line_subtotal : 0
                var productXItemTax = prodX && prodX.line_tax ? prodX.line_tax : 0
                // _newITem.Price = productXItemPrice;
                //commented this line because : -we have already updated the old_price 28-07-20022
                //_newITem.old_price = TAX_CASE == 'incl' ? (productXItemPrice + productXItemTax) / prodX.quantity : productXItemPrice / prodX.quantity

                var cartData = localStorage.getItem('CARD_PRODUCT_LIST') && JSON.parse(localStorage.getItem('CARD_PRODUCT_LIST'))
                cartData && cartData.map(itm => {
                    if (itm.product_id == _newITem.product_id && countTypes.length > 1) {
                        _newITem.Price = TAX_CASE == 'incl' ? itm.Price + productXItemPrice + productXItemTax : itm.Price + productXItemPrice;
                    }
                })
            }
        })
        // })
        // end
        _discount_amount = 0;
        var _newItemExist = newCartList && newCartList.filter(prd => prd.product_id === item.product_id && prd.variation_id == item.variation_id && prd.Title == item.Title
            && (prd.strProductX == undefined || item.strProductX == undefined || prd.strProductX == item.strProductX));
        if ((_newItemExist) && _newItemExist.length == 0) {
            newCartList.push(_newITem);
        } else {
            _newItemExist = _newITem
            newCartList.map(newItem => {
                if (newItem.product_id === _newITem.product_id && newItem.variation_id == _newITem.variation_id && newItem.Title == _newITem.Title && (newItem.strProductX == _newITem.strProductX)) {
                    newItem.discount_amount = _newITem.discount_amount;
                    newItem.cart_after_discount = _newITem.cart_after_discount;
                    newItem.cart_discount_amount = _newITem.cart_discount_amount;
                    newItem.product_after_discount = _newITem.product_after_discount;
                    newItem.product_discount_amount = _newITem.product_discount_amount;
                    newItem.old_price = _newITem.old_price ? _newITem.old_price : 0;
                    newItem.incl_tax = _newITem.incl_tax ? _newITem.incl_tax : 0;
                    newItem.excl_tax = _newITem.excl_tax ? _newITem.excl_tax : 0;
                    newItem.discount_type = _newITem.discount_type;
                    newItem.after_discount = _newITem.after_discount
                    newItem.new_product_discount_amount = _newITem.new_product_discount_amount ? _newITem.new_product_discount_amount : 0;
                }
            })
        }
    })
    cartproductlist = getTaxCartProduct(newCartList);

    var totalPrice = 0;
    var customefee = 0; //should not include into discount
    var totalCartProductDiscount = 0;
    cartproductlist && cartproductlist.map((item, index) => {
        var product_after_discount = 0;
        var isProdAddonsType = "";// CommonJs.checkForProductXAddons(item.product_id);// check for productX is Addons type products

        if (item.product_id) {//donothing
            totalPrice += item.Price;
            //$ Overall discount amount issue while increasing the quantity - START
            if (item.discount_type == "Percentage") {
                totalCartProductDiscount += item.product_discount_amount * item.quantity;
                product_after_discount += parseFloat(item.product_discount_amount * item.quantity);
            }
            else {
                totalCartProductDiscount += item.product_discount_amount;
                product_after_discount += parseFloat(item.product_discount_amount);
            }
            //END

            // totalCartProductDiscount +=item.product_discount_amount * item.quantity;
            // product_after_discount += parseFloat(item.product_discount_amount * item.quantity); 
            if (isProdAddonsType && isProdAddonsType == true) {
                product_after_discount = 0
                product_after_discount += parseFloat(item.product_discount_amount); // quantity comment for addons
            }
        } else {
            customefee += item.Price;
        }
        if (item.product_discount_amount !== 0 && item.TaxStatus !== 'none') {
            if (TAX_CASE == "incl") {
                var incl_tax = 0;
                if (item.discount_type == "Percentage") {
                    //incl_tax = getInclusiveTax(item.Price - (product_after_discount > 0 ? (product_after_discount) : item.discount_amount), item.TaxClass)
                    //Now calculating the tax on Price with inclusive tax... 
                    incl_tax = getInclusiveTax((product_after_discount > 0 ? item.Price - product_after_discount : item.Price), item.TaxClass)
                } else {
                    incl_tax = getInclusiveTax(item.Price - (item.discount_amount ? item.discount_amount : 0), item.TaxClass)
                }
                item["incl_tax"] = incl_tax
            } else {
                var excl_tax = 0;
                if (item.discount_type == "Percentage") {
                    excl_tax = getExclusiveTax(item.after_discount, item.TaxClass)
                    //excl_tax = getExclusiveTax(item.after_discount * item.quantity, item.TaxClass)// 
                    if (isProdAddonsType && isProdAddonsType == true) {
                        excl_tax = getExclusiveTax(item.after_discount, item.TaxClass)// quantity comment for addons
                    }
                } else {
                    excl_tax = getExclusiveTax(item.Price - (item.discount_amount ? item.discount_amount : 0), item.TaxClass)
                }
                item["excl_tax"] = excl_tax
            }
        }
    })
    var cart = localStorage.getItem("CART") ? JSON.parse(localStorage.getItem("CART")) : null

    var incl_tax = 0;
    var excl_tax = 0;
    if (cart !== null) {
        cartproductlist && cartproductlist.map(item => {
            var product_after_discount = 0;
            var isProdAddonsType = "";// CommonJs.checkForProductXAddons(item.product_id);
            // product_after_discount += parseFloat(item.product_discount_amount);
            // var product_discount_amount = item.product_discount_amount; // remove quantity for test 

            //  multiply by quantity in percentage discount case only...
            var product_discount_amount = item.discount_type == "Percentage" ? item.product_discount_amount * item.quantity : item.product_discount_amount; // test 
            var discount_amount = item.discount_amount ? item.discount_amount * item.quantity : 0;
            var price = item.Price;
            var discount = parseFloat(cart.discount_amount)
            var Tax = parseFloat(cart.Tax_rate);
            var discount_amount_is = 0;
            var afterDiscount = 0;
            var new_price = 0.00;
            var cart_after_discount = 0;
            var cart_discount_amount = 0;
            if (item.product_id) {
                price = parseFloat(price - parseFloat(product_discount_amount));
                product_after_discount += parseFloat(item.product_discount_amount * item.quantity);
                if (isProdAddonsType && isProdAddonsType == true) {
                    product_after_discount = 0
                    product_after_discount += parseFloat(item.product_discount_amount); // quantity comment for addons
                }
                if (price == 0) {
                    cart_after_discount = 0.00;
                    cart_discount_amount = 0.00;
                    new_price = 0.00;
                } else {
                    if (cart.discountType == 'Percentage') {
                        if (discount > 100) {
                            localStorage.removeItem("CART")
                            console.log(LocalizedLanguage.discountMoreThenMsg)
                            //$('#no_discount').modal('show')
                        } else {
                            var incl_tax = 0
                            discount_amount_is = percentWiseDiscount(price, discount);
                            if (item.TaxStatus !== 'none') {
                                if (TAX_CASE == 'incl') {
                                    incl_tax = getInclusiveTax(price, item.TaxClass)
                                    //item["incl_tax"] = incl_tax

                                    //discount_amount_is = percentWiseDiscount(price - incl_tax, discount);
                                    discount_amount_is = percentWiseDiscount(price, discount);

                                }
                            }
                            // afterDiscount = price - incl_tax - discount_amount_is;
                            afterDiscount = price - discount_amount_is;
                            cart_after_discount = afterDiscount;
                            cart_discount_amount = discount_amount_is;
                            new_price = price - parseFloat(cart_discount_amount);
                            var total_tax = afterDiscount + (afterDiscount * Tax / 100.00);
                            if (new_price == price) {
                                new_price = 0.00;
                            }
                        }
                    } else {
                        var new_discount = NumberWiseDiscount((totalPrice - totalCartProductDiscount), discount);
                        if (new_discount > 100) {
                            localStorage.removeItem("CART")
                            console.log(LocalizedLanguage.discountMoreThenMsg)
                            // $('#no_discount').modal('show')
                        } else {
                            discount_amount_is = percentWiseDiscount(price, new_discount);
                            afterDiscount = price - discount_amount_is;
                            cart_after_discount = afterDiscount;
                            cart_discount_amount = parseFloat(discount_amount_is);
                            new_price = price - parseFloat(cart_discount_amount);
                            if (new_price == price) {
                                new_price = 0.00;
                            }
                        }
                    }
                }
                item["Sku"] = item.Sku;
                item["cart_after_discount"] = parseFloat(cart_after_discount);
                item["cart_discount_amount"] = parseFloat(cart_discount_amount);
                // item["after_discount"] = new_price
                item["discount_amount"] = parseFloat(cart_discount_amount) + parseFloat(product_discount_amount);
                if (item.discount_amount && item.discount_amount !== 0 && item.TaxStatus !== 'none') {
                    if (TAX_CASE == 'incl') {
                        incl_tax = getInclusiveTax((item.discount_amount > 0 ? cart_after_discount : item.Price), item.TaxClass)
                        // incl_tax = getInclusiveTax(item.Price - (product_discount_amount > 0 ? product_discount_amount : item.discount_amount), item.TaxClass)
                        //incl_tax = getInclusiveTax(item.Price- item.discount_amount, item.TaxClass)
                        item["incl_tax"] = incl_tax
                    } else {
                        excl_tax = getExclusiveTax(item.Price - item.discount_amount, item.TaxClass);
                        item["excl_tax"] = excl_tax
                    }
                } else {
                    if (item.TaxStatus !== 'none') {
                        if (TAX_CASE == 'incl') {
                            incl_tax = getInclusiveTax(item.Price, item.TaxClass)
                            item["incl_tax"] = incl_tax
                        } else {
                            excl_tax = getExclusiveTax(item.Price, item.TaxClass);
                            item["excl_tax"] = excl_tax
                        }
                    }
                }
                // updated after discount 
                item["after_discount"] =
                    item ?
                        ((item.old_price) * item.quantity) - (item.cart_discount_amount + product_discount_amount) - item.incl_tax
                        : new_price
            }
        })
    }
    localStorage.setItem("CARD_PRODUCT_LIST", JSON.stringify(cartproductlist));
    return cartproductlist;

}

export const singleProductDiscount = (isProductX = false, productxQty = null, qty) => {
    //var qty = $('#qualityUpdater').val() || 1;
    var qty=1;
    if (isProductX && isProductX == true && productxQty) {
        qty = productxQty;
    }
    var product = localStorage.getItem("PRODUCT") ? JSON.parse(localStorage.getItem("PRODUCT")) : null
    var product_list = localStorage.getItem("SINGLE_PRODUCT") ? JSON.parse(localStorage.getItem("SINGLE_PRODUCT")) : null
    var product_after_discount = 0;
    var single_product = null;
    if (product !== null && product_list !== null) {
        var product_id = 0;
        var cart_after_discount = 0;

        var cart_discount_amount = product_list.cart_discount_amount ? parseFloat(product_list.cart_discount_amount) : 0;
        var price = 0;
        var discount = parseFloat(product.discount_amount)
        var Tax = parseFloat(product.Tax_rate);
        var product_after_discount = 0;
        var product_discount_amount = 0;
        var discount_amount_is = 0;
        var afterDiscount = 0;
        var new_price = 0.00;
        if (product_list.Type !== "variable") {
            product_id = product_list.WPID ? product_list.WPID : product_list.product_id;;
            single_product = product_list;
        } else {
            if (isProductX == false) {
                var new_single_product = product_list.Variations && product_list.Variations.filter(item => item.WPID === product.Id);
                single_product = new_single_product && new_single_product[0];
                if (typeof single_product === "undefined") {
                    single_product = product_list && product_list;
                }
                product_id = product_list.WPID ? product_list.WPID : product_list.product_id;
            } else {
                single_product = product_list && product_list;
                product_id = product_list.WPID ? product_list.WPID : product_list.product_id;
            }

        }
        // localStorage.removeItem("SINGLE_PRODUCT");
        // localStorage.removeItem("PRODUCT")
        price = single_product && typeof (single_product) !== undefined && single_product.Price ? single_product.Price : 0;
        var TAX_CASE = typeOfTax();
        if (product_id) {
            price = parseFloat(price);
            var isProdAddonsType = '';//CommonJs.checkForProductXAddons(product_id);// check for productX is Addons type products
            if (price == 0) {
                product_after_discount = 0;
                product_discount_amount = 0;
                new_price = 0.00;
            } else {
                if (product.discountType == 'Percentage') {
                    if (discount > 100) {
                        localStorage.removeItem("PRODUCT")
                        localStorage.removeItem("SINGLE_PRODUCT")
                        // alert('more than 100% discount not applicable');
                        console.log(LocalizedLanguage.discountMoreThenMsg)
                        //$('#no_discount').modal('show')
                    } else {

                        // var TAX_CASE = typeOfTax();
                        var incl_tax = 0;
                        var productDiscount = 0;
                        productDiscount = percentWiseDiscount(price, discount);
                        if (single_product.TaxStatus !== 'none') { //single_product.discount_amount !== 0 &&
                            if (TAX_CASE == 'incl') {
                                incl_tax = getInclusiveTax(single_product.Price, single_product.TaxClass)
                                //item["incl_tax"] = incl_tax
                                // productDiscount = percentWiseDiscount(price - incl_tax, discount);
                                productDiscount = percentWiseDiscount(price, discount);

                            } else {
                                productDiscount = percentWiseDiscount(price, discount);
                            }
                        }

                        // afterDiscount = (price - incl_tax - productDiscount) * (isProductX && isProductX==true ? qty:1);
                        afterDiscount = (price - productDiscount) * (isProductX && isProductX == true ? qty : 1);
                        discount_amount_is = productDiscount;
                        //var _disc = percentWiseDiscount(price, discount);
                        // product_after_discount = price - _disc;
                        // product_discount_amount = _disc;
                        product_after_discount = afterDiscount;
                        product_discount_amount = discount_amount_is;
                    }
                } else {

                    TAX_CASE = typeOfTax();
                    var incl_tax_num = 0;
                    var productDiscount = 0;
                    if (single_product.discount_amount !== 0 && single_product.TaxStatus !== 'none') {
                        if (TAX_CASE == 'incl') {
                            incl_tax_num = getInclusiveTax(single_product.Price - discount, single_product.TaxClass)
                            // productDiscount = percentWiseDiscount(price - incl_tax_num, discount);
                        }
                    }

                    var discount_percent = NumberWiseDiscount(price * qty, discount)
                    if (discount_percent > 100) {
                        localStorage.removeItem("PRODUCT")
                        localStorage.removeItem("SINGLE_PRODUCT")
                        //$('#no_discount').modal('show')
                        console.log(LocalizedLanguage.discountMoreThenMsg)
                    } else {
                        discount_amount_is = percentWiseDiscount(price * qty, discount_percent)
                        afterDiscount = price * qty - discount_amount_is;
                        if (isProdAddonsType && isProdAddonsType == true) {
                            afterDiscount = price - incl_tax_num - discount_amount_is; // minus incl_tax_num for addons in case of number discount
                        }
                        product_after_discount = afterDiscount;
                        product_discount_amount = parseFloat(discount_amount_is);
                        var total_tax = afterDiscount + (afterDiscount * Tax / 100.00);
                    }
                }
            }
            if (single_product && single_product !== null) {
                single_product["product_after_discount"] = parseFloat(product_after_discount)
                single_product["product_discount_amount"] = parseFloat(product_discount_amount)
                single_product["after_discount"] = afterDiscount
                single_product["discount_amount"] = parseFloat(cart_discount_amount) + parseFloat(product_discount_amount);
                single_product["discount_type"] = product.discountType ? product.discountType : 'Number'
                single_product["new_product_discount_amount"] = discount

                localStorage.setItem("SINGLE_PRODUCT", JSON.stringify(single_product))
            }

        }
    }
    // return dispatch => {
    //     dispatch(request());
    //     dispatch(success(single_product));
    // };
    // function request() { return { type: cartProductConstants.PRODUCT_SINGLE_ADD_REQUEST } }
    // function success(single_product) { return { type: cartProductConstants.PRODUCT_SINGLE_ADD_SUCCESS, single_product } }
}

// addProductXDiscount() {
//     var selectedProductData = this.state.cartlistSelected
//     var productX_data = localStorage.getItem('PRODUCTX_DATA') && JSON.parse(localStorage.getItem('PRODUCTX_DATA'));
//     if (productX_data && selectedProductData) {
//         var data = productX_data && productX_data.find(item => item.product_id == selectedProductData.WPID && item.strProductX == JSON.stringify(this.state.strProductX))
//         var product = {
//             type: 'product',
//             discountType: data ? data.discount_type == "Percentage" ? 'Percentage' : 'Number' : '',
//             discount_amount: data ? data.discount_amount : 0,
//             Tax_rate: 0,
//             Id: selectedProductData.WPID
//         }
//         // added price and old  price here for addons type productx 
//         var selectedProductX = { ...selectedProductData }
//         var isProdAddonsType = CommonJs.checkForProductXAddons(selectedProductX.WPID);
//         //if(isProdAddonsType && isProdAddonsType == true){  //update product old price and price with productx line_subtotal
//         var taxType = typeOfTax();

//         selectedProductX.Price = taxType == 'incl' ? (data.line_subtotal + data.line_tax) / data.quantity : data.line_subtotal / data.quantity
//         selectedProductX.old_price = taxType == 'incl' ? (data.line_subtotal + data.line_tax) / data.quantity : data.line_subtotal / data.quantity

//         localStorage.setItem("PRODUCT", JSON.stringify(product))
//         localStorage.setItem("SINGLE_PRODUCT", JSON.stringify(selectedProductX))
//         this.props.dispatch(cartProductActions.singleProductDiscount(true, data.quantity));
//     }
// }

// const extensionArray=(customTags)=> {
//     var customTagsField = new Array()
//     customTags && customTags.map((obj) => {
//         var urlData = '';
//         var displayVal = obj.display ? obj.display : urlData != '' ? urlData : obj.value;
//         var _price = (obj.field_type && obj.field_type != "custom_price") && obj.price ?
//             obj.price_type && obj.price_type == 'percentage_based' ? "(" + obj.price + "%)" : "($" + obj.price + ")"
//             : "";
//         var _displayname = (obj.name ? obj.name : obj.label ? obj.label : obj.key ? obj.key : '') + _price + ' - ' + displayVal;
//         customTagsField.push(_displayname);
//     });
//     return customTagsField.join(',');
// }
// const extensionArrayBundle=(customTags)=> {
//     var obj = '';
//     for (var key in customTags) {
//         if (customTags.hasOwnProperty(key)) {
//             var data = customTags[key];
//             var product = {};
//             if (data && data.hasOwnProperty("product_id")) {
//                 var id = data.hasOwnProperty("variation_id") ? data.variation_id : data.product_id;
//                 var addons = data.hasOwnProperty("addons") ? data.addons : null;
//                 var addonPrint = "";
//                 if (addons && typeof addons != "undefined" && addons.length > 0) {
//                     var addonPrint = this.extensionArray(addons);
//                     if (addonPrint != "")
//                         obj += addonPrint;
//                 }
//                 else if (id && typeof id != "undefined" && id != 0) {
//                     product = this.state.AllProductList.find(vitem => {
//                         return (vitem.WPID === parseInt(id))
//                     });
//                     if (typeof product != "undefined" && product && product.Title) {
//                         obj += obj != "" ? ", " : "";
//                         obj += product.Title;
//                     }
//                 }
//             }
//         }
//     }
//     return obj;
// }
// export const addProductXtoCart=(productx_qty, single_product, _strProductX)=> {
//     //const { dispatch, showSelectedProduct } = this.props;
//     var getVariationProductData = single_product;//this.state.cartlistSelected;
//     var taxType = typeOfTax();
//     //var ticket_Data = this.state.ticket_status == true ? localStorage.getItem('ticket_list') ? JSON.parse(localStorage.getItem('ticket_list')) : '' : ''
//     var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
//     var tick_data = getVariationProductData && getVariationProductData.TicketInfo ? JSON.parse(getVariationProductData.TicketInfo) : '';
//     //this.setState({ isProductxDiscount: false })
//     var data = null;
//     // test added



//     var pro_id = getVariationProductData && getVariationProductData.WPID ? getVariationProductData.WPID : getVariationProductData && getVariationProductData.product_id ? getVariationProductData.product_id : 0;
//     var prodXData = localStorage.getItem("PRODUCTX_DATA") ? JSON.parse(localStorage.getItem("PRODUCTX_DATA")) : 0
//     //
//     // var isProductXupdate = false

//     var SingleProduct = null;
//     if (single_product && single_product.WPID) {
//         if (single_product.WPID == getVariationProductData.WPID) {
//             SingleProduct = single_product
//         } else {
//             SingleProduct = getVariationProductData
//         }
//     } else {
//         if (cartlist.length > 0) {
//             cartlist.map((prdId, index) => {
//                 if (prdId.product_id === getVariationProductData.WPID && getVariationProductData.selectedIndex == index) {
//                     SingleProduct = getVariationProductData
//                     SingleProduct['after_discount'] = prdId.after_discount;
//                     SingleProduct['product_discount_amount'] = prdId.product_discount_amount;
//                     SingleProduct['product_after_discount'] = prdId.product_after_discount;
//                     SingleProduct['new_product_discount_amount'] = prdId.new_product_discount_amount;
//                     SingleProduct['discount_amount'] = prdId.discount_amount;
//                     SingleProduct['discount_type'] = prdId.discount_type;
//                     SingleProduct['cart_after_discount'] = prdId.cart_after_discount;
//                     SingleProduct['cart_discount_amount'] = prdId.cart_discount_amount;
//                     SingleProduct['line_item_id'] = prdId.line_item_id;

//                     // test added 
//                     // prodXData && prodXData.map((prodX)=>{
//                     //     if(prodX && prodX.product_id == prdId.product_id){
//                     //         // SingleProduct['quantity'] = productx_qty + prdId.quantity;
//                     //         // isProductXupdate = true
//                     //         productx_qty = productx_qty + prdId.quantity
//                     //         prodX.quantity =  productx_qty
//                     //     }
//                     // }) 
//                     // localStorage.setItem("PRODUCTX_DATA", JSON.stringify(prodXData))
//                     //
//                 }
//             })
//         }
//     }
//     // var pro_id = getVariationProductData && getVariationProductData.WPID ? getVariationProductData.WPID : getVariationProductData && getVariationProductData.product_id ? getVariationProductData.product_id : 0;
//     // var prodXData = localStorage.getItem("PRODUCTX_DATA") ? JSON.parse(localStorage.getItem("PRODUCTX_DATA")) : 0

//     var productXSingleData = prodXData ? prodXData.find(prodX => prodX.product_id == pro_id && (_strProductX == "" || prodX.strProductX == _strProductX)) : 0
//     var productXItemPrice = productXSingleData && productXSingleData.line_subtotal
//     var productXItemTax = productXSingleData && productXSingleData.line_tax
//     var psummary = "";
//     if (productXSingleData && productXSingleData.addons && productXSingleData.addons.length > 0) {
//         psummary = extensionArray(productXSingleData.addons);
//         console.log("---x psummery---" + JSON.stringify(psummary));
//     }
//     else
//         if (productXSingleData && (productXSingleData.stamp || productXSingleData.composite_data)) {
//             if (productXSingleData.stamp)
//                 psummary = extensionArrayBundle(productXSingleData.stamp);
//             else if (productXSingleData.composite_data)
//                 psummary = extensionArrayBundle(productXSingleData.composite_data);
//             console.log("---Bundle psummery---" + psummary);
//         }
//     // var productXItemPrice = productXSingleData && productXSingleData.line_subtotal
//     // var productXItemTax = productXSingleData && productXSingleData.line_tax
//     if (productXSingleData && productXSingleData.cardSubToal)
//         productXItemPrice = productXSingleData && productXSingleData.cardSubToal

//     if (productXSingleData && productXSingleData.cardtax)
//         productXItemTax = productXSingleData && productXSingleData.cardtax

//     var _Price = productXItemPrice ? taxType == 'excl' ? productXItemPrice + parseFloat(productXItemTax) : parseFloat(productXItemPrice) : 0;

//     // var _incl_tax = 0;
//     // var _excl_tax=0;   
//     // if(taxType == 'excl' ) {
//     //     _excl_tax = productXItemTax
//     // }else if(taxType == 'incl'){
//     //     _incl_tax = productXItemTax
//     // }
//     //   console.log("getVariationProductData--",getVariationProductData)
//     data = {
//         line_item_id: SingleProduct ? SingleProduct.line_item_id : 0,
//         cart_after_discount: SingleProduct ? SingleProduct.cart_after_discount : 0,
//         cart_discount_amount: SingleProduct ? SingleProduct.cart_discount_amount : 0,
//         after_discount: SingleProduct ? SingleProduct.after_discount : 0,
//         // after_discount: SingleProduct ? SingleProduct.after_discount : 0,
//         discount_amount: SingleProduct ? SingleProduct.discount_amount : 0,
//         product_after_discount: SingleProduct ? SingleProduct.product_after_discount : 0,
//         product_discount_amount: SingleProduct ? SingleProduct.product_discount_amount : 0,
//         quantity: productx_qty > 0 ? productx_qty : getVariationProductData.StockQuantity,
//         Title: getVariationProductData && getVariationProductData !== undefined ? getVariationProductData.Title : "",
//         Sku: getVariationProductData && getVariationProductData !== undefined ? getVariationProductData.Sku : "",
//         //Price: productXItemPrice ? productXItemPrice : 0, // add productX price directly from productX data
//         // Price: productXItemPrice ? taxType == 'excl' ? productXItemPrice + parseFloat(productXItemTax) : parseFloat(productXItemPrice) : 0,
//         Price: _Price, // add productX price directly from productX data
//         product_id: getVariationProductData && getVariationProductData.WPID ? getVariationProductData.WPID : getVariationProductData && getVariationProductData.product_id ? getVariationProductData.product_id : 0,
//         variation_id: 0,
//         isTaxable: getVariationProductData.Taxable ? getVariationProductData.Taxable : null,
//         // old_price: getVariationProductData.old_price,
//         old_price: _Price/productx_qty,
//         incl_tax: getVariationProductData.incl_tax,
//         excl_tax: getVariationProductData.excl_tax,
//         ticket_status: getVariationProductData.IsTicket,
//         product_ticket: this.state.ticket_status == true && getVariationProductData.TicketInfo ? getVariationProductData.TicketInfo ? getVariationProductData.TicketInfo : '' : '',
//         tick_event_id: getVariationProductData.IsTicket == true ? tick_data._event_name : null,
//         discount_type: SingleProduct ? SingleProduct.discount_type : "",
//         new_product_discount_amount: SingleProduct ? SingleProduct.new_product_discount_amount : 0,
//         TaxStatus: getVariationProductData.TaxStatus,
//         tcForSeating: getVariationProductData.tcForSeating,
//         TaxClass: getVariationProductData.TaxClass,
//         ticket_info: getVariationProductData && getVariationProductData.TicketInfo ? getVariationProductData.TicketInfo : [],
//         Type: getVariationProductData && getVariationProductData.Type,
//         strProductX: productXSingleData && productXSingleData.strProductX ? productXSingleData.strProductX : "",
//         psummary: psummary
//     }
//     var product = getVariationProductData
//     var qty = 0;
//     cartlist.map((item, index) => {
//         if (product.WPID === item.product_id && index == product.selectedIndex) {
//             qty = item.quantity;
//         }
//     })
//     var qytt = this.state.Prodefaultqty !== null && typeof this.state.Prodefaultqty !== 'undefined' ? this.state.Prodefaultqty : this.state.variationDefaultQunatity;
//     var txtPrdQuantity = (productx_qty > 0) ? productx_qty : qytt
//     // if (parseInt(txtPrdQuantity) <= 0 && product.InStock == false) {
//     //     /* Created By:priyanka,Created Date:14/6/2019,Description:quantity msg poppup */
//     //     this.CommonMsg(LocalizedLanguage.productQty)
//     //     showModal('common_msg_popup');
//     //     return;
//     // }
//     if ((product.StockQuantity == 'Unlimited' || product.InStock == true || qty <= product.StockQuantity)) {
//         if (this.state.cartlistSelected && cartlist.length > 0) {
//             var isItemFoundToUpdate = false;
//             cartlist.map((item, index) => {
//                 if (typeof this.state.cartlistSelected !== 'undefined' && this.state.cartlistSelected !== null) {
//                     if (item.product_id == this.state.cartlistSelected.WPID && index == this.state.cartlistSelected.selectedIndex) {
//                         isItemFoundToUpdate = true;
//                         cartlist[index] = data
//                     }
//                     // var _index = -1;
//                     // if (this.state.cartlistSelected['selectedIndex'] >= 0) { _index = parseInt(this.state.cartlistSelected.selectedIndex) }
//                     // if (_index > -1 && this.state.cartlistSelected.selectedIndex == index) {
//                     //     isItemFoundToUpdate = true;
//                     //     cartlist[index] = data
//                     // }
//                 }
//             })
//             if (isItemFoundToUpdate == false) {
//                 cartlist.push(data);
//             }
//         } else {
//             cartlist.push(data);
//         }
//         // this.setState({
//         //     showSelectStatus: false,
//         //     variationfound: null
//         // })
//         // this.stockUpdateQuantity(cartlist, data);
//         localStorage.removeItem("PRODUCT");
//         localStorage.removeItem("SINGLE_PRODUCT")
//         dispatch(cartProductActions.addtoCartProduct(cartlist)); // this.state.cartproductlist
//         dispatch(cartProductActions.showSelectedProduct(null));
//         dispatch(cartProductActions.singleProductDiscount());
//         this.state.showSelectStatus = false;
//         this.state.variationDefaultQunatity = 1;
//     } else {
//         this.CommonMsg('Product is out of stock.');
//         showModal('common_msg_popup');
//     }
//     //Android Call----------------------------
//     var totalPrice = 0.0;
//     cartlist && cartlist.map(item => {
//         totalPrice += item.Price;
//     })
//     androidDisplayScreen(data.Title, data.Price, totalPrice, "cart");
//     //-----------------------------------------

// }
