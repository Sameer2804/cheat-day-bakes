import { useEffect, useRef, useState } from "react";
import Right from "@/components/icons/Right"
import Left from "@/components/icons/Left"

export default function DateTimePicker({selectedDate, setSelectedDate, startDate, setStartDate, initialStartDateRef, setHasTimeBeenSelected, orders}) {

    const [disableLeftArrow, setDisableLeftArrow] = useState(true);
    const [disableRightArrow, setDisableRightArrow] = useState(false);
    const [timeSelected, setTimeSelected] = useState('');
    const [filteredTimes, setFilteredTimes] = useState([]);
    const availableTimes = [12, 13, 14]; // Available times
    let numberOfSquaresToShow = 6;

    useEffect(() => {
      checkAvailableTimes()
  }, [selectedDate, orders]);


    function checkAvailableTimes() {
      const selectedDateTime = new Date(selectedDate); // Create a new Date object with the same date as selectedDate
      selectedDateTime.setHours(0, 0, 0, 0); // Set time to midnight to ignore time component
  
      const unavailableTimes = orders
          .filter(order => {
              const orderDateTime = new Date(order.collectionDateTime);
              const orderDateMidnight = new Date(orderDateTime).setHours(0, 0, 0, 0); // Set time of orderDate to midnight
              return orderDateMidnight === selectedDateTime.getTime();
          })
          .map(order => order.collectionDateTime.getHours());
      
      setFilteredTimes(availableTimes.filter(time => !unavailableTimes.includes(time)));
    }

    function checkAvailability(date) {
      const selectedDateTime = new Date(date); // Create a new Date object with the same date as selectedDate
      selectedDateTime.setHours(0, 0, 0, 0); // Set time to midnight to ignore time component
  
      const unavailableTimes = orders
          .filter(order => {
              const orderDateTime = new Date(order.collectionDateTime);
              const orderDateMidnight = new Date(orderDateTime).setHours(0, 0, 0, 0); // Set time of orderDate to midnight
              return orderDateMidnight === selectedDateTime.getTime();
          })
          .map(order => order.collectionDateTime.getHours());
      
      return availableTimes.filter(time => !unavailableTimes.includes(time))
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
    
        for (let i = 0; i < numDays; i++) {
          const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
          const dayOfMonth = date.toLocaleDateString("en-GB", { day: "numeric" }); // UK format
          const dayOfWeek = date.toLocaleDateString("en-GB", { weekday: "long" }); // Name of the day
          const isFullyBooked = checkAvailability(date).length === 0;
      
          const squareClasses = `p-2 border text-center flex flex-col justify-center w-full h-20
            ${(date.getDate()) === (selectedDate.getDate()) && (date.getMonth() === selectedDate.getMonth()) ? 'border-black' : 'border-gray-300'}
            ${isFullyBooked ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'}
          `;
      
          dateSquares.push(
            <div key={date.getTime()} className={`w-full ${numDays > 3 ? 'w-1/3' : 'w-full'}`}>
              <div className={squareClasses}
                onClick={isFullyBooked ? () => {} : () => {setSelectedDate(date); setHasTimeBeenSelected(false); setTimeSelected('') }}
              >
                <div className="text-2xl">{dayOfMonth}</div>
                <div className="text-sm font-light">{dayOfWeek}</div>
              </div>
              {isFullyBooked && (
                <div className="text-xs font-semibold text-center mt-1">Fully Booked</div>
              )}
            </div>
          );
        }
      
        return header.concat(
          <div key="dateSquares" className={`flex md:gap-x-2.5 gap-y-3 md:flex-nowrap md:gap-y-2.5 ${numDays > 3 ? 'flex-wrap' : ''}`}>
            {dateSquares}
          </div>
        );
      };
    
      const handleScrollNext = () => {
        setStartDate((prevStartDate) => {
            const newStartDate = new Date(prevStartDate.getTime()); // Copy previous start date
            newStartDate.setDate(newStartDate.getDate() + numberOfSquaresToShow); // Move start date forward by x days
    
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
          newStartDate.setDate(newStartDate.getDate() - numberOfSquaresToShow); // Move start date backward by 6 days
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
            return '12:00 AM';
        } else if (hour < 12) {
            return `${hour}:00 AM`;
        } else if (hour === 12) {
            return '12:00 PM';
        } else {
            return `${hour - 12}:00 PM`;
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
                <div className="flex items-center gap-x-3 transition-all duration-300">
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
                        {generateDateSquares(startDate, numberOfSquaresToShow)}
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
                    {filteredTimes.map(time => (
                        <option key={time} value={time}>{convertTo12HourFormat(time)}</option>
                    ))}
                </select>
            </div>
        </>
    )
}