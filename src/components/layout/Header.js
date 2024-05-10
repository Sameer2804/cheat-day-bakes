"use client";
import { useSession } from 'next-auth/react';
import Image from "next/image";
import Link from "next/link";
import Bag from "@/components/icons/Bag"
import Profile from "@/components/icons/Profile"
import DropdownButton from "@/components/common/DropdownButton"
import DropdownButtonMore from "@/components/common/DropdownButtonMore"
import DropdownIcon from "@/components/common/DropdownIcon"
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../AppContext';
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import MobileNav from "@/components/layout/MobileNav"
import CartSidePanel from "@/components/layout/CartSidePanel"


const navigation = [
    { name: 'Home', href: '/', current: true },
    { name: 'Cupcakes', href: '/product-list/6610b6e4555875c2afaa2afd', current: false},
    { name: 'Brownies', href: '/product-list/6610b3a2555875c2afaa2ad9', current: false},
    { name: 'Dessert Cups', href: '/product-list/6610bd0c8a3885d3110a5943', current: false},
    { name: 'All Categories', href: '/product-list/663763607c0a5deda8b70c57', current: false},
    { name: 'More', href: '', current: false, children: [
        { name: 'About Us', href: '/', current: true },
        { name: 'Contact Us', href: '/product-list/6610b6e4555875c2afaa2afd', current: false },
        { name: 'Refund & Collection Policy', href: '/product-list/6610b3a2555875c2afaa2ad9', current: false },
    ]},
  ]



export default function Header() {
    const session = useSession();

    const status = session.status;
    const {cartProducts} = useContext(CartContext);
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [moreNavTitle, setMoreNavTitle] = useState('')
    const [hasGoneBack, setHasGoneBack] = useState(false);

    const [cartSidePanelOpen, setCartSidePanelOpen] = useState(false)


    useEffect(() => {
        fetch('/api/categories?findCategoryInUse=true').then(response => {
            response.json().then(categories => {
                //const categoryNames = categories.map(category => category.name);
                const filteredcategories = categories.filter(categories => categories._id != '663763607c0a5deda8b70c57')
                setCategories(filteredcategories);
            });
        });
    }, [])


    return (
        <header>
            <CartSidePanel open={cartSidePanelOpen} setOpen={setCartSidePanelOpen}/>
            <MobileNav 
                open={open} 
                setOpen={setOpen} 
                navigation={navigation} 
                status={status} 
                isMoreNavOpen={false} 
                moreNavTitle={moreNavTitle} 
                setMoreNavTitle={setMoreNavTitle}
                hasGoneBack={hasGoneBack}
                setHasGoneBack={setHasGoneBack}
                />
            <div className="font-ovo text-white bg-primary sm:text-2xl text-xl py-1.5 text-center">
            COLLECTION ONLY
            </div>
            <div className='lg:hidden flex items-center justify-center mt-5 px-4 mb-2'>
                <div className="relative" >
                    <Link href={'/'}>
                        <Image src={'/logo.svg'} alt="logo" width={160} height={160} />
                    </Link>
                </div>

                <div className='absolute right-0 mr-5 flex gap-x-1'>
                    <div onClick={() => setCartSidePanelOpen(true)} className='relative hover:cursor-pointer [@media(hover:hover){&:hover}]:scale-110 transition-transform'>
                        <Bag className="size-8"/>
                        <div className='absolute size-5 bottom-0 flex justify-center items-center bg-primary text-white rounded-full' style={{ right: '-2px' }}>
                            <div className='text-xs font-light'>{cartProducts.length}</div>
                        </div>
                    </div>
                    <button onClick={() => setOpen(!open)} className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Open main menu</span>

                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
            </div>
            <div className="px-6 hidden lg:block">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-x-24 mt-12">
                    <div className="size-40 relative grow basis-0" >
                        <Link href={'/'}>
                            <Image src={'/logo.svg'} alt="logo" fill={true} />
                        </Link>
                    </div>
                    <div className="w-[370px] h-[170px] relative">
                        <Image src={'/title.svg'} alt="Title" fill style={{objectFit:"cover"}} priority={true}/>
                    </div>
                    <div className="flex gap-x-4 justify-center grow basis-0">

                        <DropdownIcon text={<Profile className="size-8 mt-px hover:scale-110 transition-transform"/>} status={status} />
                        <div onClick={() => setCartSidePanelOpen(true)} className='relative hover:cursor-pointer hover:scale-110 transition-transform'>
                            <Bag className="size-8"/>
                            <div className='absolute size-5 bottom-0 flex justify-center items-center bg-primary text-white rounded-full' style={{ right: '-2px' }}>
                                <div className='text-xs font-light'>{cartProducts.length}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex max-w-5xl text-lg mx-auto justify-around mt-20">
                    <Link href={'/'} className="hover:underline">HOME</Link>
                    <Link href={'/product-list/663763697c0a5deda8b70c5d'} className="hover:underline">CUPCAKES</Link>
                    <Link href={'/product-list/663763657c0a5deda8b70c5a'} className="hover:underline">BROWNIES</Link>
                    <Link href={'/product-list/6637636e7c0a5deda8b70c60'} className="hover:underline">DESSERT CUPS</Link>
                    <DropdownButton text={'ALL CATEGORIES'} options={categories}/>
                    <DropdownButtonMore 
                        text={'MORE'} 
                        options={[
                            {name:'About Us', href: '/'}, {name:'Contact', href: '/'}, {name:'Refund Policy', href: '/'}
                        ]}/>
                </div>
            </div>
        </header>
    );
}