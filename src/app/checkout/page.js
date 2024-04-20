"use client";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useRef, useState } from "react";
import { useProfile } from "@/components/UseProfile";
import DateTimePicker from "@/components/layout/DateTimePicker"
import OrderReceipt from "@/components/layout/OrderReceipt"
import { CartContext, cartProductPrice } from "@/components/AppContext";
import Spinner from "@/components/common/Spinner"
import { redirect } from 'next/navigation'
import toast from "react-hot-toast";

export default function CheckoutPage() {

    const session = useSession();
    const {data: profileData, loading:profileLoading} = useProfile();
    const {status} = session;

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState(session?.data?.user?.email);
    const pickUpAddress = 'Severnake Close, London, E14 9WE';
    const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false);

    const [hasTimeBeenSelected, setHasTimeBeenSelected] = useState(false);
    const [collectionDateTime, setCollectionDateTime] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const initialStartDateRef = useRef(null);  // useRef to store the initial start date
    const [datePickerLoading, setDatePickerLoading] = useState(true);
    const daysAheadShown = [
        { quantity: 1, daysAhead: 3 }, //1 to 3 quantities = 3 days ahead, then 4 to 7 quantities = 6 days ahead and so on
        { quantity: 4, daysAhead: 6 },
        { quantity: 8, daysAhead: 8 },
        { quantity: 12, daysAhead: 12 },
        { quantity: 16, daysAhead: 15 }
        // Add more brackets as necessary
    ];
    const {cartProducts, loading} = useContext(CartContext);
    let total = cartProducts.reduce((totalPrice, product) => totalPrice + cartProductPrice(product), 0).toFixed(2);


    useEffect(() => {
        if(profileData?.firstName) {
            setFirstName(profileData.firstName);
            setLastName(profileData.lastName);
            setPhone(profileData.phone);
            setEmail(profileData.email);
        }
    }, [profileData])

    useEffect(() => {

        if(typeof window !== 'undefined') {
            if(window.location.href.includes('cancelled=1')) {
                toast.error('Payment failed')
            }
        }
        // Calculate total quantity of products
        const totalQuantity = cartProducts.reduce((acc, product) => acc + product.quantity, 0);
        // Determine the days to add based on total quantity
        const daysToAdd = findDaysAhead(totalQuantity);

        setStartDate((prevStartDate) => {

          const newStartDate = new Date(); // Get current date
          newStartDate.setDate(newStartDate.getDate() + daysToAdd); // Set start date 3 days from current date
          setCollectionDateTime(newStartDate);
          initialStartDateRef.current = newStartDate; // Store the initial date in ref
          return newStartDate;
        });
        setHasBeenSubmitted(false);
        setDatePickerLoading(false);
      }, [cartProducts]);

        function findDaysAhead(totalQuantity) {
            // Reverse iterate to find the first matching bracket whose maxQuantity is >= totalQuantity
            for (let i = daysAheadShown.length - 1; i >= 0; i--) {
                if (totalQuantity < daysAheadShown[i].quantity && totalQuantity >= daysAheadShown[i-1]?.quantity) {
                    return daysAheadShown[i-1].daysAhead;
                }
            }
            return daysAheadShown[daysAheadShown.length - 1].daysAhead; //else return the highest amount of days ahead

        }
    

      if(!loading && cartProducts.length === 0) {
        return redirect('/cart')
      }

      if(datePickerLoading || profileLoading || loading) {
        return 'Loading...'
      }
        

      async function proceedToPayment(ev) {
        ev.preventDefault();
        setHasBeenSubmitted(true);
        const userDetails = {
            firstName,
            lastName,
            phone,
            email,
            collectionDateTime
        } 
        const promise = new Promise((resolve, reject) => {
            fetch('/api/checkout', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    userDetails,
                    cartProducts
                }),
            }).then(async (response) => {
            if (response.ok) {
                resolve();
                window.location = await response.json();
            } else {
                reject();
            }
            });
        });
        
        await toast.promise(promise, {
            loading: 'Preparing your order...',
            success: 'Redirecting to payment...',
            error: 'Something went wrong... Please try again later',
        })
        setHasBeenSubmitted(false);
 
      }


    return(
        <section className="max-w-6xl mx-auto mt-10 mb-28 px-5" onSubmit={proceedToPayment}>
            <h1 className="font-ovo text-[2.8rem] mb-8 tracking-wider text-center">Checkout</h1>
            <div className="lg:grid mt-10 lg:mt-5 gap-x-16 w-full" style={{gridTemplateColumns: '61% 39%' }}>
                <div>
                    <div className=" text-xs pb-1 font-light tracking-widest">COLLECTION DETAILS</div>
                    <form id="checkout-form" className="mx-auto lg:mx-0 lg:col-span-3 border-t border-b border-thinGray py-4" >
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
                            <label htmlFor="phone">Phone</label>
                            <input type="tel" id="phone" autoComplete="tel" 
                            value={phone} onChange={e => setPhone(e.target.value)} required/>
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input type="text" id="email" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                disabled={status === 'authenticated' ? true : false}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="pickUpAddress">Pick Up Address</label>
                            <input type="text" id="pickUpAddress" 
                            value={pickUpAddress} disabled={true} required/>
                        </div>

                        <DateTimePicker 
                            selectedDate={collectionDateTime}
                            setSelectedDate={setCollectionDateTime}
                            startDate={startDate}
                            setStartDate={setStartDate}
                            initialStartDateRef={initialStartDateRef}
                            setHasTimeBeenSelected={setHasTimeBeenSelected}
                        />
                    </form>
                </div>
                <div className="mt-5">
                    <div className="bg-receiptGray pt-9 pb-8 lg:px-10 px-6">
                        <OrderReceipt
                            cartProducts={cartProducts}
                            selectedDate={collectionDateTime}
                            total={total}
                            hasTimeBeenSelected={hasTimeBeenSelected}
                        />
                        <div className="mt-6">
                            <button form="checkout-form" type="submit">{hasBeenSubmitted ? <Spinner /> : 'Confirm and Pay'}</button>    
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}