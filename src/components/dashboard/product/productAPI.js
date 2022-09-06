export function productAPI( parameter) {
      return localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
  }
  
  