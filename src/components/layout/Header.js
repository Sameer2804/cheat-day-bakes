"use client";
import { useSession } from 'next-auth/react';
import Image from "next/image";
import Link from "next/link";
import Bag from "@/components/icons/Bag"
import Profile from "@/components/icons/Profile"
import DropdownButton from "@/components/common/DropdownButton"
import DropdownIcon from "@/components/common/DropdownIcon"
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../AppContext';


export default function Header() {
    const session = useSession();

    console.log(session);
    const status = session.status;
    const {cartProducts} = useContext(CartContext);
    const [categories, setCategories] = useState([]);


    useEffect(() => {
        fetch('/api/categories?findCategoryInUse=true').then(response => {
            response.json().then(categories => {
                //const categoryNames = categories.map(category => category.name);
                setCategories(categories);
            });
        });
    }, [])


    return (
        <header>
            <div className="font-ovo text-white bg-primary text-2xl py-1.5 text-center">
            COLLECTION ONLY
            </div>
            <div className="px-6">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-x-28 mt-12">
                <div className="size-32 relative grow basis-0" >
                    <Link href={'/'}>
                        <Image src={'/logo.svg'} alt="logo" fill style={{objectFit:"cover"}} />
                    </Link>
                </div>
                <div className="w-[370px] h-[170px] relative">
                    <Image src={'/title.svg'} alt="Title" fill style={{objectFit:"cover"}} priority={true}/>
                </div>
                <div className="flex gap-x-4 justify-center grow basis-0">

                    <DropdownIcon text={<Profile className="size-8 mt-px hover:scale-110 transition-transform"/>} status={status} />
                    <Link href={''} className='relative hover:scale-110 transition-transform'>
                        <Bag className="size-8"/>
                        <div className='absolute size-5 bottom-0 flex justify-center items-center bg-primary text-white rounded-full' style={{ right: '-2px' }}>
                            <div className='text-xs font-light'>{cartProducts.length}</div>
                        </div>
                    </Link>
                </div>
                </div>
                <div className="flex max-w-4xl mx-auto justify-between mt-20">
                    <Link href={'/'} className="hover:underline">HOME</Link>
                    <Link href={'/product-list/6610b6e4555875c2afaa2afd'} className="hover:underline">CUPCAKES</Link>
                    <Link href={'/product-list/6610b3a2555875c2afaa2ad9'} className="hover:underline">BROWNIES</Link>
                    <Link href={'/product-list/6610bd0c8a3885d3110a5943'} className="hover:underline">DESSERT CUPS</Link>
                    <DropdownButton text={'ALL CATEGORIES'} options={categories}/>
                    <DropdownButton text={'MORE'} options={['About Us', 'Contact', 'Refund Policy']}/>
                </div>
            </div>
        </header>
    );
}