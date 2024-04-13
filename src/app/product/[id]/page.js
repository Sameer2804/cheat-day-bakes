"use client";
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { CartContext } from '@/components/AppContext';
import DropdownChecklist from "@/components/common/DropdownChecklist"
import toast from 'react-hot-toast';
import Bowl from "@/components/icons/Bowl"
import ReturnBasket from "@/components/icons/ReturnBasket"
import ExtraItemInfo from "@/components/common/ExtraItemInfo"


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
            addToCart(item, selectedSize, selectedToppings, giftBoxOptionChecked);
            toast.success('Added to cart!')
        }
        else{
            if(!hasToppingBeenChosen) {
                setSelectedToppingsError(true);
            }
        }
    }

    let totalPrice = item?.basePrice;
    if(selectedSize) {
        totalPrice += selectedSize.price
    }
    if (selectedToppings?.length > 0) {
        for (const topping of selectedToppings) {
            totalPrice += topping.price;
        }
    }
    if(giftBoxOptionChecked) {
        totalPrice += 1.5
    }


    return(
        <section className='max-w-4xl mx-auto w-full mt-8 mb-28 grid md:grid-cols-2 grid-cols-1'>
            <div className='flex flex-col'>
                <Image src={selectedImage} width={400} height={400} />
                <div className='flex mt-6 gap-x-4'>
                    {item?.images.map((image, index) => (
                        <div className={selectedImage === image ? 'border-4 border-dark cursor-pointer' : 'cursor-pointer'}>
                            <Image key={index} src={image} width={120} height={120} onClick={() => setSelectedImage(item?.images[index])}/>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <div className='text-sm tracking-wider mb-1 font-light'>CHEAT DAY BAKES</div>
                <div className='mb-3 text-4xl font-ovo capitalize'>{item?.name}</div>
                <div className='mb-3 text-xl font-light'>{`£${(item?.basePrice + (selectedSize?.price || 0)).toFixed(2)}`}</div>
                <div className='text-sm font-light tracking-widest leading-5'>{formatDescription(item?.description)}</div>
                {item?.sizes?.length > 0 && (
                    <div>
                        <div className='text-sm tracking-wider mb-1 font-light mt-4'>Size</div>
                        <div className='flex gap-x-3'>
                            {item?.sizes?.map((size, index) => (
                                <div className='mt-2.5'>
                                    <label className={`border rounded-2xl px-6 py-1.5 ${selectedSize === size ? 'border-black bg-black text-white cursor-pointer' : 'border-black cursor-pointer'}`}>
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
                            <div className='text-sm tracking-wider mb-1 font-light mt-4'>Toppings (Select up to 4)</div>
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

                {item?.giftBoxOption === true && (
                    <label className='mt-4 items-center flex' htmlFor='giftBox'>
                        <input type='checkbox' id='giftBox' checked={giftBoxOptionChecked} onChange={() => setGiftBoxOptionChecked(!giftBoxOptionChecked)} />
                        <div className='ml-1.5 text-sm'>Transparent giftbox? +£1.50</div>
                    </label>
                )}

                <button 
                    onClick={handleAddToCart}
                    className="w-full mt-8 border border-black px-8 py-3.5">
                    Add to cart {`£${totalPrice?.toFixed(2)}`}
                </button>
                <button className="w-full mt-3 bg-primary text-white px-8 py-3.5">
                    Buy it now
                </button>
                <div className='mt-6 border-t border-gray-300'>
                    <ExtraItemInfo 
                        icon={<Bowl />} 
                        title={'Ingredients'} 
                        text={item?.ingredients} />
                </div>
                <div>
                    <ExtraItemInfo 
                        icon={<ReturnBasket />} 
                        title={'Return Policy'} 
                        text={'This is the return policy'} />
                </div>


            </div>
        </section>
    )
}