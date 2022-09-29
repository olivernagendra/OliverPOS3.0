import { serverRequest } from '../../../CommonServiceRequest/serverRequest';
import { get_UDid } from '../localSettings';
export function getRatesAPI() {

    var UserLocation = localStorage.getItem('UserLocations') ? JSON.parse(localStorage.getItem('UserLocations')) : [];
    var UDID = get_UDid('UDID');
    var loc_country = "";
    var loc_country_state = "";
    var loc_city = "";
    var loc_postcode = "";
    var loc_address_1 = "";
    var isDemoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
    if (isDemoUser) {
        if (UserLocation && UserLocation.length > 0) {
            UserLocation.map(loc => {
                loc_country = loc.country_name;
                loc_country_state = loc.state_name;
                loc_city = loc.city;
                loc_postcode = loc.zip ? loc.zip.replace(/[^a-zA-Z0-9]/g, '') : ""; //to change all characters except numbers and letters
                loc_address_1 = loc.address_1;
            })
        } else {
            return;
            // history.push('/loginpin');
            //redirectToURL()
        }
    }
    else {
        if (UserLocation && localStorage.getItem("Location") && UserLocation.length > 0) {
            UserLocation.map(loc => {
                if (loc.id == localStorage.getItem("Location")) {
                    loc_country = loc.country_name;
                    loc_country_state = loc.state_name;
                    loc_city = loc.city;
                    loc_postcode = loc.zip ? loc.zip.trim() : "";// loc.zip.replace(/[^a-zA-Z0-9]/g, ''):"";
                    loc_address_1 = loc.address_1;
                }
            })
        }
        else {
            return;
            // history.push('/loginpin');
            //redirectToURL()
        }
    }
    //return serverRequest.clientServiceRequest('POST', `/Tax/Search?UDID=${UDID}&loc_country=${loc_country}&loc_country_state=${loc_country_state}&loc_city=${loc_city}&loc_postcode=${loc_postcode}&loc_address_1=${loc_address_1}`, '')
    return serverRequest.clientServiceRequest('POST', `/Tax/Search`, { UDID, loc_country, loc_country_state, loc_city, loc_postcode, loc_address_1 })
        .then(res => {
            if (res && res.is_success && res.is_success === true && res.content) {
                localStorage.setItem("TAXT_RATE_LIST", JSON.stringify(res.content))
            }
            return res
        }).catch(error => {
            return error
        });
}

export function getIsMultipleTaxSupportAPI() {
    return serverRequest.clientServiceRequest('GET', `/Tax/IsSupportMultipe`)
        .then(res => {
            if (res && res.is_success && res.is_success === true && res.content) {
                localStorage.setItem("multiple_tax_support", JSON.stringify(res.content))
            }
            return res
        }).catch(error => {
            return error
        });
}

export function getTaxRateListAPI() {
    try {
        return serverRequest.clientServiceRequest('GET', `/Tax/Get`, '')
            .then(tax_list => {
                if (tax_list && tax_list !== null && tax_list !== "undefined" && tax_list !== 'undefined' && tax_list.message == 'Success') {
                    localStorage.setItem("SHOP_TAXRATE_LIST", JSON.stringify(tax_list.content))
                }
                return tax_list;
            }).catch(error => console.log(error));
    }
    catch (error) {
        console.log(error);
        return error;
    }
}

export function updateTaxRateListAPI(updatetaxlist) {
    return updatetaxlist;
}
export function selectedTaxListAPI(selectetaxlist) {
    return selectetaxlist;
}

