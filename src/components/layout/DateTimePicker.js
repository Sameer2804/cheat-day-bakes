import { useEffect, useRef, useState } from "react";
import Right from "@/components/icons/Right"
import Left from "@/components/icons/Left"

export default function DateTimePicker({selectedDate, setSelectedDate, startDate, setStartDate, initialStartDateRef, setHasTimeBeenSelected}) {

    const [disableLeftArrow, setDisableLeftArrow] = useState(true);
    const [disableRightArrow, setDisableRightArrow] = useState(false);
    const [timeSelected, setTimeSelected] = useState('');

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
                 className={`p-2 cursor-pointer hover:bg-gray-200 border text-center flex flex-col justify-center w-full h-20 ${(date.getDate()) === (selectedDate.getDate()) && (date.getMonth() === selectedDate.getMonth()) ? 'border-black' : 'border-gray-300'}`}
                 onClick={() => {setSelectedDate(date); setHasTimeBeenSelected(false); setTimeSelected('') }}
                 >
                <div className="text-2xl">{dayOfMonth}</div>
                <div className="text-sm font-light">{dayOfWeek}</div>
            </div>
          );
        }
        return header.concat(
            <div key="dateSquares" className="flex gap-x-2.5">
                {dateSquares}
            </div>
        );
      };
    
      const handleScrollNext = () => {
        setStartDate((prevStartDate) => {
            const newStartDate = new Date(prevStartDate.getTime()); // Copy previous start date
            newStartDate.setDate(newStartDate.getDate() + 6); // Move start date forward by 6 days
    
            // Calculate the difference in days from the initial start date
            const daysDifference = Math.floor((newStartDate - initialStartDateRef.current) / (1000 * 60 * 60 * 24));
            if (daysDifference >= 53) {
                setDisableRightArrow(true); // Disable the right arrow if we reach 60 days ahead
                return newStartDate; //show the last set of days
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
          newStartDate.setDate(newStartDate.getDate() - 6); // Move start date backward by 6 days
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

    return (
        <>
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
                        {generateDateSquares(startDate, 6)}
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
                <select 
                    name="pickUpTime" 
                    id="pickUpTime" 
                    value={timeSelected} 
                    onInvalid={(e) => {
                        e.target.setCustomValidity('Please select a time.');
                        e.target.style.borderColor = 'red'; // Apply red border color
                    }} 
                    onChange={(e) => {
                        setSelectedDate(setHourForSelectedDate(e)); 
                        handleTimeSelection(e); 
                        setTimeSelected(e.target.value);     
                        e.target.setCustomValidity("");
                    }}
                    required
                    >
                        
                    <option value="" disabled hidden>Select</option>
                    <option value={12}>12:00 PM</option>
                    <option value={13}>1:00 PM</option>
                    <option value={14}>2:00 PM</option>
                </select>
            </div>
        </>
    )
}