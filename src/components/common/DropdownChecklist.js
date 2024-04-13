import React, { useState } from 'react';

export default function DropdownChecklist({ items, selectedToppings, setSelectedToppings }) {
    const [isOpen, setIsOpen] = useState(false);
    const [toppingsToDisplay, setToppingsToDisplay] = useState([])

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleCheck = (item) => {
        if (selectedToppings.includes(item)) {
            setSelectedToppings(selectedToppings.filter(i => i !== item));
        } else {
            if (selectedToppings.length < 4) {
                setSelectedToppings([...selectedToppings, item]);
            }
        }
    };

    return (
        <div className="relative">
            <div
                className="cursor-pointer h-auto w-full border border-gray-300 rounded p-2 bg-white flex items-center justify-between"
                onClick={toggleDropdown}
            >
                <div>
                    {selectedToppings.length > 0
                        ? selectedToppings.map((topping, index) => (
                            <span key={index}>
                                {topping.name}
                                {index < selectedToppings.length - 1 ? ", " : ""}
                            </span>
                        ))
                        : "Select"}
                </div>
                <svg
                    className={`h-5 w-5 text-gray-400 transform ${isOpen ? 'rotate-180' : 'rotate-0'} transition-transform duration-200`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 010-1.04z" clipRule="evenodd" />
                </svg>
            </div>
            <div
                className={`transition-max-height duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-60 border border-t-0' : 'max-h-0'}`}
                style={{ transitionProperty: 'max-height', transitionDuration: '500ms'}}
            >
                {items?.toppings?.map((topping, index) => (
                    <label key={index} className="flex items-center px-2 py-1">
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={selectedToppings.includes(topping)}
                            onChange={() => handleCheck(topping)}
                        />
                        {topping.name}
                        <span className='ml-2 text-sm font-light'>{topping.price > 0 ? `+£${topping.price.toFixed(2)}` : ""}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}