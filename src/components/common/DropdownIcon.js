"use client";
import { signOut } from 'next-auth/react';
import { useState } from 'react';

export default function DropdownIcon({text, options}) {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = (boolean) => {
      setIsDropdownOpen(boolean);
    };

    return(
        <div className="relative inline-block" onMouseLeave={() => toggleDropdown(false)}>
        <div>
        <button type="button" onMouseEnter={() => toggleDropdown(true)} className="inline-flex justify-center gap-x-0.5 hover:underline z-10 pb-2" id="menu-button" aria-expanded={isDropdownOpen} aria-haspopup="true">
            {text}
          </button>
        </div>

        <div className={`absolute right-0 w-[130px] z-10 origin-top rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${isDropdownOpen ? 'opacity-100 scale-y-100 transition-all duration-200' : 'opacity-0 scale-y-0 transition-all duration-200'}`} role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1" 
            style={{
                transformOrigin: 'top', 
                left: `calc(50% - 67px)`
            }} >
          <div className="py-1" role="none">
          {
            options.map((option, index) => (
              option !== "Logout" ? (
                <a key={index} href={`/${option.toLowerCase()}`} className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 text-center" role="menuitem" tabIndex="-1" id={`menu-item-${index}`}>
                  {option}
                </a>
              ) : 
              <a key={index} href="#" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 text-center" role="menuitem" tabIndex="-1" id={`menu-item-${index}`} onClick={() => signOut()}>
                {option}
              </a>
            ))
          }
          </div>
        </div>
      </div>
    )
}