"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";

export default function ProductListPage() {
    const {id} = useParams();
    const [category, setCategory] = useState(null);
    const [menuItems, setMenuItems] = useState([]);


    useEffect(() => {
        fetch('/api/categories').then(res => {
            res.json().then(categories => {
                const categorySelected = categories.find(i => i._id === id);
                setCategory(categorySelected);
            })
        })
        fetch('/api/menu-items').then(res => {
            res.json().then(allMenuItems => {
                const selectedItems = allMenuItems.filter(items => items.category === id);
                setMenuItems(selectedItems);
            })
        })
    }, [])


    return(
        <section className='max-w-4xl mx-auto w-full mt-8 mb-28'>
            <div className='font-ovo text-center text-4xl uppercase bg-secondary py-7 mb-16'>{category?.name}</div>
            <div className="grid md:grid-cols-3 grid-cols-2 md:gap-x-8 gap-x-3 gap-y-6 font-light tracking-wider lg:px-0 px-3">
                {menuItems?.length > 0 && menuItems.map(item => (
                    <div className="mx-auto">
                        <Link href={'/product/'+item._id}>
                            <div className="mb-2.5">
                                <Image src={item.images[0]} width={320} height={320} />
                            </div>
                            <div className="capitalize text-center mt-3 text-sm sm:text-base">{item.name}</div>
                            <div className="capitalize text-center mt-1 text-sm sm:text-base">
                                {(item.sizes?.length > 0) && (
                                    <span className='text-sm'>From{' '}</span>
                                )}
                                {`£${(item.basePrice + (item?.sizes.length > 0 ? item?.sizes[0]?.price : 0)).toFixed(2)}`}
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    )
}