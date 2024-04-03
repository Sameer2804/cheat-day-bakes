"use client";
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation'

export default function DropdownIcon({text, status}) {

    const router = useRouter()


    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = (boolean) => {
      setIsDropdownOpen(boolean);
    };

      const options = status === 'unauthenticated' || status === 'loading' ? [
          { text: 'Login', href: '/login' },
          { text: 'Register', href: '/register' },
          // Add more options as needed
      ] : [
          { text: 'My Account', href: '/' },
          { text: 'Logout', onClick: () => signOut({ callbackUrl: '/login' }) }
      ];


    return(
        <div className="relative inline-block" onMouseLeave={() => toggleDropdown(false)}>
        <div>
        <button type="button" onClick={() => status === "authenticated" ? router.push("/") : router.push("/login")} onMouseEnter={() => toggleDropdown(true)} className="inline-flex justify-center gap-x-0.5 hover:underline z-10 pb-2" id="menu-button" aria-expanded={isDropdownOpen} aria-haspopup="true">
            {text}
          </button>
        </div>

        <div className={`absolute right-0 w-[130px] z-10 origin-top rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${isDropdownOpen ? 'opacity-100 scale-y-100 transition-all duration-200' : 'opacity-0 scale-y-0 transition-all duration-200'}`} role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1" 
            style={{
                transformOrigin: 'top', 
                left: `calc(50% - 67px)`
            }} >
          <div className="py-1" role="none">
          {options.map((option, index) => (
                <a key={index} href={option.href} onClick={option.onClick} className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer" role="menuitem" tabIndex="-1" id={`menu-option-${index}`}>
                    {option.text}
                </a>
            ))}
          </div>
        </div>
      </div>
    )
}