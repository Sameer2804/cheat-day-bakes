"use client";
import { useState } from 'react';

export default function DropdownButton({text, options}) {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = (boolean) => {
      setIsDropdownOpen(boolean);
    };

    return(
        <div className="relative inline-block" onMouseLeave={() => toggleDropdown(false)}>
        <div>
        <button type="button" onMouseEnter={() => toggleDropdown(true)} className="inline-flex justify-center gap-x-0.5 hover:underline z-10 pb-2" id="menu-button" aria-expanded={isDropdownOpen} aria-haspopup="true">
            {text}
            <svg className={`-mr-1 h-5 w-5 mt-0.5 text-gray-400 ${isDropdownOpen ? 'transform rotate-180 transition-transform duration-200' : 'transition-transform duration-200'}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className={`absolute right-0 z-10 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${isDropdownOpen ? 'opacity-100 scale-y-100 transition-all duration-200' : 'opacity-0 scale-y-0 transition-all duration-200'}`} role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1" 
          style={{ 
            transformOrigin: 'top', 
            left: `calc(50% - 120px)`
          }} >
          <div className="py-2" role="none">
            {options.map((option, index) => (
                    <a key={index} href="#" className="text-gray-700 block px-4 py-2 text-base" role="menuitem" tabIndex="-1" id={`menu-item-${index}`}>{option}</a>
                ))}
          </div>
        </div>
      </div>
    )
}