"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useProfile } from "@/components/UseProfile";
import Right from "@/components/icons/Right"
import Left from "@/components/icons/Left"

export default function CheckoutPage() {

    const session = useSession();
    const {data: profileData, loading:profileLoading} = useProfile();
    const {status} = session;

    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const pickUpAddress = 'Severnake Close, E14 9WE'

    const [startDate, setStartDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [disableLeftArrow, setDisableLeftArrow] = useState(true);
    const [disableRightArrow, setDisableRightArrow] = useState(false);
    const initialStartDateRef = useRef(null);  // useRef to store the initial start date
    const [hasTimeBeenSelected, setHasTimeBeenSelected] = useState(false);
    const [timeSelected, setTimeSelected] = useState('');


    useEffect(() => {
        if(profileData?.firstName) {
            setFirstName(profileData.firstName);
            setLastName(profileData.lastName);
            setPhone(profileData.phone);
        }
    }, [profileData])

    useEffect(() => {
        setStartDate((prevStartDate) => {
          const newStartDate = new Date(); // Get current date
          newStartDate.setDate(newStartDate.getDate() + 3); // Set start date 3 days from current date
          setSelectedDate(newStartDate);
          initialStartDateRef.current = newStartDate; // Store the initial date in ref
          return newStartDate;
        });
        setLoading(false);
      }, []);

      if(loading || profileLoading) {
        return 'Loading...'
      }
    
      const generateDateSquares = (startDate, numDays) => {
        const header = [];
        const dateSquares = [];
        const endDate = new Date(startDate.getTime() + (numDays - 1) * 24 * 60 * 60 * 1000);
    
        // Generate header for month and year
        const startMonth = startDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        const endMonth = endDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
    
        const monthTitle = startMonth === endMonth ? startMonth : `${startMonth} / ${endMonth}`;
        header.push(
          <div key="header" className="mb-2 mt-3">
            <div className="text-sm font-light tracking-wider uppercase">{monthTitle}</div>
          </div>
        );
    
        // Generate squares for each day
        for (let i = 0; i < numDays; i++) {
          const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
          const dayOfMonth = date.toLocaleDateString("en-GB", { day: "numeric" }); // UK format
          const dayOfWeek = date.toLocaleDateString("en-GB", { weekday: "long" }); // Name of the day
          dateSquares.push(
            <div key={date.getTime()}
                 className={`p-2  cursor-pointer hover:bg-gray-200 border text-center flex flex-col justify-center w-full h-20 ${date.getDate() === selectedDate.getDate() ? 'border-black' : 'border-gray-300'}`}
                 onClick={() => {setSelectedDate(date); setHasTimeBeenSelected(false); setTimeSelected('')}}
                 >
                <div className="text-2xl">{dayOfMonth}</div>
                <div className="text-sm font-light">{dayOfWeek}</div>
            </div>
          );
        }
        return header.concat(
            <div key="dateSquares" className="flex gap-x-3">
                {dateSquares}
            </div>
        );
      };
    
      const handleScrollNext = () => {
        setStartDate((prevStartDate) => {
            const newStartDate = new Date(prevStartDate.getTime()); // Copy previous start date
            newStartDate.setDate(newStartDate.getDate() + 7); // Move start date forward by 7 days
    
            // Calculate the difference in days from the initial start date
            const daysDifference = Math.floor((newStartDate - initialStartDateRef.current) / (1000 * 60 * 60 * 24));
            if (daysDifference >= 60) {
                setDisableRightArrow(true); // Disable the right arrow if we reach 60 days ahead
                return prevStartDate; // Prevent the date from moving forward
            } else {
                setDisableRightArrow(false); // Enable the right arrow otherwise
            }
    
            // Enable left arrow once we move forward
            if (disableLeftArrow) {
                setDisableLeftArrow(false);
            }
    
            return newStartDate;
        });
    };

      const handleScrollBack = () => {
        setStartDate((prevStartDate) => {
          const newStartDate = new Date(prevStartDate.getTime()); // Copy previous start date
          newStartDate.setDate(newStartDate.getDate() - 7); // Move start date backward by 7 days
          if (newStartDate < initialStartDateRef.current) {
            return prevStartDate; // Return previous if new date is before initial
          }
          if(newStartDate.getTime() === initialStartDateRef.current.getTime()) {
            setDisableLeftArrow(true)
          }
          if (disableRightArrow) {
            setDisableRightArrow(false);
        }
          return newStartDate;
        });
    };

    const formatDate = (date, hasTimeBeenSelected) => {

    
        let formattedDate = date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    
        if (hasTimeBeenSelected) {
            formattedDate += ' - ' + date.toLocaleTimeString('en-GB', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            });
        } else {
            formattedDate += ' - NO TIME CHOSEN';
        }

        if (formattedDate.includes('0:00')) {
            formattedDate = formattedDate.replace('0:00', '12:00');
        }
    
        return formattedDate;
    };

    const convertTo12HourFormat = (hour) => {
        if (hour === 0) {
            return '12 AM';
        } else if (hour < 12) {
            return `${hour} AM`;
        } else if (hour === 12) {
            return '12 PM';
        } else {
            return `${hour - 12} PM`;
        }
    }
    
      const setTimeForSelectedDate = (date, hours, minutes, seconds, milliseconds) => {
        const newDate = new Date(date.getTime()); // Create a new Date object to avoid mutating the original date
        newDate.setHours(hours);
        newDate.setMinutes(minutes || 0); // Default to 0 if not specified
        newDate.setSeconds(seconds || 0); // Default to 0 if not specified
        newDate.setMilliseconds(milliseconds || 0); // Default to 0 if not specified
        return newDate;
    };

      const setHourForSelectedDate = (e) => {
        const newDate = setTimeForSelectedDate(selectedDate, e.target.value, 0, 0, 0); // Create a new Date object to avoid mutating the original date
        newDate.setHours(e.target.value);
        setHasTimeBeenSelected(true);
        setTimeSelected(convertTo12HourFormat(e.target.value));
        return newDate;
    };

    const handleTimeSelection = (e) => {
        setTimeSelected(e.target.value);
    };

    return(
        <section className="max-w-6xl mx-auto w-full mt-10 mb-28 px-5">
            <h1 className="font-ovo text-[2.5rem] mb-8 tracking-wider text-center">Checkout</h1>
            <div className="grid mt-10 lg:mt-5 gap-x-12 w-full" style={{gridTemplateColumns: '0.7fr 0.3fr' }}>
                <div>
                    <div className="border-b border-thinGray mb-5 text-xs pb-1 font-light tracking-widest">COLLECTION DETAILS</div>
                    <form className="mx-auto lg:mx-0 lg:col-span-3" >
                        <div className="flex gap-x-8">
                            <div className="grow">
                                <label className="font-ovo text-xl" htmlFor="firstName">First Name</label>
                                <input type="text" id="firstName" autoComplete="given-name"
                                value={firstName} onChange={e => setFirstName(e.target.value)} required/>
                            </div>
                            <div className="grow">
                                <label className="font-ovo text-xl" htmlFor="lastName">Last Name</label>
                                <input type="text" id="lastName" autoComplete="family-name"
                                value={lastName} onChange={e => setLastName(e.target.value)} required/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input type="text" id="email" value={session?.data?.user.email}
                            />
                        </div>
                        <div>
                            <label htmlFor="phone">Phone</label>
                            <input type="tel" id="phone" autoComplete="tel" 
                            value={phone} onChange={e => setPhone(e.target.value)} required/>
                        </div>
                        <div>
                            <label htmlFor="pickUpAddress">Pick Up Address</label>
                            <input type="text" id="pickUpAddress" 
                            value={pickUpAddress} disabled={true} required/>
                        </div>
                        <div>
                            <label htmlFor="collectionDate">Choose Your Collection Date</label>
                            <div className="flex items-center gap-x-3 overflow-x-auto transition-all duration-300">
                                <div className="mt-10">
                                    <button
                                    type="button"
                                    className="arrow"
                                    disabled={disableLeftArrow}
                                    onClick={handleScrollBack}
                                    >
                                    <Left className="size-9" disabled={disableLeftArrow}/>
                                    </button>
                                </div>
                                <div className="grow" >
                                    {generateDateSquares(startDate, 7)}
                                </div>
                                <div className="mt-10">
                                    <button
                                    type="button"
                                    className="arrow"
                                    onClick={handleScrollNext}
                                    disabled={disableRightArrow}
                                    >
                                    <Right className="size-9" disabled={disableRightArrow}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5">
                            <label htmlFor="pickUpTime">Choose Your Pick Up Time</label>
                            <select name="pickUpTime" id="pickUpTime" value={timeSelected} onChange={(e) => {setSelectedDate(setHourForSelectedDate(e)); handleTimeSelection(e)}}>
                                <option value="" disabled hidden>Select</option>
                                <option value={12}>12:00 PM</option>
                                <option value={13}>1:00 PM</option>
                                <option value={14}>2:00 PM</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div>
                    <div>Your order</div>
                    <div className="uppercase">Collection for {selectedDate ? formatDate(selectedDate, hasTimeBeenSelected).replace(',', ' -') : ''}</div>
                </div>
            </div>
        </section>
    )
}