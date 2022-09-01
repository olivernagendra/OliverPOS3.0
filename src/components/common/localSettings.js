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

export const get_regName = () => {
  return localStorage.getItem('registerName') ? localStorage.getItem('registerName') : ''
}

export const get_locName = () => {
  return localStorage.getItem('LocationName') ? localStorage.getItem('LocationName') : ''
}

export const get_userName = () => {
  return localStorage.getItem('user_full_name') ? localStorage.getItem('user_full_name') : ''
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




