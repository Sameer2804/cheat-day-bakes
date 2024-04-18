"use client";

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

    return(
        <section className="max-w-6xl mx-auto mt-10 mb-28 px-5">
            {order && (
                <div>
                    <h1 className="font-ovo capitalize text-[5rem] tracking-wider text-center">Thank You</h1>
                    <h3 className="font-light text-2xl tracking-wider text-center">Your order has been confirmed</h3>
                    <div className="font-light mt-5 tracking-widest text-center">Thank you for shopping with us! A confirmation has been sent to your email.</div>
                    <div className="grid grid-cols-2 mt-16">
                        <div>
                            Left
                        </div>
                        <div>
                            Right
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}