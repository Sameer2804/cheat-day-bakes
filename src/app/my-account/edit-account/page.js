"use client";
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import UserTabs from "@/components/layout/UserTabs"
import { useProfile } from '@/components/UseProfile';


export default function MyAccountPage() {

    const session = useSession();
    const {status} = session;

    const {loading:profileLoading, data:profileData} = useProfile();

    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        setFirstName(profileData.firstName)
        setLastName(profileData.lastName)
        setPhone(profileData.phone)

    }, [profileData])

    if (status === "unauthenticated") {
        return redirect("/login")
    }

    if (profileLoading) {
        return "Loading..."
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const savingPromise = new Promise (async (resolve, reject) => {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    firstName,
                    lastName,
                    phone
                }),
            });
            if (response.ok)
                resolve()
            else
                reject()
        })

        await toast.promise(savingPromise, {
            loading: 'Saving...',
            success: 'Profile saved!',
            error: 'An error has occured'
        })

    }

    return (
        <section className="max-w-6xl mx-auto mt-14 mb-28 px-6 lg:grid" style={{gridTemplateColumns: '20% 80%' }}>
            <UserTabs isAdmin={profileData.admin} />
            <form className="max-w-2xl mx-auto lg:mx-0 px-5" onSubmit={handleFormSubmit}>
                <div>
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" id="firstName" autoComplete="given-name" 
                    value={firstName} onChange={e => setFirstName(e.target.value)} required/>
                </div>
                <div>
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" id="lastName" autoComplete="family-name" 
                    value={lastName} onChange={e => setLastName(e.target.value)} required/>
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" disabled={true} value={session.data.user.email}
                    />
                </div>
                <div>
                    <label htmlFor="phone">Phone</label>
                    <input type="tel" id="phone" autoComplete="tel" 
                    value={phone} onChange={e => setPhone(e.target.value)} required/>
                </div>
                <div className="mx-auto">
                    <button className="mx-auto lg:max-w-56 max-w-full mt-8" type="submit">
                        Save
                    </button>
                </div>
            </form>
        </section>
    );
}