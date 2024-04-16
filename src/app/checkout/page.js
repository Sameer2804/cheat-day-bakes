"use client";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useRef, useState } from "react";
import { useProfile } from "@/components/UseProfile";
import DateTimePicker from "@/components/layout/DateTimePicker"
import OrderReceipt from "@/components/layout/OrderReceipt"
import { CartContext, cartProductPrice } from "@/components/AppContext";

export default function CheckoutPage() {

    const session = useSession();
    const {data: profileData, loading:profileLoading} = useProfile();
    const {status} = session;

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const pickUpAddress = 'Severnake Close, E14 9WE';

    const [hasTimeBeenSelected, setHasTimeBeenSelected] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const initialStartDateRef = useRef(null);  // useRef to store the initial start date
    const [datePickerLoading, setDatePickerLoading] = useState(true);

    const {cartProducts, loading} = useContext(CartContext);
    let total = cartProducts.reduce((totalPrice, product) => totalPrice + cartProductPrice(product), 0).toFixed(2);


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
        setDatePickerLoading(false);
      }, []);

    
      if(datePickerLoading || profileLoading || loading) {
        return 'Loading...'
      }

    

    return(
        <section className="max-w-6xl mx-auto mt-10 mb-28 px-5">
            <h1 className="font-ovo text-[2.8rem] mb-8 tracking-wider text-center">Checkout</h1>
            <div className="grid mt-10 lg:mt-5 gap-x-16" style={{gridTemplateColumns: '61% 39%' }}>
                <div>
                    <div className=" text-xs pb-1 font-light tracking-widest">COLLECTION DETAILS</div>
                    <form className="mx-auto lg:mx-0 lg:col-span-3 border-t border-b border-thinGray py-4" >
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
                        <DateTimePicker 
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            startDate={startDate}
                            setStartDate={setStartDate}
                            initialStartDateRef={initialStartDateRef}
                            setHasTimeBeenSelected={setHasTimeBeenSelected}
                        />
                    </form>
                </div>
                <div className="bg-receiptGray py-8 px-10">
                    <OrderReceipt 
                        cartProducts={cartProducts} 
                        selectedDate={selectedDate} 
                        total={total}
                        hasTimeBeenSelected={hasTimeBeenSelected}
                    />
                </div>
            </div>
        </section>
    )
}