"use client";
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminIcon from "@/components/common/AdminIcon"

export default function UserTabs({isAdmin}) {
    const path = usePathname();

    return(
        <section>
            <div className='hidden lg:flex flex-col gap-y-3.5 tabs'>
                <Link 
                href={'/my-account/edit-account'}
                className={path === '/my-account/edit-account' ? 'active' : ''}
                >
                    Account Details
                </Link>
                {!isAdmin && (
                    <Link 
                    href={'/my-account/orders'}
                    className={path === '/my-account/orders' ? 'active' : ''}
                    >
                        Orders
                    </Link>
                )}

                {isAdmin && (
                    <>
                        <Link
                            href={'/my-account/categories'}
                            className={path === '/my-account/categories' ? 'active' : ''}
                            >
                            Categories
                            <AdminIcon />
                        </Link>
                        <Link 
                            href={'/my-account/menu-items'}
                            className={path.includes('menu-items') ? 'active' : ''}
                            >
                            Menu Items
                            <AdminIcon />
                        </Link>
                        <Link href={'/my-account/orders'}
                            className={path === '/my-account/orders' ? 'active' : ''}
                        >
                            All Orders
                            <AdminIcon />
                        </Link>
                    </>
                )}
                <Link 
                    href={''}
                    onClick={() => signOut({ callbackUrl: '/login' })}
                >
                        Logout
                </Link>
            </div>
        </section>
    )
}