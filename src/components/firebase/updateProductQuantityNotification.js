import { UpdateProductInventoryDB } from "../loadProduct/loadProductSlice"
import { store } from "../../app/store"

export const updateQuantity = (productId) => {
   store.dispatch(UpdateProductInventoryDB([productId])) 
}

export const updatQuantityOnIndexDB = {
    updateQuantity
}

