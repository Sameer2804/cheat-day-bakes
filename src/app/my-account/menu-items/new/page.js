"use client";
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import EditableImage from "@/components/layout/EditableImage"
import { useState, useEffect } from 'react';
import NoticeBox from "@/components/common/NoticeBox"
import toast from 'react-hot-toast';
import Link from "next/link";
import LeftCrocArrow from "@/components/icons/LeftCrocArrow"
import { redirect } from 'next/navigation';
import MenuItemForm from "@/components/layout/MenuItemForm"

export default function NewMenuItemsPage() {

    const {loading:profileLoading, data:profileData} = useProfile();

    
    const [redirectToItems, setRedirectToItems] = useState(false);

    async function handleFormSubmit(e, data) {
        e.preventDefault();
        
        data.images = data.images.filter(image => image.trim() !== '');
        if(data.images.length === 0) {
            return toast.error('Please add an image')
        }
        const savingPromise = new Promise(async (resolve, reject) => {
            const response = await fetch('/api/menu-items', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {'Content-Type': 'application/json'},
            });
            if(response.ok)
                resolve()
            else
                reject()
        });
        await toast.promise(savingPromise, {
            loading: 'Saving item...',
            success: 'Saved',
            error: 'An error has occured'
        });

        setRedirectToItems(true);
    }

    if(redirectToItems) {
        return redirect('/my-account/menu-items')
    }

    if(profileLoading) {
        return 'Loading info...';
    }

    if(!profileData.admin) {
        return 'Not an admin';
    }

    return (
        <section className="max-w-6xl mx-auto mt-14 mb-28 px-6 lg:grid" style={{gridTemplateColumns: '20% 80%' }}>
            <UserTabs isAdmin={profileData.admin} />
            <div className="lg:mx-0 px-5">
                <Link href={'/my-account/menu-items'} className="items-center mb-8 gap-x-2 border border-black flex rounded-xl py-2 justify-center hover:bg-gray-200 hover:cursor-pointer">
                    <LeftCrocArrow />
                    <div>Show All Menu Items</div>
                </Link>
                <NoticeBox>Note: The first image will be the cover for the item</NoticeBox>
                <MenuItemForm menuItem={null} onSubmit={handleFormSubmit} />
            </div>
        </section>
    )
}