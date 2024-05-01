import { Fragment, useContext, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { signOut } from 'next-auth/react';
import RightChevron from "@/components/icons/RightChevron"
import { usePathname } from 'next/navigation';

function MobileNavItem({ navigation, setOpen, status, isMoreNavOpen, moreNavTitle, setMoreNavTitle, hasGoneBack, setHasGoneBack }) {
  const [openMoreNav, setOpenMoreNav] = useState(false);
  const [openMoreNavHasBeenOpened, setOpenMoreNavHasBeenOpened] = useState(null);


    if (navigation.children && navigation.children.length > 0) {
      return (
        <div>
          <button onClick={() => {
              setOpenMoreNav(true);
              setOpenMoreNavHasBeenOpened(true);
              setMoreNavTitle(navigation.name)}}
              className='flex justify-between items-center w-full'
            >
            {navigation.name}
            <RightChevron />
          </button>
          {openMoreNav && 
            <MobileNav 
              navigation={navigation.children} 
              setOpen={setOpenMoreNav} 
              status={status} 
              isMoreNavOpen={isMoreNavOpen} 
              moreNavTitle={moreNavTitle} 
              setMoreNavTitle={setMoreNavTitle}
              setHasGoneBack={setHasGoneBack}
          />}

          {openMoreNavHasBeenOpened && (
            !openMoreNav && !hasGoneBack &&(
              setOpen(false)
            )
          )}
        </div>
      );
    } else {
      return <a href={navigation.href} onClick={() => setOpen(false)}>{navigation.name}</a>;
    }
  }


export default function MobileNav({open, setOpen, navigation, status, isMoreNavOpen, moreNavTitle, setMoreNavTitle, hasGoneBack, setHasGoneBack}) {
  
  useEffect(() => {
    if(!open) {
      setHasGoneBack(false);
    }
  }, [open])

  const path = usePathname();

  useEffect(() => {
    if(path.includes('my-account')) {
      
    }
  }, [])

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
          <div className={`fixed inset-0 bg-opacity-75 transition-opacity ${isMoreNavOpen ? '' : 'bg-gray-500'}`} />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 -left-10 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="-translate-x-full"
                enterTo="-translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="-translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">{isMoreNavOpen ? 
                        <button onClick={() => {setOpen(false); setHasGoneBack(true)}} className='flex gap-x-2'>
                          <div>{'<-'}</div>
                          <div>{moreNavTitle}</div>
                        </button>
                        : 'Main Menu'}</Dialog.Title>
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
                            {navigation.length > 0 && navigation.map((nav, index) => (
                              <li className="flex py-6" key={index}>
                                <div className="ml-2 flex flex-1 flex-col">
                                    <div className="text-base font-medium text-gray-900">
                                      <MobileNavItem 
                                        navigation={nav} 
                                        setOpen={setOpen} 
                                        status={status} 
                                        isMoreNavOpen={true} 
                                        moreNavTitle={moreNavTitle} 
                                        setMoreNavTitle={setMoreNavTitle}
                                        hasGoneBack={hasGoneBack}
                                        setHasGoneBack={setHasGoneBack}
                                        />
                                    </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="mt-6">
                      {status && status === "authenticated" ? (
                        <div>
                          <div>
                            <a
                              href="/my-account/edit-account"
                              className="flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-dark"
                            >
                              My Account
                            </a>
                          </div>
                          <div className="mt-3">
                            <a
                              onClick={() => signOut({ callbackUrl: '/login' })}
                              className="flex items-center justify-center rounded-md border border-primary px-6 py-3 text-base font-medium hover:cursor-pointer text-primary shadow-sm hover:bg-secondary"
                            >
                              Logout
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div>
                            <a
                              href="/login"
                              className="flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-dark"
                            >
                              Login
                            </a>
                          </div>
                          <div className="mt-3">
                            <a
                              href="/register"
                              className="flex items-center justify-center rounded-md border border-primary px-6 py-3 text-base font-medium text-primary shadow-sm hover:bg-secondary"
                            >
                              Register
                            </a>
                          </div>
                        </div>
                      )}
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