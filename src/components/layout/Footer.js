import Image from "next/image";

export default function Footer() {
    return(
        <section className="bg-primary h-[350px] py-20">
            <div className="max-w-6xl mx-auto grid grid-cols-4">
                <div className="relative bg-white rounded-full size-[180px]">
                    <Image src={'/logo.svg'} alt="logo" fill style={{objectFit:"none"}} />
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
                        <a href="">Monthly Specials</a>
                    </div>
                </div>
            </div>
        </section>
    );
}