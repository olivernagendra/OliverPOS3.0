import { get_UDid } from "../../common/localSettings";
import moment from 'moment';
import { getTaxCartProduct,getInclusiveTax,getExclusiveTax,typeOfTax } from "../../common/TaxSetting";
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

export const addSimpleProducttoCart=(product, ticketFields = null)=> {      
    //const { dispatch, checkout_list, cartproductlist } = this.props;
   var cartproductlist=[];
    var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
    if (cartlist.length > 0) {
        cartlist.map(findId => {
            if (findId.product_id === product.WPID) {
                product['after_discount'] = findId ? findId.after_discount : 0,
                    product['discount_amount'] = findId ? findId.discount_amount : 0,
                    product['product_after_discount'] = findId ? findId.product_after_discount : 0,
                    product['product_discount_amount'] = findId ? findId.product_discount_amount : 0,
                    product['discount_type'] = findId ? findId.discount_type : "",
                    product['new_product_discount_amount'] = findId ? findId.new_product_discount_amount : 0
            }
        });

    }
    // var setQunatity = 1;

    var setQunatity = product.quantity;
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
            cartlist.push(data);
            //Android Call----------------------------
            var totalPrice = 0.0;
            cartlist && cartlist.map(item => {
                totalPrice += item.Price;
            })
            //androidDisplayScreen(data.Title, data.Price, totalPrice, "cart");
            //-----------------------------------------
            stockUpdateQuantity(cartlist, data, product)
            if((!localStorage.getItem("APPLY_DEFAULT_TAX")) || localStorage.getItem("APPLY_DEFAULT_TAX")==null){
                setTimeout(() => {   
                    addtoCartProduct(cartlist);                     
                }, 400);
            }else{
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
            cartlist.push(data);
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
export const deleteProduct=(item)=> {
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
            if (productx[j].product_id == item.product_id && (productx[j].strProductX == item.strProductX|| (item.strProductX == undefined && productx[j].strProductX == ""))) {
                xindex = j;
            }
        }
    }
    xindex !== undefined && productx.splice(xindex, 1);

    if (product.length == 0) {
        var checklist = localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST'))
        if(checklist && (checklist.status == "pending" || checklist.status == "park_sale" || checklist.status == "lay_away" || checklist.status == "on-hold")){
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

export const removeCheckOutList=()=> {
    //const { dispatch } = this.props;

    var checklist = localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST'))
    if(checklist && (checklist.status == "pending" || checklist.status == "park_sale" || checklist.status == "lay_away" || checklist.status == "on-hold")){
        this.setState({isLoading : true})
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
            new_incl_tax = getInclusiveTax((nitem.old_price*_qty)-( nitem.discount_type == "Number" ? nitem.product_discount_amount : nitem.product_discount_amount*_qty ) , nitem.TaxClass)

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
                    incl_tax =  getInclusiveTax((product_after_discount > 0 ? item.Price- product_after_discount :item.Price ), item.TaxClass)
                } else {
                    incl_tax =  getInclusiveTax(item.Price - (item.discount_amount ? item.discount_amount : 0), item.TaxClass)
                }
                item["incl_tax"] = incl_tax
            } else {
                var excl_tax = 0;
                if (item.discount_type == "Percentage") {
                    excl_tax =  getExclusiveTax(item.after_discount, item.TaxClass)
                    //excl_tax = getExclusiveTax(item.after_discount * item.quantity, item.TaxClass)// 
                    if (isProdAddonsType && isProdAddonsType == true) {
                        excl_tax =  getExclusiveTax(item.after_discount, item.TaxClass)// quantity comment for addons
                    }
                } else {
                    excl_tax =  getExclusiveTax(item.Price - (item.discount_amount ? item.discount_amount : 0), item.TaxClass)
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
                            //$('#no_discount').modal('show')
                        } else {
                            var incl_tax = 0
                            discount_amount_is = percentWiseDiscount(price, discount);
                            if (item.TaxStatus !== 'none') {
                                if (TAX_CASE == 'incl') {
                                    incl_tax =  getInclusiveTax(price, item.TaxClass)
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
                        incl_tax =  getInclusiveTax((item.discount_amount > 0 ? cart_after_discount : item.Price), item.TaxClass)
                        // incl_tax = getInclusiveTax(item.Price - (product_discount_amount > 0 ? product_discount_amount : item.discount_amount), item.TaxClass)
                        //incl_tax = getInclusiveTax(item.Price- item.discount_amount, item.TaxClass)
                        item["incl_tax"] = incl_tax
                    } else {
                        excl_tax =  getExclusiveTax(item.Price - item.discount_amount, item.TaxClass);
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

