"use client";
import { redirect, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";

export default function ProductListPage() {
    const {id} = useParams();
    const [category, setCategory] = useState(null);
    const [allCategories, setAllCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryNotFound, setCategoryNotFound] = useState(false);


    useEffect(() => {
        fetch('/api/categories?findCategoryInUse=true').then(res => {
            res.json().then(categories => {
                const categorySelected = categories.find(i => i._id === id);
                if(!categorySelected) {
                    setCategoryNotFound(true)
                }

                setAllCategories(categories)
                setCategory(categorySelected);

            })
        })
    }, [])

    useEffect(() => {
        fetch('/api/menu-items').then(res => {
            res.json().then(allMenuItems => {
                const selectedItems = allMenuItems.filter(items => items.category === id && (items.images ? items.images[0] : false));
                const filterItems = selectedItems.filter(item => {
                    if (!item.categoryID) {
                        return true; // Include items with no categoryID
                    } else {
                        // Check if the categoryID exists in allCategories
                        return allCategories.some(category => category._id === item.categoryID);
                    }
                });
                setMenuItems(filterItems);
            })
        })
        setLoading(false);
    }, [allCategories])

    if(loading) {
        return 'Loading...'
    }

    if(categoryNotFound) {
        return redirect('/')
    }


    return(
        <section className='max-w-6xl mx-auto px-3 mt-8 mb-28'>
            <div className='font-ovo text-center md:text-5xl text-4xl uppercase bg-secondary py-7 md:mb-16 mb-8'>{category?.name}</div>
            <div className="grid md:grid-cols-3 grid-cols-2 md:gap-x-6 gap-x-3 gap-y-6 font-light tracking-wider xl:px-0">
                {menuItems?.length > 0 && menuItems.map(item => (
                    <div className="mx-auto ">
                        <Link href={category?._id == '663763607c0a5deda8b70c57' ? '/product-list/'+item.categoryID : '/product/'+item._id}>
                            <div className="mb-2.5">
                                <Image src={item.images[0]} width={360} height={360} className='rounded-2xl'/>
                            </div>
                            <div className={`capitalize text-center mt-3 sm:text-lg ${category?._id == '663763607c0a5deda8b70c57' ? 'text-md' : 'text:sm'}`}>{item.name}</div>
                            <div className="capitalize text-center mt-1 text-sm sm:text-lg">
                                {(item.sizes?.length > 0) && (
                                    <span className='text-sm'>From{' '}</span>
                                )}
                                {item.basePrice && 
                                    (`£${(item.basePrice + (item?.sizes.length > 0 ? item?.sizes[0]?.price : 0)).toFixed(2)}`
                                )}
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    )
}