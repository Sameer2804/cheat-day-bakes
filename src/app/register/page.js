"use client";
import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [creatingUser, setCreatingUser] = useState(false);
    const [userCreated, setUserCreated] = useState(false);
    const [credentialError, setCredentialError] = useState(false);
    const [credentialErrorList, setCredentialErrorList] = useState([]);

    const session = useSession();
    const status = session.status;

    if(status === 'loading') {
        return 'Loading...'
    }

    if(status === 'authenticated') {
        return redirect('/my-account/edit-account')
    }


    async function handleFormSubmit(e) {
        e.preventDefault();

        //Reset states
        setUserCreated(false);
        setCredentialError(false);
        setCredentialErrorList([]);


        setCreatingUser(true);
        const response = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({email, password}),
            headers: {'Content-Type': 'application/json'},
        });

        if(response.ok){
            setUserCreated(true);
            setEmail("");
            setPassword("");
            toast.success('Register successful')
        }
        else {
            const data = await response.json();
            if(data.error){
                setCredentialError(true);
                setCredentialErrorList(data.error)
            }
        }
        setCreatingUser(false);
    }

    return(
        <section className="max-w-4xl mx-auto mt-12 mb-16">
            <h1 className="font-ovo text-center text-5xl">Register</h1>
            {userCreated && (
                <div className='mt-5 -mb-4 text-center'>
                    User registered. You can now <Link href={'/login'}><span className='underline'>Login</span> &raquo;</Link>
                </div>
            )}
            <form className="lg:max-w-md lg:px-0 w-full mx-auto mt-8 px-3" onSubmit={handleFormSubmit}>
                {credentialError && (
                        <div className="flex p-4 mb-4 -mt-2 text-sm rounded-lg bg-red-50 text-white" role="alert" style={{backgroundColor: '#D43811'}}>
                        <svg className="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                        </svg>
                        <div>
                            <span className="font-medium">The following problems were found:</span>
                            <ul className="mt-1.5 list-disc list-inside">
                            {credentialErrorList.map((error, index) => (
                                <li key={index} className='mt-2'>{error}</li>
                            ))}
                            </ul>
                        </div>
                        </div>
                    )}
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" autoComplete="email" 
                    disabled={creatingUser} value={email} onChange={e => setEmail(e.target.value)} required/>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" autoComplete="current-password"
                    disabled={creatingUser} value={password} onChange={e => setPassword(e.target.value)} required/>

                </div>
                <div className="mx-auto">
                    <button className="mx-auto mt-8" type="submit" disabled={creatingUser}>
                        Register
                    </button>
                </div>
                <div className='text-center mt-8'>
                    Already have an account?{' '}<Link href={'/login'}><span className='underline'>Login</span></Link>
                </div>
            </form>
        </section>
    );
}