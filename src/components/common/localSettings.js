export const encode_UDid = (udid) => {
  var UD_ID = btoa(udid)
  localStorage.setItem('UDID', UD_ID)
  return 'UDID';
}

/*------------------UDID Localstorage -----------------*/
export const get_UDid = (UDID) => {
  var decodedString = localStorage.getItem('UDID');
  var decod = decodedString ? window.atob(decodedString) : '';
  var getudid = decod;
  return getudid;
}

export const getShopName = () => {
  var client = localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")) : '';
  return client && client.subscription_detail ? client.subscription_detail.company_name : "";

}
export const get_regName = () => {
  return localStorage.getItem('registerName') ? localStorage.getItem('registerName') : ''
}
export const get_regId = () => {
  return localStorage.getItem('register') ? localStorage.getItem('register') : ''
}
export const get_locName = () => {
  return localStorage.getItem('LocationName') ? localStorage.getItem('LocationName') : ''
}

export const get_userName = () => {
  var user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
  return user != "" ? user.display_name : '';
  //return localStorage.getItem('user_full_name') ? localStorage.getItem('user_full_name') : ''
}
export const get_userId = () => {
  return localStorage.getItem('userId') ? localStorage.getItem('userId') : ''
}

export const get_customerName = () => {
  var customer = localStorage.getItem('AdCusDetail') ? JSON.parse(localStorage.getItem('AdCusDetail')) : null;
  if (customer != null) {
    var name = customer.FirstName + " " + customer.LastName;
    if (name.trim() == "") { name = customer.Email }
    return { "Name": name, "Email": customer.Email }
  }
  else
    return null;
}
/*------------------ array ----------------------*/
export const chunkArray = (myArray, chunk_size) => {
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];
  for (index = 0; index < arrayLength; index += chunk_size) {
    var myChunk = myArray.slice(index, index + chunk_size);
    // Do something if you want with the group
    tempArray.push(myChunk);
  }
  return tempArray;
}


export const plusIconSize = (length) => {
  var sizeArray = [];
  for (var i = 1; i <= length; i++) {
    sizeArray.push(i);
  }

  return sizeArray

}




