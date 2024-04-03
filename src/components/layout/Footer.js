import Image from "next/image";
import Facebook from "@/components/icons/Facebook"
import Instagram from "@/components/icons/Instagram"
import Tiktok from "@/components/icons/Tiktok"


export default function Footer() {
    return(
        <>
            <section className="bg-primary h-full px-8 py-12">
                <div className="max-w-6xl mx-auto grid grid-cols-4">
                    <div className="relative bg-white rounded-full size-[170px]">
                        <Image src={'/logo.svg'} alt="logo" fill style={{objectFit:"scale-down"}} />
                    </div>
                    <div>
                        <h4 className="text-white font-sans font-semibold mb-4">About Us</h4>
                        <div className="flex flex-col text-white font-extralight font-sans gap-y-2">
                            <a href="">Shop</a>
                            <a href="">Contact Us</a>
                            <a href="">Collection</a>
                            <a href="">Return Policy</a>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-sans font-semibold mb-4">Privacy Policy</h4>
                        <div className="flex flex-col text-white font-extralight font-sans gap-y-2">
                            <a href="">Terms of Service</a>
                            <a href="">Track Order</a>
                            <a href="">My Account</a>
                            <a href="">Cart</a>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-sans font-semibold mb-4">Products</h4>
                        <div className="flex flex-col text-white font-extralight font-sans gap-y-2">
                            <a href="">Brownies</a>
                            <a href="">Cupcakes</a>
                            <a href="">Dessert Cups</a>
                            <a href="">Bento Boxes</a>
                        </div>
                    </div>
                </div>
            </section>
            <div className="bg-dark py-4 px-8 text-white font-sans text-sm font-extralight">
                <div className="max-w-7xl mx-auto flex items-center">
                    <div className="mr-10">
                        © 2024 Cheat Day Bakes. All rights reserved.
                    </div>
                    <div className="flex gap-x-5">
                        <a href="" className="underline">Privacy Policy</a>
                        <a href="" className="underline">Terms of Service</a>
                        <a href="" className="underline">Cookies Settings</a>
                    </div>
                    <div className="flex gap-x-3 ml-auto items-center">
                        <a href=""><Facebook /></a>
                        <a href="https://www.instagram.com/cheatday.bakes/?hl=en-gb" target="_blank"><Instagram /></a>
                        <a href="https://www.tiktok.com/@cheatday.bakes?lang=en"><Tiktok /></a>
                    </div>
                </div>
            </div>
        </>
    );
}