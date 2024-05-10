"use client";
import { useProfile } from "@/components/UseProfile";
import DeleteDialog from "@/components/common/DeleteDialog";
import CompleteDialog from "@/components/common/CompleteDialog";
import UserTabs from "@/components/layout/UserTabs";
import Link from "next/link";
import { useEffect, useState } from "react"
import toast from "react-hot-toast";

export default function OrdersPage() {
    const [orders, setOrders] = useState(null);
    const {loading:profileLoading, data:profileData} = useProfile();
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [showCompleteDialog, setShowCompleteDialog] = useState(false);
    const [showUndoDialog, setShowUndoDialog] = useState(false);
    const [orderIdToUpdate, setOrderIdToUpdate] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [orderLoading, setOrderLoading] = useState(true);


    useEffect(() => {
        fetchOrders();
        setOrderLoading(false);
      }, [])

    function fetchOrders() {
        fetch('/api/orders')
            .then(res => res.json())
            .then(orders => {
                // Separate orders based on status
                const inProgressOrders = orders.filter(order => order.status === 'in progress');
                const otherOrders = orders.filter(order => order.status !== 'in progress');

                // Sort in-progress orders by collectionDateTime in descending order
                inProgressOrders.sort((a, b) => new Date(b.collectionDateTime) - new Date(a.collectionDateTime));

                // Sort other orders by collectionDateTime in descending order
                otherOrders.sort((a, b) => new Date(b.collectionDateTime) - new Date(a.collectionDateTime));

                // Concatenate the sorted arrays to get the final sorted orders
                const sortedOrders = [...inProgressOrders, ...otherOrders];

                //Filter orders by only paid orders
                const paidOrders = sortedOrders.filter(order => order.paid == true)
                
                // Update state with the sorted orders
                setOrders(paidOrders);
            });
    }

    async function handleOrderStatusChange(_id) {
        const promise = new Promise(async (resolve, reject) => {
          const response = await fetch('/api/orders?_id='+_id, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newStatus)
          });
          if (response.ok) {
            resolve();
          }
          else{
            reject();
          }
        });
  
        await toast.promise(promise, {
            loading: `Changing order status to ${newStatus}...`,
            success: 'Order status changed successfully',
            error: 'Error, unable to perform action'
        })

        fetchOrders();
  
      }


    const formatDate = (date) => {
        date = new Date(date);
        // Format date in 'DD/MM/YY' format
        let formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
        });
        // Format time in 'h:mm A' format (1:00 PM, 2:30 AM, etc.)
        let formattedTime = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
        // Concatenate the formatted date and time
        return `${formattedDate} - ${formattedTime}`;
    };

    if (profileLoading || orderLoading) {
        return "Loading..."
    }

    return(
        <section className="max-w-6xl mx-auto lg:my-14 my-8 px-6 lg:grid" style={{gridTemplateColumns: '20% 80%' }}>
            <UserTabs isAdmin={profileData.admin} />
            <div>
                {orders?.length === 0 && (
                    <p>You have not made any orders yet</p>
                )}
                {orders?.length > 0 && (
                    <div>
                        <div className="md:grid grid-cols-4 hidden text-xs mb-2 pb-1 font-light tracking-widest border-b border-thinGray">
                            <div>ORDER</div>
                            <div className="justify-self-center">COLLECTION DATE</div>
                            <div className="justify-self-center">STATUS</div>
                            <div className="justify-self-end">ACTIONS</div>
                        </div>
                    </div>
                )}
                {orders?.length > 0 && orders.map(order => (
                    <div>
                        <div className="md:grid hidden grid-cols-4 border-b border-thinGray py-6">
                            <p>
                                {`# ${order.orderNumber}`}
                                <div className="mt-1 font-medium">
                                    {profileData.admin && (
                                        `${order.firstName} ${order.lastName}`
                                    )}
                                </div>
                            </p>
                            <p className="justify-self-center">{formatDate(order.collectionDateTime).replace(',', ' -')}</p>
                            <p className={`capitalize justify-self-center ${order.status === "cancelled" ? 'text-red-600 font-medium' : ''}`}>{order.status}</p>
                            <p className="justify-self-end">
                                <div className="text-right">
                                    <Link href={'/orders/' + order._id} className="capitalize underline">View Order</Link>
                                </div>
                                {(profileData.admin && order.status === "in progress") && (
                                    <div className="flex flex-col gap-y-2 mt-5">
                                        <button className="bg-red-800 text-white text-sm px-8 py-2 rounded-md"
                                        onClick={() => {
                                            setShowCancelDialog(true);
                                            setOrderIdToUpdate(order._id)
                                            setNewStatus('cancelled')
                                            }}>Cancel</button>
                        
                                        <button className="bg-primary text-white text-sm px-8 py-2 rounded-md"
                                        onClick={() => {
                                            setShowCompleteDialog(true);
                                            setOrderIdToUpdate(order._id);
                                            setNewStatus('completed');
                                            }}>Complete</button>
                                    </div>
                                )}
                                {(profileData.admin && (order.status === "cancelled" || order.status === "completed")) && (
                                    <div className="flex flex-col gap-y-2 mt-5">
                                        <button className="bg-primary text-white text-sm px-8 py-2 rounded-md"
                                        onClick={() => {
                                            setShowUndoDialog(true);
                                            setOrderIdToUpdate(order._id)
                                            setNewStatus('in progress')
                                            }}>Undo</button>
                                    </div>
                                )}
                            </p>
                        </div>
                        <div className="md:hidden flex flex-col my-6">
                            <div className="flex flex-col border border-thinGray px-8 py-5 gap-y-2 rounded-xl">
                                <div className="flex justify-between">
                                    <div>Order:</div>
                                    <div>{`# ${order.orderNumber}`}</div>
                                </div>
                                {profileData.admin && (
                                    <div className="flex justify-between">
                                        <div>Name:</div>
                                        <div className="font-medium">{`${order.firstName} ${order.lastName}`}</div>
                                    </div>

                                )}
                                <div className="flex justify-between">
                                    <div>Collection Date:</div>
                                    <div>{formatDate(order.collectionDateTime).replace(',', ' -')}</div>
                                </div>
                                <div className="flex justify-between">
                                    <div>Status:</div>
                                    <div className={`capitalize ${order.status === "cancelled" ? 'text-red-600 font-medium' : ''}`} >{order.status}</div>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <div>Actions:</div>
                                    <div className="text-right">
                                        <Link href={'/orders/' + order._id} className="capitalize underline">View Order</Link>
                                        {(profileData.admin && order.status === "in progress") && (
                                            <div className="flex flex-col gap-y-2 mt-3">
                                                <button className="bg-red-800 text-white text-sm px-8 py-2 rounded-md"
                                                onClick={() => {
                                                    setShowCancelDialog(true);
                                                    setOrderIdToUpdate(order._id)
                                                    setNewStatus('cancelled')
                                                    }}>Cancel</button>
                                
                                                <button className="bg-primary text-white text-sm px-8 py-2 rounded-md"
                                                onClick={() => {
                                                    setShowCompleteDialog(true);
                                                    setOrderIdToUpdate(order._id);
                                                    setNewStatus('completed');
                                                    }}>Complete</button>
                                            </div>
                                        )}
                                        {(profileData.admin && (order.status === "cancelled" || order.status === "completed")) && (
                                            <div className="flex flex-col gap-y-2 mt-5">
                                                <button className="bg-primary text-white text-sm px-8 py-2 rounded-md"
                                                onClick={() => {
                                                    setShowUndoDialog(true);
                                                    setOrderIdToUpdate(order._id)
                                                    setNewStatus('in progress')
                                                    }}>Undo</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>                      
                ))}
                <DeleteDialog 
                    open={showCancelDialog} 
                    setOpen={setShowCancelDialog} 
                    onDelete={() => handleOrderStatusChange(orderIdToUpdate)} 
                    title={'Cancel order'} 
                    text={'Are you sure you want to cancel this order? Please contact the admin if a refund is required.'}
                    btnText="Cancel order"
                    />
                <DeleteDialog 
                    open={showUndoDialog} 
                    setOpen={setShowUndoDialog} 
                    onDelete={() => handleOrderStatusChange(orderIdToUpdate)} 
                    title={'Undo action'} 
                    text={'Are you sure you want to undo this order? This will set this order back to in progress.'}
                    btnText="Undo"
                    />
                <CompleteDialog 
                    open={showCompleteDialog} 
                    setOpen={setShowCompleteDialog} 
                    onComplete={() => handleOrderStatusChange(orderIdToUpdate)} 
                    title={'Complete order'} 
                    text={'Are you sure you want to complete this order? This will set the order status to completed.'}/>
            </div>
        </section>
    )
}