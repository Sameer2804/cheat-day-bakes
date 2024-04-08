"use client";
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import EditableImage from "@/components/layout/EditableImage"
import { useState, useEffect } from 'react';
import NoticeBox from "@/components/common/NoticeBox"
import toast from 'react-hot-toast';
import Link from "next/link";
import Left from "@/components/icons/Left"
import { redirect } from 'next/navigation';

export default function NewMenuItemsPage() {

    const {loading:profileLoading, data:profileData} = useProfile();

    let [images, setImages] = useState(['', '', '']);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [redirectToItems, setRedirectToItems] = useState(false);

    async function handleFormSubmit(e) {
        e.preventDefault();
        
        images = images.filter(image => image.trim() !== '');
        if(images.length === 0) {
            return toast.error('Please add an image')
        }
        const data = {images, name, description, basePrice}
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
        <section className="max-w-5xl mx-auto mt-14 mb-28 px-6 lg:grid lg:grid-cols-4">
            <UserTabs isAdmin={true} />
            <div className="lg:mx-0 lg:col-span-3">
                <Link href={'/my-account/menu-items'} className="items-center mb-8 gap-x-2 border border-black flex rounded-xl py-2 justify-center hover:bg-gray-200 hover:cursor-pointer">
                    <Left />
                    <div>Show All Menu Items</div>
                </Link>
                <NoticeBox>Note: The first image will be the cover for the item</NoticeBox>
                <form onSubmit={handleFormSubmit}>
                    <div className="flex justify-between mb-8">
                    {images.map((image, index) => (
                            <div key={index} className="max-w-[220px] grow">
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
                        <label htmlFor="description">Description</label>
                        <textarea type="text" id="description" className="h-28"
                        value={description} onChange={e => setDescription(e.target.value)} required/>
                    </div>
                    <div>
                        <label htmlFor="basePrice">Base Price</label>
                        <input type="text" id="basePrice" 
                        value={basePrice} onChange={e => setBasePrice(e.target.value)} required/>
                    </div>
                    <div className="mx-auto">
                    <button className="mx-auto lg:max-w-48 max-w-full mt-10" type="submit">
                        Save
                    </button>
                </div>
                </form>
            </div>
        </section>
    )
}