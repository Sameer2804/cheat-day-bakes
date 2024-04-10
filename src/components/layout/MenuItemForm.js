"use client";
import EditableImage from "@/components/layout/EditableImage"
import MenuItemPriceProp from "@/components/layout/MenuItemPriceProp"

import { useState } from 'react';

export default function MenuItemForm({onSubmit, menuItem}) {

    let [images, setImages] = useState([...(menuItem?.images || []), ...Array(3).fill('')].slice(0, 3)); 
    const [name, setName] = useState(menuItem?.name || '');
    const [description, setDescription] = useState(menuItem?.description || '');
    const [basePrice, setBasePrice] = useState(menuItem?.basePrice || '');
    const [sizes, setSizes] = useState(menuItem?.sizes || []);
    const [toppings, setToppings] = useState(menuItem?.toppings || []);
    const [giftBoxOption, setGiftBoxOption] = useState(menuItem?.giftBoxOption || false);


    return (
        <form 
        onSubmit={ e => 
            onSubmit(e, {images, name, description, basePrice, sizes, toppings, giftBoxOption})}
        >
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-y-6  mb-8">
                {images.map((image, index) => (
                    <div key={index} className="max-w-[220px] min-w-[220px] mx-auto">
                        <EditableImage
                            link={image}
                            setLink={newImage =>
                                setImages(prevImages => {
                                    const updatedImages = [...prevImages];
                                    updatedImages[index] = newImage;
                                    return updatedImages;
                                })
                            }
                        />
                    </div>
                ))}
            </div>
            <div>
                <label htmlFor="name">Item Name</label>
                <input type="text" id="name" 
                value={name} onChange={e => setName(e.target.value)} required/>
            </div>
            <div>
                <label htmlFor="basePrice">Base Price</label>
                <input type="text" id="basePrice" 
                value={basePrice} onChange={e => setBasePrice(e.target.value)} required/>
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <textarea type="text" id="description" className="h-28"
                value={description} onChange={e => setDescription(e.target.value)} required/>
            </div>
            <div className="mb-4">
                <MenuItemPriceProp props={sizes} setProps={setSizes}>Sizes</MenuItemPriceProp>
            </div>
            <div className="mb-4">
                <MenuItemPriceProp props={toppings} setProps={setToppings}>Toppings</MenuItemPriceProp>
            </div>
            <label htmlFor="giftBox">
                <div className='border border-black relative px-2 py-2'>
                    <div className="w-full flex justify-between items-center gap-x-0.5 hover:cursor-pointer">
                        <div className='font-ovo text-xl hover:underline'>Gift Box Option</div>
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-gray-400"
                                aria-hidden="true"
                                id="giftBox"
                                checked={giftBoxOption}
                                onChange={e => setGiftBoxOption(prev => !prev)}
                            />
                    </div>
                </div>
            </label>
            <div className="flex justify-center flex-wrap-reverse gap-x-12 mt-5">
                <button className="lg:max-w-48 max-w-full mt-5" type="submit">
                    Save
                </button>
            </div>
        </form>
    )
}