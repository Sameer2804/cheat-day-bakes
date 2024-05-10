"use client";
import { redirect, useParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { CartContext } from '@/components/AppContext';
import DropdownChecklist from "@/components/common/DropdownChecklist"
import toast from 'react-hot-toast';
import Bowl from "@/components/icons/Bowl"
import ReturnBasket from "@/components/icons/ReturnBasket"
import ExtraItemInfo from "@/components/common/ExtraItemInfo"
import QuantityButton from "@/components/layout/QuantityButton"
import CartSidePanel from "@/components/layout/CartSidePanel"


export default function ProductPage() {

    const {id} = useParams();
    const [item, setItem] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [loading, setLoading] = useState(true);
    const {addToCart} = useContext(CartContext)
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [selectedToppingsError, setSelectedToppingsError] = useState(false);
    const [giftBoxOptionChecked, setGiftBoxOptionChecked] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [hasBuyItNow, setHasBuyItNow] = useState(false);

    const [cartSidePanelOpen, setCartSidePanelOpen] = useState(false)


    
    useEffect(() => {
        fetch('/api/menu-items').then(res => {
            res.json().then(allMenuItems => {
                const selectedItems = allMenuItems.find(items => items._id === id);
                setItem(selectedItems);
                setSelectedImage(selectedItems.images[0]);
                setSelectedSize(selectedItems.sizes[0] || null)
            })
        setLoading(false);
        })
    }, [])


    if (loading) {
        return 'Loading...'
    }

    const formatDescription = (description) => {
        if (!description) return null; // Add a check for undefined description
        return description.split('\n').map((paragraph, index) => (
            <React.Fragment key={index}>
                {paragraph}
                <br/>
            </React.Fragment>
        ));
    };

    function handleAddToCart() {
        setSelectedToppingsError(false);
        const hasSizeBeenChosen = item?.sizes.length > 0 ? selectedSize : true;
        const hasToppingBeenChosen = item?.toppings.length > 0 ? selectedToppings.length > 0 : true;
        const meetRequirements = hasSizeBeenChosen && hasToppingBeenChosen;
        if(item && (meetRequirements)) {
            addToCart(item, selectedSize, selectedToppings, giftBoxOptionChecked, quantity);
            setCartSidePanelOpen(true);
            return;
        }
        else{
            if(!hasToppingBeenChosen) {
                setSelectedToppingsError(true);
                return;
            }
        }
    }

    function handleBuyItNow() {
        handleAddToCart();
        setHasBuyItNow(true);
    }

    if(hasBuyItNow) {
        setHasBuyItNow(false);
        return redirect('/checkout')
    }

    let totalPrice = item?.basePrice * quantity;
    if(selectedSize) {
        totalPrice += selectedSize.price
    }
    if (selectedToppings?.length > 0) {
        for (const topping of selectedToppings) {
            totalPrice += topping.price * quantity;
        }
    }
    if(giftBoxOptionChecked) {
        totalPrice += 1.5 * quantity;
    }



    return(
        <section className='max-w-6xl mx-auto w-full mt-8 mb-28 grid md:grid-cols-2 grid-cols-1 gap-x-4 lg:px-0 px-2.5'>
            <div className='flex flex-col mx-auto'>
                <Image src={selectedImage} width={520} height={520} className='rounded-sm'/>
                <div className='flex mt-7 gap-x-4'>
                    {item?.images.map((image, index) => (
                        <div className={selectedImage === image ? 'border-4 border-dark cursor-pointer' : 'cursor-pointer'}>
                            <Image key={index} src={image} width={160} height={160} onClick={() => setSelectedImage(item?.images[index])}/>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <div className='text-sm tracking-wider mb-1 font-light md:mt-0 mt-5'>CHEAT DAY BAKES</div>
                <div className='mb-4 md:text-4xl text-3xl capitalize'>{item?.name}</div>
                <div className='mb-3 text-xl font-light'>{`£${(item?.basePrice + (selectedSize?.price || 0)).toFixed(2)}`}</div>
                <div className='text-sm font-light tracking-widest leading-5'>{formatDescription(item?.description)}</div>
                {item?.sizes?.length > 0 && (
                    <div>
                        <div className='text-sm tracking-wider mb-1 font-light mt-4'>Size</div>
                        <div className='flex gap-x-3'>
                            {item?.sizes?.map((size, index) => (
                                <div className='mt-2.5'>
                                    <label className={`border rounded-2xl px-6 py-1.5 select-none ${selectedSize === size ? 'border-black bg-black text-white cursor-pointer' : 'border-black cursor-pointer'}`}>
                                        <input 
                                            type='radio' 
                                            name='size' 
                                            className='appearance-none' 
                                            onChange={() => setSelectedSize(size)} 
                                            checked={selectedSize?.name === size.name}/>
                                        {size.name}
                                    </label>
                                    <div className='text-center mt-2 font-light text-sm'>{`£${(item?.basePrice + size?.price).toFixed(2)}`}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {item?.toppings?.length > 0 && (
                    <div>
                        <div className='mt-5'>
                            <div className='text-sm tracking-wider mb-1 font-light mt-4'>Toppings (Select up to 4)*</div>
                            <DropdownChecklist
                                items={item}
                                selectedToppings={selectedToppings}
                                setSelectedToppings={setSelectedToppings} />
                        </div>
                    </div>
                )}
                {selectedToppingsError && (
                    <div className={'text-red-600 text-sm mt-1'}>*Please select at least one topping</div>
                )}

                <div>
                    <div className='text-sm tracking-wider mb-1 font-light mt-4'>Quantity</div>
                    <div className='h-12 w-32'>
                        <QuantityButton quantity={quantity} setQuantity={setQuantity} isBig={true} />
                    </div>
                </div>

                {item?.giftBoxOption === true && (
                    <label className='mt-6 items-center flex' htmlFor='giftBox'>
                        <input type='checkbox' id='giftBox' checked={giftBoxOptionChecked} onChange={() => setGiftBoxOptionChecked(!giftBoxOptionChecked)} />
                        <div className='ml-1.5 text-sm'>Transparent giftbox? +£{(1.50 * quantity).toFixed(2)}</div>
                    </label>
                )}

                <button 
                    onClick={handleAddToCart}
                    className="w-full mt-8 border border-black px-8 py-3.5 select-none">
                    Add to cart {`£${(totalPrice).toFixed(2)}`}
                </button>
                <button onClick={handleBuyItNow} className="w-full mt-3 bg-primary text-white px-8 py-3.5 select-none">
                    Buy it now
                </button>
                <div className='mt-6 border-t border-gray-300 select-none'>
                    <ExtraItemInfo 
                        icon={<Bowl />} 
                        title={'Ingredients'} 
                        text={item?.ingredients} />
                </div>
                <div className='select-none'>
                    <ExtraItemInfo 
                        icon={<ReturnBasket />} 
                        title={'Refund Policy'}
                        text={
                            <div>
                                <p>
                                    As a company policy, we do not offer full refunds for our bakes unless there is an issue where we are found to be at fault.
                                </p>
                                <br />
                                <p>
                                    If you are unsatisfied with your bake, please get in touch with a member of management through <a className='underline text-primary' href="mailto:cheatdaybakes@gmail.com">cheatdaybakes@gmail.com</a> within 24 hours of your collected bake with the reasons why you are unsatisfied and any photographic evidence of issues with the bake. It is then at our discretion whether you are offered a percentage from your next order, money back, or store credit to be used against a future purchase with us. As taste and texture are subjective, we would not offer credit, money back, or a percentage off for these as reasons.
                                </p>
                                <br />
                                <p>
                                    If you collect your bake from us, we cannot be held liable for any damages to the cake or products once they have left our premises. When you collect a bake, please ensure that your vehicle has a flat surface and is clean and tidy. Our cakes can be very fragile, so we advise to drive slowly and ensure that your cake cannot move around in the vehicle.
                                </p>
                                <br />
                                <p>
                                    For information on our cancellation policy, please click <a className='underline text-primary' href="#">here</a>
                                </p>
                            </div>
                        } 
                        />
                </div>
                <CartSidePanel open={cartSidePanelOpen} setOpen={setCartSidePanelOpen}/>
            </div>
        </section>
    )
}