import { Fragment, useContext, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { CartContext, cartProductPrice } from "@/components/AppContext"
import QuantityButton from './QuantityButton';

export default function CartSidePanel({open, setOpen}) {

  const {cartProducts, removeCartProduct, updateQuantities} = useContext(CartContext);

  let subtotal = cartProducts.reduce((totalPrice, product) => totalPrice + cartProductPrice(product), 0).toFixed(2);

  const [quantity, setQuantity] = useState([]);
  const [disableUpdateButton, setDisableUpdateButton] = useState(true);

    useEffect(() => {
      // Map through cartProducts and extract quantities into an array
      const initialQuantities = cartProducts.map(product => product.quantity);
      setQuantity(initialQuantities); // Set the quantity array in state
  }, [cartProducts]); // Update quantity whenever cartProducts changes

  const setQuantityAtIndex = (index, value) => {
    setQuantity(prevQuantity => {
        const newQuantity = [...prevQuantity]; // Create a copy of the quantity array
        newQuantity[index] = value; // Set the value at the specified index
        return newQuantity; // Return the updated quantity array
    });
    setDisableUpdateButton(false);
};

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">Shopping cart</Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul role="list" className="-my-6 divide-y divide-gray-200">
                            {cartProducts.length == 0 && (
                              <p>Basket Empty</p>
                            )}
                            {cartProducts.length > 0 && cartProducts.map((product, index) => (
                              <li className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    src={product.images[0]}
                                    alt={product.images[0]}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div className=''>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <a href={'/product/'+product._id}>{product.name}</a>
                                      </h3>
                                      <p className="ml-4">£{cartProductPrice(product).toFixed(2)}</p>
                                    </div>
                                    {product.size && (
                                        <p className="mt-1 text-sm text-gray-500">{product.size.name}</p>
                                    )}
                                    {product.toppings?.length > 0 && (
                                        <p className="mt-1 text-sm text-gray-500">
                                            Toppings: {product.toppings.map((topping, index) => (
                                                <span key={topping.id}>
                                                    {`${topping.name}`}
                                                    {topping.price > 0 && ` (£${topping.price.toFixed(2)})`}
                                                    {index !== product.toppings.length - 1 && ", "}
                                                </span>
                                            ))}
                                        </p>
                                    )}
                                    {product.giftBoxOption && (
                                        <p className="mt-1 text-sm text-gray-500">
                                            Gift box: {product.giftBox ? `Yes (£${(1.50).toFixed(2)} x ${product.quantity})` : 'No'}
                                        </p>
                                    )}
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm mt-3">
                                    {product.quantity && (
                                        <div className='h-12 w-32'>
                                            <QuantityButton quantity={quantity[index]} setQuantity={(value) => setQuantityAtIndex(index, value)} />
                                        </div>
                                    )}

                                    <div className="flex">
                                      <button
                                        type="button"
                                        className="font-medium text-dark hover:text-light"
                                        onClick={() => removeCartProduct(index)}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>{`£${subtotal}`}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">Discounts applied at checkout.</p>
                      <div className="mt-6">
                        <button
                          type="button"
                          disabled={disableUpdateButton}
                          onClick={() => {updateQuantities(quantity); setDisableUpdateButton(true)}}
                          className={`w-full rounded-md px-6 py-3 text-base font-medium shadow-sm hover:bg-secondary duration-300 ${disableUpdateButton ? 'text-gray-500' : 'border border-primary text-primary'}`}
                        >
                          Update Cart
                        </button>
                      </div>
                      <div className="mt-3">
                        <a
                          href="/checkout"
                          onClick={() => {updateQuantities(quantity); setDisableUpdateButton(true)}}
                          className="flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-dark"
                        >
                          Checkout
                        </a>
                      </div>
                      <div className="mt-5 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or{' '}
                          <button
                            type="button"
                            className="font-medium text-dark hover:text-light"
                            onClick={() => setOpen(false)}
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
