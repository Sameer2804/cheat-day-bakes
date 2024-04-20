import { useState, useRef, useEffect } from 'react';
import Trash from "@/components/icons/Trash"

export default function MenuItemPriceProp({children, props, setProps}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [btnClick, setBtnClick] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef = useRef(null);


    useEffect(() => {
        setContentHeight(contentRef.current.scrollHeight + 1);
    }, [isDropdownOpen, btnClick]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleBtnClick = () => {
      setBtnClick(!btnClick);
    }

    function addProp() {
        setProps(oldProp => {
          return [...oldProp, {name:'', price:0}] 
        })
      }

      function removeProp(indexToRemove) {
          setProps(prev => prev.filter((v, index) => index !== indexToRemove))
      }

      function editProp(ev, index, prop) {
          const newValue = ev.target.value;
          setProps(prevProp => {
              const newProp = [...prevProp];
              newProp[index][prop] = newValue;
              return newProp;
          })
      }

    return (
        <div className='border border-black relative px-2 py-2'>
            <div
                onClick={toggleDropdown}
                className="w-full flex justify-between items-center gap-x-0.5 hover:underline hover:cursor-pointer"
            >
                <div className='font-ovo text-xl'>{children} ({props?.length})</div>
                <svg
                    className={`-mr-1 h-5 w-5 mt-0.5 text-gray-400 ${isDropdownOpen ? 'transform rotate-180 transition-transform duration-200' : 'transition-transform duration-200'}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
            </div>

            <div
                className={`overflow-hidden transition-all duration-300`}
                style={{ maxHeight: isDropdownOpen ? contentHeight + 'px' : 0 }}
            >
                <div ref={contentRef} className="overflow-y-auto">
                    
                    <div className='mt-5 flex flex-col justify-center'>
                      {props?.length > 0 && props.map((size, index) => (
                        <div className='flex gap-x-4 mx-5'>
                          <div className='grow'>
                              <label htmlFor="name" className='text-sm font-light tracking-widest'>NAME</label>
                              <input type="text" id="name" autoComplete='off'
                              value={size.name} onChange={ev => editProp(ev, index, 'name')} required/>
                          </div>
                          <div className='grow'>
                              <label htmlFor="price" className='text-sm font-light tracking-widest'>EXTRA PRICE</label>
                              <input type="text" id="price" autoComplete='off'
                              value={size.price} onChange={ev => editProp(ev, index, 'price')} required/>
                          </div>
                          <div>
                            <div onClick={() => { removeProp(index); toggleBtnClick() }} className='mt-9 cursor-pointer'>
                              <Trash
                               />
                            </div>
                          </div>
                          </div>
                      ))}
                       
                    </div>
                    <div className='flex justify-center'>
                    <button 
                       onClick={() => { addProp(); toggleBtnClick() }}
                       className='grow bg-light text-white px-12 mx-5 py-2.5 rounded-md hover:bg-primary mt-2 mb-2' type='button'>
                        Add Row
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}
