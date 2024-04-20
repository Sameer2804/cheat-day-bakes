"use client";
import { cartProductPrice } from "@/components/AppContext"

import { CartContext } from "@/components/AppContext";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function OrderPage() {

    const {clearCart} = useContext(CartContext)
    const [order, setOrder] = useState(null);
    const {id} = useParams();
    useEffect(() => {
        if(typeof window.console !== "undefined") {
            if(window.location.href.includes('clear-cart=1')) {
                clearCart();
            }
        }

        if(id) {
            fetch('/api/orders?_id='+id).then(res => {
                res.json().then(orderData => {
                    setOrder(orderData);
                })
            })
        }
    }, [])

    const formatDate = (date) => {


        date = new Date(date);

        let formattedDate = date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    
            formattedDate += ' - ' + date.toLocaleTimeString('en-GB', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            });
        

        if (formattedDate.includes('0:00')) {
            formattedDate = formattedDate.replace('0:00', '12:00');
        }
    
        return formattedDate;
    };

    let subtotal = order?.cartProducts.reduce((totalPrice, product) => totalPrice + cartProductPrice(product), 0).toFixed(2);

    return(
        <section className="max-w-6xl mx-auto mt-10 mb-28 px-5">
            {order && (
                <div>
                    <h1 className="font-ovo capitalize text-[5rem] tracking-wider text-center">Thank You</h1>
                    <h3 className="font-light text-2xl tracking-wider text-center">Your order has been confirmed</h3>
                    <div className="font-light mt-5 tracking-widest text-center">Thank you for shopping with us! A confirmation has been sent to your email.</div>
                    <div className="grid md:grid-cols-2 grid-cols-1 mt-16 gap-x-5 gap-y-5">
                        <div>
                            <div className="border border-thinGray px-9 py-6 rounded-3xl">
                                <div className="flex justify-between text-xs mt-2 pb-1 font-light tracking-widest border-b border-thinGray mb-5">
                                    <div>ORDER SUMMARY</div>
                                    <div className="text-right">ORDER NUMBER: {order.orderNumber}</div>
                                </div>
                                <div className="border-b border-thinGray mb-3">
                                {order.cartProducts.length > 0 && order.cartProducts.map(product => (
                                    <div className="flex justify-between">
                                        <div className="mb-4 tracking-wider">
                                            <div className=" mb-1">
                                                {`${product.quantity}x ${product.name}`}
                                            </div>
                                            <div className="ml-6">
                                                {product.toppings?.length > 0 && (
                                                    <div className="text-sm max-w-80 tracking-wider text-gray-500 mb-0.5">
                                                        <span>Toppings:</span> {product.toppings.map((topping, index) => (
                                                            <span key={topping.id}>
                                                                {`${topping.name}`}
                                                                {topping.price > 0 && ` (£${topping.price.toFixed(2)})`}
                                                                {index !== product.toppings.length - 1 && ", "}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                {product.size && (
                                                    <div className="text-sm max-w-72 tracking-wider text-gray-500 mb-0.5">
                                                        <span>Size:</span> {product.size.name}
                                                    </div>
                                                )}
                                                {product.giftBoxOption && (
                                                    <div className="text-sm text-gray-500 tracking-wider mb-0.5">
                                                        <span>Gift box:</span> {product.giftBox ? `Yes (£${(1.50).toFixed(2)} x ${product.quantity})` : 'No'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            £{cartProductPrice(product).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                                </div>
                                <div className="flex justify-between mt-3">
                                    <div>
                                        <div className="mb-1">Subtotal</div>
                                        {order.discountAmount > 0 && (
                                            <div className="mb-1">Discount{' '}({`${((order.discountAmount / 100)/subtotal) * 100}% off`})</div>
                                        )}
                                        <div className="mb-1 font-semibold">Total Paid</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="mb-1 ">{`£${subtotal}`}</div>
                                        {order.discountAmount > 0 && (
                                            <div className="mb-1 ">{`- £${(order.discountAmount / 100).toFixed(2)}`}</div>
                                        )}
                                        <div className="mb-1 font-semibold">{`£${(subtotal - (order.discountAmount / 100)).toFixed(2)}`}</div>
                                    </div>
                                </div>
                        </div>
                        </div>
                        <div className="flex flex-col gap-y-5">
                            <div className="border border-thinGray px-9 py-6 rounded-3xl">
                                <div className="flex justify-between text-xs mt-2 pb-1 font-light tracking-widest border-b border-thinGray mb-5">
                                    <div>COLLECTION DETAILS</div>
                                </div>
                                <div className="border-b border-thinGray pb-3">
                                    <div className=" mb-3">
                                        {`${order.firstName} ${order.lastName}`}
                                    </div>
                                    <div className=" mb-3">
                                        {order.phone}
                                    </div>
                                    <div className=" mb-1">
                                        {order.email}
                                    </div>
                                </div>
                                <div>
                                    <div className="uppercase font-semibold mt-3">Collection for {order.collectionDateTime ? formatDate(order.collectionDateTime).replace(',', ' -') : ''}</div>
                                </div>
                            </div>
                            <div className="border border-thinGray px-9 py-6 rounded-3xl">
                                <div className="flex justify-between text-xs mt-2 pb-1 font-light tracking-widest border-b border-thinGray mb-5">
                                    <div>COLLECTION ADDRESS</div>
                                </div>
                                <div className="">
                                    <div className="mt-2 ">Severnake Close, London, E14 9WE</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}