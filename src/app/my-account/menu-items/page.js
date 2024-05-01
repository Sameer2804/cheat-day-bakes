"use client";
import Image from "next/image";
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import Link from "next/link";
import RightCrocArrow from "@/components/icons/RightCrocArrow"
import { useEffect, useState } from "react";


export default function MenuItemsPage() {

    const {loading:profileLoading, data:profileData} = useProfile();
    const [menuItems, setMenuItems] = useState([]);
    useEffect(() => {
        fetch('/api/menu-items').then(res => {
            res.json().then(menuItems => {
                setMenuItems(menuItems);
            });
        })
    }, [])
    
    if(profileLoading) {
        return 'Loading info...';
    }

    if(!profileData.admin) {
        return 'Not an admin';
    }

    return (
        <section className="max-w-6xl mx-auto mt-14 mb-28 sm:px-6 px-5 lg:grid" style={{gridTemplateColumns: '20% 80%' }}>
            <UserTabs isAdmin={profileData.admin} />
            <div className="">
                <Link  href={'menu-items/new'} className="items-center gap-x-2 mb-8 h-auto text-base border border-black flex rounded-xl py-2 justify-center hover:bg-gray-200 hover:cursor-pointer">
                    <div>Add New Menu Item</div>
                    <RightCrocArrow />
                </Link>
                <div className="grid md:grid-cols-3 grid-cols-2 sm:gap-x-6 gap-x-4 gap-y-5 font-light tracking-wider">
                    {menuItems?.length > 0 && menuItems.map(item => (
                        <div className="mx-auto">
                            <Link href={'/my-account/menu-items/edit/'+item._id}>
                                <div className="mb-2.5">
                                    <Image src={item.images[0]} width={370} height={370} />
                                </div>
                                <div className="capitalize text-center">{item.name}</div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}