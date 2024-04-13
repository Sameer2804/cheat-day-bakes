"use client";
import EditableImage from "@/components/layout/EditableImage"
import MenuItemPriceProp from "@/components/layout/MenuItemPriceProp"

import { useEffect, useState } from 'react';

export default function MenuItemForm({onSubmit, menuItem}) {

    let [images, setImages] = useState([...(menuItem?.images || []), ...Array(3).fill('')].slice(0, 3)); 
    const [name, setName] = useState(menuItem?.name || '');
    const [description, setDescription] = useState(menuItem?.description || '');
    const [ingredients, setIngredients] = useState(menuItem?.ingredients || '');
    const [basePrice, setBasePrice] = useState(menuItem?.basePrice || '');
    const [sizes, setSizes] = useState(menuItem?.sizes || []);
    const [toppings, setToppings] = useState(menuItem?.toppings || []);
    const [giftBoxOption, setGiftBoxOption] = useState(menuItem?.giftBoxOption || false);
    const [category, setCategory] = useState(menuItem?.category || '');
    const [categories, setCategories] = useState([]);

 
    useEffect(() => {
        fetch('/api/categories').then(response => {
            response.json().then(categories => {
                setCategories(['', ...categories]);
            });
        });
    }, [])

    useEffect(() => {
        // IDs of the textarea elements you want to adjust
        const textareaIDs = ['description', 'ingredients'];
      
        // Function to adjust the height of a textarea
        const adjustHeight = (textarea) => {
          if (textarea) {
            textarea.style.height = 'auto'; // Reset the height to auto to avoid scrollbars
            textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to fit the content
          }
        };
      
        // Loop through each ID and apply the height adjustment
        textareaIDs.forEach(id => {
          const textarea = document.getElementById(id);
          adjustHeight(textarea);
        });
      
      }, []); // Empty dependency array ensures this effect runs only once after the initial render
    

    return (
        <form 
        onSubmit={ e => 
            onSubmit(e, {images, name, description, ingredients, basePrice, category, sizes, toppings, giftBoxOption})}
        >
            <div className="grid md:grid-cols-3 grid-cols-1 gap-y-6 mb-8">
                {images.map((image, index) => (
                    <div key={index} className="min-w-[220px] mx-auto">
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
                <label htmlFor="category">Category</label>
                <select id="category" value={category} onChange={e => setCategory(e.target.value)} required>
                    {categories?.length > 0 && categories.map(category => (
                        <option value={category._id}>{category.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <textarea type="text" id="description"
                value={description} onChange={e => setDescription(e.target.value)} required/>
            </div>
            <div>
                <label htmlFor="ingredients">Ingredients <span>(List each ingredient seperated with commas)</span></label>
                <textarea type="text" id="ingredients"
                value={ingredients} onChange={e => setIngredients(e.target.value)} required/>
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