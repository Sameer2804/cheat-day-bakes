"use client";
import { useState } from 'react';
import {signIn} from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginInProgress, setLoginInProgress] = useState(false);
    const [incorrectCredentials, setIncorrectCredentials] = useState(false);

    const router = useRouter()


    async function handleFormSubmit(e) {
        e.preventDefault();
        setIncorrectCredentials(false);

        const result = await signIn('credentials', {email, password, redirect: false});
        setLoginInProgress(false);

        if(result?.error) {
            setIncorrectCredentials(true);
        } else {
            router.push('/');
        }

    }

    return(
        <section className="max-w-4xl mx-auto mt-12 mb-16">
            <h1 className="font-ovo text-center text-5xl">Login</h1>
            <form className="max-w-sm mx-auto mt-8" onSubmit={handleFormSubmit}>
                {incorrectCredentials && (
                    <div className="flex p-4 mb-4 -mt-2 text-sm rounded-lg bg-red-50 text-white" role="alert" style={{backgroundColor: '#D43811'}}>
                    <svg className="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <div>
                        <span className="font-medium">The following problems were found:</span>
                        <ul className="mt-1.5 list-disc list-inside">
                            <li>Invalid email or password</li>
                        </ul>
                    </div>
                    </div>
                )}
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" autoComplete="email" 
                    disabled={loginInProgress} value={email} onChange={e => setEmail(e.target.value)} required/>
    
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" autoComplete="current-password"
                    disabled={loginInProgress} value={password} onChange={e => setPassword(e.target.value)} required/>
                </div>
                <div className="mx-auto">
                    <button className="mx-auto mt-8" type="submit" disabled={loginInProgress}>
                        Login
                    </button>
                    <div className="text-center my-3 text-gray-500 tracking-widest">
                        OR
                    </div>
                    <button className="w-full mx-auto border border-black py-3.5 flex gap-2 justify-center hover:bg-gray-50" 
                    type="button" disabled={loginInProgress}>
                        <Image src={'/Google.svg'} alt="" width={24} height={24}/>
                        Login with Google
                    </button>
                </div>
                <div className='text-center mt-8'>
                    Don't have an account?{' '}<Link href={'/register'}><span className='underline'>Sign Up</span></Link>
                </div>     
            </form>
        </section>
    );
}