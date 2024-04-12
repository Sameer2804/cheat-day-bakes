"use client";
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import EditableImage from "@/components/layout/EditableImage"
import { useState, useEffect } from 'react';
import NoticeBox from "@/components/common/NoticeBox"
import toast from 'react-hot-toast';
import Link from "next/link";
import Left from "@/components/icons/Left"
import { redirect, useParams } from 'next/navigation';
import MenuItemForm from "@/components/layout/MenuItemForm"
import DeleteDialog from "@/components/common/DeleteDialog"


export default function EditMenuItemPage() {
    const {loading:profileLoading, data:profileData} = useProfile();

    const {id} = useParams();
    const [menuItem, setMenuItem] = useState(null);
    const [redirectToItems, setRedirectToItems] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    

    useEffect(() => {
        fetch('/api/menu-items').then(res => {
            res.json().then(items => {
                const item = items.find(i => i._id === id);
                // setImages([...item.images, '', '', ''].slice(0, 3))
                // setName(item.name);
                // setDescription(item.description);
                // setBasePrice(item.basePrice);
                setMenuItem(item);
            })
        })
    }, [])

    async function handleFormSubmit(e, data) {
        e.preventDefault();
        
        data.images = data.images.filter(image => image.trim() !== '');
        if(data.images.length === 0) {
            return toast.error('Please add an image')
        }
        data = {...data, _id:id};
        const savingPromise = new Promise(async (resolve, reject) => {
            const response = await fetch('/api/menu-items', {
                method: 'PUT',
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

    async function handleDeleteClick() {
    const promise = new Promise(async (resolve, reject) => {
        const response = await fetch('/api/menu-items?_id='+id, {
            method: 'DELETE'
        });
        if (response.ok) {
            resolve();
        }
        else{
            reject();
        }
        });

        await toast.promise(promise, {
        loading: 'Deleting...',
        success: 'Deleted',
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
        <section className="max-w-6xl mx-auto mt-14 mb-28 px-6 lg:grid lg:grid-cols-4">
            <UserTabs isAdmin={true} />
            <div className="lg:mx-0 lg:col-span-3">
                <Link href={'/my-account/menu-items'} className="items-center mb-8 gap-x-2 border border-black flex rounded-xl py-2 justify-center hover:bg-gray-200 hover:cursor-pointer">
                    <Left />
                    <div>Show All Menu Items</div>
                </Link>
                <NoticeBox>Note: The first image will be the cover for the item</NoticeBox>
                <MenuItemForm menuItem={menuItem} onSubmit={handleFormSubmit} />
                <div>
                    <DeleteDialog 
                    open={showDeleteDialog} 
                    setOpen={setShowDeleteDialog} 
                    onDelete={handleDeleteClick} 
                    title={'Delete menu item'} 
                    text={'Are you sure you want to delete this menu item? This action cannot be undone.'}/>
                    <button className="lg:max-w-48 w-full max-w-full mt-5 bg-red-800 text-white px-8 py-3.5 block mx-auto text-center" onClick={() => setShowDeleteDialog(true)} type="button">
                        Delete
                    </button>
                </div>
            </div>
        </section>
    )
}