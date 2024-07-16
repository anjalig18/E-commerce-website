import React, { createContext, useState } from 'react'
import { useEffect } from 'react';
import all_product from "../Components/Assests/all_product";

export const ShopContext = createContext(null);

const getDefaultCart = ()=> {
    let cart = {};
    for (let index = 0; index < all_product+1; index++) { //all_product.length
       cart[index] = 0;
    }
    return cart;
   }
 const ShopContextProvider = (props) =>{
    // const[all_product,setAll_Product] = useState([]);
    const[cartItems,setCartItems] = useState(getDefaultCart());
    
    // useEffect(()=>{
    //     fetch('http://localhost:4000/allproducts')
    //     .then((response)=>response.json())
    //     .then((data)=>setAll_Product(data))
    // },[])
    const addToCart = (itemId) => {
       setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
       console.log(cartItems);
    }
    const removeFromCart = (itemId) => {
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
     }
    
     const getTotalCartAmount = () => {
        let TotalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item));
                TotalAmount += itemInfo.new_price * cartItems[item];
            }
        }
        return TotalAmount;
    };
    const getTotalCartItems = ()=>{
        let TotalItem = 0;
        for(const  item in cartItems)
            {
                if(cartItems[item]>0){
                    TotalItem += cartItems[item];

                }
            }
            return TotalItem;
    }

    const contextValue = {getTotalCartItems,getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart};
    return(
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
 }
 export default ShopContextProvider;