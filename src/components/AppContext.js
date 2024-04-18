"use client";
import { SessionProvider } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext({});

export function cartProductPrice(cartProduct) {
    let price = cartProduct.basePrice * cartProduct.quantity;
    if (cartProduct.size) {
        price += cartProduct.size.price * cartProduct.quantity;
    }
    if (cartProduct.toppings?.length > 0) {
        for (const topping of cartProduct.toppings) {
            price += topping.price * cartProduct.quantity;
        }
    }
    if (cartProduct.giftBox) {
        price += 1.50 * cartProduct.quantity;
    }
    return price;
}

function combineProducts(cartProducts) {
    const combinedProducts = [];

    cartProducts.forEach(product => {
        const existingProduct = combinedProducts.find(p => {
            const hasSize = product.size && p.size;
            const sizesMatch = (!hasSize || (p.size && p.size._id === product.size._id));
            return (
                p._id === product._id &&
                sizesMatch &&
                p.giftBox === product.giftBox &&
                JSON.stringify(p.toppings.map(t => t._id).sort()) === JSON.stringify(product.toppings.map(t => t._id).sort())
            );
        });

        if (existingProduct) {
            existingProduct.quantity += product.quantity;
        } else {
            const newProduct = {
                ...product,
                quantity: product.quantity,
            };
            combinedProducts.push(newProduct);
        }
    });

    return combinedProducts;
}


export function AppProvider({children}) {
    const [cartProducts, setCartProducts] = useState([]);
    const ls = typeof window !== 'undefined' ? window.localStorage : null;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (ls && ls.getItem('cart')) {
            setCartProducts( JSON.parse( ls.getItem('cart') ) );
        }
        setLoading(false);
    }, []);

    function clearCart() {
        setCartProducts([]);
        saveCartProductsToLocalStorage([]);
    }

    function removeCartProduct(indexToRemove) {
        setCartProducts(prevCartProducts => {
            const newCartProducts = prevCartProducts.filter((v, index) => index !== indexToRemove);
            saveCartProductsToLocalStorage(newCartProducts);
            return newCartProducts;
        })
        toast.success('Product removed')
    }

    function updateQuantities(newQuantities) {
        // Make sure the newQuantities array has the same length as cartProducts
        if (newQuantities.length !== cartProducts.length) {
            console.error('Length of newQuantities array does not match the length of cartProducts');
            return;
        }

        // Create a copy of cartProducts and update the quantities
        const updatedProducts = cartProducts.map((product, index) => ({
            ...product,
            quantity: newQuantities[index],
        }));

        // Update the state with the new products containing updated quantities
        setCartProducts(updatedProducts);

        // Save the updated cartProducts array to local storage
        saveCartProductsToLocalStorage(updatedProducts);

        toast.success('Basket updated')
    }

    function saveCartProductsToLocalStorage(cartProducts) {
        if(ls) {
            ls.setItem('cart', JSON.stringify(cartProducts));
        }
    }

    function addToCart(product, size=null, toppings=[], giftBox=false, quantity) {
        setCartProducts(prevProducts => {
            quantity = quantity < 1 ? 1 : quantity
            const cartProduct = {...product, size, toppings, giftBox, quantity}
            const newProducts = [...prevProducts, cartProduct]
            const combinedProducts = combineProducts(newProducts);
            saveCartProductsToLocalStorage(combinedProducts);
            return combinedProducts;
        })
    }

    return(
        <SessionProvider>
            <CartContext.Provider value={{
                cartProducts, setCartProducts,
                addToCart, clearCart, removeCartProduct, updateQuantities, loading
            }}>
                {children}
            </CartContext.Provider>
        </SessionProvider>
    );
}