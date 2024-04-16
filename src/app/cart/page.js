"use client";
import { CartContext, cartProductPrice } from "@/components/AppContext"
import Image from "next/image";
import { useContext, useEffect, useState } from "react"
import Trash from "@/components/icons/Trash"
import QuantityButton from "@/components/layout/QuantityButton"
import Link from "next/link";

export default function CartPage() {
    const {cartProducts, removeCartProduct, clearCart, updateQuantities, loading} = useContext(CartContext);
    const [quantity, setQuantity] = useState([]);
    const [disableUpdateButton, setDisableUpdateButton] = useState(true);

    useEffect(() => {
        // Map through cartProducts and extract quantities into an array
        const initialQuantities = cartProducts.map(product => product.quantity);
        setQuantity(initialQuantities); // Set the quantity array in state
    }, [cartProducts]); // Update quantity whenever cartProducts changes

    const setQuantityAtIndex = (index, value) => {
        setQuantity(prevQuantity => {
            const newQuantity = [...prevQuantity]; // Create a copy of the quantity array
            newQuantity[index] = value; // Set the value at the specified index
            return newQuantity; // Return the updated quantity array
        });
        setDisableUpdateButton(false);
    };

    if(loading) {
        return 'Loading...'
    }

    let total = cartProducts.reduce((totalPrice, product) => totalPrice + cartProductPrice(product), 0).toFixed(2);
    return(
        <section className="max-w-6xl mx-auto w-full mt-10 mb-28 px-5">
            <h1 className="font-ovo text-[2.5rem] mb-8 tracking-wider text-center">Shopping cart</h1>
            {cartProducts?.length === 0 && (
                <div>Your cart is currently empty</div>
            )}
            {cartProducts.length > 0 && (
                <div>
                    <div className="grid text-xs mt-10 lg:mt-5 pb-1 font-light tracking-widest" style={{gridTemplateColumns: '0.5fr 0.25fr 0.25fr' }}>
                        <div>PRODUCT</div>
                        <div className="mx-auto">QUANTITY</div>
                        <div className="ml-auto">TOTAL</div>
                    </div>
                    <div className="grid py-7 gap-y-8 border-t border-b border-thinGray mb-5" style={{gridTemplateColumns: '0.5fr 0.25fr 0.25fr' }}>
                        {cartProducts.map((product, index) => (
                            <>
                                <div className="flex">
                                    <div className="max-w-44 min-w-44 mr-4">
                                        <Image src={product.images[0]} width={240} height={240} />
                                    </div>
                                    <div>
                                        <Link href={'/product/'+product._id}>
                                            <h3 className="font-ovo text-2xl mb-1 hover:underline">{product.name}</h3>
                                        </Link>
                                        <div className="mb-1">
                                            £{(product.basePrice + (product.size ? product.size.price : 0)).toFixed(2)}
                                        </div>
                                        {product.toppings?.length > 0 && (
                                            <div className="text-sm max-w-72 text-gray-500 mb-0.5">
                                                Toppings: {product.toppings.map((topping, index) => (
                                                    <span key={topping.id}>
                                                        {`${topping.name}`}
                                                        {topping.price > 0 && ` (£${topping.price.toFixed(2)})`}
                                                        {index !== product.toppings.length - 1 && ", "}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {product.size && (
                                            <div className="text-sm max-w-72 text-gray-500 mb-0.5">
                                                Size: {product.size.name}
                                            </div>
                                        )}
                                        {product.giftBoxOption && (
                                            <div className="text-sm text-gray-500 mb-0.5">
                                                Gift box: {product.giftBox ? `Yes (£${(1.50).toFixed(2)} x ${product.quantity})` : 'No'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-start justify-center">
                                    {product.quantity && (
                                        <div className='h-12 w-32'>
                                            <QuantityButton quantity={quantity[index]} setQuantity={(value) => setQuantityAtIndex(index, value)} />
                                        </div>
                                    )}
                                    <div className="relative">
                                        <button className="absolute -right-9 top-2.5" type="button" onClick={() => removeCartProduct(index)}>
                                            <Trash />
                                        </button>
                                    </div>
                                </div>
                                <div className="ml-auto">
                                    £{cartProductPrice(product).toFixed(2)}
                                </div>
                    
                            </>
                        ))}
                    </div>
                    <div className="md:flex gap-x-6 justify-end mt-8">
                        <button type="button" className="md:max-w-60 md:mb-0 mb-4 max-w-full w-full border border-primary text-primary px-8 py-3.5" onClick={clearCart}>
                            CLEAR BASKET
                        </button>
                        <button type="button" disabled={disableUpdateButton} className="md:max-w-60 max-w-full w-full bg-primary text-white px-8 py-3.5 duration-200" 
                            onClick={() => {updateQuantities(quantity); setDisableUpdateButton(true)}}>
                            UPDATE BASKET
                        </button>
                    </div>
                    <div className="text-right mt-12">
                        <span className="font-ovo tracking-widest text-2xl">Subtotal</span>{' '}<span className="ml-3 text-2xl tracking-wider">£{total} GBP</span>
                    </div>
                    <Link href={'/checkout'}>
                        <button type="button" className="md:max-w-96 block ml-auto max-w-full w-full mt-6 bg-primary text-white px-8 py-4">
                            CHECKOUT
                        </button>
                    </Link>
                </div>
            )}
            
        </section>
    )
}