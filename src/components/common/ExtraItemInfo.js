import { useState } from "react";

export default function ExtraItemInfo({icon, title, text}) {

    const [isOpen, setIsOpen] = useState(false);

    return(
        <div>
            <div className='flex items-center cursor-pointer py-2.5' onClick={() => setIsOpen(!isOpen)}>
                {icon}
                <div className='font-ovo mr-auto ml-2 tracking-wide text-lg'>{title}</div>
                <svg
                    className={`h-5 w-5 text-gray-400 transform ${isOpen ? 'rotate-180' : 'rotate-0'} transition-transform duration-300 ease-in-out`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 010-1.04z" clipRule="evenodd" />
                </svg>
            </div>
            <div className="border-b border-gray-300 transition-max-height duration-500 ease-in-out overflow-hidden" style={{ maxHeight: isOpen ? '1000px' : '0', transitionProperty: 'max-height', transitionDuration: isOpen ? '1000ms' : '500ms'}}>
                <div className={`my-1 pb-2 font-ovo duration-500 ease-in-out`} style={{ maxHeight: isOpen ? '1000px' : '0', overflow: 'hidden', transitionProperty: 'max-height', transitionDuration: isOpen ? '1000ms' : '500ms'}}>
                    {title === 'Ingredients' && (
                        <span>This product contains the following:{' '}</span>
                    )}
                    {text}
                </div>
            </div>
        </div>
    )
}